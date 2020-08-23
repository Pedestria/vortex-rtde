<img src="./public/vortex-bright-logo.png" alt="Vortex Logo"></img>


# VORTEX
## Its not just another JS bundler/build tool for web applications, its a Web App IDE!
> The core build of Vortex. (Includes LivePush, and API)
 
*GitHub Repository Access and Website Coming Soon!*

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
[npm|yarn] @vortex-rtde/core --input ./index.js --output-file ./dist/bundle.js
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

<!-- [See Here](./docs/Contributing.md) -->

