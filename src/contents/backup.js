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
  getBucket,
  groupJson,
} = require("@pittica/google-cloud-storage-helpers")
const {
  getDataset,
  jobDone,
  getTable,
} = require("@pittica/google-bigquery-helpers")
const log = require("@pittica/logger-helpers")
const { format } = require("date-and-time")

/**
 * Creates a backup for a BigQuery dataset to Google Cloud Storage bucket.
 *
 * @param {string} id BigQuery dataset ID.
 * @param {string} bucket Bucket name.
 * @param {string} projectId Google Cloud project ID.
 * @param {string} dateFormat Date format string.
 * @returns {boolean} A value indicating whehter the job has been done.
 */
exports.backup = async (
  id,
  bucket,
  projectId = null,
  dateFormat = "YYYY-MM-DD"
) => {
  const dataset = await getDataset(id, { projectId })
  const [tables] = await dataset.getTables()
  const date = format(new Date(), dateFormat)

  return await exports.extract(
    bucket,
    date,
    tables,
    0,
    dataset.metadata.location,
    projectId
  )
}

/**
 * Extracts a table from BigQuery to Google Cloud Storage.
 *
 * @param {string} bucket Bucket name.
 * @param {string} date Date in format YYYY-MM-DD.
 * @param {Array} tables An array of BigQuery tables.
 * @param {number} index Array index.
 * @param {string} location Location of the BigQuery dataset.
 * @param {string} projectId Google Cloud project ID.
 * @returns {boolean} A value indicating whehter the job has been done.
 */
exports.extract = async (
  bucket,
  date,
  tables,
  index = 0,
  location = "us-central1",
  projectId = null
) => {
  if (index < tables.length) {
    const table = tables[index]

    return await table
      .extract(
        getBucket(bucket, projectId).file(`${date}/${table.id}-*.json`),
        {
          location,
          format: "json",
          gzip: false,
        }
      )
      .then(async (response) => {
        if (jobDone(response)) {
          const [job] = response

          log.success(`Job backup "${job.id}" for table "${table.id}" done.`)

          return await exports.extract(
            bucket,
            date,
            tables,
            index + 1,
            location,
            projectId
          )
        } else {
          return false
        }
      })
      .catch((errors) => {
        log.error(errors)

        return false
      })
  } else {
    return true
  }
}

/**
 * Rollback data using backup.
 *
 * @param {string} date Date to download in format "YYYY-MM-DD".
 * @param {string} id BigQuery dataset ID.
 * @param {string} projectId Google Cloud project ID.
 * @param {string} sourceBucket Bucket name.
 * @param {string} destinationDataset BigQuery dataset ID.
 */
exports.rollback = async (
  date,
  id,
  projectId,
  sourceBucket,
  destinationDataset
) => {
  const dataset = await getDataset(id, { projectId })
  const bucket = getBucket(sourceBucket, projectId)
  const [response] = await bucket.getFiles({ prefix: `${date}/` })
  const files = groupJson(response.map((file) => file.name.substring(11)))

  log.info(`Begin rollback "${date}".`)

  Object.keys(files).forEach(async (key) => {
    const [table] = await dataset.table(key).get()

    files[key].forEach(async (filename) => {
      const destination = await getTable(destinationDataset, key, {
        projectId,
        location: dataset.metadata.location,
      })

      await destination.load(bucket.file(`${date}/${filename}`), {
        sourceFormat: "NEWLINE_DELIMITED_JSON",
        schema: table.metadata.schema,
        timePartitioning: table.metadata.timePartitioning,
        location: table.metadata.location,
        tableConstraints: table.metadata.tableConstraints,
        partitionDefinition: table.metadata.partitionDefinition,
      })
    })
  })
}
