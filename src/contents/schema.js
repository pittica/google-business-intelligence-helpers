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

const fs = require("fs")
const path = require("path")
const { getTables } = require("@pittica/google-bigquery-helpers")

/**
 * Maps and imports the contents of the given folder.
 *
 * @param {string} folder Path of the folder to scan.
 * @returns The contents of the given folder.
 */
exports.getSchemas = (folder) => {
  const map = {}

  fs.readdirSync(folder).forEach((file) => {
    const filename = file.split(".").slice(0, -1).join(".")
    map[filename] = require(path.join(folder, file))
  })

  return map
}

/**
 * Returns the content related to the given name.
 *
 * @param {string} name Filename without extension.
 * @param {string} folder Path of the folder to scan.
 * @returns {object} The content related to the given name.
 */
exports.getSchema = (name, folder) => {
  const contents = exports.getSchemas(folder)

  return Object.keys(contents).includes(name) ? contents[name] : null
}

/**
 * Gets the keys of the contents in the given folder.
 *
 * @param {string} folder Path of the folder to scan.
 * @returns The keys of the contents in the given folder.
 */
exports.getSchemaKeys = (folder) =>
  fs.readdirSync(folder).map((file) => file.split(".").slice(0, -1).join("."))

/**
 * Determines whether the given name has an associated content.
 *
 * @param {string} name Filename without extension.
 * @param {string} folder Path of the folder to scan.
 * @returns {boolean} A value indicating whether the given name has an associated content.
 */
exports.hasSchema = (name, folder) =>
  exports.getSchemaKeys(folder).includes(name)

/**
 * Downloads the schemas of a dataset.
 *
 * @param {string} output Path to save files.
 * @param {string} id The dataset name from which to download schemas.
 * @param {string} projectId The project ID to which the dataset belongs.
 */
exports.downloadSchemas = async (output, id, projectId = null) => {
  const tables = await getTables(id, { projectId })

  tables.forEach(
    async ({
      dataset,
      metadata: {
        tableReference: { tableId },
      },
    }) => {
      const [table] = await dataset.table(tableId).get()

      const {
        schema,
        timePartitioning,
        tableConstraints,
        partitionDefinition,
      } = table.metadata

      fs.writeFileSync(
        path.join(output, `${tableId}.json`),
        JSON.stringify({
          schema,
          timePartitioning,
          tableConstraints,
          partitionDefinition,
        }),
        "utf8"
      )
    }
  )
}
