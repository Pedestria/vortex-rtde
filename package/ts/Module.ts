/**
 * An Exported Function, Class, or Variable from a specific file or library.
 */
export default class Module {
    /**
     * Name of Module
     */
    name:string
    /**
     * Type of Module 
     */
    type:ModuleTypes
    /**
     * 
     * @param {string} name Name of Module
     * @param {ModuleTypes} type Type of Module
     */

    constructor(name:string,type:ModuleTypes)
    {
        this.name = name
        this.type = type

    }

}

/**
 * The Standardized System For Vortex Module Types
 */

export enum ModuleTypes {
    /**
     * Named ECMAScript Module
     */
    EsModule = 0,
    /**
     * Default ECMAScript Module
     */
    EsDefaultModule = 1,
    /**
     * ECMAScript Namespace __(Import * as -- from -- )__
     */
    EsNamespaceProvider = 2,
    /**
     * Named CommonJS Module
     */
    CjsModule = 3,
    /**
     * Defualt CommonJs Module
     */
    CjsDefaultModule = 4,
    /**
     * Default CommonJS Module Executed on Call. 
     * __(module.exports = () => {--MODULE CODE HERE--})__
     */
    CjsDefaultFunction = 5,
    /**
     * CommonJS Namespace __(const -- = require(--))__
     */
    CjsNamespaceProvider = 6,

    CjsInteropRequire = 7,

    EsDefaultNamespaceProvider = 8,

}