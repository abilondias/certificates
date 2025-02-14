import sqlite3, { RunResult } from "sqlite3"

/**
 * Represents an SQLite client to interact with a file database.
 */
export class SQLiteClient {
  private db: sqlite3.Database

  /**
   * Creates an instance of SQLiteClient.
   *
   * @param {string} dbPath - absolute path for the SQLite file database.
   */
  constructor(dbPath: string) {
    this.db = new sqlite3.Database(dbPath)
  }

  /**
   * Binds the provided parameters to the query and runs it.
   *
   */
  run(query: string, params: any): Promise<RunResult> {
    return new Promise((resolve, reject) => {
      this.db.run(
        query,
        params,
        function (this: sqlite3.RunResult, err: Error | null) {
          if (err) {
            reject(err)
          }
          resolve(this)
        },
      )
    })
  }
}
