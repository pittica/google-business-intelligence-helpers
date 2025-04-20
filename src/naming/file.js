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

const { format } = require("date-and-time")

/**
 * Gets the version of a filename.
 *
 * @param {string} name Filename.
 * @returns {number} The version of a filename.
 */
exports.getFilenameVersion = (name) => {
  const split = name.split("_")
  const last = split.slice(-1).pop()
  const version = typeof last !== "undefined" ? parseInt(last) : 0

  return isNaN(version) ? 0 : version
}

/**
 * Increments the version of a filename in the given filedata.
 *
 * @param {object} filedata File data.
 * @returns {number} The given file data.
 */
exports.incrementFilenameVersion = (filedata) => {
  filedata.version =
    typeof filedata.version !== "undefined" ? filedata.version + 1 : 1

  return filedata
}

/**
 * Gets the name of a JSON storage file.
 *
 * @param {Date} date Date object.
 * @param {string} file File name.
 * @returns {string} The name of a JSON storage file.
 */
exports.getJsonStorageName = (date, file) =>
  `${format(date, "YYYY-MM-DD")}/${format(date, "YYYYMMDDHHmmss")}-${file}.json`

/**
 * Generates a filename from the givend data.
 *
 * @param {object} filedata File data.
 * @returns {string} A filename from the givend data.
 */
exports.createFilename = (filedata) =>
  `${format(filedata.date, "YYYY-MM-DD")}-${filedata.fullname}.${
    filedata.extension
  }`

/**
 * Merges the given filename parts.
 *
 * @param {Date} date File date.
 * @param {string} name File or function name.
 * @param {string} extension File extension.
 * @param {int} version File version.
 * @returns {string} The merged given filename parts.
 */
exports.mergeFilename = (date, name, extension, version = 0) =>
  `${format(date, "YYYY-MM-DD")}-${name}${version ? `_${version}` : ""}.${extension.toLowerCase()}`
