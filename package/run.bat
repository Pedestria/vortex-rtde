@ECHO off
yarn tsc && yarn tsc -p tsconfig-fold.json && node ./scripts/run.js