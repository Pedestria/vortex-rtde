export interface ControlPanel {

    /**
     * If checked True, then Vortex will bundle with NO debug tools.
     * If checked False, then Vortex will bundle with debug tools.
     */
    isProduction:boolean
    /**
     * If checked true, Vortex will consider your program a library instead of a web application.
     */
    isLibrary:boolean
    /**
     * If checked true, Terser will be used to minify production bundle. (Can NOT be used on development bundles.) (Labels it Neutron Star)
     */
    usingTerser:boolean

    outputFile:string

    /**If checked true, Vortex will encode File Dependency names with uuids.
     */
      encodeFilenames:boolean

      useDebug:boolean;

      startingPoint:string

      extensions:Array<string>

      polyfillPromise:boolean

      externalLibs:Array<string>

      InstalledAddons:InternalVortexAddons

      cssPlanet:boolean

      minifyCssPlanet:boolean

}