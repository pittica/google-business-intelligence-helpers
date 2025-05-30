// Copyright 2024-2025 Pittica S.r.l.
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

const { getFiles } = require("@pittica/google-cloud-storage-helpers")
const { format } = require("date-and-time")
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
  const files = this.mapStorageResponse(response, schemas)

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
        .filter(({ name }) => typeof name !== "undefined")
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
) => this.getSafeFilename(storage, name, filename, folder)
