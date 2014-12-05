trimpath-template
-----------------

From: https://code.google.com/p/trimpath/wiki/JavaScriptTemplateSyntax

license
-------

GPL, Apache License 2.0

# JavaScript Template Syntax
 
[JavaScript Templates (JST) home](http://code.google.com/p/trimpath/wiki/JavaScriptTemplates) | 
[API](http://code.google.com/p/trimpath/wiki/JavaScriptTemplateAPI) | 
[syntax](http://code.google.com/p/trimpath/wiki/JavaScriptTemplateSyntax) | 
[modifiers](http://code.google.com/p/trimpath/wiki/JavaScriptTemplateModifiers) | 
[download](http://code.google.com/p/trimpath/downloads/list) | 
[community](http://code.google.com/p/trimpath/wiki/JavaScriptTemplateDiscussion)

This page describes the syntax for !JavaScript Templates, including its expression markup and statement tags.

## Expressions and Expression Modifiers
```
  ${expr}
  ${expr|modifier}
  ${expr|modifier1|modifier2|...|modifierN}
  ${expr|modifier1:argExpr1_1}
  ${expr|modifier1:argExpr1_1,argExpr1_2,...,argExpr1_N}
  ${expr|modifier1:argExpr1_1,argExpr1_2|...|modifierN:argExprN_1,argExprN_2,...,argExprN_M}
```

 * An expr is any valid !JavaScript expression, except for close-brace characters ('}').
 * A modifier looks like modifierName[:argExpr1[,argExpr2[,argExprN]]]
   * An argExpr is an expr.

```
  Examples:
  ${customer.firstName}
  ${customer.firstName|capitalize}
  ${customer.firstName|default:"no name"|capitalize}
  ${article.getCreationDate()|default:new Date()|toCalenderControl:"YYYY.MM.DD",true,"Creation Date"}
  ${(lastQuarter.calcRevenue() - fixedCosts) / 1000000}
```

Please see also the list of [standard modifiers](http://code.google.com/p/trimpath/wiki/JavaScriptTemplateModifiers) and how to use the [API](http://code.google.com/p/trimpath/wiki/JavaScriptTemplateAPI) to create your own custom modifiers.

Expressions can also be optionally specified as "${% customer.firstName %}" syntax, which has the extra '%' delimiter characters.  This syntax is useful if your expressions have brace characters.  For example...
```
  Visit our ${% emitLink('Solutions and Products', 
                         { color: 'red', blink: false }) %} page.
  
  The extra spaces are actually not necessary, like...
  ${%customer.firstName%}
  ${%customer.firstName|capitalize%}
```

## Statements

Statement tags are nestable in just like !JavaScript statement blocks (if/else/for/function) are nestable.  

### Control Flow
```
  {if testExpr} 
    {elseif testExpr}
    {else}
  {/if}
```

 * The testExpr is any valid !JavaScript expression, but no close-brace characters.
 * The testExpr does not require surrounding parenthesis.

```
  Examples:
  {if customer != null && customer.balance > 1000}
    We love you!
  {/if}

  {if user.karma > 100}
      Welcome to the Black Sun.
  {elseif user.isHero}
      Sir, yes sir!  Welcome!
      {if user.lastName == "Yen"}
         Fancy some apple pie, sir?
      {/if}
  {/if}

  <a href="/login{if returnURL != null && returnURL != 'main'}?goto=${returnURL}{/if}">Login</a>
```

The !JavaScript Template engine also defines a helper function called "defined(str)", which checks its argument for equality with the !JavaScript undefined value.  It is useful to check if a value is defined in the evaluation context.  For example...
```
  {if defined('adminMessage')}
    System Administrator Important NOTICE: ${adminMessage}
  {/if}
```

### Loops
```
  {for varName in listExpr}
  {/for}

  {for varName in listExpr}
    ...main body of the loop...
  {forelse}
    ...body when listExpr is null or listExpr.length is 0...
  {/for}
```

 * A varName is any valid !JavaScript variable name.
 * A listExpr is a !JavaScript expression which should evaluate to an Array, an Object, or to null.  The listExpr is evaluated only once.

```
  Two variables are bound in the main body of the loop:
    __LIST__varName - holds the result of evaluating listExpr.
    varName_index   - this is the key or counter used during iteration.

  Examples:
  {for x in customer.getRecentOrders()}
    ${x_index} : ${x.orderNumber} <br/>
  {forelse}
    You have no recent orders.
  {/for}

  Converted pseudo-code for the above...
  var __LIST__x = customer.getRecentOrders();
  if (__LIST__x != null && __LIST__x.length > 0) {
    for (var x_index in __LIST__x) {
      var x = __LIST__x[x_index];
      ${x_index} : {$x.orderNumber} <br/>
    }
  } else {
    You have no recent orders.
  }
```

### Variable Declarations
```
  {var varName}
  {var varName = varInitExpr}
```

 * A varName is any valid !JavaScript variable name.
 * A varInitExpr may not have any close-brace characters.

```
  Examples:
  {var temp = crypto.generateRandomPrime(4096)}
  Your prime is ${temp}.  
```

### Macro Declarations
```
  {macro macroName(arg1, arg2, ...argN)}
    ...body of the macro...
  {/macro}
```

 * A macro is like a !JavaScript function, except the body of the macro is another !JavaScript Template, not !JavaScript.
   * That is, the body of the macro may contain JST expressions and statements.
 * The macroName may be any valid !JavaScript variable name.
 * The return value of an invoked macro is a string.
 * You invoke the macro using the ${macroName()} expression syntax.

```
  Examples:
  {macro htmlList(list, optionalListType)}
    {var listType = optionalListType != null ? optionalListType : "ul"}
    <${listType}>
      {for item in list}     
        <li>${item}</li>
      {/for}
    </${listType}>
  {/macro}

  Using the macro...
  ${htmlList([ 1, 2, 3])}
  ${htmlList([ "Purple State", "Blue State", "Red State" ], "ol")}
  {var saved = htmlList([ 100, 200, 300 ])}
  ${saved} and ${saved}
```

Regarding macro scope: by default, macros are defined private to each template.  If you want to export a macro so that it can be reused in other templates (such as building up a helper library of macros), one approach is to save a reference to your macro into your ''contextObject''.  For example, in the ''contextObject'' that's the argument to ''template.process(contextObject)'', you can set ''contextObject['exported'] = {};'' before you call process().  Then, here's how you can capture a macro into ''contextObject['exported']''...
```
  {macro userName(user)}
    {if user.aliasName != null && user.aliasName.length > 0}
      ${user.aliasName}
    {else}
      ${user.login}
    {/if}
  {/macro}
  ${exported.userName = userName |eat}
```
Cleverly, you might also set ''contextObject['exported'] = contextObject;''  It's circular, but it works.

### CDATA Text Sections
```
  {cdata}
    ...text emitted without JST processing...
  {/cdata}

  {cdata EOF}
    ...text emitted without JST processing...
  EOF
```
You can use the '''{cdata EOF}...EOF''' or '''{cdata}...{/cdata}''' markup syntax to tell JST to ignore processing for a block of text.  The text will be emitted without any tag or markup processing.  This can be useful if you're using a !JavaScript Template to generate a !JavaScript Template.
 * The 'EOF' may be any marker string without a '}' character.  The marker string is used to delineate or 'bookend' a section of text.
 * The '...' is your text, which may contain newlines, which the JST engine will emit without any transformations.  

For example...
```
Hello, ${user.firstName}.
An example of expression markup in JST looks like...
{cdata END_OF_THE_CDATA_SECTION}
 ${customer.firstName} ${customer.lastName}
END_OF_THE_CDATA_SECTION
...which shows a customer's name.

Let me repeat that...
{cdata}
 ${customer.firstName} ${customer.lastName}
{/cdata}
...will show a customer's name.
```
The above will output...
```
Hello, Steve.
An example of expression markup in JST looks like...

 ${customer.firstName} ${customer.lastName}

...which shows a customer's name.

Let me repeat that...

 ${customer.firstName} ${customer.lastName}

...will show a customer's name.
```

### In-line JavaScript

#### eval blocks
```
  {eval}
    ...javascript evaluated during JST processing...
  {/eval

  {eval EOF}
    ...javascript evaluated during JST processing...
  EOF
```
The EOF can be any text without a close-brace ('}') character.

The {eval} markup block can be useful to define multi-line !JavaScript event handler functions near where they are used.
```
  <select onchange="sel_onchange()"></select>
  {eval} 
    sel_onchange = function() {
     ...Do some complicated javascript...;
     ...more js code here...;
    }
  {/eval}
```
Note in the above example that the 'var' keyword is *not* used, like 'var sel_onchange = function() {...}'.  This is to ensure that sel_onchange will be in global scope and hence usable as an event handler function.

#### minify blocks
```
  {minify}
    ...multi-line text which will be stripped of line-breaks during JST processing...
  {/minify 

  {minify EOF}
    ...multi-line text which will be stripped of line-breaks during JST processing...
  EOF
```
The EOF can be any text without a close-brace ('}') character.

A {minify} block allows you to inline long !JavaScript or CSS code into your HTML attributes.  For !JavaScript, this is especially useful for event handlers like onchange, onmousedown, onfocus, onblur, etc.  Without {minify}, handling linebreaks or newlines in long !JavaScript code is possible but unwieldy.
```
  <select onchange="{minify}
     ...Do some complicated multi-line javascript...;
     ...more js code here...;
     this.enabled = false;
  {/minify}">

  <select onchange="{minify END_OF_JS}
     ...Do some complicated multi-line javascript...;
     ...more js code here...;
     this.enabled = false;
  END_OF_JS">
```

The {minify} block is also useful to make long inline CSS <style> attributes readable and maintainable, which can sometimes be useful in Internet Explorer which does not seem to support dynamically generated <style> tags.
```
<div id="commentPanel"
     style="{minify}
              display:none; 
              margin: 1em;
              border: 1px solid #333;
              background: #eee;
              padding: 1em;
            {/minify}">
  ...
</div>
```

----
{ [http://code.google.com/p/trimpath/wiki/JavaScriptTemplates JavaScript Templates (JST) home] | [http://code.google.com/p/trimpath/wiki/JavaScriptTemplateAPI API] | [http://code.google.com/p/trimpath/wiki/JavaScriptTemplateSyntax syntax] | [http://code.google.com/p/trimpath/wiki/JavaScriptTemplateModifiers modifiers] | [http://code.google.com/p/trimpath/downloads/list download] | [http://code.google.com/p/trimpath/wiki/JavaScriptTemplateDiscussion community] }