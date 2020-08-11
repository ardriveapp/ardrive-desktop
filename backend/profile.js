// index.js
const Promise = require('bluebird');
const fs = require('fs');
const prompt = require('prompt-sync')({ sigint: true });
// GET RID OF THIS
const passwordPrompt = require('prompts');
const AppDAO = require('./db/dao');
const ArDriveDB = require('./db/db');
const arweave = require('./arweave');

// SQLite Database Setup
const arDriveDBFile = 'C:\\ArDrive\\ardrive.db';
const dao = new AppDAO(arDriveDBFile);
const arDriveFiles = new ArDriveDB(dao);

// Establish Arweave node connectivity.
const ArDriveCrypto = require('./crypto');

// Create a wallet and return the key and address
async function createArDriveWallet() {
  return Promise(async (resolve, reject) => {
    try {
      const {
        walletPrivateKey,
        walletPublicKey,
      } = await arweave.generateWallet();
      // TODO: logging is useless we need to store this somewhere
      console.log(
        'SUCCESS! Your new wallet public address is %s',
        walletPublicKey.toString()
      );
      resolve({ walletPrivateKey, walletPublicKey });
    } catch {
      reject('Cannot create a new Wallet');
    }
  });
}

async function setupArDriveSyncFolder() {
  try {
    console.log(
      'Please enter the path of your local ArDrive folder e.g D:\\ArDriveSync.  A new folder will be created if it does not exist'
    );
    // TODO: move this prompt to CLI and call this separately
    const syncFolderPath = prompt('ArDrive Sync Folder Path: ');
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
    // Try again
    return setupArDriveSyncFolder();
  } catch (err) {
    console.log(err);
    return null;
  }
}

// First Time Setup
exports.getUser = async (
  owner,
  walletPrivateKey,
  walletPublicKey,
  loginPasswordResponse,
  dataProtectionKeyResponse
) => {
  const encryptedWalletPrivateKey = await ArDriveCrypto.encryptText(
    JSON.stringify(walletPrivateKey),
    loginPasswordResponse.password
  );
  const encryptedDataProtectionKey = await ArDriveCrypto.encryptText(
    dataProtectionKeyResponse.password,
    loginPasswordResponse.password
  );

  // Set sync schedule
  const syncSchedule = '1 minute';
  // 5 minutes, 15 mintues, 30 minutes, 60 minutes

  // Setup ArDrive folder location
  const syncFolderPath = await setupArDriveSyncFolder();

  // Save to Database
  const profileToAdd = {
    owner,
    sync_schedule: syncSchedule,
    data_protection_key: JSON.stringify(encryptedDataProtectionKey),
    wallet_private_key: JSON.stringify(encryptedWalletPrivateKey),
    wallet_public_key: walletPublicKey,
    sync_folder_path: syncFolderPath,
  };
  await arDriveFiles.createArDriveProfile(profileToAdd);

  return {
    password: dataProtectionKeyResponse.password,
    jwk: JSON.stringify(walletPrivateKey),
    wallet_public_key: walletPublicKey,
    owner,
    sync_folder_path: syncFolderPath,
  };
};

// Decrypts password
exports.unlockArDriveProfile = async (wallet_public_key, owner) => {
  return Promise(async (resolve, reject) => {
    try {
      console.log('An ArDrive Wallet is present for: %s', owner);
      const response = await passwordPrompt({
        type: 'text',
        name: 'password',
        style: 'password',
        message: 'Please enter your ArDrive password for this wallet: ',
      });

      const profile = await arDriveFiles.getAll_fromProfileWithWalletPublicKey(
        wallet_public_key
      );
      const jwk = await ArDriveCrypto.decryptText(
        JSON.parse(profile[0].wallet_private_key),
        response.password
      );
      const dataProtectionKey = await ArDriveCrypto.decryptText(
        JSON.parse(profile[0].data_protection_key),
        response.password
      );
      console.log('');
      console.log('ArDrive unlocked!!');
      console.log('');
      resolve({
        password: dataProtectionKey,
        jwk,
        wallet_public_key,
        owner: profile[0].owner,
        sync_folder_path: profile[0].sync_folder_path,
      });
    } catch (err) {
      console.error(err);
      reject(err, 'Incorrect Password!! Cannot unlock ArDrive');
    }
  });
};

// TO DO
// Create an ArDrive password and save to DB
// exports.resetArDrivePassword = async function () {};
