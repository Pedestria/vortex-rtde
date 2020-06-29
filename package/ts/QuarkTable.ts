export class QuarkLibTable{

    QuarkLibs:Array<QuarkLibEntry> = []

    constructor(){}

    addEntry(entry:QuarkLibEntry){
        this.QuarkLibs.push(entry)
    }

    findEntryByName(entryName:string){
        for(let ent of this.QuarkLibs){
            if(ent.name == entryName){
                return this.QuarkLibs.indexOf(ent)
            }
        }
        // Returns false if it can't find the entry.
        return null
    }
}

export class QuarkLibEntry{

    name:string
    bundleLocs:Array<string>

    constructor(name:string,bundleLocs:Array<string>){
        this.name = name
        this.bundleLocs = bundleLocs
    }

}

export var DefaultQuarkTable = new QuarkLibTable
DefaultQuarkTable.addEntry(new QuarkLibEntry('aws-sdk',['./node_modules/aws-sdk/dist/aws-sdk.js','./node_modules/aws-sdk/dist/aws-sdk.min.js']))
