@ECHO off
yarn tsc &&yarn tsc -p tsconfig-fold.json && node lib/Main.js