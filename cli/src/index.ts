/* eslint-disable no-await-in-loop */
// index.ts
import ArDriveDB from '../../backend/db/db';
import { getWalletBalance } from '../../backend/arweave';
import { sleep } from '../../backend/common';
import prompts from './prompts';
import {
  queueNewFiles,
  checkUploadStatus,
  uploadArDriveFiles,
} from '../../backend/upload';
import {
  getMyArDriveFiles,
  downloadMyArDriveFiles,
} from '../../backend/download';

const db = new ArDriveDB();

async function main() {
  try {
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
    await db.createDB();

    // Check if user exists, if not, create a new one
    const profile = await db.getAll_fromProfile();
    let user;
    if (profile === undefined || profile.length === 0) {
      user = await prompts.setupAndGetUser();
    } else {
      // Allow the user to login
      user = await prompts.userLogin(
        profile[0].wallet_public_key,
        profile[0].owner
      );
    }
    // Run this in a loop
    while (true && user !== 0) {
      await getMyArDriveFiles(user);
      await queueNewFiles(user, user.sync_folder_path);
      await checkUploadStatus();
      await uploadArDriveFiles(user);
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
  } catch (err) {
    console.log('Error: ', err);
  }
}
main();
