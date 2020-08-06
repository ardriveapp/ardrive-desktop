// index.js
const Promise = require('bluebird')
const AppDAO = require('./dao')
const ArDriveDB = require('./ardrive_db')
const SmartWeave = require('smartweave')
const ArDriveCrypto = require('./crypto')
const { promisify } = require('util');
const { resolve } = require('path');
const path = require('path');
const fs = require('fs');
const prompt = require('prompt-sync')({sigint: true});
const fetch = require("node-fetch");
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const crypto = require('crypto');
const mime = require('mime-types')

const { selectWeightedPstHolder } = require('smartweave')

// SQLite Database Setup
const arDriveDBFile = "C:\\ArDrive\\ardrive.db"
const dao = new AppDAO(arDriveDBFile)
const arDriveFiles = new ArDriveDB(dao)

// ArDrive Version Tag
const VERSION = '0.1.1';

// Initialize Arweave connectivity and wallet variables
const directoryPath = "D:\\ArDriveSync"
const publicDirectoryPath = directoryPath.concat("\\Public\\")
//const gatewayURL = "https://perma.online/"
const gatewayURL = "https://arweave.net/"

// Establish Arweave node connectivity.
const Arweave = require('arweave/node');
const arweave = Arweave.init({
    //host: 'perma.online', // ARCA Community Gateway
    host: 'arweave.net', // Arweave Gateway
    port: 443,
    protocol: 'https',
    timeout: 600000
});

// Load ArDrive PST Smart Contract
const contractId = '4JDU_Ha3bMeFtDMy1HgKSB3UsmPbW_VCCLIp7Vi0rLE'

// Pauses application
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
} 

// Asyncronous ForEach function
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
}

// Format byte size to something nicer.  This is minified...
function formatBytes(bytes) {
    var marker = 1024; // Change to 1000 if required
    var decimal = 3; // Change as required
    var kiloBytes = marker; // One Kilobyte is 1024 bytes
    var megaBytes = marker * marker; // One MB is 1024 KB
    var gigaBytes = marker * marker * marker; // One GB is 1024 MB
    var teraBytes = marker * marker * marker * marker; // One TB is 1024 GB

    // return bytes if less than a KB
    if(bytes < kiloBytes) return bytes + " Bytes";
    // return KB if less than a MB
    else if(bytes < megaBytes) return(bytes / kiloBytes).toFixed(decimal) + " KB";
    // return MB if less than a GB
    else if(bytes < gigaBytes) return(bytes / megaBytes).toFixed(decimal) + " MB";
    // return GB if less than a TB
    else return(bytes / gigaBytes).toFixed(decimal) + " GB";
}

// TO DO
// Write to the ArDrive logfile.  csv?  xml??
function writeToLog(message) {

}

function extToMime (type) {
    return mime.lookup(type)
}

// First Time Setup
async function arDriveSetup() {
    return new Promise(async (resolve, reject) => {
        try {
            // Welcome message and info
            console.log ("Welcome to ArDrive!  To store your files permanently, you must first setup your ArDrive account.")

            // Get the ArDrive owner nickname
            console.log ("What is the nickname you would like to give to this wallet?")
            const owner = prompt ('Please enter your nickname: ')

            // Setup ArDrive Password
            console.log ('Your ArDrive Login password will be used to unlock your ArDrive and start syncing.');
            const password = prompt('Please enter a strong ArDrive Login password: ');

            // Setup ArDrive Password
            console.log ('Your ArDrive Encryption password will be used to protect your data on the Permaweb.  Do NOT lose this!!!');
            const dataProtectionKey = prompt('Please enter a strong ArDrive Encryption password: ');

            // Create new or import Arweave wallet
            console.log ("To use ArDrive, you must have an Arweave Wallet.")
            const existingWallet = prompt('Do you have an existing Arweave Wallet (.json file) Y/N ');
            if (existingWallet == "Y") {
                console.log ("Please enter the path of your existing Arweave Wallet JSON file eg. C:\\Source\\ardrive_test_key.json")
                const existingWalletPath = prompt ("Wallet Path: ")
                var wallet_private_key = JSON.parse(fs.readFileSync(existingWalletPath).toString());
            }
            else if (existingWallet == "N")
            {
                // Create Wallet
                var wallet_private_key = await createArDriveWallet()
            }

            const wallet_public_key = await arweave.wallets.jwkToAddress(wallet_private_key)
            const encrypted_wallet_private_key = await ArDriveCrypto.encryptText(JSON.stringify(wallet_private_key), password)
            const encrypted_dataProtectionKey = await ArDriveCrypto.encryptText(dataProtectionKey, password)

            // Set sync schedule
            const sync_schedule = "1 minute"
            // 5 minutes, 15 mintues, 30 minutes, 60 minutes

            // Setup ArDrive folder location
            const syncFolderPath = await setupArDriveSyncFolder()

            // Save to Database
            var profileToAdd = {
                owner: owner,
                sync_schedule: sync_schedule,
                data_protection_key: JSON.stringify(encrypted_dataProtectionKey),
                wallet_private_key: JSON.stringify(encrypted_wallet_private_key),
                wallet_public_key: wallet_public_key,
                sync_schedule: sync_schedule,
                sync_folder_path: syncFolderPath
            }
            await arDriveFiles.createArDriveProfile(profileToAdd)
            resolve ({password: dataProtectionKey, jwk: JSON.stringify(wallet_private_key), wallet_public_key: wallet_public_key, owner: owner, sync_folder_path: syncFolderPath})
        }
        catch (err)
        {
            console.log(err)
            reject ("Error creating new ArDrive")
        }
    })
}

// Decrypts password
async function unlockArDriveProfile (wallet_public_key, owner) {
    return new Promise(async (resolve, reject) => {
        try {
            console.log ("An ArDrive Wallet is present for: %s", owner)
            const password = prompt("Please enter your ArDrive password for this wallet: ")
            const profile = await arDriveFiles.getAll_fromProfile(wallet_public_key)
            const jwk = await ArDriveCrypto.decryptText(JSON.parse(profile[0].wallet_private_key), password)
            const dataProtectionKey = await ArDriveCrypto.decryptText(JSON.parse(profile[0].data_protection_key), password)
            console.log ("")
            console.log ("ArDrive unlocked!!")
            console.log ("")
            resolve ({password: dataProtectionKey, jwk: jwk, wallet_public_key: wallet_public_key, owner: profile[0].owner, sync_folder_path: profile[0].sync_folder_path})
        }
        catch (err) {
            //console.log (err)
            reject ("Incorrect Password!! Cannot unlock ArDrive")
        }
    })
}

async function setupArDriveSyncFolder () {
    return new Promise(async (resolve, reject) => {
        try {
            console.log ("Please enter the path of your local ArDrive folder e.g D:\\ArDriveSync.  A new folder will be created if it does not exist")
            var syncFolderPath = prompt ("ArDrive Sync Folder Path: ")
            var stats = fs.statSync(syncFolderPath)
            if (stats.isDirectory())
            {
                if (!fs.existsSync(syncFolderPath.concat("\\Public"))){
                    fs.mkdirSync(syncFolderPath.concat("\\Public"));
                }
                console.log ("Using %s as the local ArDrive folder.", syncFolderPath)
                resolve (syncFolderPath)
            }
            else {
                console.log ("The path you have entered is not a directory, please enter a correct path for ArDrive.")
                resolve (setupArDriveSyncFolder())
            }
        }
        catch {
            try {
                console.log ("Directory not found.  Creating.")
                fs.mkdirSync(syncFolderPath);
                fs.mkdirSync(syncFolderPath.concat("\\Public"));
                resolve (syncFolderPath)
            }
            catch (err) {
                //console.log (err)
                console.log ("The path you have entered is not a directory, please enter a correct path for ArDrive.")
                resolve (setupArDriveSyncFolder())
            }
        }
    })
}

// Create a wallet and save to DB
async function createArDriveWallet() {
    return new Promise(async (resolve, reject) => {
        try {
            const myNewKey = await arweave.wallets.generate()
            const myNewWalletAddress = await arweave.wallets.jwkToAddress(myNewKey)
            console.log ("SUCCESS! Your new wallet public address is %s", myNewWalletAddress.toString())
            resolve (myNewKey)
        }
        catch {
            reject ("Cannot create a new Wallet")
        }
    })
}

// TO DO
// Create an ArDrive password and save to DB
async function setArDrivePassword() {
}

// Sends a fee (15% of transaction price) to ArDrive PST holders
async function sendArDriveFee(user, arweaveCost) {
    return new Promise(async (resolve, reject) => {
        try {
            // Fee for all data submitted to ArDrive is 15%
            var fee = +arweaveCost * .15

            if (fee < .00001) {
                fee = .00001
            }

            // Probabilistically select the PST token holder
            const holder = await SmartWeave.readContract(arweave, contractId).then(contractState => {
                return SmartWeave.selectWeightedPstHolder(contractState.balances)
            })

            // send a fee. You should inform the user about this fee and amount.
            const transaction = await arweave.createTransaction({ target: holder, quantity: arweave.ar.arToWinston(fee) }, JSON.parse(user.jwk))
        
            // Sign file
            await arweave.transactions.sign(transaction, JSON.parse(user.jwk));

            // Submit the transaction
            const response = await arweave.transactions.post(transaction);
            
            if (response.status == "200" || response.status == "202")  {
                console.log("SUCCESS ArDrive fee of %s was submitted with TX %s", fee.toFixed(9), transaction.id)
                resolve (transaction.id)
            }
            else {
                console.log("ERROR submitting ArDrive fee with TX %s", transaction.id)
                resolve (transaction.id)
            }
        }
        catch (err) {
            console.log(err)
            reject ("ERROR sending ArDrive fee")
        }
    })
}

// Gets the price of AR based on amount of data
const getWinston = async (bytes, target) => {
    bytes = bytes || 0;
    target = target || '';
    try {
        const response = await fetch(`https://perma.online/price/${bytes}/${target}`);
        return response.ok ? response.text() : null;
    }
    catch (err) {}
    try {
        const response = await fetch(`https://arweave.net/price/${bytes}/${target}`);
        return response.ok ? response.text() : null;
    }
    catch (err) {
        console.log (err)
        return false
    }

};

// gets hash of a file using SHA512, used for ArDriveID
function checksumFile(path) {
    return new Promise(async (resolve, reject) => {
      const hash = crypto.createHash('sha512');

      // Method using streams
      /* const stream = fs.createReadStream(path, {encoding: 'base64'});
      stream.on('error', err => reject(err));
      stream.on('data', chunk => hash.update(chunk));
      stream.on('end', () => resolve(hash.digest('hex'))); */

      // method using file
      const file = fs.readFileSync(path, {encoding: 'base64'});
      hash.update(file)
      const file_hash = hash.digest('hex')
      resolve(file_hash)
    });
}

function readDirR(dir) {
    return fs.statSync(dir).isDirectory()
        ? Array.prototype.concat(...fs.readdirSync(dir).map(f => readDirR(path.join(dir, f))))
        : dir;
}

// Checks for any new files in the folder that arent synced or queued
async function queueNewFiles(user, sync_folder_path) {
    return new Promise(async (resolve, reject) => {
        try {
            console.log ("---Queueing New Files in %s---", sync_folder_path)

            try {
                var allFiles = readDirR(user.sync_folder_path)
            }
            catch (err) {
                reject ("ERROR Unable to scan directory")
            }

                //listing all files using forEach
                await asyncForEach(allFiles, async (file) => {

                    const fullpath = file
                    try {
                        var stats = fs.statSync(fullpath);
                    }
                    catch (err) {
                        console.log ("File not ready yet %s", fullpath)
                        return;
                    }

                    var extension = path.extname(fullpath)
                    var file_name = path.basename(fullpath)            
                    extension = extension.toLowerCase()

                    if (extension != ".enc" && stats.size != 0) {
                        const localFileHash = await checksumFile(fullpath)
                        const ardrive_id = localFileHash.concat("//", file_name)

                        var ardrive_public = "0"

                        if (fullpath.indexOf(publicDirectoryPath) != -1)
                        {
                            // Public by choice, do not encrypt
                            ardrive_public = "1"
                        }
                        
                        var matchingArDriveID = await arDriveFiles.getByArDriveId_fromCompleted(ardrive_id)
                        var matchingFileName = await arDriveFiles.getByFileName_fromCompleted(file_name)
                        var isQueued = await arDriveFiles.getByFilePath_fromQueue(fullpath)
                        var ardrive_path = fullpath.replace(user.sync_folder_path,"")
                        ardrive_path = ardrive_path.replace(file_name,"")
                    
                        if (matchingArDriveID) {
                            // console.log("%s is already completed with a matching ardrive_id", fullpath)
                        }
                        else if (matchingFileName) {
                            // A file exists on the permaweb with a different hash.  Changing that file's local status to 0 to force user to resolve conflict.
                            arDriveFiles.setCompletedFileToDownload(file_name)
                            //console.log ("Forcing user to resolve conflict %s", file)
                        }
                        else if (isQueued) {
                            isCompleted = await arDriveFiles.getByFileName_fromCompleted(file_name)
                            //console.log ("%s found in the queue", fullpath)
                        }
                        else {
                            //console.log("%s queueing file", fullpath)
                            const fileToQueue = {
                                owner: user.owner,
                                file_path: fullpath,
                                file_name: file_name,
                                file_extension: extension,
                                file_size: stats.size,
                                ardrive_id: ardrive_id,
                                isPublic: ardrive_public,
                                file_modified_date: stats.mtime,
                                tx_id: "0",
                                ardrive_path: ardrive_path
                            }
                        arDriveFiles.queueFile(fileToQueue)
                        }
                    }
                })
            //})
            resolve ("SUCCESS Queuing Files")
        }
        catch (err) {
                console.log (err)
                reject ("ERROR Queuing Files")
        }
    })
}

async function uploadArDriveFiles(user) {
    return new Promise (async (resolve, reject) => { 
        try {
            var filesUploaded = 0
            var totalWinston = 0
            var totalSize = 0
            var winston = 0

            console.log ("---Uploading All Queued Files---")
            const filesToUpload = await arDriveFiles.getFilesToUpload_fromQueue()

            if (Object.keys(filesToUpload).length > 0){
                await asyncForEach(filesToUpload, async (fileToUpload) => {
                    totalSize = totalSize + +fileToUpload.file_size
                    winston = await getWinston(fileToUpload.file_size)
                    totalWinston = totalWinston + +winston
                })
    
                const totalArweavePrice = totalWinston * 0.000000000001
                var arDriveFee = +totalArweavePrice.toFixed(9) * .15
                if (arDriveFee < .00001) {
                    arDriveFee = .00001
                }
    
                const totalArDrivePrice = +totalArweavePrice.toFixed(9) + arDriveFee
    
                console.log('Uploading %s files (%s) to the Permaweb, totaling %s AR', Object.keys(filesToUpload).length, formatBytes(totalSize), totalArDrivePrice)  
                var readyToUpload = prompt('Upload all unsynced files? Y/N ');
                if (readyToUpload == 'Y') {
                    // Ready to upload
                    await asyncForEach(filesToUpload, async (fileToUpload) => {
                        if (fileToUpload.file_size == "0") {
                            console.log ("%s has a file size of 0 and cannot be uploaded to the Permaweb", fileToUpload.file_path)
                            await arDriveFiles.remove_fromQueue(fileToUpload.ardrive_id)
                        }
                        else if (await arDriveFiles.getByFileName_fromCompleted(fileToUpload.file_name)) {   // File name must be changed to something more unique like ardrive_id
                            console.log ("%s was queued, but has been previously uploaded to the Permaweb", fileToUpload.file_path)
                            await arDriveFiles.remove_fromQueue(fileToUpload.ardrive_id)
                        }
                        else {
                            transaction = await uploadArDriveFile(user, fileToUpload.file_path, fileToUpload.ardrive_path, fileToUpload.file_extension, fileToUpload.file_modified_date)
                            //console.log ("Removing old encrypted file %s", file_path)
                            filesUploaded++
                        }
                    })
                }
            }
            if (filesUploaded < 0) {
                console.log ("Uploaded %s files to your ArDrive!", filesUploaded)
            }
            resolve ("SUCCESS")
        }
        catch (err) {
            console.log(err)
            reject ("ERROR processing files")
        }
    })
}

// Scans through the queue & checks if a file has been mined, and if it has moves to Completed Table. If a file is not on the permaweb it will be uploaded
async function checkUploadStatus(user) {
    return new Promise(async (resolve, reject) => {
        try {
            console.log ("---Checking Upload Status---")
            const unsyncedFiles = await arDriveFiles.getAllUploaded_fromQueue()

            await asyncForEach(unsyncedFiles, async (unsyncedFile) => {
                // Is the file uploaded on the web?
                const res = await arweave.transactions.getStatus(unsyncedFile.tx_id)
                if (res.status == "200")
                {
                    console.log ("SUCCESS! %s was uploaded with TX of %s", unsyncedFile.file_path, unsyncedFile.tx_id)
                    console.log ("...you can access the file here %s", gatewayURL.concat(unsyncedFile.tx_id))
                    const fileToComplete = {
                        owner: unsyncedFile.owner,
                        file_name: unsyncedFile.file_name,
                        file_extension: unsyncedFile.file_extension,
                        file_modified_date: unsyncedFile.file_modified_date,
                        ardrive_path: unsyncedFile.ardrive_path,
                        ardrive_id: unsyncedFile.ardrive_id,
                        permaweb_link: gatewayURL.concat(unsyncedFile.tx_id),
                        tx_id: unsyncedFile.tx_id,
                        prev_tx_id: unsyncedFile.tx_id,
                        isLocal: "1",
                        isPublic: unsyncedFile.isPublic
                    }
                    await arDriveFiles.completeFile(fileToComplete)
                    await arDriveFiles.remove_fromQueue(unsyncedFile.ardrive_id)
                }
                else if (res.status == 202){
                    console.log ("%s is still being uploaded to the PermaWeb (TX_PENDING)", unsyncedFile.file_path)
                }
                else if (res.status == 410){
                    console.log ("%s failed to be uploaded (TX_FAILED)", unsyncedFile.file_path)
                    await arDriveFiles.remove_fromQueue(unsyncedFile.ardrive_id)
                }
                else {
                    if (unsyncedFile.file_size == "0") {
                        console.log ("%s has a file size of 0 and cannot be uploaded to the Permaweb", unsyncedFile.file_path)
                        await arDriveFiles.remove_fromQueue(unsyncedFile.ardrive_id)
                    }
                    else if (await arDriveFiles.getByFileName_fromCompleted(unsyncedFile.file_name)) {   // File name must be changed to something more unique like ardrive_id
                        console.log ("%s was queued, but has been previously uploaded to the Permaweb", unsyncedFile.file_path)
                        await arDriveFiles.remove_fromQueue(unsyncedFile.ardrive_id)
                    }
                    else {
                        // CHECK IF FILE EXISTS AND IF NOT REMOVE FROM QUEUE
                        fs.access(unsyncedFile.file_path, fs.F_OK, async (err) => {
                            if (err) {
                                console.log ("%s was not found locally anymore.  Removing from the queue", unsyncedFile.file_path)
                                await arDriveFiles.remove_fromQueue(unsyncedFile.ardrive_id)
                            }
                        })
                    }
    
                }
            });
            resolve ("Success checking upload status")
        }
        catch (err) {
            console.log(err)
            reject ("Error checking upload status")
        }
    })
 }

 // Tags and Uploads a single file to your ArDrive
async function uploadArDriveFile(user, file_path, ardrive_path, extension, modifiedDate) {
    return new Promise(async (resolve, reject) => {
        try {
            if (file_path.indexOf(user.sync_folder_path.concat("\\Public\\")) != -1)
            {
                // Public by choice, do not encrypt
                var ardrive_public = "1"
            }
            else
            {
                // private by default, encrypt file
                var ardrive_public = "0"
                var encrypted = await ArDriveCrypto.encryptFile(file_path, user.password, user.jwk)
                await sleep('250')
                file_path = file_path.concat(".enc")
            }

            var file_to_upload = fs.readFileSync(file_path);
            var file_name = path.basename(file_path.replace(".enc",""))
            let transaction = await arweave.createTransaction({data: arweave.utils.concatBuffers([file_to_upload])}, JSON.parse(user.jwk));
            const tx_size = transaction.get('data_size');

            console.log ("TX SIZE IS %s", tx_size)
            arPrice = await getWinston(tx_size).then(async data => {
                if (!data) {
                    return false;
                }
                const arPrice = (data * 0.000000000001);
                return arPrice
            })
        
            console.log('Uploading %s (%d bytes) to the Permaweb', file_path, tx_size)
            //console.log('This will cost %s AR (%s base plus %s ArDrive fee)', totalPrice, arPrice, arDriveFee.toFixed(9))
            //const readyToUpload = prompt('Continue? Y/N '); 

            const readyToUpload = 'Y'
            if (readyToUpload == 'Y') {
    
                // Ideally, all tags would also be encrypted if the file is encrypted
                const unencryptedFile_path = file_path.replace(".enc","")
                const localFileHash = await checksumFile(unencryptedFile_path)
                const ardrive_id = localFileHash.concat("//", file_name)
    
                // Get Content-Type of file
                const contentType = extToMime(extension)
    
                // Tag file
                transaction.addTag('Content-Type', contentType);
                transaction.addTag('User-Agent', `ArDrive/${VERSION}`);
                transaction.addTag('ArDrive-FileName', file_name)
                transaction.addTag('ArDrive-Path', ardrive_path);
                transaction.addTag('ArDrive-ModifiedDate', modifiedDate);
                transaction.addTag('ArDrive-Owner', user.owner);
                transaction.addTag('ArDrive-Id', ardrive_id)
                transaction.addTag('ArDrive-Public', ardrive_public);
    
                // Sign file
                await arweave.transactions.sign(transaction, JSON.parse(user.jwk));

                let uploader = await arweave.transactions.getUploader(transaction);
    
                const fileToUpdate = {
                    file_path: file_path.replace(".enc",""),
                    tx_id: transaction.id,
                    ardrive_id: ardrive_id,
                    isPublic: ardrive_public
                }
    
                // Update the queue since the file is now being uploaded
                await arDriveFiles.updateQueueStatus(fileToUpdate)
    
                while (!uploader.isComplete) {
                    await uploader.uploadChunk();
                    //console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
                    console.log(`${uploader.pctComplete}%`);
                }
    
                console.log("SUCCESS %s was submitted with TX %s", file_path, transaction.id)
    
                // console.log ("Removing old encrypted file %s", file_path)
                if (file_path.includes(".enc")) {
                    fs.unlinkSync(file_path)
                }
    
                // Send the ArDrive fee to ARDRIVE PST smart contract
                const completedFee = await sendArDriveFee(user, arPrice.toFixed(6))
                resolve("Uploaded")
            }
            else {
                if (file_path.includes(".enc")) {
                    fs.unlinkSync(file_path)
                }
                //reject("Not Uploaded")
            }
        }
        catch (err) {
            console.log (err)
            reject ("Error uploading file")
        }
    })
}

// Gets all of the files from your ArDrive (via ARQL) and loads them into the database
async function getMyArDriveFiles(user){
    return new Promise(async (resolve, reject) => {
        try {
            console.log ("---Getting all your ArDrive files---")

            var ardrive_owner
            var ardrive_path
            var ardrive_filename
            var ardrive_modifieddate
            var ardrive_public
            var ardrive_id
            var foundFiles = 0

            const txids = await arweave.arql({
                op: "and",
                expr1: {
                op: "equals",
                expr1: "from",
                expr2: user.wallet_public_key
                },
                expr2: {
                    op: "and",
                    expr1: {
                        op: "equals",
                        expr1: "User-Agent",
                        expr2: `ArDrive/${VERSION}`
                    },
                    expr2: {
                        op: "equals",
                        expr1: "ArDrive-Owner",
                        expr2: user.owner
                    }
                }
            })

            await asyncForEach(txids, async (txid) => {
            //txids.forEach(async function (txid) {
                try {
                    const transaction = await arweave.transactions.get(txid).then(async transaction => {
                        var isCompleted = await arDriveFiles.getByTx_fromCompleted(txid)
                        if (isCompleted) {
                            resolve ("%s is found in the DB... skipping", txid)
                        }
                        else {
                            //console.log ("%s not found in DB... adding", txid)
                            // Add the TX to the DB

                            //await asyncForEach(transaction.get('tags'), async (tag) => {
                            transaction.get('tags').forEach(tag => {    
                                let key = tag.get('name', {decode: true, string: true});
                                let value = tag.get('value', {decode: true, string: true});
                                if (key == "User-Agent") {
                                    version = value
                                }
                                else if (key == "ArDrive-Path") {
                                    ardrive_path = value
                                }
                                else if (key == "ArDrive-Extension") {
                                    ardrive_extension = value
                                }
                                else if (key == "ArDrive-ModifiedDate") {
                                    ardrive_modifieddate = value
                                }
                                else if (key == "ArDrive-Owner") {
                                    ardrive_owner = value
                                }
                                else if (key == "ArDrive-FileName") {
                                    ardrive_filename = value
                                }
                                else if (key == "ArDrive-Id") {
                                    ardrive_id = value
                                }
                                else if (key == "ArDrive-Public") {
                                    ardrive_public = value
                                }
                            });
        
                            var fileToAdd = {
                                owner: ardrive_owner,
                                file_name: ardrive_filename,
                                //file_extension: ardrive_extension,
                                file_modified_date: ardrive_modifieddate,
                                ardrive_path: ardrive_path,
                                ardrive_id: ardrive_id,
                                permaweb_link: gatewayURL.concat(txid),
                                tx_id: txid,
                                prev_tx_id: txid,
                                isLocal: "0",
                                isPublic: ardrive_public
                            }
                            const newFile = await arDriveFiles.completeFile(fileToAdd)
                            foundFiles++
                        }
                    })
                }
                catch (err) {
                    //console.log (err)
                    //console.log ("%s is still pending upload", txid)
                }
            });
            if (foundFiles > 0) {
                //console.log ("Found %s missing files from your ArDrive", foundFiles)
            }
            resolve ("SUCCESS Getting all ArDrive files")
        }
        catch (err) {
            console.log (err)
            reject ("ERROR Calling ARQL to get ArDrive files")
        }
    })
}

// Downloads a single file from ArDrive by transaction
async function downloadArDriveFile_byTx(user, tx, file_name, isPublic, ardrive_path) {
    return new Promise(async (resolve, reject) => {
        var full_path = user.sync_folder_path.concat(ardrive_path, file_name)
        var folderPath = user.sync_folder_path.concat(ardrive_path)
        try {
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
                await sleep ('1000')
            }

            const transaction = await arweave.transactions.getData(tx, {decode: true}).then(async data=> {
                //console.log("FOUND PERMAFILE! %s is on the Permaweb, but not local.  Downloading...", full_path, data)
                if (isPublic == '1') {
                    fs.writeFileSync(full_path, data)
                    console.log("DOWNLOADED %s", full_path);
                }
                else {            
                    // Method with decryption
                    fs.writeFileSync(full_path.concat(".enc"), data)
                    var stats = fs.statSync(full_path.concat(".enc"))
                    await sleep('500')
                    var decrypted = await ArDriveCrypto.decryptFile(full_path.concat(".enc"), user.password, user.jwk)
                    await sleep('500')
                    console.log("DOWNLOADED AND DECRYPTED %s", full_path);
                }
            })
            resolve ("Success")
        }
        catch (err) {
            //console.log (err)
            //console.log ("FOUND PERMAFILE %s but not ready to be downloaded yet", full_path)
            resolve ("Error downloading file")
        }
    })
}

// Downloads all ardrive files that are not local
async function downloadMyArDriveFiles(user) {
    return new Promise(async (resolve, reject) => {
        try {
            console.log ("---Downloading any unsynced files---")
            const incompleteFiles = await arDriveFiles.getAll_fromCompleted()

            await asyncForEach(incompleteFiles, async (incompleteFile) => {
                var full_path = user.sync_folder_path.concat(incompleteFile.ardrive_path, incompleteFile.file_name)
                if (!fs.existsSync(full_path)) {
                    //console.log("FOUND PERMAFILE! %s is on the Permaweb, but not local.  Downloading...", full_path)             
                    const myDownload = await downloadArDriveFile_byTx(user, incompleteFile.tx_id, incompleteFile.file_name, incompleteFile.isPublic, incompleteFile.ardrive_path)
                    if (incompleteFile.isPublic == 0) {
                        fs.unlinkSync(full_path.concat(".enc"))
                    }
                }
                else {
                    //console.log("%s is on the Permaweb, but is already downloaded with matching file name", full_path)
                    const localFileHash = await checksumFile(full_path)
                    incompleteFileArDriveID = incompleteFile.ardrive_id.split("//")
                    const incompleteFileHash = incompleteFileArDriveID[0]
                    if (incompleteFileHash == localFileHash)
                    {
                        //console.log("IGNORED! %s is on the Permaweb, but is already downloaded (matching file name and hash)", full_path)
                        await arDriveFiles.updateCompletedStatus(incompleteFile.tx_id)
                    }
                    else {
                        var newFileName = incompleteFile.file_name.split(".")
                        newFileName = newFileName[0].concat("1.", newFileName[1])
                        var new_full_path = directoryPath.concat("\\", newFileName)
                        console.log("CONFLICT! %s is on the Permaweb, but there is a local file with the same name and different hash.  File will be overwritten if it is not renamed.", incompleteFile.file_name)
                        console.log("   New file name : %s", new_full_path)
                        const renameFile = prompt('   Rename local file? Y/N ');
                        if (renameFile == 'Y') {
                            // rename local file
                            console.log ("   ...file being renamed")
                            fs.rename(full_path, new_full_path, function(err) {
                                if ( err ) console.log('ERROR: ' + err);
                            });
                            // console.log ("File renamed.  Downloading %s from the PermaWeb", incompleteFile.file_name)
                            // await downloadArDriveFile_byTx(incompleteFile.tx_id, newFileName)
                            fs.unlinkSync(full_path)
                            const myDownload = await downloadArDriveFile_byTx(user, incompleteFile.tx_id, incompleteFile.file_name, incompleteFile.isPublic, incompleteFile.ardrive_path)
                        }
                        else if (renameFile == 'N')
                        {
                            const overWriteFile = prompt('   Overwrite local file? Y/N ');
                            if (overWriteFile == 'Y') {
                                console.log ("   ...file being overwritten")
                                const myDownload = await downloadArDriveFile_byTx(user, incompleteFile.tx_id, incompleteFile.file_name, incompleteFile.isPublic, incompleteFile.ardrive_path)
                            }
                            else {
                                const ignoreFile = prompt('   Leave this file on the PermaWeb and ignore future downloads? Y/N ');
                                if (ignoreFile == 'Y') {
                                    // SET TO IGNORE
                                    arDriveFiles.setIncompleteFileToIgnore(incompleteFile.tx_id)
                                    console.log ("   ...excluding file from future downloads")
                                }
                                else { }// Do nothing and skip file}
                            }
                        }    
                    }
                }
            });
            resolve ("Downloaded all ArDrive files")
        }
        catch (err) {
            console.log (err)
            reject ("Error downloading all ArDrive files")
        }
    })
}

// Checks if a file is in the Queue
async function checkIfQueued(arDrive_id) {
    console.log(arDrive_id)
    var row = await arDriveFiles.getByArDriveId_fromQueue(arDrive_id)
    console.log(row)
}

// Creates the SQLite database
async function createDB() {
    await arDriveFiles.createProfileTable()
    await arDriveFiles.createQueueTable()
    await arDriveFiles.createCompletedTable()
    //await sleep(5000)
    //console.log("Database created")
}

async function main() {
    try {
        console.log("---Initializing ArDrive---")

        // Setup database if it doesnt exist
        await createDB()
        await sleep(500)

        // Check if user exists, if not, create a new one
        var profile = await arDriveFiles.getAll_fromProfile()
        if (profile == '') {
            var user = await arDriveSetup()
            await sleep (500)

        }
        else {
            // unlock ardrive for user
            var user = await unlockArDriveProfile(profile[0].wallet_public_key, profile[0].owner)
        }

        // Run this in a loop
        while (true)
        {
            var balance = await arweave.wallets.getBalance(user.wallet_public_key);
            balance = await arweave.ar.winstonToAr(balance);
    
            var getfiles = await getMyArDriveFiles(user)
            var queuedfiles = await queueNewFiles(user, user.sync_folder_path)
            var checkedstatus = await checkUploadStatus(user)
            var uploadedfiles = await uploadArDriveFiles(user)
            var downloadfiles = await downloadMyArDriveFiles(user)

            var today = new Date();
            var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date+' '+time;
            console.log ("%s Syncronization completed.  Current AR Balance: %s", dateTime, balance)
            await sleep(30000)
        }
    }
    catch (err) {
        console.log('Error: ', err)
    }
}
  
main()



/* SCRAPS
const instances = [Arweave.init({
    host: '127.0.0.1',
    port: 1984,
    protocol: 'http'
}),
Arweave.init({
    host: '127.0.0.2',
    port: 1984,
    protocol: 'http'
});


const post = async (tx) => {
    await Promise.all(instances.map((instance) => {
        instance.post(tx);
    })
}

*/