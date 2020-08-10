// Nodejs encryption with CTR
// With help from https://medium.com/@brandonstilson/lets-encrypt-files-with-node-85037bea8c0e
const crypto = require('crypto');
const fs = require('fs');
const AppendInitVect = require('./appendInitVect');

function getFileCipherKey(password, jwk) {
  try {
    const hash = crypto.createHash('sha256');
    hash.update(password);
    hash.update(jwk.toString());
    const KEY = hash.digest();
    return KEY;
  } catch (err) {
    console.log(err);
    return null;
  }
}

function getTextCipherKey(password) {
  try {
    const hash = crypto.createHash('sha256');
    hash.update(password);
    const KEY = hash.digest();
    return KEY;
  } catch (err) {
    console.log(err);
    return null;
  }
}

exports.encryptFile = async (file_path, password, jwk) => {
  return new Promise((resolve, reject) => {
    try {
      // Generate a secure, pseudo random initialization vector.
      const initVect = crypto.randomBytes(16);

      // Generate a cipher key from the password.
      const CIPHER_KEY = getFileCipherKey(password, jwk);

      const readStream = fs.createReadStream(file_path);
      const cipher = crypto.createCipheriv('aes256', CIPHER_KEY, initVect);
      const appendInitVect = new AppendInitVect(initVect);

      // Create a write stream with a different file extension.
      let writeStream = null;
      if (file_path.includes('.enc')) {
        writeStream = fs.createWriteStream(file_path);
      } else {
        writeStream = fs.createWriteStream(file_path.concat('.enc'));
      }

      readStream.pipe(cipher).pipe(appendInitVect).pipe(writeStream);
      writeStream.on('finish', () => {
        resolve('Success!');
      });
    } catch (err) {
      reject(err, 'File Encryption Error');
    }
  });
};

exports.decryptFile = async (encrypted_file_path, password, jwk) => {
  return new Promise((resolve, reject) => {
    try {
      // console.log ("Decrypting %s", encrypted_file_path)
      // First, get the initialization vector from the file.
      // var encrypted_file_path = file_path.concat(".enc")
      // fs.renameSync(file_path, encrypted_file_path)
      const readInitVect = fs.createReadStream(encrypted_file_path, {
        end: 15,
      });

      let initVect;
      readInitVect.on('data', async (chunk) => {
        initVect = chunk;
      });

      // Once we’ve got the initialization vector, we can decrypt the file.
      readInitVect.on('close', async () => {
        const cipherKey = getFileCipherKey(password, jwk);
        const readStream = fs.createReadStream(encrypted_file_path, {
          start: 16,
        });
        const decipher = crypto.createDecipheriv('aes256', cipherKey, initVect);
        const writeStream = fs.createWriteStream(
          encrypted_file_path.replace('.enc', '')
        );
        readStream.pipe(decipher).pipe(writeStream);
      });
    } catch (err) {
      // console.log (err)
      reject(err, 'ERROR decrypting file');
    }
    resolve('Success!');
  });
};

exports.encryptText = async (text, password) => {
  return new Promise((resolve, reject) => {
    try {
      const initVect = crypto.randomBytes(16);
      const CIPHER_KEY = getTextCipherKey(password);
      const cipher = crypto.createCipheriv('aes256', CIPHER_KEY, initVect);
      let encryptedText = cipher.update(text);
      encryptedText = Buffer.concat([encryptedText, cipher.final()]);
      resolve({
        iv: initVect.toString('hex'),
        encryptedText: encryptedText.toString('hex'),
      });
    } catch (err) {
      reject(err, 'Text Encryption Error');
    }
  });
};

exports.decryptText = async (text, password) => {
  return new Promise((resolve, reject) => {
    try {
      // text = JSON.parse(text)
      const iv = Buffer.from(text.iv.toString(), 'hex');
      const encryptedText = Buffer.from(text.encryptedText.toString(), 'hex');
      const cipherKey = getTextCipherKey(password);
      const decipher = crypto.createDecipheriv('aes256', cipherKey, iv);
      let decrypted = decipher.update(encryptedText);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      resolve(decrypted.toString());
    } catch (err) {
      console.log(err);
      reject(err, 'Text Decryption Error');
    }
  });
};
