// Nodejs encryption with CTR
// With help from https://medium.com/@brandonstilson/lets-encrypt-files-with-node-85037bea8c0e
const crypto = require('crypto');
const fs = require('fs');
const AppendInitVect = require('./appendInitVect');

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  } 

function getFileCipherKey (password, jwk) {
    try {
        const hash = crypto.createHash('sha256');
        hash.update(password);
        hash.update(jwk.toString())
        const KEY = hash.digest();
        return KEY
    }
    catch (err) {
        console.log (err)
    }
}

function getTextCipherKey (password) {
    try {
        const hash = crypto.createHash('sha256');
        hash.update(password);
        const KEY = hash.digest();
        return KEY
    }
    catch (err) {
        console.log (err)
    }
}

exports.encryptFile = async function (file_path, password, jwk) {
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
            writeStream.on('finish', function() {
                resolve("Success!")
            })

        }
        catch (err) {
            reject("File Encryption Error")
        }
    })
}

exports.decryptFile = async function (encrypted_file_path, password, jwk) {
    return new Promise(async (resolve, reject) => {
        try {
            // console.log ("Decrypting %s", encrypted_file_path)
            // First, get the initialization vector from the file.
            // var encrypted_file_path = file_path.concat(".enc")
            // fs.renameSync(file_path, encrypted_file_path)
            var readInitVect = fs.createReadStream(encrypted_file_path, { end: 15 });

            var initVect;
            readInitVect.on('data', async (chunk) => {
                initVect = chunk;
            });

            // Once we’ve got the initialization vector, we can decrypt the file.
            readInitVect.on('close', async () => {
                const cipherKey = getFileCipherKey(password, jwk);
                const readStream = fs.createReadStream(encrypted_file_path, { start: 16 });
                const decipher = crypto.createDecipheriv('aes256', cipherKey, initVect);
                const writeStream = fs.createWriteStream(encrypted_file_path.replace(".enc",""));
                readStream
                .pipe(decipher)
                .pipe(writeStream);
            })
        }
        catch (err) {
            //console.log (err)
            reject ("ERROR decrypting file")
        }
        resolve("Success!")
    })
}

exports.encryptText = async function (text, password) {
    return new Promise((resolve, reject) => {
        try {
        const initVect = crypto.randomBytes(16);
        const CIPHER_KEY = getTextCipherKey(password);
        const cipher = crypto.createCipheriv('aes256', CIPHER_KEY, initVect);
        let encryptedText = cipher.update(text);
        encryptedText = Buffer.concat([encryptedText, cipher.final()]);
        resolve ({ iv: initVect.toString('hex'), encryptedText: encryptedText.toString('hex') })
        }
        catch (err) {
            reject ("Text Encryption Error")
        }
    })
}

exports.decryptText = async function (text, password) {
    return new Promise ((resolve, reject) => {
        try {
            //text = JSON.parse(text)
            let iv = Buffer.from(text.iv.toString(), 'hex'); 
            let encryptedText = Buffer.from(text.encryptedText.toString(), 'hex'); 
            const cipherKey = getTextCipherKey(password);
            let decipher = crypto.createDecipheriv('aes256', cipherKey, iv); 
            let decrypted = decipher.update(encryptedText); 
            decypted = Buffer.concat([decrypted, decipher.final()]); 
            resolve(decrypted.toString())
        }
        catch (err) {
            console.log(err)
            reject("Text Decryption Error")
        }

    })
}