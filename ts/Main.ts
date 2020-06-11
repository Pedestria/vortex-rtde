import * as VortexSearch from './Find'
import * as chalk from 'chalk'
import * as Logger from './Log'


function Bundle (productionMode:boolean){

    let isProduction:boolean = productionMode;

    if (isProduction){
        process.env.NODE_ENV = 'production'
    }
    else{
        process.env.NODE_ENV = 'development'
    }
    //Logger.Log();

    VortexSearch.GraphStar('./test.js');
}


Bundle(false);