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
    type:number
    /**
     * 
     * @param {string} name Name of Module
     * @param {ModuleTypes} type Type of Module
     */

    constructor(name:string,type:number)
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
    CjsModule = 2,
    /**
     * Defualt CommonJs Module
     */
    CjsDefaultModule = 3,
    /**
     * Default CommonJS Module Executed on Call. 
     * __(module.exports = () => {--MODULE CODE HERE--})__
     */
    CjsDefaultFunction = 4,
    /**
     * CommonJS Namespace __(const -- = require(--))__
     */
    CjsNamespaceProvider = 5,

}