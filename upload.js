// upload.js
const Promise = require('bluebird')
const AppDAO = require('./dao')
const ArDriveDB = require('./ardrive_db')
const ArDriveCrypto = require('./crypto')
const ArDriveCommon = require('./common')
const ArDrivePST = require ('./pst')
const path = require('path');
const fs = require('fs');
const prompt = require('prompt-sync')({sigint: true});

// SQLite Database Setup
const arDriveDBFile = "C:\\ArDrive\\ardrive.db"  // NEED AN ENVIRONMENT VARIABLE
const dao = new AppDAO(arDriveDBFile)
const ArDriveFiles = new ArDriveDB(dao)

// ArDrive Version Tag
const VERSION = '0.1.1';

// Establish Arweave node connectivity.
const gatewayURL = "https://arweave.net/"
//const gatewayURL = "https://perma.online/"
const Arweave = require('arweave/node');
const arweave = Arweave.init({
    //host: 'perma.online', // ARCA Community Gateway
    host: 'arweave.net', // Arweave Gateway
    port: 443,
    protocol: 'https',
    timeout: 600000
});

// Recursively returns all files in a directory
function readDirR(dir) {
    return fs.statSync(dir).isDirectory()
        ? Array.prototype.concat(...fs.readdirSync(dir).map(f => readDirR(path.join(dir, f))))
        : dir;
}

 // Tags and Uploads a single file to your ArDrive
 async function uploadArDriveFile (user, file_path, ardrive_path, extension, modifiedDate) {
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
                await ArDriveCommon.sleep('250')
                file_path = file_path.concat(".enc")
            }

            var file_to_upload = fs.readFileSync(file_path);
            var file_name = path.basename(file_path.replace(".enc",""))
            let transaction = await arweave.createTransaction({data: arweave.utils.concatBuffers([file_to_upload])}, JSON.parse(user.jwk));
            const tx_size = transaction.get('data_size');

            arPrice = await ArDriveCommon.getWinston(tx_size).then(async data => {
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
                const localFileHash = await ArDriveCrypto.checksumFile(unencryptedFile_path)
                const ardrive_id = localFileHash.concat("//", file_name)
    
                // Get Content-Type of file
                const contentType = ArDriveCommon.extToMime(extension)
    
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
                await ArDriveFiles.updateQueueStatus(fileToUpdate)
    
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
    
                // Send the ArDrive fee to ARDRIVE Profit Sharing Comunity smart contract
                const completedFee = await ArDrivePST.sendArDriveFee(user, arPrice.toFixed(6))
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

// Checks for any new files in the folder that arent synced or queued
exports.queueNewFiles = async function (user, sync_folder_path) {
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
                await ArDriveCommon.asyncForEach(allFiles, async (file) => {

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
                        const localFileHash = await ArDriveCrypto.checksumFile(fullpath)
                        const ardrive_id = localFileHash.concat("//", file_name)

                        var ardrive_public = "0"

                        if (fullpath.indexOf(sync_folder_path.concat("\\Public\\")) != -1)
                        {
                            // Public by choice, do not encrypt
                            ardrive_public = "1"
                        }
                        
                        var matchingArDriveID = await ArDriveFiles.getByArDriveId_fromCompleted(ardrive_id)
                        var matchingFileName = await ArDriveFiles.getByFileName_fromCompleted(file_name)
                        var isQueued = await ArDriveFiles.getByFilePath_fromQueue(fullpath)
                        var ardrive_path = fullpath.replace(user.sync_folder_path,"")
                        ardrive_path = ardrive_path.replace(file_name,"")
                    
                        if (matchingArDriveID) {
                            // console.log("%s is already completed with a matching ardrive_id", fullpath)
                        }
                        else if (matchingFileName) {
                            // A file exists on the permaweb with a different hash.  Changing that file's local status to 0 to force user to resolve conflict.
                            ArDriveFiles.setCompletedFileToDownload(file_name)
                            //console.log ("Forcing user to resolve conflict %s", file)
                        }
                        else if (isQueued) {
                            isCompleted = await ArDriveFiles.getByFileName_fromCompleted(file_name)
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
                        ArDriveFiles.queueFile(fileToQueue)
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

// Uploads all queued files
exports.uploadArDriveFiles = async function (user) {
    return new Promise (async (resolve, reject) => { 
        try {
            var filesUploaded = 0
            var totalWinston = 0
            var totalSize = 0
            var winston = 0

            console.log ("---Uploading All Queued Files---")
            const filesToUpload = await ArDriveFiles.getFilesToUpload_fromQueue()

            if (Object.keys(filesToUpload).length > 0){
                await ArDriveCommon.asyncForEach(filesToUpload, async (fileToUpload) => {
                    totalSize = totalSize + +fileToUpload.file_size
                    winston = await ArDriveCommon.getWinston(fileToUpload.file_size)
                    totalWinston = totalWinston + +winston
                })
                const totalArweavePrice = totalWinston * 0.000000000001
                var arDriveFee = +totalArweavePrice.toFixed(9) * .15
                if (arDriveFee < .00001) {
                    arDriveFee = .00001
                }
    
                const totalArDrivePrice = +totalArweavePrice.toFixed(9) + arDriveFee
    
                console.log('Uploading %s files (%s) to the Permaweb, totaling %s AR', Object.keys(filesToUpload).length, ArDriveCommon.formatBytes(totalSize), totalArDrivePrice)  
                var readyToUpload = prompt('Upload all unsynced files? Y/N ');
                if (readyToUpload == 'Y') {
                    // Ready to upload
                    await ArDriveCommon.asyncForEach(filesToUpload, async (fileToUpload) => {
                        if (fileToUpload.file_size == "0") {
                            console.log ("%s has a file size of 0 and cannot be uploaded to the Permaweb", fileToUpload.file_path)
                            await ArDriveFiles.remove_fromQueue(fileToUpload.ardrive_id)
                        }
                        else if (await ArDriveFiles.getByFileName_fromCompleted(fileToUpload.file_name)) {   // File name must be changed to something more unique like ardrive_id
                            console.log ("%s was queued, but has been previously uploaded to the Permaweb", fileToUpload.file_path)
                            await ArDriveFiles.remove_fromQueue(fileToUpload.ardrive_id)
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
exports.checkUploadStatus = async function () {
    return new Promise(async (resolve, reject) => {
        try {
            console.log ("---Checking Upload Status---")
            const unsyncedFiles = await ArDriveFiles.getAllUploaded_fromQueue()

            await ArDriveCommon.asyncForEach(unsyncedFiles, async (unsyncedFile) => {
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
                    await ArDriveFiles.completeFile(fileToComplete)
                    await ArDriveFiles.remove_fromQueue(unsyncedFile.ardrive_id)
                }
                else if (res.status == 202){
                    console.log ("%s is still being uploaded to the PermaWeb (TX_PENDING)", unsyncedFile.file_path)
                }
                else if (res.status == 410){
                    console.log ("%s failed to be uploaded (TX_FAILED)", unsyncedFile.file_path)
                    await ArDriveFiles.remove_fromQueue(unsyncedFile.ardrive_id)
                }
                else {
                    if (unsyncedFile.file_size == "0") {
                        console.log ("%s has a file size of 0 and cannot be uploaded to the Permaweb", unsyncedFile.file_path)
                        await ArDriveFiles.remove_fromQueue(unsyncedFile.ardrive_id)
                    }
                    else if (await ArDriveFiles.getByFileName_fromCompleted(unsyncedFile.file_name)) {   // File name must be changed to something more unique like ardrive_id
                        console.log ("%s was queued, but has been previously uploaded to the Permaweb", unsyncedFile.file_path)
                        await ArDriveFiles.remove_fromQueue(unsyncedFile.ardrive_id)
                    }
                    else {
                        // CHECK IF FILE EXISTS AND IF NOT REMOVE FROM QUEUE
                        fs.access(unsyncedFile.file_path, fs.F_OK, async (err) => {
                            if (err) {
                                console.log ("%s was not found locally anymore.  Removing from the queue", unsyncedFile.file_path)
                                await ArDriveFiles.remove_fromQueue(unsyncedFile.ardrive_id)
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

