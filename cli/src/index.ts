/* eslint-disable no-await-in-loop */
// index.ts
import { setupDatabase, getAll_fromProfile } from '../../app/backend/db';
import { getWalletBalance } from '../../app/backend/arweave';
import { sleep } from '../../app/backend/common';
import {
  queueNewFiles,
  checkUploadStatus,
  uploadArDriveFiles,
  getPriceOfNextUploadBatch,
} from '../../app/backend/upload';
import {
  getMyArDriveFiles,
  downloadMyArDriveFiles,
} from '../../app/backend/download';
import { setupAndGetUser, userLogin, promptForArDriveUpload } from './prompts';

async function main() {
  console.log('       ___   _____    _____   _____    _   _     _   _____  ');
  console.log(
    '      /   | |  _  \\  |  _  \\ |  _  \\  | | | |   / / | ____| '
  );
  console.log('     / /| | | |_| |  | | | | | |_| |  | | | |  / /  | |__   ');
  console.log('    / /_| | |  _  /  | | | | |  _  /  | | | | / /   |  __|  ');
  console.log(
    '   / /  | | | | \\ \\  | |_| | | | \\ \\  | | | |/ /    | |___  '
  );
  console.log(
    '  /_/   |_| |_|  \\_\\ |_____/ |_|  \\_\\ |_| |___/     |_____| '
  );
  console.log('');
  // Setup database if it doesnt exist
  try {
    await setupDatabase('./.ardrive-cli.db');
  } catch (err) {
    console.error(err);
    return;
  }

  // Check if user exists, if not, create a new one
  const profile = await getAll_fromProfile();
  let user;
  let uploadBatch;
  let readyToUpload;
  if (profile === undefined || profile.length === 0) {
    user = await setupAndGetUser();
  } else {
    // Allow the user to login
    user = await userLogin(profile[0].wallet_public_key, profile[0].owner);
  }
  // Run this in a loop
  while (true && user !== 0) {
    await getMyArDriveFiles(user);
    await queueNewFiles(user, user.sync_folder_path);
    await checkUploadStatus();
    uploadBatch = await getPriceOfNextUploadBatch();
    if (uploadBatch) {
      readyToUpload = await promptForArDriveUpload(
        uploadBatch.totalArDrivePrice,
        uploadBatch.totalSize,
        uploadBatch.totalAmountOfFiles
      );
      await uploadArDriveFiles(user, readyToUpload);
    }

    await downloadMyArDriveFiles(user);
    const today = new Date();
    const date = `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}`;
    const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
    const dateTime = `${date} ${time}`;
    const balance = await getWalletBalance(user.wallet_public_key);
    console.log(
      '%s Syncronization completed.  Current AR Balance: %s',
      dateTime,
      balance
    );
    await sleep(30000);
  }
}
main();
