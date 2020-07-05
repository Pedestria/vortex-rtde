
/**
 * Vortex Addon Interface
 */
export class VortexAddon {

    name:string
    handler:ExportsHandler
    /**
     * 
     * @param {string} name Addon Name
     */
    constructor(name:string, handler:ExportsHandler){
        this.name = name;
        this.handler = handler
    }
} 

export class ExportsHandler {

    exports:{
        extend: {
            jsExtensions:Array<string>
            extensions:Array<string>
        }
        override: {
            compileExtensions: {
                jsExtension:boolean
                extension:string
                compiler:Function
            }
            reloadExtensions: {
                jsExtension:boolean
                extension:string
                compiler:Function
            }
        }
    }
}