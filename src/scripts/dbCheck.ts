import sqlite3 from "sqlite3"
import url from "node:url"
import path from "node:path"

/**
 * Outputs information for all stored certificate information
 */
const filePath = url.fileURLToPath(import.meta.url)
const scriptDir = path.dirname(filePath)
const dataPath = path.join(scriptDir, "../../data/")
const dbPath = path.join(dataPath, "internal.db")
const db = new sqlite3.Database(dbPath)

// omitting image because of data URLs
const select =
  "SELECT id, date, subject, student_name, signature_name FROM certificates"
db.all(select, function (err, rows) {
  for (let row of rows) {
    console.log(JSON.stringify(row))
  }
})
