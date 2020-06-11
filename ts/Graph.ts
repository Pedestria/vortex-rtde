export class VortexGraph {

    Graph = {
        Application:Array<Dependency>
    };

    constructor(){
       
    }

    newDependency(name:string, acquiredModules:Array<String>,superDependency?:string){
        let Dependency:Dependency = {
            name,
            acquiredModules,
            superDependency?
        };
        
        Dependency.name = name
        Dependency.acquiredModules = acquiredModules
        Dependency.superDependency = superDependency

        this.Graph.Application.push(Dependency);
    }

    display(): Array<Dependency> {

        return this.Graph.Application

    }
}


interface Dependency {
    name:string,
    acquiredModules:Array<String>,
    superDependency?:string
}