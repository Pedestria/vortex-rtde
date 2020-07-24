Why Vortex - RTDE?
===

Vortex is a real time development environment (hence the name RTDE), and a web application bundler. (Like Webpack, Rollup.js, Parcel, Browserify, etc.)

IN DEVELOPENT!!!!







## Bundler Key Syntax Words (Only for library mode):

### vortexExpose

```javascript
function exampleFunc(){
    console.log('I do stuff!');
}

export {exampleFunc} /*vortexExpose*/
``` 

Vortex will expose export so other JS files can access it.

### vortexRetain

```javascript
import Example from './example.js' /*vortexRetain*/
```

Vortex will outsource the import and will NOT include it in the bundle.