# bible-reference-validator

> Validates Bible references and returns an OSIS reference

## Installation

```
npm install --save bible-reference-validator
```

## Usage

```javascript
var validateRef = require('bible-reference-validator');

var myRef = validateRef('John 3:16');
// { osis: 'John.3.16' }

var myRefRange = validateRef('1 Corinthians 13:4-7');
// { isRange: true, osisStart: '1Cor.13.4', osisEnd: '1Cor.13.7' }

var myRefInvalid = validateRef('Hezekiah 6:2');
// { invalid: 'book name' }

var myRefOutOfRange = validateRef('James 100:10');
// { invalid: 'out of range' }
```
