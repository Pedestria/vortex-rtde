import Dependency from "../Dependency";
import { FileImportLocation } from "../FileImportLocation";

/**
 * A Stylesheet Dependency
 * @extends Dependency
 */
export class CSSDependency extends Dependency{
    /**
     * CSS file in string Format
     */
    stylesheet:string

    constructor(name:string,initImportLocation:FileImportLocation,stylesheet:string){
        super(name,initImportLocation);
        this.stylesheet = stylesheet;
    }

}