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
const VERSION = '0.0.7';

////////UPDATE THESE VARIABLES TO YOUR OWN SETTINGS///////
const arDrivePassword = "ChangeThis1234"                //
const arDriveOwner = "blah"                             //
const walletFile = 'C:\\Source\\ardrive_test_key.json'  //
//////////////////////////////////////////////////////////

// Get private key
const jwk = JSON.parse(fs.readFileSync(walletFile).toString());

// Initialize Arweave connectivity and wallet variables
const directoryPath = "D:\\ArDriveSync"
const publicDirectoryPath = directoryPath.concat("\\Public\\")
const gatewayURL = "https://perma.online/"
const gatewayURLBackup = "https://arweave.net/"

// Establish Arweave node connectivity.
const Arweave = require('arweave/node');
const arweave = Arweave.init({
    host: 'perma.online', // ARCA Community Gateway
    //host: 'arweave.net', // Arweave Gateway
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

// TO DO
// Write to the ArDrive logfile.  csv?  xml??
function writeToLog(message) {

}

function extToMime (type) {
    return mime.lookup(type)
}

// TO DO
// First Time Setup
async function arDriveSetup() {

    console.log ("Welcome to ArDrive!  To store your files permanently, you must first setup your ArDrive account.")

    // Setup ArDrive Password
    console.log ("To use ArDrive, you must have an Arweave Wallet.")
    const existingWallet = prompt('Do you have an existing Arweave Wallet (.json file) Y/N ');
    if (existingWallet == "Y") {
        console.log ("Please enter the path of your existing Arweave Wallet JSON file eg. D:\\Source\\My_Wallet.json")
        const existingWalletPath = prompt ("Wallet Path: ")
        var wallet_private_key = JSON.parse(fs.readFileSync(existingWalletPath).toString());
    }
    else if (existingWallet == "N")
    {
        // Create Wallet
        var wallet_private_key = await createArDriveWallet()
    }
    const wallet_public_key = await arweave.wallets.jwkToAddress(wallet_private_key)

    console.log ("What is the nickname you would like to give to this wallet?")
    const owner = prompt ('Please enter your nickname: ')
    console.log ('Your ArDrive password will be used to open your ArDrive and protect your data on the Permaweb.');
    const password = prompt('Please enter a strong password: ');

    // Set sync schedule
    const sync_schedule = "1 minute"
    // 5 minutes, 15 mintues, 30 minutes, 60 minutes

    // Setup ArDrive folder location
    const syncFolderPath = await setupArDriveSyncFolder()

    // Save to Database
    var profileToAdd = {
        owner: owner,
        sync_schedule: sync_schedule,
        password: password,
        wallet_private_key: wallet_private_key,
        wallet_public_key: wallet_public_key,
        sync_schedule: sync_schedule,
        sync_folder_path: syncFolderPath
    }
    await arDriveFiles.createArDriveProfile(profileToAdd)
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
// TO DO
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
async function sendArDriveFee(arweaveCost) {
    return new Promise(async (resolve, reject) => {
        // Fee for all data submitted to ArDrive is 15%
        const fee = +arweaveCost * .15

        // Probabilistically select the PST token holder
        const holder = await SmartWeave.readContract(arweave, contractId).then(contractState => {
            return SmartWeave.selectWeightedPstHolder(contractState.balances)
        })

        // send a fee. You should inform the user about this fee and amount.
        const transaction = await arweave.createTransaction({ target: holder, quantity: arweave.ar.arToWinston(fee) }, jwk)
    
        // Sign file
        await arweave.transactions.sign(transaction, jwk);

        // Submit the transaction
        const response = await arweave.transactions.post(transaction);
        
        if (response.status == "200" || response.status == "202")  {
            console.log("SUCCESS ArDrive fee of %s was submitted with TX %s", fee.toFixed(9), transaction.id)
            resolve (transaction.id)
        }
        else {
            console.log("ERROR submitting ArDrive fee with TX %s", transaction.id)
            reject (transaction.id)
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
    return new Promise((resolve, reject) => {
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

// Checks for any new files in the folder that arent synced or queued
async function queueNewFiles(directoryPath) {
  console.log ("---Queueing New Files in %s---", directoryPath)
  fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 

    //listing all files using forEach
    files.forEach(async function (file) {
        const fullpath = directoryPath.concat("\\", file)
        try {
            var stats = fs.statSync(fullpath);
        }
        catch (err) {
            console.log ("File not ready yet %s", fullpath)
            return;
        }
        //console.log(fullpath)
        if (stats.isDirectory()) {
            queueNewFiles(fullpath)
        } 
        else {
            const localFileHash = await checksumFile(fullpath)
            const ardrive_id = localFileHash.concat("//", file)
            var ardrive_public = "0"

            if (fullpath.indexOf(publicDirectoryPath) != -1)
            {
                // Public by choice, do not encrypt
                ardrive_public = "1"
            }
            
            var matchingArDriveID = await arDriveFiles.getByArDriveId_fromCompleted(ardrive_id)
            var matchingFileName = await arDriveFiles.getByFileName_fromCompleted(file)
            var isQueued = await arDriveFiles.getByFilePath_fromQueue(fullpath)

            if (matchingArDriveID) {
                // console.log("%s is already completed with a matching ardrive_id", fullpath)
            }
            else if (matchingFileName) {
                // A file exists on the permaweb with a different hash.  Changing that file's local status to 0 to force user to resolve conflict.
                arDriveFiles.setCompletedFileToDownload(file)
                //console.log ("Forcing user to resolve conflict %s", file)
            }
            else if (isQueued) {
                isCompleted = await arDriveFiles.getByFileName_fromCompleted(file)
                //console.log ("%s found in the queue", fullpath)
            }
            else {
                //console.log("%s queueing file", fullpath)
                var path = require('path')
                var extension = path.extname(fullpath)            
                extension = extension.toLowerCase()
                const fileToQueue = {
                    owner: arDriveOwner,
                    file_path: fullpath,
                    file_name: file,
                    file_extension: extension,
                    file_size: stats.size,
                    ardrive_id: ardrive_id,
                    isPublic: ardrive_public,
                    file_modified_date: stats.mtime,
                    tx_id: "0",
                    ardrive_path: "home"
                }
                arDriveFiles.queueFile(fileToQueue)
            }
        }
    })
  })
}

// Scans through the queue
// Checks if a file has been mined, and if it has moves to Completed Table
// If a file is not on the permaweb it will be uploaded
async function processQueue() {
    console.log ("---Processing All Queued Files---")
    const unsyncedFiles = await arDriveFiles.getAll_fromQueue()
    unsyncedFiles.forEach(async function (unsyncedFile) {

        // Is the file uploaded on the web?
        const res = await arweave.transactions.getStatus(unsyncedFile.tx_id)
        if (res.status == "200")
        {
            console.log ("SUCCESS! %s was uploaded with TX of %s", unsyncedFile.file_path, unsyncedFile.tx_id)
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
                    else {
                        // Ready to upload
                        transaction = await uploadArDriveFile(unsyncedFile.file_path, unsyncedFile.ardrive_path, unsyncedFile.ardrive_id, unsyncedFile.file_modified_date)
                    }
                })
            }

        }
    });
 }

 // Tags and Uploads a single file to your ArDrive
async function uploadArDriveFile(file_path, ardrive_path, extension, modifiedDate) {
    return new Promise(async (resolve, reject) => {
        // Private by default
        var ardrive_public = "0"

        if (file_path.indexOf(publicDirectoryPath) != -1)
        {
            // Public by choice, do not encrypt
            ardrive_public = "1"
        }
        else
        {
            // private by default, encrypt file
            var encrypted = await ArDriveCrypto.encrypt(file_path, arDrivePassword)
            file_path = file_path.concat(".enc")
            await sleep('250')
        }

        var file_to_upload = fs.readFileSync(file_path);
        let transaction = await arweave.createTransaction({data: arweave.utils.concatBuffers([file_to_upload])}, jwk);

        const tx_size = transaction.get('data_size');

        arPrice = await getWinston(tx_size).then(data => {
            if (!data) {
                return false;
            }
            const arPrice = (data * 0.000000000001);
            return arPrice
        })

        const my_wallet_address = await arweave.wallets.jwkToAddress(jwk)
        var balance = await arweave.wallets.getBalance(my_wallet_address);
        balance = arweave.ar.winstonToAr(balance);
        var file_name = path.basename(file_path.replace(".enc",""))

        const arDriveFee = +arPrice.toFixed(9) * .15
        const totalPrice = +arPrice.toFixed(9) + +arDriveFee
        console.log('Uploading %s (%d bytes) to the Permaweb', file_path, tx_size)
        console.log('This will cost %s AR (%s base plus %s ArDrive fee) paid by %s (balance of %s AR)', totalPrice, arPrice, arDriveFee.toFixed(9), my_wallet_address, balance)

        const readyToUpload = prompt('Continue? Y/N ');
        if (readyToUpload == 'Y') {

            // Ideally, all tags would also be encrypted if the file is encrypted
            const unencryptedFile_path = file_path.replace(".enc","")
            const localFileHash = await checksumFile(unencryptedFile_path)
            const ardrive_id = localFileHash.concat("//", file_name)

            // Get Content-Type of file
            const contentType = extToMime(extension)
            console.log ("mime type is %s", contentType)

            // Tag file
            transaction.addTag('Content-Type', contentType);
            transaction.addTag('User-Agent', `ArDrive/${VERSION}`);
            transaction.addTag('ArDrive-FileName', file_name)
            transaction.addTag('ArDrive-Path', ardrive_path);
            //transaction.addTag('ArDrive-Extension', extension);
            transaction.addTag('ArDrive-ModifiedDate', modifiedDate);
            transaction.addTag('ArDrive-Owner', arDriveOwner);
            transaction.addTag('ArDrive-Id', ardrive_id)
            transaction.addTag('ArDrive-Public', ardrive_public);

            // Sign file
            await arweave.transactions.sign(transaction, jwk);

            /* Submit the transaction (OLD)
            // const response = await arweave.transactions.post(transaction);

            if (response.status == "200" || response.status == "202")  {
                console.log("SUCCESS %s was submitted with TX %s", file_path, transaction.id)
                const fileToUpdate = {
                    file_path: file_path.replace(".enc",""),
                    tx_id: transaction.id,
                    ardrive_id: ardrive_id,
                    isPublic: ardrive_public
                } */

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
            await sendArDriveFee(arPrice.toFixed(6))
            resolve("Uploaded")
        }
        else {
            if (file_path.includes(".enc")) {
                fs.unlinkSync(file_path)
            }
            reject("Not Uploaded")
        }
    })
}

// Gets all of the files from your ArDrive (via ARQL) and loads them into the database
async function getMyArDriveFiles(jwk)
{
    console.log ("---Getting all your ArDrive files---")
    var my_addy = await arweave.wallets.jwkToAddress(jwk)
    var ardrive_owner
    var ardrive_path
    var ardrive_filename
    var ardrive_extension
    var ardrive_modifieddate
    var ardrive_public
    var ardrive_id

    const txids = await arweave.arql({
        op: "and",
        expr1: {
          op: "equals",
          expr1: "from",
          expr2: my_addy
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
                expr2: arDriveOwner
            }
        }
    })

    txids.forEach(async function (txid) {
        const transaction = await arweave.transactions.get(txid).then(async transaction => {
            var isCompleted = await arDriveFiles.getByTx_fromCompleted(txid)
            //console.log(isCompleted)
            if (isCompleted) {
                //console.log ("%s is found in the DB... skipping", txid)
            }
            else {
                //console.log ("%s not found in DB... adding", txid)
                // Add the TX to the DB
                transaction.get('tags').forEach(tag => {
                    let key = tag.get('name', {decode: true, string: true});
                    let value = tag.get('value', {decode: true, string: true});
                    if (key == "User-Agent") {
                        version = value
                    }
                    else if (key == "ArDrive-Path") {
                        ardrive_path = value
                        console.log (ardrive_id)
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
                await arDriveFiles.completeFile(fileToAdd)
            }
        });
    });
}

// Gets a specific file from your ArDrive (via ARQL) and returns it
async function getMyArDriveFile_byId(ardrive_id) {
    var my_addy = await arweave.wallets.jwkToAddress(jwk)
    
    // do not include ardrive version
    /*const txids = await arweave.arql({
        op: "and",
        expr1: {
          op: "equals",
          expr1: "from",
          expr2: my_addy
        },
        expr2: {
            op: "equals",
            expr1: "ArDrive-Id",
            expr2: ardrive_id
        },
        expr3: {
            op: "equals",
            expr1: "Ardrive-Owner",
            expr2: arDriveOwner
        }
    }); */

    // include ardrive version
    const txids = await arweave.arql({
        op: "and",
        expr1: {
          op: "equals",
          expr1: "from",
          expr2: my_addy
        },
        expr2: {
            op: "and",
            expr1: {
                op: "equals",
                expr1: "User-Agent",
                expr2: `ArDrive/${VERSION}`
            },
            expr3: {
                op: "and",
                expr1: {
                    op: "equals",
                    expr1: "ArDrive-Owner",
                    expr2: arDriveOwner
                },
                expr2: {
                    op: "equals",
                    expr1: "ardrive_id",
                    expr2: ardrive_id
                }
            }
        }
    });

    if (txids[0]) {
        return txids[0];
    }
    else {
        return false;
    }
    return txids[0];
    console.log(txids[0]);
}

async function getMyArDriveFile_byTx(tx) {
    console.log ("Getting %s", tx)
    const transaction = arweave.transactions.get(tx, {decode: true, string: true}).then(transaction => {
        console.log('tx : ', tx)
        transaction.get('tags').forEach(tag => {
            let key = tag.get('name', {decode: true, string: true});
            let value = tag.get('value', {decode: true, string: true});
            console.log(`${key} : ${value}`);
        });
        console.log('data_size : ', transaction.get('data_size'));
        console.log('data : ', transaction.get('data',{decode: true, string: true}));
        console.log('')
    })
}

// Downloads a single file from ArDrive by transaction
async function downloadArDriveFile_byTx(tx, file_name, isPublic) {
    //console.log ("Downloading %s : %s", file_name, tx)
    try {
        const transaction = await arweave.transactions.getData(tx, {decode: true}).then(data=> {
            if (isPublic == '1') {
                var full_path = directoryPath.concat("\\Public\\", file_name)
                fs.writeFile(full_path, data, async (err) => {
                    if (err) throw err;
                    await sleep('250')
                    console.log("DOWNLOADED %s", full_path);
                });
            }
            else {            
                var full_path = directoryPath.concat("\\", file_name)
                // Method with decryption
                fs.writeFile(full_path, data, async (err) => {
                    if (err) throw err;
                    var decrypted = await ArDriveCrypto.decrypt(full_path, arDrivePassword)
                    await sleep('250')
                    console.log("DOWNLOADED AND DECRYPTED %s", full_path);
                    fs.unlinkSync(full_path.concat(".enc"))
                });
            }
        });
    }
    catch (err) {
        console.log (err)
    }
}

// Downloads all ardrive files that are not local
async function downloadMyArDriveFiles(directoryPath) {
    console.log ("---Downloading any unsynced files---")

    const incompleteFiles = await arDriveFiles.getAll_fromCompleted()
    incompleteFiles.forEach(async function (incompleteFile) {
        if (incompleteFile.isPublic == 1) {
            var full_path = directoryPath.concat("\\Public\\", incompleteFile.file_name)
        }
        else {
            var full_path = directoryPath.concat("\\", incompleteFile.file_name)
        }

        //console.log("Downloading %s", full_path)
        fs.access(full_path, fs.F_OK, async (err) => {
            if (err) {
                console.log("FOUND PERMAFILE! %s is on the Permaweb, but not local.  Downloading...", full_path)             
                await downloadArDriveFile_byTx(incompleteFile.tx_id, incompleteFile.file_name, incompleteFile.isPublic)
            }
            else {
                //console.log("%s is on the Permaweb, but is already downloaded with matching file name", full_path)
                const localFileHash = await checksumFile(full_path)
                incompleteFileArDriveID = incompleteFile.ardrive_id.split("//")
                const incompleteFileHash = incompleteFileArDriveID[0]
                if (incompleteFileHash == localFileHash)
                {
                    //console.log("IGNORED! %s is on the Permaweb, but is already downloaded (matching file name and hash)", full_path)
                    arDriveFiles.updateCompletedStatus(incompleteFile.tx_id)
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
                        await downloadArDriveFile_byTx(incompleteFile.tx_id, incompleteFile.file_name, incompleteFile.isPublic)
                    }
                    else if (renameFile == 'N')
                    {
                        const overWriteFile = prompt('   Overwrite local file? Y/N ');
                        if (overWriteFile == 'Y') {
                            console.log ("   ...file being overwritten")
                            await downloadArDriveFile_byTx(incompleteFile.tx_id, incompleteFile.file_name, incompleteFile.isPublic)
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

    });
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
        const my_wallet_address = await arweave.wallets.jwkToAddress(jwk)
        console.log("---Synchronizing ArDrive for %s with %s wallet---", arDriveOwner, my_wallet_address)

        // Setup database if it doesnt exist
        await createDB()

        await sleep(500)

        // Sync my files from Permaweb to database
        await getMyArDriveFiles(jwk)

        await sleep(500)

        // Download all unsynced files from PermaWeb
        await downloadMyArDriveFiles(directoryPath)

        await sleep(500)

        // Queue new files
        await queueNewFiles(directoryPath)

        await sleep(500)

        // Process files and upload to Permaweb
        await processQueue()

    }
    catch {
        console.log('Error: ', err)
    }
    console.log ("Syncronization completed.  Sleeping for 1 minute")
    await sleep(60000)
    main()
}
  
main()
//createDB()
//sleep(500)
//arDriveSetup()
