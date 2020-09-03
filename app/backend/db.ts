/* eslint-disable @typescript-eslint/naming-convention */
import sqlite3, { Database } from 'sqlite3';

// Use verbose mode in development
let sql3 = sqlite3;
if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  sql3 = sqlite3.verbose();
}

let db: Database | null;

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
        arDriveId NOT NULL UNIQUE,
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
        metaDataTxId text NOT NULL,
        dataTxId text,
        appName text DEFAULT ArDrive,
        appVersion text,
        unixTime integer,
        contentType text,
        entityType text,
        arDriveId text,
        parentFolderId text,
        fileId text,
        filePath text,
        arDrivePath text,
        fileName text,
        fileHash text,
        fileSize text,
        fileModifiedDate text,
        fileVersion integer DEFAULT 0,
        permaWebLink text,
        fileDataSyncStatus text,
        fileMetaDataSyncStatus text,
        ignore INTEGER DEFAULT 0,
        isPublic text DEFAULT 0,
        isLocal text,
        isApproved text
     );`;
  return run(sql);
};

export const addFileToSyncTable = (file: {
  appName: any;
  appVersion: any;
  unixTime: any;
  contentType: any;
  entityType: any;
  arDriveId: any;
  parentFolderId: any;
  fileId: any;
  filePath: any;
  arDrivePath: any;
  fileName: any;
  fileHash: any;
  fileSize: any;
  fileModifiedDate: any;
  fileVersion: any;
  isPublic: any;
  isLocal: any;
  metaDataTxId: any;
  dataTxId: any;
  fileDataSyncStatus: any;
  fileMetaDataSyncStatus: any;
  permaWebLink: any;
}) => {
  const {
    appName,
    appVersion,
    unixTime,
    contentType,
    entityType,
    arDriveId,
    parentFolderId,
    fileId,
    filePath,
    arDrivePath,
    fileName,
    fileHash,
    fileSize,
    fileModifiedDate,
    fileVersion,
    isPublic,
    isLocal,
    metaDataTxId,
    dataTxId,
    fileDataSyncStatus,
    fileMetaDataSyncStatus,
    permaWebLink,
  } = file;
  return run(
    'REPLACE INTO Sync (appName, appVersion, unixTime, contentType, entityType, arDriveId, parentFolderId, fileId, filePath, arDrivePath, fileName, fileHash, fileSize, fileModifiedDate, fileVersion, isPublic, isLocal, metaDataTxId, dataTxId, fileDataSyncStatus, fileMetaDataSyncStatus, permaWebLink) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      appName,
      appVersion,
      unixTime,
      contentType,
      entityType,
      arDriveId,
      parentFolderId,
      fileId,
      filePath,
      arDrivePath,
      fileName,
      fileHash,
      fileSize,
      fileModifiedDate,
      fileVersion,
      isPublic,
      isLocal,
      metaDataTxId,
      dataTxId,
      fileDataSyncStatus,
      fileMetaDataSyncStatus,
      permaWebLink,
    ]
  );
};

export const getFolderFromSyncTable = (folderPath: string) => {
  return get(
    `SELECT fileId FROM Sync WHERE filePath = ? AND entityType = 'folder'`,
    [folderPath]
  );
};

export const getByFilePathAndHashFromSyncTable = (file: {
  fileHash: string;
  filePath: string;
}) => {
  const { fileHash, filePath } = file;
  return get(`SELECT * FROM Sync WHERE fileHash = ? AND filePath = ?`, [
    fileHash,
    filePath,
  ]);
};

export const getByFileHashAndModifiedDateAndArDrivePathFromSyncTable = (file: {
  fileHash: string;
  fileModifiedDate: number;
  arDrivePath: string;
}) => {
  const { fileHash, fileModifiedDate, arDrivePath } = file;
  return get(
    `SELECT * FROM Sync WHERE fileHash = ? AND fileModifiedDate = ? AND arDrivePath = ?`,
    [fileHash, fileModifiedDate, arDrivePath]
  );
};

export const getByFileHashAndModifiedDateAndFileNameFromSyncTable = (file: {
  fileHash: string;
  fileModifiedDate: number;
  fileName: string;
}) => {
  const { fileHash, fileModifiedDate, fileName } = file;
  return get(
    `SELECT * FROM Sync WHERE fileHash = ? AND fileModifiedDate = ? AND fileName = ?`,
    [fileHash, fileModifiedDate, fileName]
  );
};

export const getByFilePathFromSyncTable = (filePath: string) => {
  return get(
    `SELECT * FROM Sync WHERE filePath = ? ORDER BY fileVersion DESC`,
    [filePath]
  );
};

export const getLatestFileVersionFromSyncTable = (fileId: string) => {
  return get(`SELECT * FROM Sync WHERE fileId = ? ORDER BY unixTime DESC`, [
    fileId,
  ]);
};

export const getFilesToUploadFromSyncTable = () => {
  return all(
    'SELECT * FROM Sync WHERE fileDataSyncStatus = 1 OR fileMetaDataSyncStatus = 1 '
  );
};

export const getAllUploadedFilesFromSyncTable = () => {
  return all(
    'SELECT * FROM Sync WHERE fileDataSyncStatus = 2 OR fileMetaDataSyncStatus = 2'
  );
};

export const getFilesToDownload = () => {
  return all(
    'SELECT * FROM Sync WHERE ignore = 0 AND isLocal = 0 AND entityType = "file"'
  );
};

export const getFoldersToCreate = () => {
  return all(
    'SELECT * FROM Sync WHERE ignore = 0 AND isLocal = 0 AND entityType = "folder"'
  );
};

export const updateFileMetaDataSyncStatus = (file: {
  fileMetaDataSyncStatus: any;
  metaDataTxId: any;
  id: any;
}) => {
  const { fileMetaDataSyncStatus, metaDataTxId, id } = file;
  return get(
    `UPDATE Sync SET fileMetaDataSyncStatus = ?, metaDataTxId = ? WHERE id = ?`,
    [fileMetaDataSyncStatus, metaDataTxId, id]
  );
};

export const updateFileDataSyncStatus = (file: {
  fileDataSyncStatus: any;
  dataTxId: any;
  id: any;
}) => {
  const { fileDataSyncStatus, dataTxId, id } = file;
  return get(
    `UPDATE Sync SET fileDataSyncStatus = ?, dataTxId = ? WHERE id = ?`,
    [fileDataSyncStatus, dataTxId, id]
  );
};

export const updateFileInSyncTable = (file: {
  arDriveId: any;
  parentFolderId: any;
  fileId: any;
  fileVersion: any;
  metaDataTxId: any;
  dataTxId: any;
  fileDataSyncStatus: any;
  fileMetaDataSyncStatus: any;
  permaWebLink: any;
  id: any;
}) => {
  const {
    arDriveId,
    parentFolderId,
    fileId,
    fileVersion,
    metaDataTxId,
    dataTxId,
    fileDataSyncStatus,
    fileMetaDataSyncStatus,
    permaWebLink,
    id,
  } = file;
  return run(
    'UPDATE Sync SET arDriveId = ?, parentFolderId = ?, fileId = ?, fileVersion = ?, metaDataTxId = ?, dataTxId = ?, fileDataSyncStatus = ?, fileMetaDataSyncStatus = ?, permaWebLink = ? WHERE id = ?',
    [
      arDriveId,
      parentFolderId,
      fileId,
      fileVersion,
      metaDataTxId,
      dataTxId,
      fileDataSyncStatus,
      fileMetaDataSyncStatus,
      permaWebLink,
      id,
    ]
  );
};

export const completeFileDataFromSyncTable = (file: {
  fileDataSyncStatus: any;
  permaWebLink: any;
  id: any;
}) => {
  const { fileDataSyncStatus, permaWebLink, id } = file;
  return get(
    `UPDATE Sync SET fileDataSyncStatus = ?, permaWebLink = ? WHERE id = ?`,
    [fileDataSyncStatus, permaWebLink, id]
  );
};

export const completeFileMetaDataFromSyncTable = (file: {
  fileMetaDataSyncStatus: any;
  permaWebLink: any;
  id: any;
}) => {
  const { fileMetaDataSyncStatus, permaWebLink, id } = file;
  return get(
    `UPDATE Sync SET fileMetaDataSyncStatus = ?, permaWebLink = ? WHERE id = ?`,
    [fileMetaDataSyncStatus, permaWebLink, id]
  );
};

export const removeFromSyncTable = (id: string) => {
  return get(`DELETE FROM Sync WHERE id = ?`, [id]);
};

export const getByMetaDataTxFromSyncTable = (metaDataTxId: string) => {
  return get(`SELECT * FROM Sync WHERE metaDataTxId = ?`, [metaDataTxId]);
};

export const getMyFileDownloadConflicts = () => {
  return all('SELECT * FROM Sync WHERE isLocal = 2 ');
};

export const createArDriveProfile = (profile: {
  owner: any;
  arDriveId: any;
  email: any | null;
  data_protection_key: any;
  wallet_private_key: any;
  wallet_public_key: any;
  sync_schedule: any;
  sync_folder_path: any;
}) => {
  const {
    owner,
    arDriveId,
    email,
    data_protection_key,
    wallet_private_key,
    wallet_public_key,
    sync_schedule,
    sync_folder_path,
  } = profile;
  return run(
    'REPLACE INTO Profile (owner, arDriveId, email, data_protection_key, wallet_private_key, wallet_public_key, sync_schedule, sync_folder_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [
      owner,
      arDriveId,
      email,
      data_protection_key,
      wallet_private_key,
      wallet_public_key,
      sync_schedule,
      sync_folder_path,
    ]
  );
};

export const getAll_fromProfileWithWalletPublicKey = (
  wallet_public_key: string
) => {
  return get(`SELECT * FROM Profile WHERE wallet_public_key = ?`, [
    wallet_public_key,
  ]);
};

export const deleteFromSyncTable = (id: string) => {
  return get(`DELETE FROM Sync WHERE id = ?`, [id]);
};

export const setPermaWebFileToIgnore = (id: string) => {
  return get(`UPDATE Sync SET ignore = 1 WHERE id = ?`, [id]);
};

export const setPermaWebFileToOverWrite = (id: string) => {
  return get(`UPDATE Sync SET isLocal = 2 WHERE id = ?`, [id]);
};

export const updateFileDownloadStatus = (isLocal: string, id: string) => {
  return get(`UPDATE Sync SET isLocal = ? WHERE id = ?`, [isLocal, id]);
};

export const getAll_fromProfile = (): Promise<any[]> => {
  return all('SELECT * FROM Profile');
};

const createOrOpenDb = (dbFilePath: string): Promise<Database> => {
  return new Promise((resolve, reject) => {
    const database: Database = new sql3.Database(dbFilePath, (err) => {
      if (err) {
        console.error('Could not connect to database: '.concat(err.message));
        return reject(err);
      }
      return resolve(database);
    });
  });
};

const createTablesInDB = async () => {
  await createProfileTable();
  await createSyncTable();
};

// Main entrypoint for database. MUST call this before anything else can happen
export const setupDatabase = async (
  dbFilePath: string
): Promise<Error | null> => {
  try {
    db = await createOrOpenDb(dbFilePath);
    await createTablesInDB();
  } catch (err) {
    return err;
  }
  return null;
};
