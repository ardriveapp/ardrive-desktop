// index.js
const fs = require('fs');
const AppDAO = require('./db/dao');
const ArDriveDB = require('./db/db');

// SQLite Database Setup
const arDriveDBFile = './ardrive.db';
const dao = new AppDAO(arDriveDBFile);
const db = new ArDriveDB(dao);

// Establish Arweave node connectivity.
const ArDriveCrypto = require('./crypto');

exports.setupArDriveSyncFolder = async (syncFolderPath) => {
  try {
    const stats = fs.statSync(syncFolderPath);
    if (stats.isDirectory()) {
      if (!fs.existsSync(syncFolderPath.concat('\\Public'))) {
        fs.mkdirSync(syncFolderPath.concat('\\Public'));
      }
      console.log('Using %s as the local ArDrive folder.', syncFolderPath);
      return syncFolderPath;
    }
    console.log(
      'The path you have entered is not a directory, please enter a correct path for ArDrive.'
    );
    return '0';
  } catch (err) {
    console.log(
      'Folder not found.  Creating new directory at %s',
      syncFolderPath
    );
    fs.mkdirSync(syncFolderPath);
    fs.mkdirSync(syncFolderPath.concat('\\Public'));
    return syncFolderPath;
  }
};

// First Time Setup
exports.setUser = async (
  owner,
  syncFolderPath,
  walletPrivateKey,
  walletPublicKey,
  loginPassword,
  dataProtectionKey
) => {
  const encryptedWalletPrivateKey = await ArDriveCrypto.encryptText(
    JSON.stringify(walletPrivateKey),
    loginPassword
  );
  const encryptedDataProtectionKey = await ArDriveCrypto.encryptText(
    dataProtectionKey,
    loginPassword
  );

  // Set sync schedule, not modifiable at this time
  const syncSchedule = '1 minute';
  // 5 minutes, 15 mintues, 30 minutes, 60 minutes
  // Save to Database
  const profileToAdd = {
    owner,
    sync_schedule: syncSchedule,
    data_protection_key: JSON.stringify(encryptedDataProtectionKey),
    wallet_private_key: JSON.stringify(encryptedWalletPrivateKey),
    wallet_public_key: walletPublicKey,
    sync_folder_path: syncFolderPath,
  };
  await db.createArDriveProfile(profileToAdd);
  console.log('New ArDrive user added!');
  return {
    password: dataProtectionKey,
    jwk: JSON.stringify(walletPrivateKey),
    wallet_public_key: walletPublicKey,
    owner,
    sync_folder_path: syncFolderPath,
  };
};

// Decrypts user's private key information and unlocks their ArDrive
exports.getUser = async (wallet_public_key, loginPassword) => {
  try {
    const profile = await db.getAll_fromProfileWithWalletPublicKey(
      wallet_public_key
    );
    const jwk = await ArDriveCrypto.decryptText(
      JSON.parse(profile.wallet_private_key),
      loginPassword
    );
    const dataProtectionKey = await ArDriveCrypto.decryptText(
      JSON.parse(profile.data_protection_key),
      loginPassword
    );
    console.log('');
    console.log('ArDrive unlocked!!');
    console.log('');
    return {
      password: dataProtectionKey,
      jwk,
      wallet_public_key,
      owner: profile.owner,
      sync_folder_path: profile.sync_folder_path,
    };
  } catch (err) {
    console.log(err);
    console.log('Incorrect Password!! Cannot unlock ArDrive');
    return 0;
  }
};

// TO DO
// Create an ArDrive password and save to DB
// exports.resetArDrivePassword = async function () {};
