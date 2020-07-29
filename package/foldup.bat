@ECHO off
yarn tsc -p tsconfig-fold.json && yarn rollup test/vortex/Index.js --file dist/vortex-rtde.js --format umd --name "VortexRTDE"