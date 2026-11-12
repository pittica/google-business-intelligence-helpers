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

const { splitName } = require("./split")
const { mergeFiledata } = require("./file")

/**
 * Processes filenames safely based on the provided configuration.
 *
 * @param {Array} files Array of file objects.
 * @param {Array} configuration Array of allowed filenames.
 * @returns {Array} Array of processed filenames.
 * @since 1.17.0
 */
exports.safeFilenamesProcess = (files, configuration = []) =>
  files
    .map((file) => splitName(file))
    .filter((file) => configuration.includes(file.name))
    .map((file) => mergeFiledata(file))
