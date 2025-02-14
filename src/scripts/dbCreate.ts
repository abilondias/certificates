import sqlite3 from "sqlite3"
import url from "node:url"
import path from "node:path"
import fs from "node:fs"

/**
 * Creates the internal SQLite database file
 */
const filePath = url.fileURLToPath(import.meta.url)
const scriptDir = path.dirname(filePath)
const dataPath = path.join(scriptDir, "../../data/")
if (!fs.existsSync(dataPath)) {
  fs.mkdirSync(dataPath)
}
const dbPath = path.join(dataPath, "internal.db")
const db = new sqlite3.Database(dbPath)

db.serialize(() => {
  const createCertificatesTable = `
  CREATE TABLE IF NOT EXISTS certificates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    subject TEXT NOT NULL,
    signature_name TEXT NOT NULL,
    student_name TEXT NOT NULL,
    image TEXT NOT NULL
  );`

  db.run(createCertificatesTable, (err) => {
    if (err) {
      console.error("Failed to create table for certificates", err)
      return
    }

    console.log("Created certificates table")
  })
})
