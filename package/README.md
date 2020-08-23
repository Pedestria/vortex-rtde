![VORTEX LOGO](https://raw.githubusercontent.com/Pedestria/vortex-rtde/master/package/public/vortex-bright-logo.png)


# VORTEX
## Its not just another JS bundler/build tool for web applications, its a Web App IDE!
> The core build of Vortex. (Includes LivePush, and API)
 
Beta Documentation: [Here](https://github.com/Pedestria/vortex-rtde/blob/master/website/src/docs/Intro.md)
Note: Vortex RTDE is still in the beta testing process but a stable release along with complete documentation will come in the near future.
### Installation

**With npm:**
```sh
npm install @vortex-rtde/core --save-dev
```

**or yarn:**
```sh
yarn add @vortex-rtde/core -D
```


### Example Usage:

>Core Bundler

**With builin in CLI:**

```sh
[npm|yarn] vortex-rtde --input ./index.js --output-file ./dist/bundle.js
```

**or with Node.js**

```javascript
const VortexRTDE = require('@vortex-rtde/core');

VortexRTDE.createStarPackage(path.resolve(__dirname,"./vortex.panel.js"));
```
*or*
```javascript
import {createStarPackage} from '@vortex-rtde/core'

createStarPackage(path.resolve(__dirname,"./vortex.panel.js"));
```

>LivePush

(Only works for Node.js Express Servers (For Now))

```javascript
var http = require('http');
var path = require('path')
var express = require('express')
var {LivePush} = require('@vortex-rtde/core')

var main = express()
var server = http.createServer(main);

main.use(express.static(path.resolve(__dirname,'./app')))

new LivePush(path.resolve(__dirname,"./vortex.panel.js"),main,server,8080,true);
```


### Interested in Becoming a Contributer?

 [See Here](https://github.com/Pedestria/vortex-rtde/blob/master/package/docs/Contributing.md)

