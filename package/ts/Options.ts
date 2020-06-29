import { TransformOptions } from '@babel/core';

export var BabelSettings:TransformOptions = {sourceType:'module',presets:[['@babel/preset-env',{modules:false}],['@babel/preset-react',{modules:false}]]}


