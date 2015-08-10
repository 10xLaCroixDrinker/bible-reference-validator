var _ = require('underscore'),
    books = require('./data/books.json');

var ValidateRef = function (reference) {
  this.reference = reference;
  this.referenceObj = {};
  this.parsedObj = {};
  return this.parse(this.reference);
};

ValidateRef.prototype.getBook = function () {
  var self = this;

  this.book = _.find(books, function (book) {
    var re = new RegExp('\\b(' + book.name + '|' + book.abbr.join('|') + ')\\b', 'ig'),
        match = self.reference.match(re);
    if (match) self.bookMatch = match[0];
    return match;
  });
};

ValidateRef.prototype.getReferenceObj = function () {
  var reference = this.reference.replace(this.bookMatch, '').replace(/\s/g, '').split('-');

  var startRefArr = reference[0].split(':'),
      endRefArr;

  if (reference.length > 2 || startRefArr.length > 2) return false;

  if (reference.length === 2) endRefArr = reference[1].split(':');

  this.referenceObj.start = {
    chapter: startRefArr[0],
    verse: startRefArr[1]
  };

  if (endRefArr) {
    if (endRefArr.length > 2) return false;

    if (endRefArr.length === 1 && startRefArr[1]) {
      this.referenceObj.end = {
        chapter: this.referenceObj.start.chapter,
        verse: endRefArr[0]
      };
    } else {
      this.referenceObj.end = {
        chapter: endRefArr[0],
        verse: endRefArr[1]
      };
    }
  }
};

ValidateRef.prototype.chapterIsInRange = function (chapter) {
  return parseInt(chapter) <= this.book.chapters.length;
};

ValidateRef.prototype.verseIsInRange = function (verse, chapter) {
  return parseInt(verse) <= this.book.chapters[chapter - 1];
};

ValidateRef.prototype.checkRange = function () {
  if (!this.chapterIsInRange(this.referenceObj.start.chapter) || (this.referenceObj.start.verse && !this.verseIsInRange(this.referenceObj.start.verse, this.referenceObj.start.chapter))) {
    return false;
  }

  if (this.referenceObj.end) {
    if (!this.chapterIsInRange(this.referenceObj.end.chapter) || (this.referenceObj.end.verse && !this.verseIsInRange(this.referenceObj.end.verse, this.referenceObj.end.chapter))) {
      return false;
    }
  }

  return true;
};

ValidateRef.prototype.parse = function () {
  this.getBook();

  if (!this.book) {
    this.parsedObj.invalid = 'book name';
    return this.parsedObj;
  }

  this.getReferenceObj();

  if (!this.referenceObj) {
    this.parsedObj.invalid = 'reference';
    return this.parsedObj;
  }

  if (this.referenceObj.end) this.parsedObj.isRange = true;

  if (!this.checkRange()) {
    this.parsedObj.invalid = 'out of range';
    return this.parsedObj;
  }

  this.parsedObj.osisStart = this.book.osisId + '.' + this.referenceObj.start.chapter;
  if (this.referenceObj.start.verse) this.parsedObj.osisStart +=  '.' + this.referenceObj.start.verse;

  if (this.parsedObj.isRange) {
    this.parsedObj.osisEnd = this.book.osisId + '.' + this.referenceObj.end.chapter;
    if (this.referenceObj.end.verse) this.parsedObj.osisEnd += '.' + this.referenceObj.end.verse;
  } else {
    this.parsedObj.osis = this.parsedObj.osisStart;
    delete this.parsedObj.osisStart;
  }

  return this.parsedObj;
};

module.exports = ValidateRef;
