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

const { implode, erase } = require("../contents/storage")

/**
 * Merges the files from a date and saves them in a local folder.
 *
 * @param {string} date Date to download in given format.
 * @param {string} output Path to save files.
 * @param {string} bucket Bucket name.
 * @param {string} dateFormat Date format string.
 */
exports.scriptImplode = implode

/**
 * Erases the bucket.
 *
 * @param {string} bucket Bucket name.
 * @param {number} days Number of days to keep.
 * @returns {boolean} A value indicating whehter the job has been done.
 */
exports.scriptErase = erase
