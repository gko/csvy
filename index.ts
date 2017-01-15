import * as YAML from 'js-yaml'

const isEmpty = (o: Object | Array<any>): boolean => {
  if (o instanceof Array) {
    return !o.length
  } else if (typeof o === "object") {
    return !Object.keys(o).length
  }
}

/**
 * get all keys from json
 * @param {Object | Array} o — object to crawl
 * @param {number} pKey — parent key
 */
const getKeys = (o: Object | Array<any>, pKey?: string): Set<string> => {
  if (!o) {
    return new Set();
  }
  
  let key: string
  let keys: Set<string> = new Set()

  for (let k in o) {
    key = pKey ? `${pKey}.${k}` : k;

    if (typeof o[k] === "object") {
      keys = new Set([...keys, ...getKeys(o[k], !pKey && o instanceof Array ? "" : key)])
    } else {
      keys.add(key)
    }
  }

  return keys
}

/**
 * Once we have keys array we need to match values
 * to generate final csv
 * @param {Object | Array} o — object to crawl
 * @param {Array} keys — keys to match
 * @param {number} pKey — parent key
 */
const getValues = (
  o: Object | Array<any> = null,
  keys: Array<string>,
  pKey?: string,
  values?: Array<string>
): Array<string> => {
  if (!o) {
    return [];
  }

  if (!values) {
    values = new Array(keys.length).fill(null)
  }

  let key: string

  for (let k in o) {
    key = pKey ? `${pKey}.${k}` : k;

    if (typeof o[k] === "object") {
      values = getValues(o[k], keys, key, values)
    } else if (keys.indexOf(key) >= 0) {
      values[keys.indexOf(key)] = o[k]
    }
  }

  return values
}

/**
 * replace quotes within items
 */
const addQuotes = (str: string): string => {
  // if el is undefined we make it an empty string otherwise
  // we make it a string
  return `"${('' + (str || "")).replace('"', '""')}"`
}

export = (input: string | Object, options?: Object): string => {
  let delimiter = options ? options['delimiter'] || ',' : ','
  let json: Object;
  let csv: string = "";

  if (typeof input === "string") {
    try {
      json = YAML.safeLoad(input)
    } catch(err) {
      throw new Error("error while parsing");
    }
  } else {
    json = input;
  }

  if (isEmpty(json)) {
    return csv;
  }

  let keys = Array.from(getKeys(json))
  let result: string = ``;
  result += keys.map(addQuotes).join(delimiter) + '\n'
  if (json instanceof Array) {
    result += json.map(json => getValues(json, keys).map(addQuotes).join(delimiter)).join('\n')
  } else {
    result += getValues(json, keys).map(addQuotes).join(delimiter)
  }

  return result
}
