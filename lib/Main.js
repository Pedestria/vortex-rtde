"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const VortexSearch = require("./Find");
function Bundle() {
    VortexSearch.FindModulesAndDependencies('test.js');
}
Bundle();
