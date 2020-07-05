/**
 * The Vortex Live Package Interpreter 
 */
class LivePackageInterpreter{

    name:string

    /**
     * 
     * @param {string} name Name of Interpreter
     * @param {string} dirToPackage Dir to Watcher Output
     * @param {string} dirToHTML Dir to HTML Page
     * @param {string} dirToControlPanel Dir to Vortex Config Panel
     */
    constructor(name:string,dirToPackage:string,dirToHTML:string,dirToControlPanel:string){
        this.name = name
        this.run(dirToPackage,dirToHTML,dirToControlPanel);
    }

    /**Intializes live interpreter.
     * 
     * @param {string} dirToPackage 
     * @param {string} dirToHTML 
     * @param {string} dirToControlPanel 
     */

    run(dirToPackage:string,dirToHTML:string,dirToControlPanel:string){

    }
}
