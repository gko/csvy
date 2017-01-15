const assert = require('assert');
const convert = require('../index.js');
const read = require('fs').readFileSync;
const exec = require('child_process').execSync;

describe('Converting', () => {
  it('empty convert', () => {
    assert.equal(convert({}), "")
  })

  it('empty array convert', () => {
    assert.equal(convert([]), "")
  })

  it('simple object convert', () => {
    assert.equal(convert('{"a": 1, "b": 2}'), '"a","b"\n"1","2"')
  })

  it('simple array convert with different keys', () => {
    assert.equal(convert('[{"a": 1}, {"b": 2}, {"c":3}, {"d":4}]'),
      '"a","b","c","d"\n"1","","",""\n"","2","",""\n"","","3",""\n"","","","4"')
  })

  it('custom delimiter', () => {
    assert.equal(convert('[{"a": 1}, {"b": 2}, {"c":3}, {"d":4}]', {delimiter: ';'}),
      '"a";"b";"c";"d"\n"1";"";"";""\n"";"2";"";""\n"";"";"3";""\n"";"";"";"4"')
  })

  it('custom delimiter with an object', () => {
    assert.equal(convert('{"a": 1, "b": 2, "c":3, "d":4}', {delimiter: ';'}),
      '"a";"b";"c";"d"\n"1";"2";"3";"4"')
  })

  it('convert point within a key', () => {
    assert.equal(convert('[{"a.b": 1}, {"b": 2}, {"c":3}, {"d":4}]'),
      '"a.b","b","c","d"\n"1","","",""\n"","2","",""\n"","","3",""\n"","","","4"')
  })

  it('complexe object convert', () => {
    assert.equal(convert('{"a": 1, "b": 2, "c": [{"d": 5}, {"e": [{"f": 7}]}]}'),
      '"a","b","c.0.d","c.1.e.0.f"\n"1","2","5","7"')
  })

  it('complexe array of objects', () => {
    assert.equal(convert(read(__dirname + '/test.json', 'utf8')),
      read(__dirname + '/test.csv', 'utf8'))
  })

  it('complexe yaml array of objects', () => {
    assert.equal(convert(read(__dirname + '/test.yml', 'utf8')),
      read(__dirname + '/test.csv', 'utf8'))
  })
})

describe('cli', () => {
  it('empty convert', () => {
    assert.equal(exec('echo "{}" | node ./bin/csvy').toString(), '\n')
  })

  it('empty array convert', () => {
    assert.equal(exec('echo "[]" | node ./bin/csvy').toString(), '\n')
  })

  it('simple object convert', () => {
    assert.equal(exec(`echo '{"a": 1, "b": 2}' | node ./bin/csvy`).toString(), '"a","b"\n"1","2"\n')
  })

  it('custom delimiter', () => {
    assert.equal(exec(`echo '{"a": 1, "b": 2}' | node ./bin/csvy -d ';'`).toString(), '"a";"b"\n"1";"2"\n')
  })

  it('convert from file', () => {
    assert.equal(exec(`node ./bin/csvy ./test/test2.json`).toString(), '"a","b"\n"1","2"\n')
  })

  it('write result to file', () => {
    exec(`node ./bin/csvy ./test/test2.json -o ./test/test.tmp.csv`)
    assert.equal(read(__dirname + '/test.tmp.csv'), '"a","b"\n"1","2"')
  })
})
