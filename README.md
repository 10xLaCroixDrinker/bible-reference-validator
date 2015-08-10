# bible-reference-validator

> Validates Bible references and returns an OSIS reference

## Installation

```
npm install --save bible-reference-validator
```

## Usage

```javascript
var ValidateRef = require('bible-reference-validator');

var myRef = new ValidateRef('John 3:16');
// { osis: 'John.3.16' }

var myRefRange = new ValidateRef('1 Corinthians 13:4-7');
// { isRange: true, osisStart: '1Cor.13.4', osisEnd: '1Cor.13.7' }

var myRefInvalid = new ValidateRef('Hezekiah 6:2');
// { invalid: 'book name' }
```
