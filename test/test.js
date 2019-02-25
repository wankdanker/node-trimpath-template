var test = require("tape");
var fs = require("fs");


//*********************************************************************************************************************
// Test with default trimpath tokens. { }
//*********************************************************************************************************************
var TrimPathTemplate = require("../");
test("test render call. (Single Curly Brace)", function (t) {
  var str = TrimPathTemplate.render("${name}", {name: "steve"});
  t.equal(str, "steve");
  t.end();
});

test("test compile call. (Single Curly Brace)", function (t) {
  var c = TrimPathTemplate.compile("${name}");

  var d = c({name: "steve"});

  t.equal(d, "steve");
  t.end();
});

test("test filters/modifiers. (Single Curly Brace)", function (t) {
  TrimPathTemplate.filters.toYesNo = function (val) {
    return val
      ? "yes"
      : "no";
  };

  var str1 = TrimPathTemplate.render("${good|toYesNo}", {good: true});
  var str2 = TrimPathTemplate.render("${good|toYesNo}", {good: false});

  t.equal(str1, "yes");
  t.equal(str2, "no");
  t.end();
});

test("test include files. (Single Curly Brace)", function (t) {
  var str1 = TrimPathTemplate.render("before {include ./test/test-include1.html} after", {name: "steve"});
  t.equal(str1, "before steve after");
  t.end();
});

test("test single curly braces.", function (t) {
  var data = {
    age: 21
    , name: "Jacob"
    , names: ["Joesph", "Jacob", "Dan"]
  }
  var html = '{if age == 35}You are ${age} years old.{/if}{if age == 21}You are ${age} years old.{/if}';
  var renderedHtml = TrimPathTemplate.render(html, data);
  var expectedOutput = "You are " +  data.age + " years old.";
  t.equal(renderedHtml, expectedOutput);
  
  fs.readFile("test/test-include3.html", "utf8", function(err, fileData){
    if(err){
      //console.log(err);
    }
    if(fileData){
      //console.log((TrimPathTemplate.render(fileData, data)));
    }
  });

  t.end();
});

//*********************************************************************************************************************
//Tests with double curly brace and pound sign tokens. {{# }}
//*********************************************************************************************************************

//Set custom tags.
var doubleTrimPathTemplate = TrimPathTemplate.config({
  OPENING: "{{"
  , CLOSING: "}}"
  , DISPLAY: ""
  , SPECIAL: "#"
});

test("test render call. (Double Curly Brace)", function (t) {
  var str = doubleTrimPathTemplate.render("{{name}}", {name: "steve"});
  t.equal(str, "steve");
  t.end();
});

test("test compile call. (Double Curly Brace)", function (t) {
  var c = doubleTrimPathTemplate.compile("{{name}}");

  var d = c({name: "steve"});

  t.equal(d, "steve");
  t.end();
});

test("test filters/modifiers. (Double Curly Brace)", function (t) {
  doubleTrimPathTemplate.filters.toYesNo = function (val) {
    return val
      ? "yes"
      : "no";
  };

  var str1 = doubleTrimPathTemplate.render("{{good|toYesNo}}", {good: true});
  var str2 = doubleTrimPathTemplate.render("{{good|toYesNo}}", {good: false});

  t.equal(str1, "yes");
  t.equal(str2, "no");
  t.end();
});

test("test include files. (Double Curly Brace)", function (t) {
  var str1 = doubleTrimPathTemplate.render("before {{include ./test/test-include2.html}} after", {hairColor: "Brown"});
  t.equal(str1, "before Brown after");
  t.end();
});

test("test double curly braces with pound signs.", function (t) {
  var data = {
    age: 21
    , name: "Jacob"
    , likes: ["Programming", "Videogames", "Washing Dishes", "Game of Thrones"]
    , hairColor: "Brown"
  }
  var html = '{{#if age == 35}}You are {{age}} years old.{{/if}}{{#if age == 21}}You are {{age}} years old.{{/if}}';
  var renderedHtml = doubleTrimPathTemplate.render(html, data);
  var expectedOutput = "You are " +  data.age + " years old.";
  t.equal(renderedHtml, expectedOutput);
  

    fs.readFile("test/test-include4.html", "utf8", function(err, fileData){
    if(err){
      //console.log(err);
    }
    if(fileData){
      //console.log((doubleTrimPathTemplate.render(fileData, data)));
    }
  });

  t.end();
});

//*********************************************************************************************************************
//Test with double curly brace and nothing for display and # for speical. {{#if name='Jacob'}} and {{name}}
//*********************************************************************************************************************

//Set custom tags.
var custom1TrimPathTemplate = TrimPathTemplate.config({
  OPENING: "{{"
  , CLOSING: "}}"
  , DISPLAY: ""
  , SPECIAL: "#"
});

test("test include files. (Double Curly Brace, no display, # for special.)", function (t) {
  var str1 = custom1TrimPathTemplate.render("{{#if language == 'JavaScript'}}My favorite programming langague is JavaScript by {{name}}{{/if}}", {language: "JavaScript", name: "Jacob"});
  t.equal(str1, "My favorite programming langague is JavaScript by Jacob");
  t.end();
});

//*********************************************************************************************************************
//Test with double curly brace and * for display tokens. {{ }} and *{{ }}
//*********************************************************************************************************************

//Set custom tags.
var custom2TrimPathTemplate = TrimPathTemplate.config({
  OPENING: "{{"
  , CLOSING: "}}"
  , DISPLAY: "*"
  , SPECIAL: ""
});

test("test include files. (Double Curly Brace with * for display)", function (t) {
  var str1 = custom2TrimPathTemplate.render("{{if language == 'JavaScript'}}My favorite programming langague is JavaScript by *{{name}}{{/if}}", {language: "JavaScript", name: "Jacob"});
  t.equal(str1, "My favorite programming langague is JavaScript by Jacob");
  t.end();
});

//*********************************************************************************************************************
//Test with single curly brace, % for speical token, and ! for display token. {#if name=='Jacob'} and !{name}
//*********************************************************************************************************************

//Set custom tags.
var custom3TrimPathTemplate = TrimPathTemplate.config({
  OPENING: "{"
  , CLOSING: "}"
  , DISPLAY: "!"
  , SPECIAL: "%"
});

test("test include files. (Double Curly Brace with * for display)", function (t) {
  var str1 = custom3TrimPathTemplate.render("{%if language == 'JavaScript'}My favorite programming langague is JavaScript by !{name}{/if}", {language: "JavaScript", name: "Jacob"});
  t.equal(str1, "My favorite programming langague is JavaScript by Jacob");
  t.end();
});


//*********************************************************************************************************************
//Test with triple curly brace, % for speical token, and ! for display token. {#if name=='Jacob'} and !{name}
//*********************************************************************************************************************

//Set custom tags.
var custom4TrimPathTemplate = TrimPathTemplate.config({
  OPENING: "{{{"
  , CLOSING: "}}}"
  , DISPLAY: "!"
  , SPECIAL: "%"
});

test("test include files. (Double Curly Brace with * for display)", function (t) {
  var str1 = custom4TrimPathTemplate.render("{{{%if language == 'JavaScript'}}}My favorite programming langague is JavaScript by !{{{name}}}{{{/if}}}", {language: "JavaScript", name: "Jacob"});
  t.equal(str1, "My favorite programming langague is JavaScript by Jacob");
  t.end();
});


//TODO: Changes need to be made in Trimpath before this is allowed.

//*********************************************************************************************************************
//Test with double square brace and % for display tokens. [[ ]] and %[[ ]]
//*********************************************************************************************************************

//Set custom tags.
// var custom3TrimPathTemplate = TrimPathTemplate.config({
//   OPENING: "[["
//   , CLOSING: "]]"
//   , DISPLAY: "%"
//   , SPECIAL: ""
// });

// test("test include files. (Double square brace with % for display)", function (t) {
//   var str1 = custom3TrimPathTemplate.render("[[{if language == 'JavaScript'}]]My favorite programming langague is JavaScript by %[[{name}]]  [[{/if]]}", {language: "JavaScript", name: "Jacob"});
//   t.equal(str1, "My favorite programming langague is JavaScript by Jacob");
//   t.end();
// });
