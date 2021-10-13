"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var x = 5;
var y = 6;

var sampleFunction = function sampleFunction() {
  return "some return value";
};

var Person = function Person(name, age) {
  _classCallCheck(this, Person);

  this.name = name;
  this.age = age;
};

var hasThree = [1, 2, 3].includes(3);
console.log(hasThree);
