@ECHO off
yarn tsc && node lib/CLI.js ./test/web/Main.jsx ./out/bundle.js