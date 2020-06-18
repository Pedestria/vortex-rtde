const fs = require("fs-extra");
const Babel = require("@babel/parser");
const traverse_1 = require("@babel/traverse");
const path = require("path");
const resolve = require("resolve");
const chalk = require("chalk");
 /******Division******/ 
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function createStarPackage(productionMode, entry) {
  let isProduction = productionMode; // if (isProduction){
  //     process.env.NODE_ENV = 'production'
  // }
  // else{
  //     process.env.NODE_ENV = 'development'
  // }
  //Logger.Log();

  let Graph = StarGraph(entry);
  console.log(Graph);
  fs.writeJson('./dep-graph.json', Graph, err => {
    if (err) return console.error(err);
    console.log('Wrote Star Graph to dep-graph.json ');
  }); //console.log(Graph.display());
}
 /******Division******/ 
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

//import * as terser from 'terser'
function StarGraph(entry) {
  if (isProduction) {
    fs.emptyDirSync('./cache/files');
    fs.emptyDirSync('./cache/libs');
  }

  const node_modules = 'node_modules'; //let resolvedEntry = path.resolve(entry)

  let Graph = new VortexGraph();
  let fileLoc = './dep-graph.json';
  let loadedFilesCache = [];
  GraphDepsAndModsForCurrentFile(addJsExtensionIfNecessary(entry), Graph);
  loadedFilesCache.push(entry);

  for (let dep of Graph.Graph.Star) {
    let str = './';

    if (loadedFilesCache.includes(dep.name) == false) {
      if (dep.name.includes(str) == true) {
        //Local File Graphing
        GraphDepsAndModsForCurrentFile(dep.name, Graph);
        loadedFilesCache.push(dep.name);
      } else {
        if (isLibrary == false) {
          GraphDepsForLib(dep, Graph);
          loadedFilesCache.push(dep.name);
        }
      }
    }
  } //console.log(loadedFilesCache)
  //console.log(loadedFilesCache)
  //console.log(resolveLibBundle("lodash",Graph,false))
  // console.log(resolveLibBundle('react'));
  //console.log(resolve.sync('aws-sdk'))
  //console.log(LocalizedResolve('./test/baha.js','../pooper/colop/mama.js'))


  return Graph;
}

function GraphDepsAndModsForCurrentFile(file, Graph) {
  SearchAndGraph(file, Graph);
  SearchAndGraph(file, Graph);
}

function GraphDepsForLib(dep, Graph) {
  if (dep instanceof ModuleDependency) {
    GraphDepsAndModsForCurrentFile(resolveLibBundle(dep.name), Graph);
  }
} // export function minifyIfProduction(file:string){
//     if(isProduction){ 
//         let fileName = path.basename(file,'.js')
//         let finalPath = './cache/files/' + fileName + '.min.js'
//         let min = terser.minify(fs.readFileSync(file).toString())
//         fs.ensureDirSync(path.dirname(finalPath))
//         fs.writeFileSync(finalPath,min.code)
//         return finalPath
//     }
//     else{
//         return addJsExtensionIfNecessary(file)
//     }
 /******Division******/ 
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function SearchAndGraph(file, Graph) {
  const buffer = fs.readFileSync(file, 'utf-8').toString();
  const jsCode = Babel.parse(buffer, {
    "sourceType": "module"
  });
  traverse_1.default(jsCode, {
    enter(path) {
      if (path.node.type === 'ImportDeclaration') {
        let modules = []; //console.log(path.node);

        for (let ImportType of path.node.specifiers) {
          if (ImportType.type === 'ImportDefaultSpecifier') {
            let mod = new Module(ImportType.local.name, ModuleTypes.EsDefaultOrNamespaceModule);
            modules.push(mod);
          } else if (ImportType.type === 'ImportSpecifier') {
            let mod = new Module(ImportType.local.name, ModuleTypes.EsModule);
            modules.push(mod);
          }
        } //console.log(modules)


        let currentImpLoc = new MDImportLocation(file, path.node.loc.start.line, modules);
        Transport(new EsModuleDependency(path.node.source.value, currentImpLoc), Graph, file, currentImpLoc);
      }
    }

  });
}
 /******Division******/ 
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function SearchAndGraph(file, Graph) {
  const buffer = fs.readFileSync(file, 'utf-8').toString();
  let str = './';
  const jsCode = Babel.parse(buffer, {
    "sourceType": "module"
  }); // fs.writeJson('./debug.json',jsCode, err => {
  //         if (err) return console.error(err)
  //         console.log('Debug Written')
  //       })

  traverse_1.default(jsCode, {
    enter(path) {
      if (path.node.type === 'VariableDeclaration') {
        let modules = [];

        if (path.node.declarations[0].init !== null) {
          if (path.node.declarations[0].init.type === 'CallExpression') {
            if (path.node.declarations[0].init.callee.name === 'require') {
              if (path.node.declarations[0].id.type === 'ObjectPattern') {
                for (let namedRequires of path.node.declarations[0].id.properties) {
                  //console.log(namedRequires.value)
                  modules.push(new Module(namedRequires.value.name, ModuleTypes.CjsModule));
                }
              } else {
                modules.push(new Module(path.node.declarations[0].id.name, ModuleTypes.CjsDefaultOrNamespaceModule));
              } //console.log(path.node.declarations[0].init.arguments[0].value)


              let currentImpLoc = new MDImportLocation(file, path.node.loc.start.line, modules);
              Transport(new CjsModuleDependency(path.node.declarations[0].init.arguments[0].value, currentImpLoc), Graph, file, currentImpLoc);
            }
          }
        }
      }

      if (path.node.type === 'ExpressionStatement') {
        let modules = [];

        if (path.node.expression.type === 'AssignmentExpression') {
          if (path.node.expression.left.type === 'MemberExpression' && path.node.expression.right.type === 'CallExpression') {
            if (path.node.expression.right.callee.name === 'require') {
              modules.push(new Module(path.node.expression.right.arguments[0].value, ModuleTypes.CjsDefaultOrNamespaceModule));
              let currentImpLoc = new MDImportLocation(file, path.node.loc.start.line, modules);
              Transport(new CjsModuleDependency(path.node.expression.right.arguments[0].value, currentImpLoc), Graph, file, currentImpLoc);
            }
          }
        }

        if (path.node.expression.type === 'CallExpression') {
          if (path.node.expression.callee.type === 'Identifier' && path.node.expression.callee.name == 'require') {
            modules.push(new Module('_Default_', ModuleTypes.CjsDefaultOrNamespaceModule));
            let currentImpLoc = new MDImportLocation(file, path.node.loc.start.line, modules);
            Transport(new CjsModuleDependency(path.node.expression.arguments[0].value, currentImpLoc), Graph, file, currentImpLoc);
          }

          if (path.node.expression.callee.type === 'CallExpression') {
            if (path.node.expression.callee.callee.name === 'require') {
              modules.push(new Module('_DefaultFunction_', ModuleTypes.CjsDefaultFunction));
              let currentImpLoc = new MDImportLocation(file, path.node.loc.start.line, modules);
              Transport(new CjsModuleDependency(path.node.expression.callee.arguments[0].value, currentImpLoc), Graph, file, currentImpLoc);
            }
          }
        }
      }
    }

  });
}
 /******Division******/ 
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function LocalizedResolve(rootFileDirToEntry, dependencyLocalDir) {
  if (rootFileDirToEntry == dependencyLocalDir) {
    return rootFileDirToEntry;
  } else if (path.dirname(dependencyLocalDir) == './') {
    return dependencyLocalDir;
  }

  let dirname = path.dirname(rootFileDirToEntry);
  let localFilePath = dependencyLocalDir;
  return './' + path.join(dirname, localFilePath);
}

function resolveLibBundle(nodeLibName) {
  //GraphDepsAndModsForCurrentFile(ResolveLibrary(nodeLibName),Graph)
  let minified = new RegExp('min');
  let bundles = ResolveLibrary(nodeLibName);

  if (bundles instanceof Array) {
    for (let lib of bundles) {
      if (lib.match(minified) && isProduction) {
        return lib;
      } else if (lib.match(minified) == null && isProduction == false) {
        return lib;
      }
    }
  } // else{
  // if(isProduction){
  //     let fileName = path.basename(bundles,'.js')
  //     let finalPath = './cache/libs/' + fileName + '.min.js'
  //     if(fs.existsSync(finalPath)){
  //         return finalPath
  //     }
  //     let fileToBeMinified = fs.readFileSync(bundles).toString()
  //     let min = terser.minify(fileToBeMinified)
  //     fs.writeFileSync(finalPath,min.code)
  //     return finalPath
  // }
  // else{


  return bundles; // }
}

function ResolveLibrary(packageName) {
  let packageIndexDirname = fixLibraryPath(resolve.sync(packageName));
  let testOutput = [];

  if (DefaultQuarkTable.findEntryByName(packageName) !== null) {
    return DefaultQuarkTable.QuarkLibs[DefaultQuarkTable.findEntryByName(packageName)].bundleLocs;
  }

  if (LibraryRelayVerify(packageIndexDirname).length == 0) {
    return packageIndexDirname;
  }

  for (let bundle of LibraryRelayVerify(packageIndexDirname)) {
    testOutput.push(LocalizedResolve(packageIndexDirname, bundle));
  }

  return testOutput;
}

function LibraryRelayVerify(packageIndexDirname) {
  const buffer = fs.readFileSync(packageIndexDirname, 'utf-8').toString();
  let regexp = new RegExp('./');
  const jsCode = Babel.parse(buffer, {
    "sourceType": "module"
  });
  let libBundles = [];
  traverse_1.default(jsCode, {
    enter(path) {
      if (path.node.type === 'ExpressionStatement') {
        if (path.node.expression.type === 'AssignmentExpression') {
          if (path.node.expression.left.type === 'MemberExpression' && path.node.expression.right.type === 'CallExpression') {
            if (path.node.expression.left.object.name === 'module' && path.node.expression.left.property.name === 'exports') {
              if (path.node.expression.right.callee.name === 'require') {
                //libBundles.push(LocalizedResolve(packageIndexDirname,path.path.node.expression.right.arguments[0].value))
                libBundles.push(path.node.expression.right.arguments[0].value);
              }
            }
          }
        }
      }
    }

  });
  return libBundles;
}

function fixLibraryPath(pathToFile) {
  if (pathToFile.search('node_modules') == -1) {
    throw new Error('Package Does not Exist!');
  } else {
    let i = pathToFile.search('node_modules');
    return './' + pathToFile.slice(i);
  }
}

function isQuarky(entryPoint) {
  const buffer = fs.readFileSync(entryPoint, 'utf-8').toString();
  let regexp = new RegExp('./');
  const jsCode = Babel.parse(buffer, {
    "sourceType": "module"
  });
  traverse_1.default(jsCode, {
    enter(path) {
      if (path.node.type === 'VariableDeclaration') {
        if (path.node.declarations[0].init !== null) {
          if (path.node.declarations[0].init.type === 'CallExpression') {
            if (path.node.declarations[0].init.callee.name === 'require') {
              if (path.node.declarations[0].id.type === 'ObjectPattern') {
                for (let namedRequires of path.node.declarations[0].id.properties) {
                  //console.log(namedRequires.value)
                  if (testForLocalFileRequires(LocalizedResolve(entryPoint, namedRequires.value))) {
                    return true;
                  }
                }
              } else {
                if (testForLocalFileRequires(LocalizedResolve(entryPoint, path.node.declarations[0].init.arguments[0].value))) {
                  return true;
                }
              }
            }
          }
        }
      }

      if (path.node.type === 'ExpressionStatement') {
        if (path.node.expression.type === 'AssignmentExpression') {
          if (path.node.expression.left.type === 'MemberExpression' && path.node.expression.right.type === 'CallExpression') {
            if (path.node.expression.right.callee.name === 'require') {
              if (testForLocalFileRequires(LocalizedResolve(entryPoint, path.node.expression.right.arguments[0].value))) {
                return true;
              }
            }
          }
        }

        if (path.node.expression.type === 'CallExpression') {
          if (path.node.expression.callee.type === 'CallExpression') {
            if (path.node.expression.callee.callee.name === 'require') {
              if (testForLocalFileRequires(LocalizedResolve(entryPoint, path.node.expression.callee.arguments[0].value))) {
                return true;
              }
            }
          }
        }
      }
    }

  });
  return false;
}

function testForLocalFileRequires(filename) {
  console.log(filename);
  const buffer = fs.readFileSync(addJsExtensionIfNecessary(filename), 'utf-8').toString();
  let regexp = new RegExp('./');
  const jsCode = Babel.parse(buffer, {
    "sourceType": "module"
  });
  traverse_1.default(jsCode, {
    enter(path) {
      if (path.node.type === 'VariableDeclaration') {
        //console.log(path.node)
        let modules = [];

        if (path.node.declarations[0].init.type === 'CallExpression') {
          if (path.node.declarations[0].init.callee.name === 'require') {
            if (path.node.declarations[0].id.type === 'ObjectPattern') {
              for (let namedRequires of path.node.declarations[0].id.properties) {
                if (namedRequires.value.match(regexp) !== null) {
                  return true;
                }
              }
            } else {
              if (path.node.declarations[0].init.arguments[0].value.match(regexp) !== null) {
                return true;
              }
            }
          }
        }
      }

      if (path.node.type === 'ExpressionStatement') {
        if (path.node.expression.type === 'AssignmentExpression') {
          if (path.node.expression.left.type === 'MemberExpression' && path.node.expression.right.type === 'CallExpression') {
            if (path.node.expression.right.callee.name === 'require') {
              if (path.node.expression.right.arguments[0].value.match(regexp) !== null) {
                return true;
              }
            }
          }
        }

        if (path.node.expression.type === 'CallExpression') {
          if (path.node.expression.callee.type === 'CallExpression') {
            if (path.node.expression.callee.callee.name === 'require') {
              if (path.node.expression.callee.arguments[0].value.match(regexp) !== null) {
                return true;
              }
            }
          }
        }
      }
    }

  });
  return false;
}

function addJsExtensionIfNecessary(file) {
  let jsExt = new RegExp('.js');

  if (file.match(jsExt) !== null) {
    return file;
  } else {
    return file + '.js';
  }
}
 /******Division******/ 
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

class EsModuleDependency extends ModuleDependency {
  constructor(name, initImportLocation) {
    super(name, initImportLocation);
  }

  verifyImportedModules(file, currentImpLoc) {
    const buffer = fs.readFileSync(file, 'utf-8').toString();
    const jsCode = Babel.parse(buffer, {
      "sourceType": "module"
    }).program.body;
    let modBuffer = []; //let VDefImport = new RegExp('_VDefaultImport_')
    //let VNamImport = new RegExp('_VNamedImport_')
    //let VDefExport = new RegExp('_VDefaultExport_')
    //let VNamExport = new RegExp('_VNamedExport_')

    for (let node of jsCode) {
      //console.log(node)
      if (node.type === 'ExportDefaultDeclaration') {
        //console.log(node)
        let defaultMod = node.declaration;
        let modid = defaultMod.id.name;
        modBuffer.push(new Module(modid, ModuleTypes.EsDefaultOrNamespaceModule));
      }

      if (node.type == 'ExportNamedDeclaration') {
        //console.log(node)
        for (let ExportType of node.specifiers) {
          if (ExportType.type === 'ExportSpecifier') {
            let mod = ExportType.exported.name;
            modBuffer.push(new Module(mod, ModuleTypes.EsModule));
          }
        }

        let mod = node.declaration.id.name;
        modBuffer.push(new Module(mod, ModuleTypes.EsModule));
      }
    }

    let dummyImpLoc = new MDImportLocation('buffer', 0, modBuffer); //let confModImp = []
    //let confModExp = []
    //let index = this.indexOfImportLocation(file)
    //console.log(confModExp,confModImp)

    let NonExtError = new Error(chalk.bgRed('Non Existant Modules Imported from ' + file));

    for (let mod of currentImpLoc.modules) {
      if (dummyImpLoc.testForModule(mod) == false) {
        throw NonExtError;
      }
    }
  }

}
 /******Division******/ 
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

class CjsModuleDependency extends ModuleDependency {
  constructor(name, initImportLocation) {
    super(name, initImportLocation);
  }

  verifyImportedModules(file, currentImpLoc) {
    const buffer = fs.readFileSync(file, 'utf-8').toString();
    const jsCode = Babel.parse(buffer, {
      "sourceType": "module"
    }).program.body;
    let modBuffer = []; //console.log("Calling" + file)

    for (let node of jsCode) {
      if (node.type === 'ExpressionStatement') {
        if (node.expression.type === 'AssignmentExpression') {
          if (node.expression.left.type === 'MemberExpression') {
            if (node.expression.left.object.name === 'module' && node.expression.left.property.name === 'exports') {
              //console.log(node.expression.right)
              if (node.expression.right.type === 'FunctionExpression' || node.expression.right.type === 'ArrowFunctionExpression') {
                modBuffer.push(new Module('_DefaultFunction_', ModuleTypes.CjsDefaultFunction));
              } else {
                modBuffer.push(new Module(node.expression.right.name, ModuleTypes.CjsModule));
              }
            }
          }
        }
      }
    }

    let dummyImpLoc = new MDImportLocation('buffer', 0, modBuffer); // let confModImp = []
    // let confModExp = []
    //let index = this.indexOfImportLocation(file)
    // console.log(confModExp,confModImp)
    // console.log(this.acquiredModules)
    // console.log(modBuffer)

    let NonExtError = new Error(chalk.bgRed('Non Existant Modules Imported from ' + file));

    for (let mod of currentImpLoc.modules) {
      if (dummyImpLoc.testForModule(mod) == false) {
        throw NonExtError;
      }
    }
  }

}
 /******Division******/ 
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

class VortexGraph {
  constructor() {
    this.Graph = {
      Star: Array()
    };
  }

  add(Dependency) {
    this.Graph.Star.push(Dependency);
  }

  searchFor(Dependency) {
    for (let dep of this.Graph.Star) {
      if (Dependency.name == dep.name) {
        return true;
      }
    }

    return false;
  }

  update(newDependency) {
    for (let dep of this.Graph.Star) {
      if (newDependency instanceof ModuleDependency && dep instanceof ModuleDependency) {
        ModuleDependencyUpdater(newDependency, dep);
      }
    }
  }

  remove(Dependency) {
    let index = this.Graph.Star.indexOf(Dependency);
    this.Graph.Star.splice(index);
  }

  display() {
    return this.Graph.Star;
  }

}

function ModuleDependencyUpdater(newDependency, dep) {
  if (dep.name == newDependency.name) {
    // for(let newMod of newDependency.acquiredModules){
    //     if(dep.testForModule(newMod) == false){
    //         dep.acquiredModules.push(newMod)
    //     }
    // }
    for (let newImpLoc of newDependency.importLocations) {
      if (dep.testForImportLocation(newImpLoc.name) == false) {
        dep.importLocations.push(newImpLoc);
      }
    }
  }
}
 /******Division******/ 
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

//import MDImportLocation from "./MDImportLocation.js";
//
//Transports Dependencies into the Graph
//
function Transport(Dependency, Graph, CurrentFile, CurrentMDImpLoc) {
  let str = './';

  if (Dependency.name.includes(str)) {
    Dependency.updateName(LocalizedResolve(CurrentFile, addJsExtensionIfNecessary(Dependency.name)));

    if (Dependency instanceof EsModuleDependency || Dependency instanceof CjsModuleDependency) {
      Dependency.verifyImportedModules(Dependency.name, CurrentMDImpLoc);
    }
  } else {
    if (Dependency instanceof ModuleDependency) {
      Dependency.libLoc = resolveLibBundle(Dependency.name);
    }
  }

  if (Graph.searchFor(Dependency)) {
    Graph.update(Dependency);
  } else {
    Graph.add(Dependency);
  }
}
 /******Division******/ 
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

class ModuleDependency extends Dependency {
  constructor(name, initImportLocation) {
    super(name, initImportLocation); //this.acquiredModules = acquiredModules
  }

}
 /******Division******/ 
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
 /******Division******/ 
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

class Module {
  constructor(name, type) {
    this.name = name;
    this.type = type;
  }

}

var ModuleTypes;

(function (ModuleTypes) {
  ModuleTypes[ModuleTypes["EsModule"] = 0] = "EsModule";
  ModuleTypes[ModuleTypes["EsDefaultOrNamespaceModule"] = 1] = "EsDefaultOrNamespaceModule";
  ModuleTypes[ModuleTypes["CjsModule"] = 2] = "CjsModule";
  ModuleTypes[ModuleTypes["CjsDefaultOrNamespaceModule"] = 3] = "CjsDefaultOrNamespaceModule";
  ModuleTypes[ModuleTypes["CjsDefaultFunction"] = 4] = "CjsDefaultFunction";
})(ModuleTypes = exports.ModuleTypes || (exports.ModuleTypes = {}));
 /******Division******/ 
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

class MDImportLocation extends ImportLocation {
  constructor(name, line, modules) {
    super(name, line);
    this.modules = modules;
  }

  testForModule(module) {
    for (let mod of this.modules) {
      if (mod.name == module.name) {
        return true;
      }
    }

    return false;
  }

}
 /******Division******/ 
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

class QuarkLibTable {
  constructor() {
    this.QuarkLibs = [];
  }

  addEntry(entry) {
    this.QuarkLibs.push(entry);
  }

  findEntryByName(entryName) {
    for (let ent of this.QuarkLibs) {
      if (ent.name == entryName) {
        return this.QuarkLibs.indexOf(ent);
      }
    } // Returns false if it can't find the entry.


    return null;
  }

}

class QuarkLibEntry {
  constructor(name, bundleLocs) {
    this.name = name;
    this.bundleLocs = bundleLocs;
  }

}

exports.DefaultQuarkTable.addEntry(new QuarkLibEntry('aws-sdk', ['./node_modules/aws-sdk/dist/aws-sdk.js', './node_modules/aws-sdk/dist/aws-sdk.min.js']));
 /******Division******/ 
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

class Dependency {
  constructor(name, initImportLocation) {
    this.name = name;
    this.importLocations = [];
    this.importLocations.push(initImportLocation);
  }

  testForImportLocation(impLocName) {
    for (let impLoc of this.importLocations) {
      if (impLoc.name == impLocName) {
        return true;
      }
    }

    return false;
  }

  indexOfImportLocation(impLocName) {
    for (let impLoc of this.importLocations) {
      if (impLoc.name == impLocName) {
        return this.importLocations.indexOf(impLoc);
      }
    }
  }

  updateName(newName) {
    this.name = newName;
  }

  isLibraryDependency() {
    if (this.name.includes('./')) {
      return false;
    } else {
      return true;
    }
  }

}
 /******Division******/ 
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

class ImportLocation {
  constructor(name, line) {
    this.name = name;
    this.line = line;
  }

}