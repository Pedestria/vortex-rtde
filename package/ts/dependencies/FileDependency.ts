import Dependency from "../Dependency";
import { FileImportLocation } from "../importlocations/FileImportLocation";
import * as uuid from 'uuid'

/**A Non JS Dependency
 * @extends Dependency
 */
export class FileDependency extends Dependency{

    uuid:string

    constructor(name:string,initImportLocation:FileImportLocation) {
        super(name,initImportLocation)
        this.uuid = uuid.v4();
    }
}