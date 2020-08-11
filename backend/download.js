// upload.js
const Promise = require('bluebird')
const AppDAO = require('./dao')
const ArDriveDB = require('./db/ardrive_db')
const ArDriveCrypto = require('./crypto')
const ArDriveCommon = require('./common')
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

// Downloads a single file from ArDrive by transaction
async function downloadArDriveFile_byTx(user, tx, file_name, isPublic, ardrive_path) {
    return new Promise(async (resolve, reject) => {
        var full_path = user.sync_folder_path.concat(ardrive_path, file_name)
        var folderPath = user.sync_folder_path.concat(ardrive_path)
        try {
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
                await ArDriveCommon.sleep('1000')
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
                    await ArDriveCommon.sleep('500')
                    var decrypted = await ArDriveCrypto.decryptFile(full_path.concat(".enc"), user.password, user.jwk)
                    await ArDriveCommon.sleep('500')
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

// Gets all of the files from your ArDrive (via ARQL) and loads them into the database
exports.getMyArDriveFiles = async function (user){
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

            await ArDriveCommon.asyncForEach(txids, async (txid) => {
            //txids.forEach(async function (txid) {
                try {
                    const transaction = await arweave.transactions.get(txid).then(async transaction => {
                        var isCompleted = await ArDriveFiles.getByTx_fromCompleted(txid)
                        if (isCompleted) {
                            resolve ("%s is found in the DB... skipping", txid)
                        }
                        else {
                            //console.log ("%s not found in DB... adding", txid)
                            // Add the TX to the DB

                            //await ArDriveCommon.asyncForEach(transaction.get('tags'), async (tag) => {
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
                            const newFile = await ArDriveFiles.completeFile(fileToAdd)
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

// Downloads all ardrive files that are not local
exports.downloadMyArDriveFiles = async function (user) {
    return new Promise(async (resolve, reject) => {
        try {
            console.log ("---Downloading any unsynced files---")
            const incompleteFiles = await ArDriveFiles.getAll_fromCompleted()

            await ArDriveCommon.asyncForEach(incompleteFiles, async (incompleteFile) => {
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
                    const localFileHash = await ArDriveCrypto.checksumFile(full_path)
                    incompleteFileArDriveID = incompleteFile.ardrive_id.split("//")
                    const incompleteFileHash = incompleteFileArDriveID[0]
                    if (incompleteFileHash == localFileHash)
                    {
                        //console.log("IGNORED! %s is on the Permaweb, but is already downloaded (matching file name and hash)", full_path)
                        await ArDriveFiles.updateCompletedStatus(incompleteFile.tx_id)
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
                                    ArDriveFiles.setIncompleteFileToIgnore(incompleteFile.tx_id)
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
