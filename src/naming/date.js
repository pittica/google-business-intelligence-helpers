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

/**
 * Converts the file name parts to a date object.
 *
 * @param {Array} parts String array from regular expression split representing a date from file name.
 * @returns {Date} The date from the given array.
 */
exports.partsToDate = (parts) =>
  new Date(parseInt(parts[1]), parseInt(parts[2]) - 1, parseInt(parts[3]))

/**
 * Extracts a date from the given date representation.
 *
 * @param {string} date Date in string format YYYY-MM-DD.
 * @returns {Date} A date from the given date representation.
 */
exports.stringToDate = (date) => {
  const split = date.split(/^(\d{4})\-(\d{2})\-(\d{2})$/gis)

  if (split.length === 5) {
    return this.partsToDate(split)
  }

  return null
}
