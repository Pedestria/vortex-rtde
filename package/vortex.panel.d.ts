
    declare var Panel:{
        type:'app'|'library'
        bundleMode:'star'|'neutronstar'
        useTerser:boolean
        start:string
        output:string
        extensions:Array<string>
        encodeFilenames:boolean
    }

    export = Panel;
