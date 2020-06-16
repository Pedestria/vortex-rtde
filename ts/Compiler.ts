import { VortexGraph } from "./Graph.js";
import * as fs from 'fs-extra'
import EsModuleDependency from "./dependencies/EsModuleDependency.js";

//Transforms VortexGraph into a Star/Bundle
export default function Compile(Graph:VortexGraph){


}

function LibCompile(Graph:VortexGraph){

    for(let dep of Graph.Graph.Star){

    }

}

function Division(){
    let code =`/******Division******/`
    return code
}

class LibBundle {
    code:string
    queue:Array<string>


    constructor(){}

    addFileEntry(codeOfFile:string){
        this.queue.push(codeOfFile)
    }

    addEntriesToCode(){
        for(let file of this.queue){
            this.queue.concat(Division())
            this.queue.concat(file)
        }
    }

}