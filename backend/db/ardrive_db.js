/* eslint-disable @typescript-eslint/naming-convention */
// ardrive_db.js

class ArDriveDB {
  constructor(dao) {
    this.dao = dao;
  }

  createProfileTable() {
    const sql = `CREATE TABLE IF NOT EXISTS Profile (
        id integer NOT NULL PRIMARY KEY,
        owner text NOT NULL UNIQUE,
        email text,
        data_protection_key text,
        wallet_private_key text,
        wallet_public_key text,
        sync_schedule text,
        sync_folder_path text
     );`;
    return this.dao.run(sql);
  }

  createSyncTable() {
    const sql = `CREATE TABLE IF NOT EXISTS Sync (
        id integer NOT NULL PRIMARY KEY,
        tx_id text UNIQUE,
        permaweb_link text,
        owner text,
        file_path text,
        file_name text,
        file_extension text,
        file_size text,
        sync_status text,
        content_type text,
        file_hash text,
        ignore INTEGER DEFAULT 0,
        queuedDate text,
        submittedDate text,
        advancedEncryption text,
        isLocal text,
        isApproved text,
        isPublic text DEFAULT 0,
        file_modified_date text,
        ardrive_id text UNIQUE,
        ardrive_path text,
        keywords text,
        prev_tx_id text,
        block_hash text,
        file_version INTEGER DEFAULT 0
     );`;
    return this.dao.run(sql);
  }

  createQueueTable() {
    const sql = `CREATE TABLE IF NOT EXISTS Queue (
          id integer NOT NULL PRIMARY KEY,
          tx_id text,
          owner text,
          file_path text NOT NULL UNIQUE,
          file_name text,
          file_extension text,
          file_size text,
          sync_status INTEGER DEFAULT 0,
          file_hash text,
          ignore INTEGER DEFAULT 0,
          isPublic text DEFAULT 0,
          file_modified_date text,
          ardrive_id text,
          ardrive_path text,
          keywords text,
          permaweb_link text,
          prev_tx_id text,
          block_hash text,
          file_version INTEGER DEFAULT 0
       );`;
    return this.dao.run(sql);
  }

  createCompletedTable() {
    const sql = `CREATE TABLE IF NOT EXISTS Completed (
          id integer NOT NULL PRIMARY KEY,
          tx_id text NOT NULL UNIQUE,
          isLocal text,
          file_name text UNIQUE,
          owner text,
          permaweb_link text,
          ardrive_id text,
          isPublic text DEFAULT 0,
          file_modified_date text,
          file_extension text,
          ardrive_path text,
          ignore INTEGER DEFAULT 0,
          keywords text,
          prev_tx_id text,
          block_hash text
       );`;
    return this.dao.run(sql);
  }

  queueFile(file) {
    const {
      owner,
      file_path,
      file_name,
      file_extension,
      file_size,
      file_modified_date,
      tx_id,
      ardrive_id,
      isPublic,
      ardrive_path,
    } = file;
    return this.dao.run(
      'REPLACE INTO Queue (owner, file_path, file_name, file_extension, file_size, file_modified_date, tx_id, ardrive_id, isPublic, ardrive_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        owner,
        file_path,
        file_name,
        file_extension,
        file_size,
        file_modified_date,
        tx_id,
        ardrive_id,
        isPublic,
        ardrive_path,
      ]
    );
  }

  completeFile(file) {
    const {
      owner,
      file_name,
      file_extension,
      file_modified_date,
      ardrive_id,
      ardrive_path,
      permaweb_link,
      tx_id,
      prev_tx_id,
      isLocal,
      isPublic,
    } = file;
    return this.dao.run(
      'REPLACE INTO Completed (owner, file_name, file_extension, file_modified_date, ardrive_id, ardrive_path, permaweb_link, tx_id, prev_tx_id, isLocal, isPublic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        owner,
        file_name,
        file_extension,
        file_modified_date,
        ardrive_id,
        ardrive_path,
        permaweb_link,
        tx_id,
        prev_tx_id,
        isLocal,
        isPublic,
      ]
    );
  }

  createArDriveProfile(profile) {
    const {
      owner,
      email,
      data_protection_key,
      wallet_private_key,
      wallet_public_key,
      sync_schedule,
      sync_folder_path,
    } = profile;
    return this.dao.run(
      'REPLACE INTO Profile (owner, email, data_protection_key, wallet_private_key, wallet_public_key, sync_schedule, sync_folder_path) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        owner,
        email,
        data_protection_key,
        wallet_private_key,
        wallet_public_key,
        sync_schedule,
        sync_folder_path,
      ]
    );
  }

  getByArDriveId_fromCompleted(ardrive_id) {
    return this.dao.get(`SELECT * FROM Completed WHERE ardrive_id = ?`, [
      ardrive_id,
    ]);
  }

  getByFileName_fromCompleted(file_name) {
    return this.dao.get(`SELECT * FROM Completed WHERE file_name= ?`, [
      file_name,
    ]);
  }

  getByTx_fromCompleted(tx_id) {
    return this.dao.get(`SELECT ardrive_id FROM Completed WHERE tx_id = ?`, [
      tx_id,
    ]);
  }

  getAllIncomplete_fromCompleted() {
    return this.dao.all(
      'SELECT * FROM COMPLETED WHERE isLocal = 0 AND ignore = 0'
    );
  }

  getAll_fromProfile(wallet_public_key) {
    return this.dao.get(`SELECT * FROM Profile WHERE wallet_public_key = ?`, [
      wallet_public_key,
    ]);
  }

  remove_fromQueue(ardrive_id) {
    return this.dao.get(`DELETE FROM Queue WHERE ardrive_id = ?`, [ardrive_id]);
  }

  updateQueueStatus(file) {
    const { tx_id, ardrive_id, isPublic, file_path } = file;
    return this.dao.run(
      `UPDATE Queue SET tx_id = ?, ardrive_id = ?, isPublic = ? WHERE file_path = ?`,
      [tx_id, ardrive_id, isPublic, file_path]
    );
  }

  setIncompleteFileToIgnore(tx_id) {
    return this.dao.get(`UPDATE Completed SET ignore = 1 WHERE tx_id = ?`, [
      tx_id,
    ]);
  }

  updateCompletedStatus(tx_id) {
    return this.dao.get(`UPDATE Completed SET isLocal = 1 WHERE tx_id = ?`, [
      tx_id,
    ]);
  }

  setCompletedFileToDownload(file_name) {
    return this.dao.get(
      `UPDATE Completed SET isLocal = 0 WHERE file_name = ?`,
      [file_name]
    );
  }

  setQueuedFileToPublic(file_path) {
    return this.dao.get(`UPDATE Queue SET isPublic = 1 WHERE file_path = ?`, [
      file_path,
    ]);
  }

  getByArDriveId_fromQueue(ardrive_id) {
    return this.dao.get(`SELECT * FROM Queue WHERE ardrive_id = ?`, [
      ardrive_id,
    ]);
  }

  getByFilePath_fromQueue(file_path) {
    return this.dao.get(`SELECT * FROM Queue WHERE file_path = ?`, [file_path]);
  }

  getAllUploaded_fromQueue() {
    return this.dao.all('SELECT * FROM Queue WHERE tx_id != 0');
  }

  // getAll_fromProfile() {
  //   return this.dao.all('SELECT * FROM Profile');
  // }

  getAll_fromCompleted() {
    return this.dao.all('SELECT * FROM COMPLETED WHERE ignore = 0');
  }

  getFilesToUpload_fromQueue() {
    return this.dao.all('SELECT * FROM Queue WHERE tx_id = 0 ');
  }
}

module.exports = ArDriveDB;
