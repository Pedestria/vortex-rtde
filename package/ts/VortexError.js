"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VortexErrorType = exports.VortexError = void 0;
const chalk = require("chalk");
class VortexError {
    constructor(error_message, type) {
        this.message = chalk.redBright(`${VortexErrorType[type]} NOVA ${error_message}`);
    }
    printOut() {
        return this.message;
    }
}
exports.VortexError = VortexError;
var VortexErrorType;
(function (VortexErrorType) {
    VortexErrorType[VortexErrorType["PortalPanelError"] = 1] = "PortalPanelError";
    VortexErrorType[VortexErrorType["StarSyntaxError"] = 2] = "StarSyntaxError";
    VortexErrorType[VortexErrorType["StarSelfImposedError"] = 3] = "StarSelfImposedError";
})(VortexErrorType = exports.VortexErrorType || (exports.VortexErrorType = {}));
