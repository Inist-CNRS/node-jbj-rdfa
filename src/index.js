import * as assert  from 'assert';
const clone = require('clone');

module.exports = function rdfa(exec, execmap) {
  const filters = {};

  const htmlToString = function() {
    const {content="", tag="span", language="", style="", classes="", uri} = this;
    let res = `<${tag}` +
            (uri      ? ` property="${uri}"`  : '') +
            (language ? ` lang="${language}"` : '') +
            (style    ? ` style="${style}"`   : '') +
            (classes  ? ` class="${classes}"` : '') +
            `>${content}</${tag}>`;
    return res;
  }

  /**
   * Get the value of the field which URI is given in parameter,
   * and declared in the @content part of the JSON-LD
   *
   * @param  {Object}   input
   * @param  {String}   arg   URI of the field, or [URI, lang]
   * @param  {function} next  callback(err,res) to trigger next action in
   *                          stylesheet
   */
  filters.getJsonLdField = (input, arg, next) => {
    exec(arg, arg => {
      if (!input) {
        return next(null, null);
      }
      const uri     = Array.isArray(arg) ? arg[0] : arg;
      let   lang    = Array.isArray(arg) ? arg[1] : null;
      const context = input["@context"];
      let   fieldName;
      for (let _fieldName in context) {
        if (context[_fieldName]["@id"] === uri) {
          if (!lang) {
            fieldName = _fieldName;
            lang      = context[_fieldName]["@language"];
            break;
          }
          if (context[_fieldName]["@language"] === lang) {
            fieldName = _fieldName;
            break;
          }
        }
      }
      if (!fieldName) {
        return next(undefined);
      }
      const res = {
        uri:uri,
        content:input[fieldName]
      }
      if (lang) {
        res.language = lang;
      }
      Object.defineProperty(res, 'toString', { value: htmlToString, enumerable: false });
      return next(null, res);
    }, "getJsonLdField");
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
      Object.defineProperty(res, 'toString', { value: htmlToString, enumerable: false });
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
      Object.defineProperty(res, 'toString', { value: htmlToString, enumerable: false });
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
      Object.defineProperty(res, 'toString', { value: htmlToString, enumerable: false });
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
      return next(null, htmlToString.apply(input));
    }, "toHtml");
  }

  return filters;
}

