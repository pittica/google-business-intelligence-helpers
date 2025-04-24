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

const {
  getSchemas,
  getSchema,
  getSchemaKeys,
  hasSchema,
} = require("./contents/schema")
const { getSqlFilePath } = require("./contents/sql")
const {
  mapStorageResponse,
  extractStorageResponse,
  getSafeFilename,
  getSafeFilenameFromBucket,
} = require("./contents/storage")
const {
  getTemporaryTableName,
  getTemporaryTableSuffix,
} = require("./naming/dataset")
const { partsToDate, stringToDate } = require("./naming/date")
const { isDataCsv } = require("./naming/schema")
const {
  getFilenameVersion,
  incrementFilenameVersion,
  getJsonStorageName,
  createFilename,
  mergeFilename,
  mergeFiledata,
} = require("./naming/file")
const { splitName, splitIdByKeys } = require("./naming/split")
const { scriptUnlistened } = require("./scripts/unlistened")

exports.getSchemas = getSchemas
exports.getSchema = getSchema
exports.getSchemaKeys = getSchemaKeys
exports.hasSchema = hasSchema
exports.getSqlFilePath = getSqlFilePath
exports.mapStorageResponse = mapStorageResponse
exports.extractStorageResponse = extractStorageResponse
exports.getSafeFilename = getSafeFilename
exports.getSafeFilenameFromBucket = getSafeFilenameFromBucket
exports.getTemporaryTableName = getTemporaryTableName
exports.getTemporaryTableSuffix = getTemporaryTableSuffix
exports.partsToDate = partsToDate
exports.stringToDate = stringToDate
exports.isDataCsv = isDataCsv
exports.getFilenameVersion = getFilenameVersion
exports.incrementFilenameVersion = incrementFilenameVersion
exports.getJsonStorageName = getJsonStorageName
exports.createFilename = createFilename
exports.mergeFilename = mergeFilename
exports.mergeFiledata = mergeFiledata
exports.splitName = splitName
exports.splitIdByKeys = splitIdByKeys
exports.scripts = {
  unlistened: scriptUnlistened,
}
