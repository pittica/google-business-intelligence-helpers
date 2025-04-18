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
  getStorage,
  getFiles,
  deleteFile,
} = require("@pittica/google-cloud-storage-helpers")
const { hasSchema } = require("../contents/schema")
const { splitName } = require("../naming/split")

/**
 * Removes all not allowed files in given bucket.
 *
 * @param {string} bucket Bucket name.
 * @param {string} folder Path of the local folder to scan for schemas.
 * @returns {void}
 */
exports.scriptUnlistened = async (bucket, folder) => {
  if (bucket) {
    const storage = getStorage()
    const [files] = await getFiles(storage, bucket)

    files.forEach((file) => {
      const { name } = splitName(file.id)

      if (!hasSchema(name, folder)) {
        deleteFile(file)
      }
    })
  }
}
