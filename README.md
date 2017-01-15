# CSVy
![build](https://travis-ci.org/gko/csvy.svg?branch=master)

yaml/json → csv

## Installation

```bash
npm i csvy -g
```

## Usage

```bash
Usage: csvy [options]

yaml/json converter to csv

Options:

    -h, --help                   output usage information
  
    -V, --version                output the version number
  
    -d, --delimiter <delimiter>  delimiter symbol
  
    -o, --output <file>          output file
```

examples:
```bash
csv -o test.csv ./test.json
```

```bash
curl -L https://raw.githubusercontent.com/gko/csvy/master/test/test.yml | csvy
```

You can also use it from node:

```javascript
const convert = require('csvy');

convert(`{"a":1}`, {delimiter: ';'})
```

## Tests

To run tests you simply need to do:
```bash
npm run test
```

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2016 Konstantin Gorodinskiy
