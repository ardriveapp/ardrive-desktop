const prompt = require('prompt-sync')({ sigint: true });
const passwordPrompt = require('prompts');
const profile = require('./profile');
const arCommon = require('./common');
const arweave = require('./arweave');

// Get path to local wallet and return that wallet public and private key
const promptForLocalWallet = async () => {
  console.log(
    'Please enter the path of your existing Arweave Wallet JSON file eg. C:\\Source\\ardrive_test_key.json'
  );
  const existingWalletPath = prompt('Wallet Path: ');
  return arCommon.getLocalWallet(existingWalletPath);
};

exports.setupAndGetUser = async () => {
  try {
    // Welcome message and info
    console.log(
      'We have not detected a profile.  To store your files permanently, you must first setup your ArDrive account.'
    );

    // Get the ArDrive owner nickname
    console.log('What is the nickname you would like to give to this wallet?');
    const owner = prompt('Please enter your nickname: ');

    // Setup ArDrive Login Password
    console.log(
      'Your ArDrive Login password will be used to unlock your ArDrive and start syncing.'
    );
    // const password = prompt('Please enter a strong ArDrive Login password: ');
    const loginPasswordResponse = await passwordPrompt({
      type: 'text',
      name: 'password',
      style: 'password',
      message: 'Please enter a strong ArDrive Login password: ',
    });

    // Setup ArDrive Data Protection Password
    console.log(
      'Your ArDrive Data Protection password will be used to encrypt your data on the Permaweb.  Do NOT lose this!!!'
    );
    const dataProtectionKeyResponse = await passwordPrompt({
      type: 'text',
      name: 'password',
      style: 'password',
      message: 'Please enter a strong ArDrive Encryption password: ',
    });

    // Create new or import Arweave wallet
    console.log('To use ArDrive, you must have an Arweave Wallet.');
    const existingWallet = prompt(
      'Do you have an existing Arweave Wallet (.json file) Y/N '
    );
    const { walletPrivateKey, walletPublicKey } =
      existingWallet === 'N'
        ? await arweave.generateWallet()
        : await promptForLocalWallet();

    const user = await profile.getUser(
      owner,
      walletPrivateKey,
      walletPublicKey,
      loginPasswordResponse,
      dataProtectionKeyResponse
    );

    return user;
  } catch (err) {
    console.log(err);
    return null;
  }
};
