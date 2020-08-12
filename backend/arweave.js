// arweave.js
const fs = require('fs');
const path = require('path');
const Arweave = require('arweave/node');
const Community = require('community-js');
const arDriveCommon = require('./common');
const arDriveCrypto = require('./crypto');
const AppDAO = require('./db/dao');
const ArDriveDB = require('./db/db');

// SQLite Database Setup
const arDriveDBFile = './ardrive.db'; // NEED AN ENVIRONMENT VARIABLE
const dao = new AppDAO(arDriveDBFile);
const db = new ArDriveDB(dao);

// ArDrive Version Tag
const VERSION = '0.1.1';

const arweave = Arweave.init({
  // host: 'perma.online', // ARCA Community Gateway
  host: 'arweave.net', // Arweave Gateway
  port: 443,
  protocol: 'https',
  timeout: 600000,
});

// ArDrive Profit Sharing Community Smart Contract
const communityTxId = 'Zxsxx2ON_dojHD_WlLBbOAo3N_KBQUmJ4JxYl-P19pQ';
// eslint-disable-next-line new-cap
const community = new Community.default(arweave);

const generateWallet = async () => {
  const walletPrivateKey = await arweave.wallets.generate();
  const walletPublicKey = await this.getAddressForWallet(walletPrivateKey);
  return { walletPrivateKey, walletPublicKey };
};

exports.getAddressForWallet = async (wallet) => {
  return arweave.wallets.jwkToAddress(wallet);
};

// Gets all of the transactions from a user's wallet, filtered by owner and ardrive version.
exports.getAllMyTxIds = async (user) => {
  try {
    const txids = await arweave.arql({
      op: 'and',
      expr1: {
        op: 'equals',
        expr1: 'from',
        expr2: user.wallet_public_key,
      },
      expr2: {
        op: 'and',
        expr1: {
          op: 'equals',
          expr1: 'User-Agent',
          expr2: `ArDrive/${VERSION}`,
        },
        expr2: {
          op: 'equals',
          expr1: 'ArDrive-Owner',
          expr2: user.owner,
        },
      },
    });
    return txids;
  } catch (err) {
    console.log(err);
    return 0;
  }
};

// Gets only the transaction information, with no data
exports.getTransaction = async (txid) => {
  try {
    const tx = await arweave.transactions.get(txid);
    return tx;
  } catch (err) {
    // console.log(err);
    return 0;
  }
};

// Gets only the data of a given transaction
exports.getTransactionData = async (txid) => {
  try {
    const data = await arweave.transactions.getData(txid, { decode: true });
    return data;
  } catch (err) {
    console.log(err);
    return 0;
  }
};

// Get the latest status of a transaction
exports.getTransactionStatus = async (txid) => {
  try {
    const response = await arweave.transactions.getStatus(txid);
    return response.status;
  } catch (err) {
    console.log(err);
    return 0;
  }
};

// Get the balance of an Arweave wallet
exports.getWalletBalance = async (walletPublicKey) => {
  try {
    let balance = await arweave.wallets.getBalance(walletPublicKey);
    balance = await arweave.ar.winstonToAr(balance);
    return balance;
  } catch (err) {
    console.log(err);
    return 0;
  }
};

exports.createArDriveTransaction = async (
  user,
  filePath,
  arDrivePath,
  extension,
  modifiedDate,
  arDrivePublic
) => {
  try {
    const fileToUpload = fs.readFileSync(filePath);
    const fileName = path.basename(filePath.replace('.enc', ''));
    const transaction = await arweave.createTransaction(
      { data: arweave.utils.concatBuffers([fileToUpload]) },
      JSON.parse(user.jwk)
    );
    const txSize = transaction.get('data_size');
    const winston = await arDriveCommon.getWinston(txSize);
    const arPrice = +winston * 0.000000000001;
    console.log(
      'Uploading %s (%d bytes) at %s to the Permaweb',
      filePath,
      txSize,
      arPrice
    );
    // Ideally, all tags would also be encrypted if the file is encrypted
    const unencryptedFilePath = filePath.replace('.enc', '');
    const localFileHash = await arDriveCrypto.checksumFile(unencryptedFilePath);
    const arDriveId = localFileHash.concat('//', fileName);
    // Get Content-Type of file
    const contentType = arDriveCommon.extToMime(extension);
    // Tag file
    transaction.addTag('Content-Type', contentType);
    transaction.addTag('User-Agent', `ArDrive/${VERSION}`);
    transaction.addTag('ArDrive-FileName', fileName);
    transaction.addTag('ArDrive-Path', arDrivePath);
    transaction.addTag('ArDrive-ModifiedDate', modifiedDate);
    transaction.addTag('ArDrive-Owner', user.owner);
    transaction.addTag('ArDrive-Id', arDriveId);
    transaction.addTag('ArDrive-Public', arDrivePublic);
    // Sign file
    await arweave.transactions.sign(transaction, JSON.parse(user.jwk));
    const uploader = await arweave.transactions.getUploader(transaction);
    const fileToUpdate = {
      file_path: filePath.replace('.enc', ''),
      tx_id: transaction.id,
      ardrive_id: arDriveId,
      isPublic: arDrivePublic,
    };
    // Update the queue since the file is now being uploaded
    await db.updateQueueStatus(fileToUpdate);
    while (!uploader.isComplete) {
      // eslint-disable-next-line no-await-in-loop
      await uploader.uploadChunk();
      // console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
      console.log(`${uploader.pctComplete}%`);
    }
    console.log(
      'SUCCESS %s was submitted with TX %s',
      filePath,
      transaction.id
    );
    return arPrice;
  } catch (err) {
    console.log(err);
    return 0;
  }
};
// Create a wallet and return the key and address
exports.createArDriveWallet = async () => {
  try {
    const { walletPrivateKey, walletPublicKey } = await generateWallet();
    // TODO: logging is useless we need to store this somewhere.  It is stored in the database - Phil
    console.log(
      'SUCCESS! Your new wallet public address is %s',
      walletPublicKey.toString()
    );
    return { walletPrivateKey, walletPublicKey };
  } catch {
    return 'Cannot create a new Wallet';
  }
};

// Sends a fee (15% of transaction price) to ArDrive Profit Sharing Community holders
exports.sendArDriveFee = async (user, arweaveCost) => {
  try {
    await community.setCommunityTx(communityTxId);
    // Fee for all data submitted to ArDrive is 15%
    let fee = +arweaveCost * 0.15;

    if (fee < 0.00001) {
      fee = 0.00001;
    }

    // Probabilistically select the PST token holder
    const holder = await community.selectWeightedHolder();

    // send a fee. You should inform the user about this fee and amount.
    const transaction = await arweave.createTransaction(
      { target: holder, quantity: arweave.ar.arToWinston(fee) },
      JSON.parse(user.jwk)
    );

    // Sign file
    await arweave.transactions.sign(transaction, JSON.parse(user.jwk));

    // Submit the transaction
    const response = await arweave.transactions.post(transaction);
    if (response.status === 200 || response.status === 202) {
      console.log(
        'SUCCESS ArDrive fee of %s was submitted with TX %s',
        fee.toFixed(9),
        transaction.id
      );
    } else {
      console.log('ERROR submitting ArDrive fee with TX %s', transaction.id);
    }
    return transaction.id;
  } catch (err) {
    console.log(err);
    return 'ERROR sending ArDrive fee';
  }
};
