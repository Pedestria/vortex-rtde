import { TransformOptions } from '@babel/core';

/**
 * If checked True, then Vortex will bundle with NO debug tools.
 * If checked False, then Vortex will bundle with debug tools.
 */
export var isProduction:boolean = false;
/**
 * If checked true, Vortex will consider your program a library instead of a web application.
 */
export var isLibrary:boolean = false;
/**
 * If checked true, Terser will be used to minify production bundle. (Can NOT be used on development bundles.)
 */
export var usingTerser:boolean = false;

export var useDebug:boolean = true;

export var BabelSettings:TransformOptions = {sourceType:'module',presets:[['@babel/preset-env',{modules:false}],['@babel/preset-react',{modules:false}]]}


