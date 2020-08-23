VORTEX as a Web Application Bundler
===

Vortex RTDE traverses your project, fetching all modules, libraries, and other dependencies, and formatting them into one bundle that can execute inside the browser.

## Sync Module Types

### ES6 Modules (Most Support!)

Example:

```javascript
**IMPORTS**

//Default/Namespace Import
import React from 'react'
//Named Imports
import {render} from 'react-dom'
//Typescript Namespace Import
import * as $ from 'jquery'

**EXPORTS**

//Named Exports

export class Test {}

export {AnotherTest}

export {OtherThing as MainComponent}

//Default Exports

export default //class or function HERE!!

export {Test2 as default}

```

### CommonJS

Example:

```javascript
//REQUIRE
const lodash = require('lodash');

// *EXPORTS*

//Named Export
export.Thing = Thing;
//Default Export
module.exports = OtherThing;

```

## Code Splitting (Async Module Types)

A larger application with a lot of code will make the bundle load slower.

### ES6 Dynamic Import (Best Way!)

```javascript
import('./Thing.js').then(thingObject => {

thingObject.doStuff();

})
```

### AMD

```javascript

define(['lodash','moment'],(_,moment) => {

    //DO STUFF HERE!!

})
```


