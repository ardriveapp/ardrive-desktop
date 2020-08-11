// index.js
const Promise = require('bluebird');
const mime = require('mime-types');
const fetch = require('node-fetch');
const AppDAO = require('./dao');
const ArDriveDB = require('./db/ardrive_db');

// SQLite Database Setup
const arDriveDBFile = 'C:\\ArDrive\\ardrive.db';
const dao = new AppDAO(arDriveDBFile);
const arDriveFiles = new ArDriveDB(dao);

// Pauses application
exports.sleep = async (ms) => {
  return new Promise((resolve) => {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    setTimeout(resolve, ms);
  });
};

// Asyncronous ForEach function
exports.asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index += 1) {
    // eslint-disable-next-line no-await-in-loop
    await callback(array[index], index, array);
  }
};

// Format byte size to something nicer.  This is minified...
exports.formatBytes = (bytes) => {
  const marker = 1024; // Change to 1000 if required
  const decimal = 3; // Change as required
  const kiloBytes = marker; // One Kilobyte is 1024 bytes
  const megaBytes = marker * marker; // One MB is 1024 KB
  const gigaBytes = marker * marker * marker; // One GB is 1024 MB
  // const teraBytes = marker * marker * marker * marker; // One TB is 1024 GB

  // return bytes if less than a KB
  if (bytes < kiloBytes) return `${bytes} Bytes`;
  // return KB if less than a MB
  if (bytes < megaBytes) return `${(bytes / kiloBytes).toFixed(decimal)} KB`;
  // return MB if less than a GB
  if (bytes < gigaBytes) return `${(bytes / megaBytes).toFixed(decimal)} MB`;
  // return GB if less than a TB
  return `${(bytes / gigaBytes).toFixed(decimal)} GB`;
};

exports.extToMime = (type) => {
  return mime.lookup(type);
};

// Format byte size to something nicer.
exports.formatBytes = (bytes) => {
  const marker = 1024; // Change to 1000 if required
  const decimal = 3; // Change as required
  const kiloBytes = marker; // One Kilobyte is 1024 bytes
  const megaBytes = marker * marker; // One MB is 1024 KB
  const gigaBytes = marker * marker * marker; // One GB is 1024 MB
  // const teraBytes = marker * marker * marker * marker; // One TB is 1024 GB

  // return bytes if less than a KB
  if (bytes < kiloBytes) return `${bytes} Bytes`;
  // return KB if less than a MB
  if (bytes < megaBytes) return `${(bytes / kiloBytes).toFixed(decimal)} KB`;
  // return MB if less than a GB
  if (bytes < gigaBytes) return `${(bytes / megaBytes).toFixed(decimal)} MB`;
  // return GB if less than a TB
  return `${(bytes / gigaBytes).toFixed(decimal)} GB`;
};

// Creates the SQLite database
exports.createDB = async () => {
  await arDriveFiles.createProfileTable();
  await arDriveFiles.createQueueTable();
  await arDriveFiles.createCompletedTable();
  // console.log("Database created")
};

// Gets the price of AR based on amount of data
exports.getWinston = async (bytes = 0, target = '') => {
  return fetch(`https://arweave.net/price/${bytes}/${target}`);
};
