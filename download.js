/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-vars */
// upload.js
const Promise = require('bluebird');
const fs = require('fs');
const prompt = require('prompt-sync')({ sigint: true });
const Arweave = require('./arweave');
const AppDAO = require('./db/dao');
const ArDriveDB = require('./db/db');
const ArDriveCrypto = require('./crypto');
const ArDriveCommon = require('./common');

// SQLite Database Setup
const arDriveDBFile = './ardrive.db'; // NEED AN ENVIRONMENT VARIABLE
const dao = new AppDAO(arDriveDBFile);
const db = new ArDriveDB(dao);

// ArDrive Version Tag
const VERSION = '0.1.1';

// Establish Arweave node connectivity.
const gatewayURL = 'https://arweave.net/';
// const gatewayURL = "https://perma.online/"

// Downloads a single file from ArDrive by transaction
async function downloadArDriveFile_byTx(
  user,
  txid,
  file_name,
  isPublic,
  ardrive_path
) {
  try {
    const full_path = user.sync_folder_path.concat(ardrive_path, file_name);
    const folderPath = user.sync_folder_path.concat(ardrive_path);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      await ArDriveCommon.sleep('1000');
    }
    const data = await Arweave.getTransactionData(txid);

    // console.log("FOUND PERMAFILE! %s is on the Permaweb, but not local.  Downloading...", full_path, data)
    if (isPublic === '1') {
      fs.writeFileSync(full_path, data);
      console.log('DOWNLOADED %s', full_path);
    } else {
      // Method with decryption
      fs.writeFileSync(full_path.concat('.enc'), data);
      const stats = fs.statSync(full_path.concat('.enc'));
      await ArDriveCommon.sleep('500');
      const decrypted = await ArDriveCrypto.decryptFile(
        full_path.concat('.enc'),
        user.password,
        user.jwk
      );
      await ArDriveCommon.sleep('500');
      console.log('DOWNLOADED AND DECRYPTED %s', full_path);
    }
    return 'Success';
  } catch (err) {
    console.log(err);
    // console.log ("FOUND PERMAFILE %s but not ready to be downloaded yet", full_path)
    return 'Error downloading file';
  }
}

// Gets all of the files from your ArDrive (via ARQL) and loads them into the database.
exports.getMyArDriveFiles = async (user) => {
  console.log('---Getting all your ArDrive files---');

  let ardrive_owner;
  let ardrive_path;
  let ardrive_filename;
  let ardrive_modifieddate;
  let ardrive_public;
  let ardrive_id;
  let foundFiles = 0;

  const txids = await Arweave.getAllMyTxIds(user);

  // eslint-disable-next-line consistent-return
  await ArDriveCommon.asyncForEach(txids, async (txid) => {
    // txids.forEach(async function (txid) {
    try {
      const isCompleted = await db.getByTx_fromCompleted(txid);
      if (isCompleted) {
        // skip
      } else {
        // Get the full TX and add to the DB
        const transaction = await Arweave.getTransaction(txid);
        transaction.get('tags').forEach((tag) => {
          const key = tag.get('name', { decode: true, string: true });
          const value = tag.get('value', {
            decode: true,
            string: true,
          });

          switch (key) {
            case 'User-Agent':
              // version = value;
              break;
            case 'ArDrive-Path':
              ardrive_path = value;
              break;
            case 'ArDrive-Extension':
              // ardrive_extension = value;
              break;
            case 'ArDrive-ModifiedDate':
              ardrive_modifieddate = value;
              break;
            case 'ArDrive-Owner':
              ardrive_owner = value;
              break;
            case 'ArDrive-FileName':
              ardrive_filename = value;
              break;
            case 'ArDrive-Id':
              ardrive_id = value;
              break;
            case 'ArDrive-Public':
              ardrive_public = value;
              break;
            default:
              break;
          }
        });

        const fileToAdd = {
          owner: ardrive_owner,
          file_name: ardrive_filename,
          file_modified_date: ardrive_modifieddate,
          ardrive_path,
          ardrive_id,
          permaweb_link: gatewayURL.concat(txid),
          tx_id: txid,
          prev_tx_id: txid,
          isLocal: '0',
          isPublic: ardrive_public,
        };
        const newFile = await db.completeFile(fileToAdd);
        foundFiles += 1;
      }
      return true;
    } catch (err) {
      // console.log (err)
      // console.log ("%s is still pending upload", txid)
    }
  });

  if (foundFiles > 0) {
    // console.log ("Found %s missing files from your ArDrive", foundFiles)
  }
  return 'SUCCESS Getting all ArDrive files';
};

// Downloads all ardrive files that are not local
exports.downloadMyArDriveFiles = async (user) => {
  try {
    console.log('---Downloading any unsynced files---');
    const incompleteFiles = await db.getAll_fromCompleted();

    await ArDriveCommon.asyncForEach(
      incompleteFiles,
      async (incompleteFile) => {
        const full_path = user.sync_folder_path.concat(
          incompleteFile.ardrive_path,
          incompleteFile.file_name
        );
        if (!fs.existsSync(full_path)) {
          // console.log("FOUND PERMAFILE! %s is on the Permaweb, but not local.  Downloading...", full_path)
          const myDownload = await downloadArDriveFile_byTx(
            user,
            incompleteFile.tx_id,
            incompleteFile.file_name,
            incompleteFile.isPublic,
            incompleteFile.ardrive_path
          );
          if (incompleteFile.isPublic === '0') {
            fs.unlinkSync(full_path.concat('.enc'));
          }
        } else {
          // console.log("%s is on the Permaweb, but is already downloaded with matching file name", full_path)
          const localFileHash = await ArDriveCrypto.checksumFile(full_path);
          const incompleteFileArDriveID = incompleteFile.ardrive_id.split('//');
          const incompleteFileHash = incompleteFileArDriveID[0];
          if (incompleteFileHash === localFileHash) {
            // console.log("IGNORED! %s is on the Permaweb, but is already downloaded (matching file name and hash)", full_path)
            await db.updateCompletedStatus(incompleteFile.tx_id);
          } else {
            let newFileName = incompleteFile.file_name.split('.');
            newFileName = newFileName[0].concat('1.', newFileName[1]);
            // const new_full_path = directoryPath.concat('\\', newFileName);
            const new_full_path = '\\'.concat(newFileName);
            console.log(
              'CONFLICT! %s is on the Permaweb, but there is a local file with the same name and different hash.  File will be overwritten if it is not renamed.',
              incompleteFile.file_name
            );
            console.log('   New file name : %s', new_full_path);
            const renameFile = prompt('   Rename local file? Y/N ');
            if (renameFile === 'Y') {
              // rename local file
              console.log('   ...file being renamed');
              fs.rename(full_path, new_full_path, (err) => {
                if (err) console.log(`ERROR: ${err}`);
              });
              // console.log ("File renamed.  Downloading %s from the PermaWeb", incompleteFile.file_name)
              // await downloadArDriveFile_byTx(incompleteFile.tx_id, newFileName)
              fs.unlinkSync(full_path);
              const myDownload = await downloadArDriveFile_byTx(
                user,
                incompleteFile.tx_id,
                incompleteFile.file_name,
                incompleteFile.isPublic,
                incompleteFile.ardrive_path
              );
            } else if (renameFile === 'N') {
              const overWriteFile = prompt('   Overwrite local file? Y/N ');
              if (overWriteFile === 'Y') {
                console.log('   ...file being overwritten');
                const myDownload = await downloadArDriveFile_byTx(
                  user,
                  incompleteFile.tx_id,
                  incompleteFile.file_name,
                  incompleteFile.isPublic,
                  incompleteFile.ardrive_path
                );
              } else {
                const ignoreFile = prompt(
                  '   Leave this file on the PermaWeb and ignore future downloads? Y/N '
                );
                if (ignoreFile === 'Y') {
                  // SET TO IGNORE
                  db.setIncompleteFileToIgnore(incompleteFile.tx_id);
                  console.log('   ...excluding file from future downloads');
                } else {
                  // Do nothing and skip file
                }
              }
            }
          }
        }
      }
    );
    return 'Downloaded all ArDrive files';
  } catch (err) {
    console.log(err);
    return 'Error downloading all ArDrive files';
  }
};
