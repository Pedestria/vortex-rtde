import Dependency from "../Dependency";
import { FileImportLocation } from "../importlocations/FileImportLocation";

/**
 * A Stylesheet Dependency
 * @extends Dependency
 */
export class CSSDependency extends Dependency{
    /**
     * CSS file in string Format
     */
    stylesheet:string
    dependencies:Array<Dependency> = []

    constructor(name:string,initImportLocation:FileImportLocation,stylesheet:string){
        super(name,initImportLocation);
        this.stylesheet = stylesheet;
    }

}