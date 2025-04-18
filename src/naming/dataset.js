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

const { format } = require("date-and-time")

/**
 * Gets the suffix of a temporary table.
 *
 * @param {Date} date Date.
 * @returns {string} The suffix of a temporary table.
 */
exports.getTemporaryTableSuffix = (date) => format(date, "YYYY-MM-DD")

/**
 * Gets the name of a temporary table.
 *
 * @param {object} filedata Filename data.
 * @param {string} prefix The prefix of a temporary table.
 * @returns {string} The name of a temporary table.
 */
exports.getTemporaryTableName = ({ date, name, version }, prefix) =>
  prefix + name + "-" + version + "-" + this.getTemporaryTableSuffix(date)
