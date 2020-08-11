/* eslint-disable no-await-in-loop */
// index.js

const AppDAO = require('./db/dao');
const ArDriveDB = require('./db/db');
const ArDriveCommon = require('./common');
const ArDriveUpload = require('./upload');
const ArDriveDownload = require('./download');
const arweave = require('./arweave');
const cli = require('./cli');

// SQLite Database Setup
const arDriveDBFile = './ardrive.db'; // NEED AN ENVIRONMENT VARIABLE
const dao = new AppDAO(arDriveDBFile);
const db = new ArDriveDB(dao);

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
    await ArDriveCommon.sleep(500);

    // Check if user exists, if not, create a new one
    const profile = await db.getAll_fromProfile();
    let user;
    if (profile === undefined || profile.length === 0) {
      user = await cli.setupAndGetUser();
      await ArDriveCommon.sleep(500);
    } else {
      // Allow the user to login
      user = await cli.userLogin(
        profile[0].wallet_public_key,
        profile[0].owner
      );
    }

    // Run this in a loop
    while (true && user !== 0) {
      await ArDriveDownload.getMyArDriveFiles(user);
      await ArDriveUpload.queueNewFiles(user, user.sync_folder_path);
      await ArDriveUpload.checkUploadStatus(user);
      await ArDriveUpload.uploadArDriveFiles(user);
      await ArDriveDownload.downloadMyArDriveFiles(user);

      const today = new Date();
      const date = `${today.getFullYear()}-${
        today.getMonth() + 1
      }-${today.getDate()}`;
      const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
      const dateTime = `${date} ${time}`;
      const balance = await arweave.getWalletBalance(user.wallet_public_key);
      console.log(
        '%s Syncronization completed.  Current AR Balance: %s',
        dateTime,
        balance
      );
      await ArDriveCommon.sleep(30000);
    }
  } catch (err) {
    console.log('Error: ', err);
  }
}

main();

/* SCRAPS
const instances = [Arweave.init({
    host: '127.0.0.1',
    port: 1984,
    protocol: 'http'
}),
Arweave.init({
    host: '127.0.0.2',
    port: 1984,
    protocol: 'http'
});


const post = async (tx) => {
    await Promise.all(instances.map((instance) => {
        instance.post(tx);
    })
}

*/
