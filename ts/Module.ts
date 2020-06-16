export default class Module {

    name:string
    type:number

    constructor(name:string,type:number)
    {
        this.name = name
        this.type = type

    }

}

export enum ModuleTypes {
    EsModule = 0,
    EsDefaultOrNamespaceModule = 1,
    CjsModule = 2,
    CjsDefaultOrNamespaceModule = 3,
    CjsDefaultFunction = 4

}