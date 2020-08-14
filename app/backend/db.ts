/* eslint-disable @typescript-eslint/naming-convention */
import sqlite3 from 'sqlite3';

// Use verbose mode in development
let sql3 = sqlite3;
if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  sql3 = sqlite3.verbose();
}

let db: sqlite3.Database | null;

const run = (sql: any, params: any[] = []) => {
  return new Promise((resolve, reject) => {
    if (db === null) {
      return reject(
        new Error(
          'DB not created yet - run setupDatabase() before using these methods.'
        )
      );
    }
    return db.run(sql, params, (err: string) => {
      if (err) {
        console.log(`Error running sql ${sql}`);
        console.log(err);
        reject(err);
      }
      resolve();
    });
  });
};

const get = (sql: any, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (db === null) {
      return reject(
        new Error(
          'DB not created yet - run setupDatabase() before using these methods.'
        )
      );
    }
    return db.get(sql, params, (err: any, result: any) => {
      if (err) {
        console.log(`Error running sql: ${sql}`);
        console.log(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

const all = (sql: any, params: any[] = []): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    if (db === null) {
      return reject(
        new Error(
          'DB not created yet - run setupDatabase() before using these methods.'
        )
      );
    }
    return db.all(sql, params, (err: any, rows: any[]) => {
      if (err) {
        console.error(`Error running sql: ${sql}`);
        console.error(err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

const createProfileTable = async () => {
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
  return run(sql);
};

const createSyncTable = () => {
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
  return run(sql);
};

const createQueueTable = () => {
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
  return run(sql);
};

const createCompletedTable = () => {
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
  return run(sql);
};

export const queueFile = (file: {
  owner: any;
  file_path: any;
  file_name: any;
  file_extension: any;
  file_size: any;
  file_modified_date: any;
  tx_id: any;
  ardrive_id: any;
  isPublic: any;
  ardrive_path: any;
}) => {
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
  return run(
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
};

export const completeFile = (file: {
  owner: any;
  file_name: any;
  file_extension: any;
  file_modified_date: any;
  ardrive_id: any;
  ardrive_path: any;
  permaweb_link: any;
  tx_id: any;
  prev_tx_id: any;
  isLocal: any;
  isPublic: any;
}) => {
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
  return run(
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
};

export const createArDriveProfile = (profile: {
  owner: any;
  email: any | null;
  data_protection_key: any;
  wallet_private_key: any;
  wallet_public_key: any;
  sync_schedule: any;
  sync_folder_path: any;
}) => {
  const {
    owner,
    email,
    data_protection_key,
    wallet_private_key,
    wallet_public_key,
    sync_schedule,
    sync_folder_path,
  } = profile;
  return run(
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
};

export const getByArDriveId_fromCompleted = (ardrive_id: string) => {
  return get(`SELECT * FROM Completed WHERE ardrive_id = ?`, [ardrive_id]);
};

export const getByFileName_fromCompleted = (file_name: string) => {
  return get(`SELECT * FROM Completed WHERE file_name= ?`, [file_name]);
};

export const getByTx_fromCompleted = (tx_id: string) => {
  return get(`SELECT ardrive_id FROM Completed WHERE tx_id = ?`, [tx_id]);
};

export const getAllIncomplete_fromCompleted = () => {
  return all('SELECT * FROM COMPLETED WHERE isLocal = 0 AND ignore = 0');
};

export const getAll_fromProfileWithWalletPublicKey = (
  wallet_public_key: string
) => {
  return get(`SELECT * FROM Profile WHERE wallet_public_key = ?`, [
    wallet_public_key,
  ]);
};

export const remove_fromQueue = (ardrive_id: string) => {
  return get(`DELETE FROM Queue WHERE ardrive_id = ?`, [ardrive_id]);
};

export const updateQueueStatus = (file: {
  tx_id: any;
  ardrive_id: any;
  isPublic: any;
  file_path: any;
}) => {
  const { tx_id, ardrive_id, isPublic, file_path } = file;
  return run(
    `UPDATE Queue SET tx_id = ?, ardrive_id = ?, isPublic = ? WHERE file_path = ?`,
    [tx_id, ardrive_id, isPublic, file_path]
  );
};

export const setIncompleteFileToIgnore = (tx_id: string) => {
  return get(`UPDATE Completed SET ignore = 1 WHERE tx_id = ?`, [tx_id]);
};

export const updateCompletedStatus = (tx_id: string) => {
  return get(`UPDATE Completed SET isLocal = 1 WHERE tx_id = ?`, [tx_id]);
};

export const setCompletedFileToDownload = (file_name: string) => {
  return get(`UPDATE Completed SET isLocal = 0 WHERE file_name = ?`, [
    file_name,
  ]);
};

export const setQueuedFileToPublic = (file_path: string) => {
  return get(`UPDATE Queue SET isPublic = 1 WHERE file_path = ?`, [file_path]);
};

export const getByArDriveId_fromQueue = (ardrive_id: string) => {
  return get(`SELECT * FROM Queue WHERE ardrive_id = ?`, [ardrive_id]);
};

export const getByFilePath_fromQueue = (file_path: string) => {
  return get(`SELECT * FROM Queue WHERE file_path = ?`, [file_path]);
};

export const getAllUploaded_fromQueue = () => {
  return all('SELECT * FROM Queue WHERE tx_id != 0');
};

export const getAll_fromProfile = (): Promise<any[]> => {
  return all('SELECT * FROM Profile');
};

export const getAll_fromCompleted = () => {
  return all('SELECT * FROM COMPLETED WHERE ignore = 0');
};

export const getFilesToUpload_fromQueue = () => {
  return all('SELECT * FROM Queue WHERE tx_id = 0 ');
};

const createTablesInDB = async () => {
  await createProfileTable();
  await createQueueTable();
  await createCompletedTable();
};

// Main entrypoint for database. MUST call this before anything else can happen
export const setupDatabase = async (dbFilePath: string) => {
  return new Promise((resolve, reject) => {
    db = new sql3.Database(dbFilePath, async (err) => {
      if (err) {
        console.error('Could not connect to database: '.concat(err.message));
        return reject(err);
      }
      try {
        await createTablesInDB();
      } catch (tableErr) {
        return reject(tableErr);
      }
      return resolve();
    });
  });
};
