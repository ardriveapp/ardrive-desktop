// index.js
const Promise = require('bluebird');
const mime = require('mime-types');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const arweave = require('./arweave');

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

// Gets the price of AR based on amount of data
exports.getWinston = async (bytes) => {
  const response = await fetch(`https://arweave.net/price/${bytes}`);
  const winston = await response.json();
  return winston;
};

exports.getLocalWallet = async (existingWalletPath) => {
  const walletPrivateKey = JSON.parse(
    fs.readFileSync(existingWalletPath).toString()
  );
  const walletPublicKey = await arweave.getAddressForWallet(walletPrivateKey);
  return { walletPrivateKey, walletPublicKey };
};

// Checks path if it exists, and creates if not
exports.checkOrCreateFolder = async (path) => {
  try {
    const stats = fs.statSync(path);
    if (stats.isDirectory()) {
      return path;
    }
    console.log(
      'The path you have entered is not a directory, please enter a correct path for your ArDrive wallet backup.'
    );
    return '0';
  } catch (err) {
    console.log('Folder not found.  Creating new directory at %s', path);
    fs.mkdirSync(path);
    return path;
  }
};

exports.backupWallet = async (backupWalletPath, wallet, owner) => {
  try {
    const backupWalletFile = backupWalletPath.concat(
      path.sep,
      'ArDrive_Backup_',
      owner,
      '.json'
    );
    console.log('Writing your ArDrive Wallet backup to %s', backupWalletFile);
    fs.writeFileSync(backupWalletFile, JSON.stringify(wallet.walletPrivateKey));
    return 'Success!';
  } catch (err) {
    console.log(err);
    return 0;
  }
};
