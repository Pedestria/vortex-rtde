@ECHO off
yarn tsc &&yarn tsc -p tsconfig-fold.json && node lib/Index.js