// Nodejs encryption with CTR
// With help from https://medium.com/@brandonstilson/lets-encrypt-files-with-node-85037bea8c0e
const crypto = require('crypto');
const fs = require('fs');
const AppendInitVect = require('./appendInitVect');

// Set your ArDrive owner and wallet json file.
const walletFile = 'C:\\Source\\ardrive_test_key.json'
const jwk = JSON.parse(fs.readFileSync(walletFile).toString());

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  } 

function getCipherKey (password) {
    const hash = crypto.createHash('sha256');
    hash.update(password);
    hash.update(JSON.stringify(jwk))
    const KEY = hash.digest();
    return KEY
}

exports.encrypt = async function (file_path, password) {
    return new Promise((resolve, reject) => {
        try {
            // Generate a secure, pseudo random initialization vector.
            const initVect = crypto.randomBytes(16);
            
            // Generate a cipher key from the password.
            const CIPHER_KEY = getCipherKey(password);

            const readStream = fs.createReadStream(file_path);
            const cipher = crypto.createCipheriv('aes256', CIPHER_KEY, initVect);
            const appendInitVect = new AppendInitVect(initVect);

            // Create a write stream with a different file extension.
            if (file_path.includes(".enc")) {
                var writeStream = fs.createWriteStream(file_path);
            }
            else {
                var writeStream = fs.createWriteStream(file_path.concat(".enc"));
            }

            readStream
            .pipe(cipher)
            .pipe(appendInitVect)
            .pipe(writeStream);
            
            resolve("Success!")
        }
        catch (err) {
            reject("Oh Balls!")
        }
    })
}

exports.decrypt = async function (file_path, password) {
    // First, get the initialization vector from the file.
    return new Promise((resolve, reject) => {
        try {
            var encrypted_file_path = file_path.concat(".enc")
            fs.renameSync(file_path, encrypted_file_path)
            sleep(250)
            var readInitVect = fs.createReadStream(encrypted_file_path, { end: 15 });
            let initVect;
            readInitVect.on('data', (chunk) => {
                initVect = chunk;
            });
        
            // Once we’ve got the initialization vector, we can decrypt the file.
            readInitVect.on('close', () => {
                const cipherKey = getCipherKey(password);
                const readStream = fs.createReadStream(encrypted_file_path, { start: 16 });
                const decipher = crypto.createDecipheriv('aes256', cipherKey, initVect);
                const writeStream = fs.createWriteStream(file_path);
                readStream
                .pipe(decipher)
                .pipe(writeStream);
            })
            resolve ("Success!")
        }
        catch (err) {
            console.log (err)
            reject("Oh Balls!")
        }
    });
}
