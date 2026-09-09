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
  txtContentToArray,
  listFiles,
} = require("@pittica/google-cloud-storage-helpers")
const { stringToDateUTC } = require("../naming/date")
const { mergeFilename } = require("../naming/file")

/**
 * Compares the content of a file in a bucket with a given date to the files contained in the bucket.
 *
 * @param {string} bucket Bucket name.
 * @param {string} date Date to compare against.
 * @returns {Array} Array of files that are in the file but not in the bucket.
 */
exports.scriptComparison = async (bucket, date = null) => {
  if (bucket) {
    const day = date ? stringToDateUTC(date) : new Date()
    const filename = mergeFilename(day, "filelist", "txt")
    const content = await txtContentToArray(filename, bucket)
    const files = await listFiles(bucket)

    return content.filter((file) => !files.includes(file))
  }
}
