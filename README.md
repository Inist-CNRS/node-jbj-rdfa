# JBJ RDFa module

[![bitHound Overall Score](https://www.bithound.io/github/Inist-CNRS/node-jbj-rdfa/badges/score.svg)](https://www.bithound.io/github/Inist-CNRS/node-jbj-rdfa)
[![Travis-CI](https://img.shields.io/travis/Inist-CNRS/node-jbj-rdfa.svg "Travis-CI")](https://travis-ci.org/Inist-CNRS/node-jbj-rdfa)
[![Code Coverage](https://img.shields.io/codecov/c/github/Inist-CNRS/node-jbj-rdfa.svg "Code Coverage")](https://codecov.io/github/Inist-CNRS/node-jbj-rdfa)

JBJ RDFa is a [JBJ](https://github.com/Inist-CNRS/node-jbj) module 
to generate [HTML + RDFa](https://www.w3.org/TR/xhtml-rdfa-primer/) 
from a [JSON-LD](http://json-ld.org/).

## Contributors

  * [François Parmentier](https://github.com/parmentf)

## Installation

```bash
$ npm install jbj-rdfa
```

## Usage

This JBJ module cannot be used alone. JBJ has to be installed.

```js
var JBJ = require('jbj');
JBJ.use(require('jbj-rdfa'));
```

But, the first aim of this JBJ module is to be used as a template engine
filter:

```html
<li>Label: {{_content.jsonld|getJsonLdField(["http://www.w3.org/2004/02/skos/core#prefLabel","fr"])}}</li>
```

In the above example, a template variable `_content`, containing a `jsonld`
key, pointing to a JSON-LD object, can be filtered using the JBJ actions
`getJsonLdField`, here.

You can pipe several JBJ filters: `{{_content.jsonld | getJsonLdField(["http://www.w3.org/2004/02/skos/core#prefLabel", "fr"]) | style({"color": "red"}) | class("label") | tag("p")}}` which should give, using [nunjucks](http://mozilla.github.io/nunjucks/) or [ejs](http://www.embeddedjs.com/):

```html
<p property="http://www.w3.org/2004/02/skos/core#prefLabel" lang="fr" style="color: red" class="label">Le libellé préférentiel en question</p>
```

You can see a complete example in the [LODEX project](https://github.com/Inist-CNRS/lodex/blob/26c3d676f274056f05246fd38753cba6ffbe2b77/views/item.html#L18-L20).

## Tests

Use [mocha](https://github.com/visionmedia/mocha) to run the tests.

```bash
$ npm install
$ npm test
```

## Actions

Once the module is declared as used for JBJ, you can use the following actions:

<a id="getJsonLdField"></a>
### getJsonLdField: URI | [URI, language]

Get the value of the field which URI is given in parameter, and declared in the
`@content` part of the JSON-LD.

Input:
```json
{
    "@id": "http://article-type.lod.istex.fr/=/research-article",
    "@context": {
        "c2": {
            "@id": "http://www.w3.org/2008/05/skos-xl#prefLabel",
            "@language": "en"
        },
        "c3": {
            "@id": "http://www.w3.org/2008/05/skos-xl#prefLabel",
            "@language": "fr"
        },
        "c4": {
            "@id": "http://www.w3.org/2004/02/skos/core#definition",
            "@language": "en"
        },
        "c5": {
            "@id": "http://www.w3.org/2004/02/skos/core#definition",
            "@language": "fr"
        },
        "_wid": {
            "@id": "http://purl.org/dc/elements/1.1/identifier",
            "@language": null
        }
    },
    "c2": "research article",
    "c3": "papier de recherche",
    "c4": "Article reporting on primary research (The related value “review-article” describes a literature review, research summary, or state-of-the-art article.)",
    "c5": "Article relatif à une recherche initiale",
    "_wid": "research-article"
}
```

Stylesheet:
```json
{
    "getJsonLdField": "http://www.w3.org/2004/02/skos/core#definition"
}
```

Output:
```json
{
    "uri": "http://www.w3.org/2004/02/skos/core#definition",
    "content": "Article reporting on primary research (The related value “review-article” describes a literature review, research summary, or state-of-the-art article.)",
    "language": "en"
}
```

When the `language` is given, only the matching value will be returned.

Input:
```json
{
    "@id": "http://article-type.lod.istex.fr/=/research-article",
    "@context": {
        "c2": {
            "@id": "http://www.w3.org/2008/05/skos-xl#prefLabel",
            "@label": "Libellé anglais",
            "@language": "en"
        },
        "c3": {
            "@id": "http://www.w3.org/2008/05/skos-xl#prefLabel",
            "@label": "Libellé français",
            "@language": "fr"
        }
    },
    "c2": "research article",
    "c3": "papier de recherche"
}
```

Stylesheet:
```json
{
    "getJsonLdField": [
        "http://www.w3.org/2008/05/skos-xl#prefLabel",
        "fr"
    ]
}
```

Output:
```json
{
    "uri": "http://www.w3.org/2008/05/skos-xl#prefLabel",
    "content": "papier de recherche",
    "language": "fr"
}
```

<a id="style"></a>
### style: CSS

Add *inline* CSS style.

Input:
```json
{
    "tag": "p"
}
```

Stylesheet:
```json
{
    "style": {
        "font-weight": "bold"
    }
}
```

Output:
```json
{
    "tag": "p",
    "style": "font-weight: bold"
}
```

<a id="class"></a>
### class: class | [class, ...]

Add one or several classes.

Input:
```json
{
    "tag": "div"
}
```

Stylesheet:
```json
{
    "class": "figure"
}
```

Output:
```json
{
    "tag": "div",
    "classes": "figure"
}
```

<a id="tag"></a>
### tag: name

Add a tag over the content.

Input:
```json
{
    "content": "Any string value"
}
```

Stylesheet:
```json
{
    "tag": "name"
}
```

Output:
```json
{
    "tag": "name",
    "content": "Any string value"
}
```

<a id="toHtml"></a>
### toHtml

Serializes the input to HTML+RDFa.
Used keys: `uri`, `content`, `language`, `style`, and `tag`.

Input:
```json
{
    "uri": "http://www.w3.org/2004/02/skos/core#definition",
    "content": "Any string value",
    "language": "en",
    "style": {
        "font-weight": "bold"
    },
    "class": ["show", "center"],
    "tag": "menu"
}
```

Stylesheet:
```json
{
    "toHtml": true
}
```

Output:
```json
"<menu property=\"http://www.w3.org/2004/02/skos/core#definition\" lang=\"en\" style=\"font-weight: bold\" class=\"show center\">Any string value</menu>"
```


## Examples

See unit tests : https://github.com/Inist-CNRS/node-jbj-rdfa/tree/master/test


## Try it

http://Inist-CNRS.github.io/jbj-playground/

(don't forget to click on RDFa button -- when it will exist)

## License

[MIT](https://github.com/Inist-CNRS/node-jbj-rdfa/blob/master/LICENSE)


