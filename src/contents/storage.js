// Copyright 2024-2026 Pittica S.r.l.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const {
  getFiles,
  downloadFolder,
  groupJson,
  getBucket,
} = require("@pittica/google-cloud-storage-helpers")
const log = require("@pittica/logger-helpers")
const { format, parse } = require("date-and-time")
const path = require("path")
const fs = require("fs")
const { getSchemaKeys } = require("./schema")
const { splitName } = require("../naming/split")
const { incrementFilenameVersion } = require("../naming/file")

/**
 * Maps Google Cloud Storage response.
 *
 * @param {Array} response Google Cloud Storage response.
 * @param {string} schemas Schema files folder path.
 * @returns {object} Mapped response.
 */
exports.mapStorageResponse = (response, schemas = "") => {
  const files = {}

  if (schemas) {
    getSchemaKeys(schemas).map((key) => (files[key] = []))
  }

  response.flat(3).forEach(({ id }) => {
    if (id) {
      const filename = splitName(id)

      if (typeof files[filename.name] !== "undefined") {
        files[filename.name].push(id)
      }
    }
  })

  return Object.values(files)
    .flat(1)
    .map((file) => splitName(file))
}

/**
 * Maps the given response and returns grouped and ordered object to import.
 *
 * @param {Array} response Google Cloud Storage response.
 * @param {string} schemas Schema files folder path.
 * @param {string} dateFormat Format string.
 * @returns {object} Bucket files.
 */
exports.extractStorageResponse = (
  response,
  schemas = "",
  dateFormat = "YYYY-MM-DD"
) => {
  const days = {}
  const files = exports.mapStorageResponse(response, schemas)

  files.forEach((file) => {
    const date = format(file.date, dateFormat)

    if (typeof days[date] === "undefined") {
      days[date] = []
    }

    days[date].push(file)
  })

  return Object.values(
    Object.keys(days)
      .sort()
      .reduce((obj, key) => {
        obj[key] = days[key]

        return obj
      }, {})
  ).flat()
}

/**
 * Ritrieves a safe name of a file in the given folder in the given bucket.
 *
 * @param {Storage} storage Google Cloud Storage object.
 * @param {string} bucket Bucket name.
 * @param {string} filename File name.
 * @param {string} folder Google Storage folder path.
 * @returns {object} A safe name of a file in the given folder in the given bucket.
 */
exports.getSafeFilename = (storage, bucket, filename, folder = "") =>
  getFiles(storage, bucket, folder ? `${folder}/${filename}` : filename).then(
    (response) => {
      const file = response
        .flat(3)
        .filter((value) => value && typeof value.name !== "undefined")
        .map(({ name }) =>
          folder ? name.replace(new RegExp(`^${folder}\/`, "gs"), "") : name
        )
        .slice(-1)
        .pop()

      return typeof file !== "undefined" && file
        ? incrementFilenameVersion(splitName(file))
        : splitName(filename)
    }
  )

/**
 * Ritrieves a safe name of a file in the given folder in the given bucket.
 *
 * @param {Bucket} bucket Bucket.
 * @param {string} filename File name.
 * @param {string} folder Google Storage folder path.
 * @returns {object} A safe name of a file in the given folder in the given bucket.
 */
exports.getSafeFilenameFromBucket = (
  { storage, name },
  filename,
  folder = ""
) => exports.getSafeFilename(storage, name, filename, folder)

/**
 * Merges the files from a date and saves them in a local folder.
 *
 * @param {string} date Date to download in given format.
 * @param {string} output Path to save files.
 * @param {string} bucket Bucket name.
 * @param {string} dateFormat Date format string.
 */
exports.implode = async (date, output, bucket, dateFormat = "YYYY-MM-DD") => {
  const folder = format(parse(date, dateFormat), dateFormat)
  const destination = path.join(output, ".tmp")
  const temporary = path.join(destination, folder)

  await downloadFolder(folder, bucket, destination)
    .then(() =>
      log.info(`Downloaded "gs://${bucket}/${folder}" to "${destination}".`)
    )
    .catch(log.error)

  const files = groupJson(fs.readdirSync(temporary))

  Object.keys(files).forEach((table) => {
    const json = []

    files[table].forEach((current) => {
      const content = []

      fs.readFileSync(path.join(temporary, current), { encoding: "utf8" })
        .split("\n")
        .forEach((line) => {
          if (line) {
            const result = JSON.parse(`[${line}]`)

            return content.push(result[0])
          }
        })

      json.push(content)
    })

    fs.writeFileSync(
      path.join(output, `${table}.json`),
      JSON.stringify(json.flat(1)),
      "utf8"
    )
  })

  fs.rmSync(destination, { recursive: true, force: true })

  log.success(`JSON files created in "${output}".`)
}

/**
 * Erases the bucket.
 *
 * @param {string} bucket Bucket name.
 * @param {number} days Number of days to keep.
 * @returns {boolean} A value indicating whehter the job has been done.
 */
exports.erase = async (bucket, days = process.env.BACKUP_KEEP_DAYS || 3) => {
  const b = getBucket(bucket)

  const [files] = await b.getFiles()
  const result = {}

  files.forEach(({ id }) => {
    const split = id.split(/^(\d{4})\-(\d{2})\-(\d{2})/gis)

    result[`${split[1]}-${split[2]}-${split[3]}`] = null
  })

  const folders = Object.keys(result).sort()
  const blacklist = folders.slice(0, folders.length - parseInt(days))

  await Promise.all(
    blacklist.map(async (prefix) => await b.deleteFiles({ prefix }))
  )

  log.success("Backup bucket erased.")

  return true
}
