@ECHO off
yarn tsc && node lib/CLI.js ./test/test.js ./out/vortex.js && yarn cleanup