# V0RTEX 

## (Getting closer to a RTDE(Real Time Development Environment), but is now OFFICIAL a Js Bundler)

## Checklist:


- NonJS File Support (Adds images/fonts/ or css stylesheets to Graph but doesn't verify modules from files.)

- Add Support for other Module Dependency types. (AMD Modules, and UMD Modules)
 - Dynamic import support (An async import of a js module which uses Promises. Typically code and dependencies of the dynamic imported module is divided into another bundle)

- Build Interpreter For Browser(To interpret Star created by Compiler. Not used in production/neutron-star mode)

- Build LiveUpdate mechanism. (Can push as little as a few lines to Star or can push whole new libraries or divisions of code.)
