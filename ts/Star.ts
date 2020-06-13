import { VortexGraph } from "./Graph.js";
import * as StarCreator from './Compiler'

export default class Star {
    name:string
    StarGraph:VortexGraph

    constructor(name:string,stargraph:VortexGraph){
        this.name = name
        this.StarGraph = stargraph
    }

    generate(stargraph:VortexGraph){
        return StarCreator.default(stargraph)
    }

}