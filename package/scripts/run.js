const path = require("path");

function loadVortex() {
    try {
        return require("../lib/Index.js");
    } catch (err) {
        if (err && err.code !== "MODULE_NOT_FOUND") {
            throw err;
        }
        return require("../dist/vortex.js");
    }
}

const vortex = loadVortex();

vortex.createStarPackage(path.resolve(__dirname, "../vortex.panel.js")).catch((err) => {
    console.error(err);
    process.exit(1);
});
