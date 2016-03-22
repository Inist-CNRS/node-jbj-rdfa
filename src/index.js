import * as assert  from 'assert';
const clone = require('clone');

module.exports = function rdfa(exec, execmap) {
  const filters = {};

  /**
   * Get the value of the field which URI is given in parameter,
   * and declared in the @content part of the JSON-LD
   *
   * @param  {Object}   input
   * @param  {String}   arg   URI of the field
   * @param  {function} next  callback(err,res) to trigger next action in
   *                          stylesheet
   */
  filters.content = (input, arg, next) => {
    exec(arg, arg => {
      const context = input["@context"];
      let   fieldName;
      for (let _fieldName in context) {
        if (context[_fieldName]["@id"] === arg) {
          fieldName = _fieldName;
          break;
        }
      }
      if (!fieldName) {
        return next(new Error("URI not found"));
      }
      const res = {
        uri:arg,
        content:input[fieldName]
      }
      return next(null, res);
    }, "content");
  }

  /**
   * Add inline CSS style
   *
   * @param  {Object}   input
   * @param  {Object}   arg   {css-property:css-value}
   * @param  {function} next  callback(err,res) to trigger next action in
   *                          stylesheet
   */
  filters.style = (input, arg, next) => {
    exec(arg, arg => {
      assert.equal(typeof(input),"object");
      assert.equal(typeof(arg),"object");
      const res = clone(input);
      let style = "";
      style = Object.keys(arg)
        .map(property => property + ": " + arg[property]);
      res.style = style.join('; ');
      return next(null, res);
    }, "style");
  }

  /**
   * Add one or several classes
   *
   * @param  {Object}   input
   * @param  {Array|String}   arg   class(es)
   * @param  {function} next  callback(err,res) to trigger next action in
   *                          stylesheet
   */
  filters.class = (input, arg, next) => {
    exec(arg, arg => {
      const res = clone(input);
      if (Array.isArray(arg)) {
        res.classes = arg.join(' ');
      }
      else {
        res.classes = arg;
      }
      return next(null, res);
    }, "class");
  }

  /**
   * Add a tag
   *
   * @param  {Object}   input
   * @param  {String}   arg   tag name
   * @param  {function} next  callback(err,res) to trigger next action in
   *                          stylesheet
   */
  filters.tag = (input, arg, next) => {
    exec(arg, arg => {
      const res = clone(input);
      res.tag = arg;
      return next(null, res);
    }, "tag");
  }

  /**
   * Serialize the input to HTML+RDFa.
   * Used keys:
   * - uri
   * - content
   * - style
   * - tag
   * - classes
   *
   * @param  {Object}   input
   * @param  {Any}      arg   Not used
   * @param  {Function} next  callback(err,res) to trigger next action in
   *                          stylesheet
   */
  filters.toHtml = (input, arg, next) => {
    exec(arg, arg => {
      const {content="", tag="span", style="", classes="", uri} = input;
      let res = `<${tag} property="${uri}" style="${style}" class="${classes}">${content}</${tag}>`;
      return next(null, res);
    }, "toHtml");
  }

  return filters;
}

