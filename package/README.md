# V0RTEX 

## (Getting closer to a RTDE(Real Time Development Environment), but is now OFFICIALLY a JS Bundler)

## Checklist:


- Expand Non-JS support.

- Add Support for other Module Dependency types. (AMD Modules, and UMD Modules)
 - Dynamic import support (An async import of a js module which uses Promises. Typically code and dependencies of the dynamic imported module is divided into another bundle)

- Build Interpreter For Browser(To interpret Star created by Compiler. Not used in production/neutron-star mode)

- Build LiveUpdate mechanism. (Can push as little as a few lines to Star or can push whole new libraries or divisions of code.)

- Build docs webpage.

- Fix miscopy of File Dependency

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


## Possible NEW Architecture for RTDE:

### Non Live

If every import/export is synchronous, a star will be created. (One bundle.)
However a large application would have to load some pieces asynchronously (via Dynamic imports), that division has to be split off into another file. (Either calling it a division or planet.)
This division or planet has less features then the main division.

### Live

For live updates, the watcher will quickly search through entrypoint and all of its dependencies (And there dependencies, and so on.) And it will copy all of those files to a package that is interpreted by the Vortex Live Intrepeter. 

