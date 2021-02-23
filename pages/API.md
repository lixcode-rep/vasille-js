# Vasille.js API description

To define a Vasille.js component, create a file with extension `.vc` 
and the next structure:
```html
<script>
	// flow.js code
</script>

<App>..</App> or <Component>..</Component> or <Fragment>..</Fragment>	

<style>
	/* styles go here */
</style>
```

A `App` is a root of a Vasille.js application, it will be bounded to 
an existing DOM node. `Component` defines a typical component, which root
is an HTML node created by Vasille.js. `Fragment` can contain any number of
nodes at top level.

## The script part

Component data, functions, events, slots and watcher are defined in the
`script` tag.

### Component data/state

Component state is composed of javascript variables defined in `script`
section:
```html
<script>
    let foo = 2;
    let bar = 'bar';
</script>
```

Also, the variables can be typed:
```typescript
let foo : number = 2;
let bar : string = 'bar';
```

### Component properties

Component properties are marked by `export` keyword, and must be typed:
```typescript
export let foo : number;
export let bar : string = 'default value';
```

### Computed properties (expressions)

An expression is a state variable which default value is an expression. 
It's value will be automatically recalculated.

Syntax:
```typescript
let x = 2;
let y = 3;
let z = x + y;
```

### Methods (functions)

To declare a component method, just declare a function. It also can be typed;

```typescript
function sum (a, b) {
    return a + b;
}
function diff (a : number, b : number) : number {
    return a - b;
}
```

To make a method available outside of component declare a slot using
`export` key:
```typescript
export function slot() {
    return x + y;
}
```

### Components hooks

The Vasille.js components has 4 hooks. The `$created`
hook is called when the component is created and properties are
initialized. The `$mounted` hook is called when all elements defined in
component are mounted. The `$ready` hook is called when all elements
declared is component and installed to its slots are mounted. The
`$destroy` hook is called when component is destroyed.

To define a hook just define a function with its name.

```typescript
function $created () {
    // created hook
}
function $mounted () {
    // mounted hook
}
function $ready () {
    // ready hook
}
function $destroy () {
    // before destroy hook
}
```

### Events

An event can be handled outside of function, to declare an event use
`declare` keyword, after call it to emit the defined event, the event
signature must be typed.

Syntax:
```typescript
declare function myEvent(a: number, b: number);

// emit a event
myEvent(x, y);
```

### Dependency track

All state variables used in a function are tracked, and function will
be called each time when an argument or state variable get changed:
```typescript
let x = 0, y = 1;

function sum (a) {
    return x + a;
}

// will be updated on x and y change
let expr = sum(y);
```

### Watchers

A watcher is an anonymous function which will be called each time when a state
variable used in it get changed. It also can be used like multiline 
expresion. Watcher functions must have **no parameters**, to be **"called"** 
in current context, and function result must be **assigned to a local state**
variable.

Example:
```typescript
let x = 0, y = 0, visible = true;

let watcher = function () {
    if (x < 0 && y < 0) {
        visible = true;
    }
    else {
        visible = false;
    }
}.call();

let multilineExpression = function () {
    let result;
    
    switch (x) {
        case 1:
            result = x + 2;
            break;
            
        case 2:
            result = y + 3;
            break;
            
        default:
            result = visible ? x - 2 : y - 4;
    }
    
    return result;
}.call();
```

### Use global variable in Vassile.js components

Use import from `global` to resolve global variables names.

```typescript
import { window, document, location } from 'global';

window.requestAnimationFrame(() => {
    // smoe code here
});
```

## Style

A style tag which is present is each file, can be used to declare local
and global style rules. The operator `|` is used to combine a global
selector with a local one. `@global` (which is used like `@media`) is 
used to define global rules simply.

Examples:
```html
<style>
    p span {
        /* Local selector example */
    }

    p | span {
        /* Hybrid selector example */
    }

    @global {
        /* Global CSS here */
    }
</style>
```

## HTML

HTML part is used to define the HTML nodes and subcomponents.

### Root tags

The root of template must be `App` or `Component` or `Fragement`.

`App` defines a root of an application or a page.
Attributes of `App` & `Fragment` nodes will be applied to
container node. Attributes of `Component` node will be applied to the
root of component.

Examples:
```html
<App>
    <!-- Root of a simple application -->
</App>

<App role="app">
    <!-- Root of a single page application -->
</App>

<App role="page">
    <!-- Page in multi-page application -->
</App>

<Component>
    <!-- Here must be a child node which is a component or HTMl node -->
</Component>

<Fragment>
    <!-- Here can by any number of children, inclusive no children -->
</Fragment>
```

### HTML node/tag

An HTML tag is defined without any special rules:
```html
<App>
    <div class="text">
        <p>some text here</p>
    </div>
</App>
```

### Subcomponents

Subcomponents must be imported in `script` part, after used is HTML part 
like a tag which name is the component name:
```html
<script>
    import Component from './Component';
</script>

<App>
    <Component />
</App>
```

### Attributes and properties

An HTML tag accepts values of its attributes, a Vasille.js component
accepts values of its properties. Values are declared like typical HTML 
attributes, use double-quoted string to use a value as string, and
single-quoted string to use a value as JavaScript expression.

Example:
```html
<App>
    <div
        id="id"
        class="class1 class2"
        data-mydata='sum(a, b)'
    ></div>
    <Component 
        prop1="string value"
        prop2='x + y'
    />
</App>
```

### Class directives

Class directives are used to define dynamical and conditional classes.
Use directive `class='classNameVariable'` to add a dynamical class and 
`class.className='condition'` to add a conditional class.

```html
<App>
    <div
        class="staticClass"
        class='dynamicalClass'
        class.conditionalClass='condition'
    ></div>
</App>
```

### Style directives

Style can be defined static, dynamical and dynamical with units. Use 
directive `style="static style"` to define static style, use
`style.property='variable'` to define dynamical one and 
`style.property.unit='value'` to define dynamical with unit.

Example:
```html
<App>
    <div 
        style="width: 3px"
        style.width='3 + "px"'
        style.width.px='3'
    />
</App>
```

### Text expressions in HTML

Use curly bracket to add text of state variables.

Example:
```sveltehtml
<p>{x} + {y} = {x + y}</p>
```

### Listen for events

To listen for default DOM events, use `onmousedown` or other HTML
standard attributes. To listen to component events use `on-eventName`,
events accept as value functions names, expressions and
lambda-functions.

Examples:
```html
<App>
    <div
        onmousedown='functionName'
        onmouseup="functionName"
        onmousemove="(ev) => x = ev.clientX"
    ></div>
    <Component
        on-eventName="functionName"
        on-hover='hovered = true'
    />
</App>
```

### Setting inner HTML

Use `:html` directive to set inner HTML:
```html
<p :html="variable"></p>
```

### Reference to node or subcomponents

To make a reference to a component or element or a set of elements,
at first is necessary to create a local variable of type `ref<Element>`, 
`ref<App>`, `ref<Component>`, `ref<Fragment>`, `refs<Element>`, `refs<App>`,
`refs<Component>`, `refs<Fragment>` at second is necessary to link that 
variable to element/component using `:ref` directive. 

References are available in `$mounted` hook.

Examples:
```html
<script>
    import { ref, refs, Component } from 'vasille-js';
    import MyComponent from './MyComponent';
    
    let div : ref<HTMLDivElement>; // refer to <div>
    let sub : ref<MyComponent>;    // refer to <MyComponent>
    let items : refs<Element>;     // refer to [<p>, <p>, <p>]
</script>

<Fragment>
    <div :ref='div' />
    <MyComponent :ref="sub">
        <p :ref="items"/>
        <p :ref="items"/>
        <p :ref="items"/>
    </MyComponent>
</Fragment>
```

### Slots

Use `slot` tag to define a slot, and `slot` directive to put a component
to a concrete slot.

Example:
```html
<App>
    <!-- Default slot -->
    <slot />
    <!-- Named slot -->
    <slot name="slotName" />
    
    <Compoent>
        <!-- Paste to default slot -->
        <div />
        <!-- Paste to named slot -->
        <div slot="slotName"/>
    </Compoent>
</App>
```

## Flow control

Flow can be controlled using `if`, `if-else`, `if-else-if` and loops.

### `if`

To define an if node, use `if` node or `:if` directive:
```html
<if cond='boolean expression'>..</if>
<!-- Alternative -->
<div :if='boolean expression'>..</div>
```

### `if-else`

To define an if-else flow, use `if` & `else` nodes, or `:if` & `:else`
directives:
```html
<if cond=''>..</if>
<else>..</else>
<!-- Alternative -->
<div :if='expression'>..</div>
<div :else>..</div>
```

### `if-else-if`

To define an if-else-if flow, use a combination between `if` & `else` nodes,
or `:if` & `:else` directives:
```html
<if cond='expression'>..</if>
<else if='expression'>..</else>
<!-- Alternative -->
<div :if='expression'>..</div>
<div :else :if='expression'>..</div>
```

### Loops

Loops can iterate arrays, objects, sets and maps. A loops can be defined
using `for` tag or `:let`, `:of` & `:index` directives:
```html
<for let='identifier' index='index' of='iterable'>..</for>
<!-- Alternative -->
<div :let='identifier' :index='index' :of='iterable'></div>
```

### Debugging comments

Use `debug` tag to define debug comments:
```html
<debug>{expression}</debug>
<!-- Some expressions -->
<debug>{expression 1}, {expression 2}</debug>
```

## Advanced

There are some advanced options, which can be coded using Vasille.js
language.

### Multi-page applications (multiple HTML files)

Defines some `App` with role `page` and attribute `static-url` with the 
path to future HTML file.

Example:
```html
<!-- Index.vc file -->
<App role="page" static-url="index.html">
    <!-- Index file content -->
</App>

<!-- About.vc file -->
<App role="page" static-url="pages/about.html">
    <!-- About page content -->
</App>
```

After compilation, you get the next files:
```
/index.html
/index.html.js
/index.html.css
/pages/about.html
/pages/about.html.js
/pages/about.html.css
```

### Multi-page applications (single HTML file)

Optionally define a `App` with role `app` which will represent the loading 
screen. Strong define one or more `App` with role `page` and attribute
`url` with a regular expression to match the url of page.

Example:
```html
<!-- Index.vc file -->
<App role="page" url="^/?$">
    <!-- Index file content -->
</App>

<!-- News.vc file -->
<App role="page" url="^/news/(?<newsId>\\w+)/?$">
    <!-- About page content -->
</App>

<script>
    export let newsId;
    
    // use here newsId url parameter
</script>
```

After compilation, you get the next files:
```
/index.html
/Index.js
/News.js
```

### Executors

An executor is a class which releases all changes in DOM, the default
executor is `InstantExecutor`, it applies all changes immediately. To 
create an own executor use JavaScript API.

Example how to apply a custom executor:
```html
<App executor='MyExecutor'>
    <!-- App children -->
</App>

<script>
    import {MyExecutor} from "./MyExecutor";
</script>
```

### Pointers

A pointer can be defined using a `var` keyword. Details about pointers
will be added after.

```typescript
var pointer;
var pointer = 'default value';
let x = 'x', y = 'y';

// change pointer value
pointer = x;
// change pointed value
pointer = 'y';

console.log(x, y); // will print y y
```

### Watch for

"Watch for" updates the children node on each value change (must cause 
performance issues), DOM is updated automatically, this is a solution
requested in special cases only.

Syntax:
```html
<Watch for="variable">
    <!-- Code to be updated -->
</Watch>
```