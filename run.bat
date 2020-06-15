@ECHO off
yarn tsc && node lib/CLI.js ./test/test.js && yarn cleanup