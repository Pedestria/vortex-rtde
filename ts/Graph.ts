import Module from "./Module.js";
import Dependency from './Dependency'

export class VortexGraph {

    Graph = {
        Star:Array<Dependency>
    };

    constructor(){}

    add(Dependency:Dependency){
        this.Graph.Star.push(Dependency);
    }

    searchFor(Dependency:Dependency) : boolean {
        for (let dep of this.Graph.Star){
            if(Dependency.name == dep.name) {
                return true
            }
        }
        return false
    }
    update(newDependency:Dependency){
        for (let dep of this.Graph.Star){
            if(dep.name == newDependency.name) {
                for(let newMod of newDependency.acquiredModules){
                    if(dep.testForModule(newMod) == false){
                        dep.acquiredModules.push(newMod)
                    }
                }
                for(let newSupDep of newDependency.superDependencies){
                    if(dep.testForSuperDependency(newSupDep) == false){
                        dep.superDependencies.push(newSupDep)
                    }
                }
            }
        }
    }

    remove(Dependency:Dependency){
        let index = this.Graph.Star.indexOf(Dependency)
        this.Graph.Star.splice(index)
    }

    display(): Array<Dependency> {
        return this.Graph.Star
    }
}
