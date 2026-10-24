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

const { backup, rollback } = require("../contents/backup")
const { erase } = require("../contents/storage")

/**
 * Creates a backup for a BigQuery dataset to Google Cloud Storage bucket.
 *
 * @param {string} id BigQuery dataset ID.
 * @param {string} bucket Bucket name.
 * @param {string} projectId Google Cloud project ID.
 * @param {string} dateFormat Date format string.
 * @returns {boolean} A value indicating whehter the job has been done.
 */
exports.scriptBackup = backup

/**
 * Creates a backup and erases the bucket.
 *
 * @param {string} id BigQuery dataset ID.
 * @param {string} bucket Bucket name.
 * @param {string} projectId Google Cloud project ID.
 * @param {number} days Number of days to keep.
 * @param {string} dateFormat Date format string.
 * @returns {boolean} A value indicating whehter the job has been done.
 */
exports.scriptBackupErase = async (
  id,
  bucket,
  projectId,
  days,
  dateFormat = "YYYY-MM-DD"
) =>
  await backup(id, bucket, projectId, dateFormat).then(
    async () => await erase(bucket, days)
  )

/**
 * Rollback data using backup.
 *
 * @param {string} date Date to download in format "YYYY-MM-DD".
 * @param {string} id BigQuery dataset ID.
 * @param {string} projectId Google Cloud project ID.
 * @param {string} sourceBucket Bucket name.
 * @param {string} destinationDataset BigQuery dataset ID.
 */
exports.scriptRollback = rollback
