yarn tsc && yarn tsc -p tsconfig-fold.json && yarn rollup ./test/vortex/Index.js --out-file dist/vortex.rollup.js --format cjs