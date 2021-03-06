import * as VORTEXAPI from  "./API_AND_Types";

interface LivePushOptions {
    /**
     * Entry point for program!
     * (Multiple Entry Point Support will come eventually!)
     */
    entry:string
    /**
     * Resolved Directory to Html
     * @example
     * path.resolve(__dirname,"./client/index.html")
     */
    dirToHTML:string
    /**
     * Externals!
     */

    CDNImports:Array<CDNImport>
}

interface CDNImport{
    libraryName:string
    namespace:string
}

    declare var Panel:{
        /**
         * Type of program to bundle for
         */
        type:'app'|'library'
        /**
         * LivePush Config!
         */
        livePushOptions:LivePushOptions
        /**
         * The Mode of which to bundle the program in.
         */
        bundleMode:'star'|'neutronstar'
        /**
         * Whether Vortex should use terser to extra minify your neutron star solar system. (Uses babel core compilier on neutronstar library!!!)
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

        /**
         * Whether Vortex should polyfill the es6 promise. __(Used with Planet imports!)__
         */
        polyfillPromise:boolean

        /**
         * Addon Objects to Add to Vortex RTDE
         */
        addons:Array<VORTEXAPI.Addons.VortexAddon>

        /**
         * Libraries to NOT include in bundle. Links browser global to shuttle_exports.
         */

        outBundle:Array<string>

        /**
         * Whether Vortex should pipe all CSS Dependencies into one file.
         */

        cssPlanet:boolean

        /**
         * Whether Vortex should minify the CSS Planet (If it gets created.)
         */

        minifyCssPlanet:boolean


    }

    export = Panel;
