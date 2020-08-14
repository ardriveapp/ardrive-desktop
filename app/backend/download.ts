/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-vars */
// upload.js
import fs from 'fs';
import { sleep, asyncForEach, gatewayURL } from './common';
import { getTransactionData, getAllMyTxIds, getTransaction } from './arweave';
import { checksumFile, decryptFile } from './crypto';
import { promptForFileOverwrite } from '../../cli/src/prompts';
import {
  getAll_fromCompleted,
  updateCompletedStatus,
  setIncompleteFileToIgnore,
  getByTx_fromCompleted,
  completeFile,
} from './db';

// Downloads a single file from ArDrive by transaction
async function downloadArDriveFile_byTx(
  user: { sync_folder_path: string; password: string; jwk: string },
  txid: string,
  file_name: any,
  isPublic: string,
  ardrive_path: any
) {
  try {
    const full_path = user.sync_folder_path.concat(ardrive_path, file_name);
    const folderPath = user.sync_folder_path.concat(ardrive_path);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      await sleep(1000);
    }
    const data = await getTransactionData(txid);

    // console.log("FOUND PERMAFILE! %s is on the Permaweb, but not local.  Downloading...", full_path, data)
    if (isPublic === '1') {
      fs.writeFileSync(full_path, data);
      console.log('DOWNLOADED %s', full_path);
    } else {
      // Method with decryption
      fs.writeFileSync(full_path.concat('.enc'), data);
      // const stats = fs.statSync(full_path.concat('.enc'));
      await sleep(500);
      await decryptFile(full_path.concat('.enc'), user.password, user.jwk);
      await sleep(500);
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
export const getMyArDriveFiles = async (user: {
  wallet_public_key: string;
  owner: string;
}) => {
  // console.log ("FOUND PERMAFILE %s but not ready to be downloaded yet", full_path)
  console.log('---Getting all your ArDrive files---');

  let ardrive_owner: any;
  let ardrive_path: any;
  let ardrive_filename: any;
  let ardrive_modifieddate: any;
  let ardrive_public: any;
  let ardrive_id: any;
  let foundFiles = 0;

  const txids = await getAllMyTxIds(user);

  // eslint-disable-next-line consistent-return
  await asyncForEach(txids, async (txid: string) => {
    // txids.forEach(async function (txid) {
    try {
      const isCompleted = await getByTx_fromCompleted(txid);
      if (isCompleted) {
        // skip
      } else {
        // Get the full TX and add to the DB
        const transaction = await getTransaction(txid);
        transaction
          .get('tags')
          .forEach(
            (tag: {
              get: (
                arg0: string,
                arg1: { decode: boolean; string: boolean }
              ) => any;
            }) => {
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
            }
          );

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
          file_extension: undefined, // TODO - FIX THIS
        };
        await completeFile(fileToAdd);
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
export const downloadMyArDriveFiles = async (user: {
  sync_folder_path: string;
  password: string;
  jwk: string;
}) => {
  try {
    console.log('---Downloading any unsynced files---');
    const incompleteFiles = await getAll_fromCompleted();

    await asyncForEach(
      incompleteFiles,
      async (incompleteFile: {
        ardrive_path: any;
        file_name: string;
        tx_id: string;
        isPublic: string;
        ardrive_id: string;
      }) => {
        const full_path = user.sync_folder_path.concat(
          incompleteFile.ardrive_path,
          incompleteFile.file_name
        );
        if (!fs.existsSync(full_path)) {
          // TODO track these individual awaits - don't catch whole thing!
          await downloadArDriveFile_byTx(
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
          const localFileHash = await checksumFile(full_path);
          const incompleteFileArDriveID = incompleteFile.ardrive_id.split('//');
          const incompleteFileHash = incompleteFileArDriveID[0];
          if (incompleteFileHash === localFileHash) {
            // console.log("IGNORED! %s is on the Permaweb, but is already downloaded (matching file name and hash)", full_path)
            await updateCompletedStatus(incompleteFile.tx_id);
          } else {
            // There is a conflict.  Prompt the user to resolve
            const conflictResolution = await promptForFileOverwrite(full_path);
            switch (conflictResolution) {
              case 'R': {
                // Rename by adding - copy at the end.
                let newFileName:
                  | string[]
                  | string = incompleteFile.file_name.split('.');
                newFileName = newFileName[0].concat(' - Copy.', newFileName[1]);
                const new_full_path = user.sync_folder_path.concat(
                  incompleteFile.ardrive_path,
                  newFileName
                );
                console.log(
                  '   ...renaming existing file to : %s',
                  new_full_path
                );
                fs.renameSync(full_path, new_full_path);

                await downloadArDriveFile_byTx(
                  user,
                  incompleteFile.tx_id,
                  incompleteFile.file_name,
                  incompleteFile.isPublic,
                  incompleteFile.ardrive_path
                );
                fs.unlinkSync(full_path.concat('.enc'));
                break;
              }
              case 'O': // Overwrite existing file
                console.log('   ...file being overwritten');
                await downloadArDriveFile_byTx(
                  user,
                  incompleteFile.tx_id,
                  incompleteFile.file_name,
                  incompleteFile.isPublic,
                  incompleteFile.ardrive_path
                );
                fs.unlinkSync(full_path.concat('.enc'));
                break;
              case 'I':
                console.log('   ...excluding file from future downloads');
                setIncompleteFileToIgnore(incompleteFile.tx_id);
                break;
              default:
                // Skipping this time
                break;
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
