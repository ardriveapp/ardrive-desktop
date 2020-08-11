// index.js
const Promise = require('bluebird')
const AppDAO = require('./dao')
const ArDriveDB = require('./db/ardrive_db')
const mime = require('mime-types')
const fetch = require("node-fetch");

// SQLite Database Setup
const arDriveDBFile = "C:\\ArDrive\\ardrive.db"
const dao = new AppDAO(arDriveDBFile)
const arDriveFiles = new ArDriveDB(dao)

// Pauses application
exports.sleep = async function (ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// Asyncronous ForEach function
exports.asyncForEach = async function (array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
}

// Format byte size to something nicer.  This is minified...
exports.formatBytes = function (bytes) {
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

exports.extToMime = function (type) {
    return mime.lookup(type)
}

// Format byte size to something nicer.
exports.formatBytes = function (bytes) {
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

// Creates the SQLite database
exports.createDB = async function () {
    await arDriveFiles.createProfileTable()
    await arDriveFiles.createQueueTable()
    await arDriveFiles.createCompletedTable()
    //console.log("Database created")
}

// Gets the price of AR based on amount of data
exports.getWinston = async function(bytes, target) {
    return new Promise(async (resolve, reject) => {
        bytes = bytes || 0;
        target = target || '';
        try {
            const response = await fetch(`https://arweave.net/price/${bytes}/${target}`)
            resolve (response.ok ? response.text() : null)
        }
        catch (err) {
            console.log (err)
            resolve (false)
        }
    })
};

