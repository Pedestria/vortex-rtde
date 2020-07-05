
    declare var Panel:{
        /**
         * Type of program to bundle for
         */
        type:'app'|'library'|'live'
        /**
         * The Mode of which to bundle the program in.
         */
        bundleMode:'star'|'neutronstar'
        /**
         * Whether Vortex should use terser to extra minify your nuetron star system.
         */
        useTerser:boolean
        /**
         * The entry point for your program.
         */
        start:string
        /**
         * The output file (If using async imports, Planets will be outputed to same directory)
         */
        output:string
        /**
         * The __Non-JS__ resolvable extensions
         */
        extensions:Array<string>
        /**
         * Whether Vortex should encode filenames with uuids.
         */
        encodeFilenames:boolean
    }

    export = Panel;
