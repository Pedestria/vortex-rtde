# V0RTEX 

## (Getting closer to a RTDE(Real Time Development Environment), but is now OFFICIALLY a JS Bundler)

## Checklist:

- Build LivePush

    - Build Interpreter For Browser(To interpret Star created by Compiler. Not used in production/neutron-star mode)

    - Build LiveUpdate mechanism. (Can push as little as a few lines to Star or can push whole new libraries or divisions of code.)

- Build docs webpage.

- Fix miscopy of File Dependency

- Add syntax word to change name of Planet.

- Finish support for addons.



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

### LivePush Checklist

- [ ] Add Updater.
 - [ ] load Precached Code STRINGS for unchanged files!!
 - [ ] add chokidar event listeners.
 - [ ] 
- [ ] Support For Images.
- [ ] Addon Support! 


