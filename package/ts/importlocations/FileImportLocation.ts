import ImportLocation from "../ImportLocation";

export class FileImportLocation extends ImportLocation{

    relativePathToDep:string
    localName?:string

    constructor(name:string,line:number,relativePathToDep:string,localName?:string){
        super(name,line);
        this.relativePathToDep = relativePathToDep;
        this.localName = localName;
    };

}