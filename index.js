// index.js
const Promise = require('bluebird')
const AppDAO = require('./dao')
const ArDriveDB = require('./ardrive_db')
const ArDriveCommon = require('./common')
const ArDriveProfile = require('./profile')
const ArDriveUpload = require ('./upload')
const ArDriveDownload = require ('./download')

// SQLite Database Setup
const arDriveDBFile = "C:\\ArDrive\\ardrive.db"  // NEED AN ENVIRONMENT VARIABLE
const dao = new AppDAO(arDriveDBFile)
const ArDriveFiles = new ArDriveDB(dao)

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

async function main() {
    try {

        console.log("       ___   _____    _____   _____    _   _     _   _____  ")
        console.log("      /   | |  _  \\  |  _  \\ |  _  \\  | | | |   / / | ____| ")
        console.log("     / /| | | |_| |  | | | | | |_| |  | | | |  / /  | |__   ")
        console.log("    / /_| | |  _  /  | | | | |  _  /  | | | | / /   |  __|  ")
        console.log("   / /  | | | | \\ \\  | |_| | | | \\ \\  | | | |/ /    | |___  ")
        console.log("  /_/   |_| |_|  \\_\\ |_____/ |_|  \\_\\ |_| |___/     |_____| ")
        console.log("")

        // Setup database if it doesnt exist
        await ArDriveCommon.createDB()
        await ArDriveCommon.sleep(500)

        // Check if user exists, if not, create a new one
        var profile = await ArDriveFiles.getAll_fromProfile()
        if (profile == '') {
            var user = await ArDriveProfile.arDriveProfileSetup()
            await ArDriveCommon.sleep(500)

        }
        else {
            // unlock ardrive for user
            var user = await ArDriveProfile.unlockArDriveProfile(profile[0].wallet_public_key, profile[0].owner)
        }

        // Run this in a loop
        while (true)
        {
            var balance = await arweave.wallets.getBalance(user.wallet_public_key);
            balance = await arweave.ar.winstonToAr(balance);
    
            var getfiles = await ArDriveDownload.getMyArDriveFiles(user)
            var queuedfiles = await ArDriveUpload.queueNewFiles(user, user.sync_folder_path)
            var checkedstatus = await ArDriveUpload.checkUploadStatus(user)
            var uploadedfiles = await ArDriveUpload.uploadArDriveFiles(user)
            var downloadfiles = await ArDriveDownload.downloadMyArDriveFiles(user)

            var today = new Date();
            var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date+' '+time;
            console.log ("%s Syncronization completed.  Current AR Balance: %s", dateTime, balance)
            await ArDriveCommon.sleep(30000)
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