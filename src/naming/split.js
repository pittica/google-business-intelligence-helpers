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

const { getFilenameVersion } = require("./file")
const { partsToDate } = require("./date")

/**
 * Splits the given filename.
 *
 * @param {string} name Filename.
 * @returns {object} An object containing the splitted name.
 */
exports.splitName = (name) => {
  if (name) {
    const split = name.split(
      /^(\d{4})\-(\d{2})\-(\d{2})\-(([\w_-]+)(?:\_[0-9]+)|([\w_-]+))(?:\.(\w+))$/gis
    )

    if (split.length >= 8) {
      return {
        date: partsToDate(split),
        name: typeof split[5] !== "undefined" ? split[5] : split[6],
        fullname: typeof split[4] !== "undefined" ? split[4] : name,
        extension: split[7],
        match: true,
        version:
          typeof split[4] !== "undefined" ? getFilenameVersion(split[4]) : 0,
      }
    } else {
      return {
        date: new Date(),
        name,
        fullname: name,
        extension: /[.]/.exec(name) ? /[^.]+$/.exec(name) : undefined,
        match: false,
        version: getFilenameVersion(name),
      }
    }
  } else {
    return {
      date: new Date(),
      name: null,
      fullname: null,
      extension: undefined,
      match: false,
      version: 0,
    }
  }
}

/**
 * Splits an ID into an object.
 *
 * @param {string} id ID representation.
 * @param {array} keys An array of keys.
 * @returns {object} Sliced object of the given ID.
 */
exports.splitIdByKeys = (id, keys) => {
  const slices = {}

  id.split("_").forEach((value, index) => {
    if (typeof keys[index] !== "undefined") {
      slices[keys[index]] = parseInt(value)
    }
  })

  return slices
}
