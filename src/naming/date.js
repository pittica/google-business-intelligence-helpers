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

const { format } = require("date-and-time")

/**
 * Converts the file name parts to a date object.
 *
 * @param {Array} parts String array from regular expression split representing a date from file name.
 * @returns {Date} The date from the given array.
 */
exports.partsToDate = (parts) =>
  new Date(parseInt(parts[1]), parseInt(parts[2]) - 1, parseInt(parts[3]))

/**
 * Converts the file name parts to an UTC date object.
 *
 * @param {Array} parts String array from regular expression split representing a date from file name.
 * @returns {Date} The UTC date from the given array.
 */
exports.partsToDateUTC = (parts) =>
  new Date(
    Date.UTC(parseInt(parts[1]), parseInt(parts[2]) - 1, parseInt(parts[3]))
  )

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

/**
 * Extracts an UTC date from the given date representation.
 *
 * @param {string} date Date in string format YYYY-MM-DD.
 * @returns {Date} An UTC date from the given date representation.
 */
exports.stringToDateUTC = (date) => {
  const split = date.split(/^(\d{4})\-(\d{2})\-(\d{2})$/gis)

  if (split.length === 5) {
    return this.partsToDateUTC(split)
  }

  return null
}

/**
 * Gets the current date in the given format.
 *
 * @param {string} dateFormat Format string.
 * @returns {string} The current date in the given format.
 */
exports.getNow = (dateFormat = "YYYY-MM-DD") =>
  this.formatDate(new Date(), dateFormat)

/**
 * Gets the given date in the given format.
 *
 * @param {Date} date Date object.
 * @param {string} dateFormat Format string.
 * @returns {string} The given date in the given format.
 */
exports.formatDate = (date, dateFormat = "YYYY-MM-DD") =>
  format(date, dateFormat)

/**
 * Gets the given date in the given format UTC.
 *
 * @param {Date} date Date object.
 * @param {string} dateFormat Format string.
 * @returns {string} The given date in the given UTC format.
 */
exports.formatDateUTC = (date, dateFormat = "YYYY-MM-DD") =>
  format(date, dateFormat, true)

/**
 * Gets the dates from the beginning of the year of the given date.
 *
 * @param {Date} until The day at the end of the loop.
 * @param {string} dateFormat Format string.
 * @returns {Array} The dates from the beginning of the year of the given date.
 */
exports.getDatesUntil = (until = new Date(), dateFormat = "YYYY-MM-DD") => {
  const dates = []
  const year = until.getUTCFullYear()
  let current = new Date(Date.UTC(year, 0, 1))

  while (current <= until && current.getUTCFullYear() === year) {
    dates.push(this.formatDateUTC(current, dateFormat))
    current.setUTCDate(current.getUTCDate() + 1)
  }

  return dates
}

/**
 * Gets the formatted date for the specified date or the previous day if no date is provided.
 *
 * @param {Date|string} date Date to format.
 * @param {string} dateFormat Format string.
 * @returns {string} Formatted date.
 */
exports.getFormattedDate = (date = null, dateFormat = "YYYY-MM-DD") => {
  if (date != null) {
    return this.formatDate(
      typeof date === "string" ? this.stringToDate(date) : date,
      dateFormat
    )
  } else {
    const now = this.stringToDate(this.getNow())
    now.setDate(now.getDate() - 1)

    return this.formatDate(now, dateFormat)
  }
}
