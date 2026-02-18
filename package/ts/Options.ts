import { TransformOptions, ParserOptions} from '@babel/core';

const OptionalRuntimePlugin = (() => {
    try {
        require.resolve("@babel/plugin-transform-runtime");
        return "@babel/plugin-transform-runtime";
    } catch {
        return undefined;
    }
})();

export var BabelSettings:TransformOptions = {
    sourceType: "module",
    presets: [["@babel/preset-env", { modules: false }], ["@babel/preset-react", { modules: false }]],
    plugins: OptionalRuntimePlugin ? [OptionalRuntimePlugin] : []
}

export var ParseSettings:ParserOptions = {sourceType:'module',plugins:['asyncGenerators','dynamicImport'],strictMode:false}

