import { TransformOptions, ParserOptions } from '@babel/core';

export var BabelSettings:TransformOptions = {sourceType:'module',presets:[['@babel/preset-env',{modules:false}],['@babel/preset-react',{modules:false}]],plugins:["@babel/plugin-transform-runtime"]}

export var ParseSettings:ParserOptions = {sourceType:'module',plugins:['asyncGenerators','dynamicImport'],strictMode:false}


