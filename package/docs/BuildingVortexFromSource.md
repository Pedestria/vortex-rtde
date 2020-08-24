# Building Vortex From Source

> Note: Vortex is a Bootstrapped Bundler That Bundles it Self!

1. Bootstrap! Goto package.json and change entry point to `lib/Index.js`
```json
...
main:"./dist/vortex.js"
files:[
    "./dist/vortex.min.js"
]
...
```
*Change to*
```json
...
main:"./lib/Index.js"
files:[
    "./dist/vortex.min.js"
]
...
```

2. Run `make` in the current directory (vortex-rtde/package) (This will generate a dist folder containing a `vortex.js`)

3. Change `lib/Index.js` in package.json back to `dist/vortex.js`

 **Optional**

4. Run `make final`. (Same as `make` except it produces a `vortex.min.js`)
