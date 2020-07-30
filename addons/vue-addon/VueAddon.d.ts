import { VortexRTDEAPI } from "../../package";
declare class VVueAddon extends VortexRTDEAPI.Addons.VortexAddon {
    constructor(name: string, handler: VortexRTDEAPI.Addons.ExportsHandler);
}
declare var SELF: VVueAddon;
export { SELF as VueVortexAddon };
