Vortex Control Panel
===

Similar to Webpack and Rollup.js, Vortex uses a config file. This is called the Control Panel (Default name is set to *vortex.panel.js*)

Here is an example of how one's project control panel might look:

```javascript
const {VortexVueAddon} = require('@vortex/addons/vue')
const {VortexMoreStylesAddon} = require('@vortex/addons/more-styles')

module.exports = {
    type:'app',
    bundleMode:'star',
    start:'./src/entry-point.js',
    output:'./dist/webapp.js',
    extensions: ['.css','.png','.otf'],
    encodeFilenames:true,
    addons:[VortexVueAddon,VortexMoreStylesAddon]
}
```

## Options For Panel

### ```type:"app"|"library"|"live"```

The mode setting which tells Vortex which mode to build for.

- "live" - LivePush
- "app" - Web application
- "library" - Node.js or CommonJS library

### ```livePush:LivePushOptions```

The configuration of the LivePush feature.. Go to [here]() if you want to know about LivePush config.

### ```bundleMode:"star"|"neutronstar"```

- "star" - Regular bundle mode. (Source Maps enabled.)
- "neutronstar" - Minified bundle mode. (Same as Webpack production mode)


