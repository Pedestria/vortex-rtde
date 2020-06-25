import * as t from '@babel/types'
import { TransformOptions } from '@babel/core';

export var isProduction:boolean = false ;
export var isLibrary:boolean = false;
export var usingTerser:boolean = false;

export var BabelSettings:TransformOptions = {sourceType:'module',presets:[['@babel/preset-env',{modules:false}],['@babel/preset-react',{modules:false}]]}


