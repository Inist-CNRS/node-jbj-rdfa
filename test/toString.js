/*jshint node:true, laxcomma:true */
/* global describe, it */
'use strict';
var assert = require('assert');
var JBJ = require('jbj');
var examples = require('./toString.json');

JBJ.use(require('../src/'));


describe('RDFa toString', function () {
  Object.keys(examples).forEach(function (example) {
    it(example, function (done) {
      var input      = examples[example].input;
      var stylesheet = examples[example].stylesheet;
      var expected   = examples[example].expected;
      JBJ.render(stylesheet, input, function (err, output) {
        assert.deepEqual(output.toString(), expected);
        done(err);
      });
    });
  });
});
