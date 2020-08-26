/* eslint-disable import/prefer-default-export */
// arweave.js
import fs from 'fs';
import path from 'path';
import Arweave from 'arweave/node';
import Community from 'community-js';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { getWinston, extToMime } from './common';
import { checksumFile, encryptTag } from './crypto';
import { Wallet } from './types';
import { updateQueueStatus } from './db';
import { encryptText } from '../../cli/build/app/backend/crypto';

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
const communityTxId = 'HzCmXxpvcnPSEPx0y64WKT-9_gYDxMhMZlb6-R_STQ8';
// eslint-disable-next-line new-cap
const community = new Community(arweave);

export const getAddressForWallet = async (walletPrivateKey: JWKInterface) => {
  return arweave.wallets.jwkToAddress(walletPrivateKey);
};

export const generateWallet = async (): Promise<Wallet> => {
  const walletPrivateKey = await arweave.wallets.generate();
  const walletPublicKey = await getAddressForWallet(walletPrivateKey);
  return { walletPrivateKey, walletPublicKey };
};

export const getLocalWallet = async (existingWalletPath: string) => {
  const walletPrivateKey = JSON.parse(
    fs.readFileSync(existingWalletPath).toString()
  );
  const walletPublicKey = await getAddressForWallet(walletPrivateKey);
  return { walletPrivateKey, walletPublicKey };
};

// Gets all of the transactions from a user's wallet, filtered by owner and ardrive version.
export const getAllMyTxIds = async (user: {
  wallet_public_key: any;
  owner: any;
}): Promise<string[]> => {
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
    // console.log(err);
    return Promise.reject(err);
  }
};

// Gets only the transaction information, with no data
export const getTransaction = async (txid: string): Promise<any> => {
  try {
    const tx = await arweave.transactions.get(txid);
    return tx;
  } catch (err) {
    // console.error(err);
    return Promise.reject(err);
  }
};

// Gets only the data of a given transaction
export const getTransactionData = async (txid: string) => {
  try {
    const data = await arweave.transactions.getData(txid, { decode: true });
    return data;
  } catch (err) {
    console.log(err);
    return Promise.reject(err);
  }
};

// Get the latest status of a transaction
export const getTransactionStatus = async (txid: string) => {
  try {
    const response = await arweave.transactions.getStatus(txid);
    return response.status;
  } catch (err) {
    // console.log(err);
    return 0;
  }
};

// Get the balance of an Arweave wallet
export const getWalletBalance = async (walletPublicKey: string) => {
  try {
    let balance = await arweave.wallets.getBalance(walletPublicKey);
    balance = await arweave.ar.winstonToAr(balance);
    return balance;
  } catch (err) {
    console.log(err);
    return 0;
  }
};

export const createArDriveTransaction = async (
  user: { jwk: string; owner: string },
  filePath: string,
  fileName: string,
  fileHash: string,
  contentType: string,
  arDrivePath: string,
  modifiedDate: string,
  arDrivePublic: string
) => {
  try {
    const fileToUpload = fs.readFileSync(filePath);
    // const fileName = path.basename(filePath.replace('.enc', ''));
    const transaction = await arweave.createTransaction(
      { data: arweave.utils.concatBuffers([fileToUpload]) },
      JSON.parse(user.jwk)
    );
    const txSize = transaction.get('data_size');
    const winston = await getWinston(txSize);
    const arPrice = +winston * 0.000000000001;
    console.log(
      'Uploading %s (%d bytes) at %s to the Permaweb',
      filePath,
      txSize,
      arPrice
    );

    // Tag file
    transaction.addTag('Content-Type', contentType);
    transaction.addTag('User-Agent', `ArDrive/${VERSION}`);
    transaction.addTag('ArDrive-Owner', user.owner);
    transaction.addTag('ArDrive-Public', arDrivePublic);
    transaction.addTag('ArDrive-FileName', fileName);
    transaction.addTag('ArDrive-FileHash', fileHash);
    transaction.addTag('ArDrive-Path', arDrivePath);
    transaction.addTag('ArDrive-ModifiedDate', modifiedDate);
    // transaction.addTag('ArDrive-Id', arDriveId); no longer needed

    // Sign file
    await arweave.transactions.sign(transaction, JSON.parse(user.jwk));
    const uploader = await arweave.transactions.getUploader(transaction);
    const fileToUpdate = {
      file_path: filePath.replace('.enc', ''),
      tx_id: transaction.id,
      isPublic: arDrivePublic,
    };
    // Update the queue since the file is now being uploaded
    await updateQueueStatus(fileToUpdate);
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
export const createArDriveWallet = async (): Promise<Wallet> => {
  try {
    const wallet = await generateWallet();
    // TODO: logging is useless we need to store this somewhere.  It is stored in the database - Phil
    console.log(
      'SUCCESS! Your new wallet public address is %s',
      wallet.walletPublicKey
    );
    return wallet;
  } catch (err) {
    console.error('Cannot create Wallet');
    console.error(err);
    return Promise.reject(err);
  }
};

// Sends a fee (15% of transaction price) to ArDrive Profit Sharing Community holders
export const sendArDriveFee = async (
  user: { jwk: string },
  arweaveCost: string
) => {
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
      { target: holder, quantity: arweave.ar.arToWinston(fee.toString()) },
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
