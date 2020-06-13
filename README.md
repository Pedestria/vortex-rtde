# V0RTEX 

## (Probably a RTDE(Real Time Development Environment) but for now, a Js Bundler)

## Checklist:



- NonJS File Support (Adds images/fonts/ or css stylesheets to Graph but doesn't verify modules from files.)
  - Create a new class that extends Dependency called FileDependency that is used for managing files others than Js. (For Stylesheets there may have to be a sub class below FileDependency called CSSDependency that is only used for stylesheets.)
  - Use Babel Compiler (@babel/core) to pre-compile .js, .jsx, .ts, .tsx, etc. files before plugging them into the Grapher.


- Finish Implementing full support for ES Modules and CommonJS Modules. (Different methods of imports/exports of modules)

- Add Support for other Module Dependency types. (AMD Modules, and UMD Modules)

- Build Compiler (Creates either Star or ProductionBundle/NeutronStar based off of a VortexGraph)
  - Star contains multiple divisions (chunks of your app dependencies/code.) 
  - Neutron Star is the same thing but is minified with Terser.

- Build Interpreter For Browser(To interpret Star created by Compiler. Not used in production/neutron-star mode)

- Build LiveUpdate mechanism. (Can push as little as a few lines to Star or can push whole new libraries or divisions of code.)
