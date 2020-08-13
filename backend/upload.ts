// upload.js
import { sep, join, extname, basename } from 'path';
import fs from 'fs';
import cli from '../cli/src/prompts';
import ArDriveDB from './db/db';
import {
  createArDriveTransaction,
  sendArDriveFee,
  getTransactionStatus,
} from './arweave';
import { asyncForEach, getWinston, formatBytes } from './common';
import { encryptFile, checksumFile } from './crypto';

const db = new ArDriveDB();

// Establish Arweave node connectivity.
const gatewayURL = 'https://arweave.net/';

// Recursively returns all files in a directory
const readDirR = (dir: string): any =>
  fs.statSync(dir).isDirectory()
    ? Array.prototype.concat(
        ...fs.readdirSync(dir).map((f) => readDirR(join(dir, f)))
      )
    : dir;

// Tags and Uploads a single file to your ArDrive
async function uploadArDriveFile(
  user: {
    sync_folder_path: string;
    password: any;
    jwk: string;
    owner: string;
  },
  filePath: string,
  arDrivePath: any,
  extension: any,
  modifiedDate: any
) {
  try {
    let arDrivePublic;
    let newFilePath = '';
    if (
      filePath.indexOf(user.sync_folder_path.concat(sep, 'Public', sep)) !== -1
    ) {
      // Public by choice, do not encrypt
      arDrivePublic = '1';
      newFilePath = filePath;
    } else {
      // private by default, encrypt file
      arDrivePublic = '0';
      await encryptFile(filePath, user.password, user.jwk);
      newFilePath = filePath.concat('.enc');
    }

    const arPrice = await createArDriveTransaction(
      user,
      newFilePath,
      arDrivePath,
      extension,
      modifiedDate,
      arDrivePublic
    );

    // console.log ("Removing old encrypted file %s", file_path)
    if (newFilePath.includes('.enc')) {
      fs.unlinkSync(newFilePath);
    }

    // Send the ArDrive fee to ARDRIVE Profit Sharing Comunity smart contract
    await sendArDriveFee(user, arPrice.toFixed(6));
    return 'Uploaded';
  } catch (err) {
    console.log(err);
    return 'Error uploading file';
  }
}

// Checks for any new files in the folder that arent synced or queued
export const queueNewFiles = async (
  user: { sync_folder_path: any; owner: any },
  sync_folder_path: string | any[]
) => {
  try {
    console.log('---Queueing New Files in %s---', sync_folder_path);
    let allFiles = null;
    try {
      allFiles = readDirR(user.sync_folder_path);
    } catch (err) {
      console.error(err);
      return 'Unable to scan directory';
    }

    // listing all files using forEach
    await asyncForEach(allFiles, async (file: any) => {
      const fullpath = file;
      let stats = null;
      try {
        stats = fs.statSync(fullpath);
      } catch (err) {
        console.log('File not ready yet %s', fullpath);
        return;
      }

      let extension = extname(fullpath);
      const fileName = basename(fullpath);
      extension = extension.toLowerCase();

      if (extension !== '.enc' && stats.size !== 0) {
        const localFileHash = await checksumFile(fullpath);
        const ardriveId = localFileHash.concat('//', fileName);

        let ardrivePublic = '0';

        if (fullpath.indexOf(sync_folder_path.concat('\\Public\\')) !== -1) {
          // Public by choice, do not encrypt
          ardrivePublic = '1';
        }

        const matchingArDriveID = await db.getByArDriveId_fromCompleted(
          ardriveId
        );
        const matchingFileName = await db.getByFileName_fromCompleted(fileName);
        const isQueued = await db.getByFilePath_fromQueue(fullpath);
        let ardrivePath = fullpath.replace(user.sync_folder_path, '');
        ardrivePath = ardrivePath.replace(fileName, '');

        if (matchingArDriveID) {
          // console.log("%s is already completed with a matching ardrive_id", fullpath)
        } else if (matchingFileName) {
          // A file exists on the permaweb with a different hash.  Changing that file's local status to 0 to force user to resolve conflict.
          db.setCompletedFileToDownload(fileName);
          // console.log ("Forcing user to resolve conflict %s", file)
        } else if (isQueued) {
          await db.getByFileName_fromCompleted(fileName);
          // console.log ("%s found in the queue", fullpath)
        } else {
          // console.log("%s queueing file", fullpath)
          const fileToQueue = {
            owner: user.owner,
            file_path: fullpath,
            file_name: fileName,
            file_extension: extension,
            file_size: stats.size,
            ardrive_id: ardriveId,
            isPublic: ardrivePublic,
            file_modified_date: stats.mtime,
            tx_id: '0',
            ardrive_path: ardrivePath,
          };
          db.queueFile(fileToQueue);
        }
      }
    });
    return 'SUCCESS Queuing Files';
  } catch (err) {
    console.log(err);
    return 'ERROR Queuing Files';
  }
};

// Uploads all queued files
export const uploadArDriveFiles = async (user: any) => {
  try {
    let filesUploaded = 0;
    let totalWinston = 0;
    let totalSize = 0;
    let winston = 0;

    console.log('---Uploading All Queued Files---');
    const filesToUpload = await db.getFilesToUpload_fromQueue();

    if (Object.keys(filesToUpload).length > 0) {
      await asyncForEach(
        filesToUpload,
        async (fileToUpload: { file_size: string | number }) => {
          totalSize += +fileToUpload.file_size;
          winston = await getWinston(fileToUpload.file_size);
          totalWinston += +winston;
        }
      );
      const totalArweavePrice = totalWinston * 0.000000000001;
      let arDriveFee = +totalArweavePrice.toFixed(9) * 0.15;
      if (arDriveFee < 0.00001) {
        arDriveFee = 0.00001;
      }
      const totalArDrivePrice = +totalArweavePrice.toFixed(9) + arDriveFee;
      const readyToUpload = await cli.promptForArDriveUpload(
        totalArDrivePrice,
        formatBytes(totalSize),
        Object.keys(filesToUpload).length
      );
      if (readyToUpload === 'Y') {
        // Ready to upload
        await asyncForEach(
          filesToUpload,
          async (fileToUpload: {
            file_size: string;
            file_path: any;
            ardrive_id: string;
            file_name: string;
            ardrive_path: any;
            file_extension: any;
            file_modified_date: any;
          }) => {
            if (fileToUpload.file_size === '0') {
              console.log(
                '%s has a file size of 0 and cannot be uploaded to the Permaweb',
                fileToUpload.file_path
              );
              await db.remove_fromQueue(fileToUpload.ardrive_id);
            } else if (
              await db.getByFileName_fromCompleted(fileToUpload.file_name)
            ) {
              // File name must be changed to something more unique like ardrive_id
              console.log(
                '%s was queued, but has been previously uploaded to the Permaweb',
                fileToUpload.file_path
              );
              await db.remove_fromQueue(fileToUpload.ardrive_id);
            } else {
              await uploadArDriveFile(
                user,
                fileToUpload.file_path,
                fileToUpload.ardrive_path,
                fileToUpload.file_extension,
                fileToUpload.file_modified_date
              );
              // console.log ("Removing old encrypted file %s", file_path)
              filesUploaded += 1;
            }
          }
        );
      }
    }
    if (filesUploaded < 0) {
      console.log('Uploaded %s files to your ArDrive!', filesUploaded);
    }
    return 'SUCCESS';
  } catch (err) {
    console.log(err);
    return 'ERROR processing files';
  }
};

// Scans through the queue & checks if a file has been mined, and if it has moves to Completed Table. If a file is not on the permaweb it will be uploaded
export const checkUploadStatus = async () => {
  try {
    console.log('---Checking Upload Status---');
    const unsyncedFiles = await db.getAllUploaded_fromQueue();

    await asyncForEach(
      unsyncedFiles,
      async (unsyncedFile: {
        tx_id: string;
        file_path: fs.PathLike;
        owner: any;
        file_name: string;
        file_extension: any;
        file_modified_date: any;
        ardrive_path: any;
        ardrive_id: string;
        isPublic: any;
        file_size: string;
      }) => {
        // Is the file uploaded on the web?
        const status = await getTransactionStatus(unsyncedFile.tx_id);
        if (status === 200) {
          console.log(
            'SUCCESS! %s was uploaded with TX of %s',
            unsyncedFile.file_path,
            unsyncedFile.tx_id
          );
          console.log(
            '...you can access the file here %s',
            gatewayURL.concat(unsyncedFile.tx_id)
          );
          const fileToComplete = {
            owner: unsyncedFile.owner,
            file_name: unsyncedFile.file_name,
            file_extension: unsyncedFile.file_extension,
            file_modified_date: unsyncedFile.file_modified_date,
            ardrive_path: unsyncedFile.ardrive_path,
            ardrive_id: unsyncedFile.ardrive_id,
            permaweb_link: gatewayURL.concat(unsyncedFile.tx_id),
            tx_id: unsyncedFile.tx_id,
            prev_tx_id: unsyncedFile.tx_id,
            isLocal: '1',
            isPublic: unsyncedFile.isPublic,
          };
          await db.completeFile(fileToComplete);
          await db.remove_fromQueue(unsyncedFile.ardrive_id);
        } else if (status === 202) {
          console.log(
            '%s is still being uploaded to the PermaWeb (TX_PENDING)',
            unsyncedFile.file_path
          );
        } else if (status === 410) {
          console.log(
            '%s failed to be uploaded (TX_FAILED)',
            unsyncedFile.file_path
          );
          await db.remove_fromQueue(unsyncedFile.ardrive_id);
        } else if (unsyncedFile.file_size === '0') {
          console.log(
            '%s has a file size of 0 and cannot be uploaded to the Permaweb',
            unsyncedFile.file_path
          );
          await db.remove_fromQueue(unsyncedFile.ardrive_id);
        } else if (
          await db.getByFileName_fromCompleted(unsyncedFile.file_name)
        ) {
          // File name must be changed to something more unique like ardrive_id
          console.log(
            '%s was queued, but has been previously uploaded to the Permaweb',
            unsyncedFile.file_path
          );
          await db.remove_fromQueue(unsyncedFile.ardrive_id);
        } else {
          // CHECK IF FILE EXISTS AND IF NOT REMOVE FROM QUEUE
          fs.access(unsyncedFile.file_path, async (err) => {
            if (err) {
              console.log(
                '%s was not found locally anymore.  Removing from the queue',
                unsyncedFile.file_path
              );
              await db.remove_fromQueue(unsyncedFile.ardrive_id);
            }
          });
        }
      }
    );
    return 'Success checking upload status';
  } catch (err) {
    console.log(err);
    return 'Error checking upload status';
  }
};
