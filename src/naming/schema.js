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

const { hasSchema } = require("../contents/schema")

/**
 * Determines whether the given file data matches the whitelist requirements.
 *
 * @param {object} data Filename data.
 * @param {string} folder Path of the folder to scan.
 * @returns {boolean} A value indicating whether the given file data matches the whitelist requirements.
 */
exports.isDataCsv = ({ match, extension, name }, folder) =>
  match &&
  extension &&
  extension.toLowerCase() === "csv" &&
  hasSchema(name, folder)
