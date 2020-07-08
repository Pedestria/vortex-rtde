declare function shuttle(moduleName:string):Object

/**
 * Shuttle Module Loader (Type Definitions)
 * 
 * _Copyright Topper Studios 2020_
 */
declare namespace shuttle {

    /**Loads planet and returns Promise with Module Object
     * 
     * @param {string} planetName 
     */

    function planet(planetName:string): Promise<Object>

    /**Loads planets and maps module objects into callback args.
     * 
     * @param {Array<string>} planetNames 
     * @param {Function} callback 
     */

    function planetCluster(planetNames:Array<string>,callback:(...args:Array<string>) => void): void

    /**Overrides current module scope with new scope
     * 
     * @param {Object} newScopedModules 
     */

    function override(newScopedModules:Object):void

}





