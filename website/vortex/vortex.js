/*STAR*/ 
 /*Vortex_RTDE 0.4.1 
 Alex Topper 
 License: MIT 
 A real time web application/js library development environment. */ 
/*NODE_REQUIRES*/ 
const fs = require("fs-extra");
const terser = require("terser");
const path = require("path");
const Panel = require("../vortex.panel.js");
const chalk = require("chalk");
const cliSpinners = require("cli-spinners");
const ora = require("ora");
const os = require("os");
const Babel = require("@babel/parser");
const babel_core_NAMESPACE = require("@babel/core");
const babel_generator_NAMESPACE = require("@babel/generator");
const babel_traverse_NAMESPACE = require("@babel/traverse");
const t = require("@babel/types");
const resolve = require("resolve");
 /*LIB_CODE*/ 

 /*VORTEX_DIVIDER*/ 
class ImportLocation {
  constructor(name, line) {
    this.name = name;
    this.line = line;
  }

}
 /*VORTEX_DIVIDER*/ 
/**
 * A Dependent File or Library that is required by another file.
 */
class Dependency {
  /**
   *
   * @param {string} name Name of Dependency
   * @param {ImportLocation} initImportLocation Inital location where the Dependency is imported from
   */
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
 /*VORTEX_DIVIDER*/ 
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

var DefaultQuarkTable = new QuarkLibTable();
DefaultQuarkTable.addEntry(new QuarkLibEntry('aws-sdk', ['./node_modules/aws-sdk/dist/aws-sdk.js', './node_modules/aws-sdk/dist/aws-sdk.min.js']));
 /*VORTEX_DIVIDER*/ 
class FileImportLocation extends ImportLocation {
  constructor(name, line, relativePathToDep, localName) {
    super(name, line);
    this.relativePathToDep = relativePathToDep;
    this.localName = localName;
  }

}
 /*VORTEX_DIVIDER*/ 
/**
 * A Stylesheet Dependency
 * @extends Dependency
 */
class CSSDependency extends Dependency {
  constructor(name, initImportLocation, stylesheet) {
    super(name, initImportLocation);
    this.stylesheet = stylesheet;
  }

}
 /*VORTEX_DIVIDER*/ 
/**
 * An Exported Function, Class, or Variable from a specific file or library.
 */
class Module {
  /**
   *
   * @param {string} name Name of Module
   * @param {ModuleTypes} type Type of Module
   */
  constructor(name, type) {
    this.name = name;
    this.type = type;
  }

}
/**
 * The Standardized System For Vortex Module Types
 */


var ModuleTypes;

(function (ModuleTypes) {
  /**
   * Named ECMAScript Module
   */
  ModuleTypes[ModuleTypes["EsModule"] = 0] = "EsModule";
  /**
   * Default ECMAScript Module
   */

  ModuleTypes[ModuleTypes["EsDefaultModule"] = 1] = "EsDefaultModule";
  /**
   * ECMAScript Namespace __(Import * as -- from -- )__
   */

  ModuleTypes[ModuleTypes["EsNamespaceProvider"] = 2] = "EsNamespaceProvider";
  /**
   * Named CommonJS Module
   */

  ModuleTypes[ModuleTypes["CjsModule"] = 2] = "CjsModule";
  /**
   * Defualt CommonJs Module
   */

  ModuleTypes[ModuleTypes["CjsDefaultModule"] = 3] = "CjsDefaultModule";
  /**
   * Default CommonJS Module Executed on Call.
   * __(module.exports = () => {--MODULE CODE HERE--})__
   */

  ModuleTypes[ModuleTypes["CjsDefaultFunction"] = 4] = "CjsDefaultFunction";
  /**
   * CommonJS Namespace __(const -- = require(--))__
   */

  ModuleTypes[ModuleTypes["CjsNamespaceProvider"] = 5] = "CjsNamespaceProvider";
})(ModuleTypes || (ModuleTypes = {}));
 /*VORTEX_DIVIDER*/ 
class MDImportLocation extends ImportLocation {
  constructor(name, line, modules, relativePath) {
    super(name, line);
    this.modules = modules;
    this.relativePathToDep = relativePath;
  }

  testForModule(module) {
    for (let mod of this.modules) {
      if (mod.name == module.name) {
        return true;
      }
    }

    return false;
  }

  indexOfModuleByName(name) {
    for (let mod of this.modules) {
      if (mod.name == name) {
        return this.modules.indexOf(mod);
      }
    }

    return null;
  }

}
 /*VORTEX_DIVIDER*/ 
var BabelSettings = {
  sourceType: 'module',
  presets: [['@babel/preset-env', {
    modules: false
  }], ['@babel/preset-react', {
    modules: false
  }]]
};
 /*VORTEX_DIVIDER*/ 
/**
 * A JavaScript Dependency where modules are acquired from.
 *
 * @extends Dependency
 *
 */
class ModuleDependency extends Dependency {
  constructor(name, initImportLocation) {
    super(name, initImportLocation);
    this.outBundle = false; //this.acquiredModules = acquiredModules
  }

}
 /*VORTEX_DIVIDER*/ 
var CjsModuleGrapher = {
  SearchAndGraph: function (entry, Graph) {
    // fs.writeJson('./debug.json',jsCode, err => {
    //         if (err) return console.error(err)
    //         console.log('Debug Written')
    //       })
    babel_traverse_NAMESPACE.default(entry.ast, {
      VariableDeclarator: function (path) {
        let modules = [];

        if (path.node.init !== null) {
          if (path.node.init.type === 'CallExpression') {
            if (path.node.init.callee.name === 'require') {
              if (path.node.id.type === 'ObjectPattern') {
                for (let namedRequires of path.node.id.properties) {
                  //console.log(namedRequires.value)
                  modules.push(new Module(namedRequires.value.name, ModuleTypes.CjsModule));
                }
              } else {
                modules.push(new Module(path.node.id.name, ModuleTypes.CjsNamespaceProvider));
              } //console.log(path.node.declarations[0].init.arguments[0].value)


              let currentImpLoc = new MDImportLocation(entry.name, path.node.loc.start.line, modules, path.node.init.arguments[0].value);
              Transport(new CjsModuleDependency(path.node.init.arguments[0].value, currentImpLoc), Graph, entry.name, currentImpLoc);
            }
          }
        }
      },
      ExpressionStatement: function (path) {
        let modules = [];

        if (path.node.expression.type === 'AssignmentExpression') {
          if (path.node.expression.left.type === 'MemberExpression' && path.node.expression.right.type === 'CallExpression') {
            if (path.node.expression.right.callee.name === 'require') {
              modules.push(new Module(path.node.expression.right.arguments[0].value, ModuleTypes.CjsNamespaceProvider));
              let currentImpLoc = new MDImportLocation(entry.name, path.node.loc.start.line, modules, path.node.expression.right.arguments[0].value);
              Transport(new CjsModuleDependency(path.node.expression.right.arguments[0].value, currentImpLoc), Graph, entry.name, currentImpLoc);
            }
          }
        }

        if (path.node.expression.type === 'CallExpression') {
          if (path.node.expression.callee.type === 'Identifier' && path.node.expression.callee.name == 'require') {
            modules.push(new Module('_Default_', ModuleTypes.CjsDefaultModule));
            let currentImpLoc = new MDImportLocation(entry.name, path.node.loc.start.line, modules, path.node.expression.arguments[0].value);
            Transport(new CjsModuleDependency(path.node.expression.arguments[0].value, currentImpLoc), Graph, entry.name, currentImpLoc);
          }

          if (path.node.expression.callee.type === 'CallExpression') {
            if (path.node.expression.callee.callee.name === 'require') {
              modules.push(new Module('_DefaultFunction_', ModuleTypes.CjsDefaultFunction));
              let currentImpLoc = new MDImportLocation(entry.name, path.node.loc.start.line, modules, path.node.expression.callee.arguments[0].value);
              Transport(new CjsModuleDependency(path.node.expression.callee.arguments[0].value, currentImpLoc), Graph, entry.name, currentImpLoc);
            }
          }
        }
      }
    });
  }
};
 /*VORTEX_DIVIDER*/ 
/**
 * The Dependency Graph used by Vortex
 */
class VortexGraph {
  /**
   * @param {string} entrypoint Entry point
   */
  constructor(entrypoint) {
    /**
     * List of ALL Dependencys for app/library
     */
    this.Star = [];
    this.entryPoint = entrypoint;
  }
  /**
   * Adds entry to Graph
   * @param {Dependency} Dependency Dependency to add to Graph
   */


  add(Dependency) {
    this.Star.push(Dependency);
  }
  /**
   * Checks to see if dependency has already been added to Graph. __Type sensitive!!__
   * @param {Dependency} Dependency Dependency to check for
   * @returns {boolean} True or False
   */


  searchFor(Dependency) {
    for (let dep of this.Star) {
      if (Dependency.name == dep.name && Object.getPrototypeOf(dep) === Object.getPrototypeOf(Dependency)) {
        return true;
      }
    }

    return false;
  }
  /**
   * Updates old dependency with same name with new dependency
   * @param {Dependency} newDependency The __New__ Dependency to replace the old dependency sharing the same name.
   */


  update(newDependency) {
    for (let dep of this.Star) {
      if (dep.name == newDependency.name) {
        for (let newImpLoc of newDependency.importLocations) {
          if (dep.testForImportLocation(newImpLoc.name) == false) {
            dep.importLocations.push(newImpLoc);
          }
        }
      }
    }
  }

  remove(Dependency) {
    let index = this.Star.indexOf(Dependency);
    this.Star.splice(index);
  }

}
 /*VORTEX_DIVIDER*/ 
var EsModuleGrapher = {
  SearchAndGraph: function (entry, Graph) {
    babel_traverse_NAMESPACE.default(entry.ast, {
      ImportDeclaration: function (path) {
        if (isJs(path.node.source.value)) {
          let modules = []; //console.log(path.node);

          for (let ImportType of path.node.specifiers) {
            if (ImportType.type === 'ImportDefaultSpecifier') {
              let mod;
              mod = new Module(ImportType.local.name, ModuleTypes.EsDefaultModule); // else{
              //     mod = new Module(ImportType.local.name,ModuleTypes.CjsNamespaceProvider)
              // }

              modules.push(mod);
            } else if (ImportType.type === 'ImportSpecifier') {
              let mod = new Module(ImportType.local.name, ModuleTypes.EsModule);
              modules.push(mod);
            } else {
              let mod = new Module(ImportType.local.name, ModuleTypes.EsNamespaceProvider);
              modules.push(mod);
            }
          } //console.log(modules)


          let currentImpLoc = new MDImportLocation(entry.name, path.node.loc.start.line, modules, path.node.source.value);
          let dep = new EsModuleDependency(path.node.source.value, currentImpLoc);

          if (path.node.trailingComments !== undefined) {
            if (path.node.trailingComments[0].value === 'vortexRetain') {
              dep.outBundle = true;
            }
          }

          Transport(dep, Graph, entry.name, currentImpLoc);
        } else {
          //For Non-Module Dependencies.
          let impLoc = new FileImportLocation(entry.name, path.node.loc.start.line, path.node.source.value, path.node.specifiers[0] !== undefined ? path.node.specifiers[0].local.name : null);
          let dep = resolveDependencyType(path.node.source.value, impLoc, entry.name);
          Transport(dep, Graph, entry.name);
        }
      }
    });
  }
};
/**Searchs and Graphs JS code for ECMAScript Module Dependencies
 *
 * @param {QueueEntry} entry
 * @param {VortexGraph} Graph
 */
//import Dependency from "../Dependency.js";
 /*VORTEX_DIVIDER*/ 
//import Dependency from "../Dependency.js";

/** CommonJS Dependency that contain exported Modules
 * @extends ModuleDependency
 */
class CjsModuleDependency extends ModuleDependency {
  constructor(name, initImportLocation) {
    super(name, initImportLocation);
  }

  verifyImportedModules(entry, currentImpLoc) {
    let modBuffer = []; //console.log("Calling" + file)

    babel_traverse_NAMESPACE.default(entry.ast, {
      ExpressionStatement: function (path) {
        if (path.node.expression.type === 'AssignmentExpression') {
          if (path.node.expression.left.type === 'MemberExpression') {
            if (path.node.expression.left.object.name === 'module' && path.node.expression.left.property.name === 'exports') {
              //console.log(path.node.expression.right)
              if (path.node.expression.right.type === 'FunctionExpression' || path.node.expression.right.type === 'ArrowFunctionExpression') {
                modBuffer.push(new Module('_DefaultFunction_', ModuleTypes.CjsDefaultFunction));
              } else {
                modBuffer.push(new Module(path.node.expression.right.name, ModuleTypes.CjsModule));
              }
            }

            if (path.node.expression.left.object.name === 'exports') {
              if (path.node.expression.left.property.name === 'default') {
                if (path.node.expression.right.type !== 'UnaryExpression') {
                  modBuffer.push(new Module(path.node.expression.right.name, ModuleTypes.CjsDefaultModule));
                }
              } else {
                if (path.node.expression.right.type !== 'UnaryExpression') {
                  modBuffer.push(new Module(path.node.expression.right.name, ModuleTypes.CjsModule));
                }
              }
            }
          }
        }
      }
    });
    let dummyImpLoc = new MDImportLocation('buffer', 0, modBuffer, ''); //console.log(dummyImpLoc)
    // let confModImp = []
    // let confModExp = []
    //let index = this.indexOfImportLocation(file)
    // console.log(confModExp,confModImp)
    // console.log(this.acquiredModules)
    // console.log(modBuffer)
    //console.log(currentImpLoc)

    let NonExtError = new Error(chalk.redBright('Non Existant Modules Imported from ' + entry.name));

    for (let mod of currentImpLoc.modules) {
      if (dummyImpLoc.testForModule(mod) == false) {
        for (let modName of findModulesUnderNamespace(currentImpLoc.name, mod.name)) {
          if (searchForModuleUnderNamespace(currentImpLoc.name, modName, mod.name) == false) {
            throw NonExtError;
          }
        }

        currentImpLoc.modules[currentImpLoc.indexOfModuleByName(mod.name)].type = ModuleTypes.CjsNamespaceProvider;
      }
    }
  }

}
 /*VORTEX_DIVIDER*/ 
/**ECMAScript Dependency that contain exported Modules.
 * @extends ModuleDependency
 */
class EsModuleDependency extends ModuleDependency {
  constructor(name, initImportLocation) {
    super(name, initImportLocation);
  }

  verifyImportedModules(entry, currentImpLoc) {
    let modBuffer = []; //let VDefImport = new RegExp('_VDefaultImport_')
    //let VNamImport = new RegExp('_VNamedImport_')
    //let VDefExport = new RegExp('_VDefaultExport_')
    //let VNamExport = new RegExp('_VNamedExport_')

    babel_traverse_NAMESPACE.default(entry.ast, {
      ExportDefaultDeclaration: function (path) {
        let defaultMod = path.node.declaration;
        let modid = defaultMod.id.name;
        modBuffer.push(new Module(modid, ModuleTypes.EsDefaultModule));

        if (path.node.declaration.type === 'ClassDeclaration') {
          let mod = path.node.declaration.id.name;
          modBuffer.push(new Module(mod, ModuleTypes.EsDefaultModule));
        }

        if (path.node.declaration.type === 'FunctionDeclaration') {
          let mod = path.node.declaration.id.name;
          modBuffer.push(new Module(mod, ModuleTypes.EsDefaultModule));
        }
      },
      ExportNamedDeclaration: function (path) {
        if (path.node.declaration.type === 'VariableDeclaration') {
          let mod = path.node.declaration.declarations[0].id.name;
          modBuffer.push(new Module(mod, ModuleTypes.EsModule));
        } else if (path.node.declaration.type === 'ClassDeclaration') {
          let mod = path.node.declaration.id.name;
          modBuffer.push(new Module(mod, ModuleTypes.EsModule));
        } else if (path.node.declaration.type === 'FunctionDeclaration') {
          let mod = path.node.declaration.id.name;
          modBuffer.push(new Module(mod, ModuleTypes.EsModule));
        } else {
          for (let ExportType of path.node.specifiers) {
            if (ExportType.type === 'ExportSpecifier') {
              let mod = ExportType.exported.name;
              modBuffer.push(new Module(mod, ModuleTypes.EsModule));
            }
          }

          let mod = path.node.declaration.id.name;
          modBuffer.push(new Module(mod, ModuleTypes.EsModule));
        }
      }
    });
    let dummyImpLoc = new MDImportLocation('buffer', 0, modBuffer, ''); //let confModImp = []
    //let confModExp = []
    //let index = this.indexOfImportLocation(file)
    //console.log(modBuffer)
    //console.log(currentImpLoc.modules)
    //console.log(confModExp,confModImp)

    let NonExtError = new Error(chalk.redBright('Non Existent Modules Imported from ' + entry.name));

    for (let mod of currentImpLoc.modules) {
      if (dummyImpLoc.testForModule(mod) == false) {
        for (let modName of findModulesUnderNamespace(currentImpLoc.name, mod.name)) {
          if (searchForModuleUnderNamespace(currentImpLoc.name, modName, mod.name) == false) {
            throw NonExtError;
          }
        } //currentImpLoc.modules[currentImpLoc.indexOfModuleByName(mod.name)].type = ModuleTypes.CjsNamespaceProvider

      }
    }
  }

}
 /*VORTEX_DIVIDER*/ 
function findModulesUnderNamespace(file, Namespace) {
  const buffer = fs.readFileSync(file, 'utf-8').toString();
  const jsCode = Babel.parse(buffer, {
    "sourceType": "module"
  });
  let modules = [];
  babel_traverse_NAMESPACE.default(jsCode, {
    MemberExpression: function (path) {
      if (path.node.object.type === 'Identifier') {
        var namespace = path.node.object.name;
      }

      if (path.node.property.type === 'Identifier') {
        if (namespace == Namespace) {
          modules.push(path.node.property.name);
        }
      }
    }
  });
  return modules;
}

function searchForModuleUnderNamespace(file, Module, Namespace) {
  const buffer = fs.readFileSync(file, 'utf-8').toString();
  const jsCode = Babel.parse(buffer, {
    "sourceType": "module"
  });
  let rc = false;
  babel_traverse_NAMESPACE.default(jsCode, {
    MemberExpression: function (path) {
      if (path.node.object.type === 'Identifier') {
        var namespace = path.node.object.name;
      }

      if (path.node.property.type === 'Identifier') {
        if (namespace == Namespace) {
          if (path.node.property.name === Module) {
            rc = true;
          }
        }
      }
    }
  });
  return rc;
}
 /*VORTEX_DIVIDER*/ 
/**Resolves dependency location based off of Import Location
 * __(To allow Node File System to read/verify imported modules)__
 *
 * @param {string} rootFileDirToEntry Directory to Current File
 * @param {string} dependencyLocalDir Directory _(according to Current File)_ to Dependency
 * @returns {string} A Resolved Dependency location.
 */
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
/**Resolves a Node Module
 *
 * @param {string} nodeLibName Name of Node Module to Resolve
 * @returns {string} A Locally Resolved library bundle location __(Depending on global config, will return either minified or development bundle. If a minified bundle does NOT exist, a cache directory will be made and the bundle will be minfied using _Terser_ )__
 */


function resolveLibBundle(nodeLibName) {
  //GraphDepsAndModsForCurrentFile(ResolveLibrary(nodeLibName),Graph)
  let minified = new RegExp('min');
  let STD_NODE_LIBS = ['path', 'fs', 'module', 'os'];

  if (STD_NODE_LIBS.includes(nodeLibName)) {
    return 'node.js';
  }

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
  babel_traverse_NAMESPACE.default(jsCode, {
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
  if (pathToFile.includes('node_modules') == false) {
    throw new Error(chalk.redBright('Package "' + pathToFile + '" does not Exist!'));
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
  babel_traverse_NAMESPACE.default(jsCode, {
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
  babel_traverse_NAMESPACE.default(jsCode, {
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
 /*VORTEX_DIVIDER*/ 
function getFileExtension(filename) {
  let i = filename.lastIndexOf('.');
  return filename.slice(i);
}

function resolveDependencyType(name, initImportLoc, currentFile) {
  let resolvedDependency;

  switch (getFileExtension(name)) {
    case '.css':
      resolvedDependency = new CSSDependency(LocalizedResolve(currentFile, name), initImportLoc, fs.readFileSync(LocalizedResolve(currentFile, name)).toString());
      break;
  }

  return resolvedDependency;
}
 /*VORTEX_DIVIDER*/ 
//import * as terser from 'terser'
var queue = [];

function isInQueue(entryName) {
  for (let ent of queue) {
    if (ent.name === entryName) {
      return true;
    }
  }

  return false;
}

function addEntryToQueue(entry) {
  queue.push(entry);
}

function loadEntryFromQueue(entryName) {
  for (let ent of queue) {
    if (ent.name === entryName) {
      return ent;
    }
  }
}

class QueueEntry {
  constructor(name, parsedCode) {
    this.name = name;
    this.ast = parsedCode;
  }

}
/**
 * Generates a Vortex Graph of your app/library.
 * @param {string} entry Entry point for GraphGenerator
 * @returns {VortexGraph} A Dependency Graph
 *
 */


async function GenerateGraph(entry) {
  const node_modules = 'node_modules'; //let resolvedEntry = path.resolve(entry)

  let Graph = new VortexGraph(entry);
  let loadedFilesCache = [];
  let modEnt = addJsExtensionIfNecessary(entry);
  let entryFile = fs.readFileSync(modEnt).toString();

  if (!isLibrary) {
    entryFile = babel_core_NAMESPACE.transformSync(fs.readFileSync(modEnt).toString(), BabelSettings).code;
  }

  let entryAst = Babel.parse(entryFile, {
    "sourceType": 'module'
  });
  addEntryToQueue(new QueueEntry(entry, entryAst));
  GraphDepsAndModsForCurrentFile(loadEntryFromQueue(modEnt), Graph);
  loadedFilesCache.push(entry);

  for (let dep of Graph.Star) {
    if (dep instanceof ModuleDependency) {
      if (dep.outBundle !== true) {
        let str = './';

        if (loadedFilesCache.includes(dep.name) == false) {
          if (dep.name.includes(str) == true) {
            let modName = addJsExtensionIfNecessary(dep.name);

            if (isInQueue(modName)) {
              GraphDepsAndModsForCurrentFile(loadEntryFromQueue(modName), Graph);
            } else {
              let file = fs.readFileSync(modName).toString();

              if (!isLibrary) {
                file = babel_core_NAMESPACE.transformSync(file, BabelSettings).code;
              }

              let entryAst = Babel.parse(file, {
                "sourceType": 'module'
              });
              let ent = new QueueEntry(modName, entryAst);
              addEntryToQueue(ent);
              GraphDepsAndModsForCurrentFile(loadEntryFromQueue(ent.name), Graph);
            }

            loadedFilesCache.push(modName);
          } else {
            if (dep instanceof ModuleDependency) {
              if (!isLibrary) {
                if (isInQueue(dep.libLoc)) {
                  GraphDepsAndModsForCurrentFile(dep.libLoc);
                } else {
                  let ent = new QueueEntry(dep.libLoc, Babel.parse(fs.readFileSync(dep.libLoc).toString(), {
                    "sourceType": 'module'
                  }));
                  addEntryToQueue(ent);
                  GraphDepsAndModsForCurrentFile(loadEntryFromQueue(ent.name), Graph);
                }
              }

              loadedFilesCache.push(dep.name);
            }
          }
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

function GraphDepsAndModsForCurrentFile(entry, Graph) {
  EsModuleGrapher.SearchAndGraph(entry, Graph);
  CjsModuleGrapher.SearchAndGraph(entry, Graph);
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
 /*VORTEX_DIVIDER*/ 
//import MDImportLocation from "./MDImportLocation.js";

/**Transports the given dependency to given Graph.
 *
 * @param {Dependency} Dependency Dependency to Transport
 * @param {VortexGraph} Graph Graph to Use
 * @param {string} CurrentFile Current file being loading from.
 * @param {MDImportLocation} CurrentMDImpLoc Curret Module Dependency Import Location
 */
function Transport(Dependency, Graph, CurrentFile, CurrentMDImpLoc) {
  let str = './';

  if (Dependency instanceof ModuleDependency) {
    if (Dependency.outBundle !== true) {
      if (Dependency.name.includes(str)) {
        //If local file, then resolve it to root dir.
        Dependency.updateName(LocalizedResolve(CurrentFile, addJsExtensionIfNecessary(Dependency.name)));

        if (Dependency instanceof EsModuleDependency || Dependency instanceof CjsModuleDependency) {
          if (isInQueue(Dependency.name)) {
            Dependency.verifyImportedModules(loadEntryFromQueue(Dependency.name), CurrentMDImpLoc);
          } else {
            let file = fs.readFileSync(Dependency.name).toString();

            if (!isLibrary) {
              file = babel_core_NAMESPACE.transformSync(file, BabelSettings).code;
            }

            addEntryToQueue(new QueueEntry(Dependency.name, Babel.parse(file, {
              "sourceType": 'module'
            })));
            Dependency.verifyImportedModules(loadEntryFromQueue(Dependency.name), CurrentMDImpLoc);
          }
        }
      } else {
        // Else Find library bundle location
        if (Dependency instanceof ModuleDependency) {
          Dependency.libLoc = resolveLibBundle(Dependency.name);
        }
      }
    }
  }

  if (Graph.searchFor(Dependency)) {
    Graph.update(Dependency);
  } else {
    Graph.add(Dependency);
  }
}
 /*VORTEX_DIVIDER*/ 
function fixDependencyName(name) {
  let NASTY_CHARS = "\\./@^$#*&!%-";
  let newName = "";

  if (name[0] === '@') {
    newName = name.slice(1);
  } else {
    newName = name;
  }

  for (let char of NASTY_CHARS) {
    if (newName.includes(char)) {
      while (newName.includes(char)) {
        let a;
        let b;
        a = newName.slice(0, newName.indexOf(char));
        b = newName.slice(newName.indexOf(char) + 1);
        newName = `${a}_${b}`;
      }
    }
  } //console.log(newName)


  return newName;
}
/**
 * Creates a Star depending on the global config
 * @param {VortexGraph} Graph The Dependency Graph created by the Graph Generator
 */


async function Compile(Graph) {
  let finalBundle;

  if (isLibrary) {
    finalBundle = LibCompile(Graph);
  } else {
    finalBundle = WebAppCompile(Graph);
  }

  return finalBundle; // let finalLib = LibCompile(Graph)
  // return finalLib
  // const buffer = fs.readFileSync('./test/func.js').toString()
  // const code = Babel.parse(buffer,{"sourceType":"module"})
  // let modules = []
  // let testBundle = new LibBundle
  // modules.push(new Module('haha',ModuleTypes.CjsNamespaceProvider))
  // removeImportsFromAST(code,new MDImportLocation('FILE',0,modules),'haha',testBundle)
}
/**Compiles a library bundle from a given Vortex Graph
 *
 * @param {VortexGraph} Graph
 */


function LibCompile(Graph) {
  let libB = new LibBundle();
  let finalBundle = "";

  for (let dep of Graph.Star) {
    if (dep instanceof ModuleDependency) {
      for (let impLoc of dep.importLocations) {
        if (impLoc instanceof MDImportLocation) {
          if (libB.isInQueue(impLoc.name)) {
            if (dep.name.includes('./') == false && impLoc.modules[0].type !== ModuleTypes.EsNamespaceProvider) {
              mangleVariableNamesFromAst(libB.loadEntryFromQueue(impLoc.name).ast, impLoc.modules);
            }

            removeImportsFromAST(libB.loadEntryFromQueue(impLoc.name).ast, impLoc, dep, libB);
          } else {
            let filename = fs.readFileSync(impLoc.name).toString();
            libB.addEntryToQueue(new BundleEntry(impLoc.name, Babel.parse(filename, {
              "sourceType": 'module'
            })));

            if (dep.name.includes('./') == false && impLoc.modules[0].type !== ModuleTypes.EsNamespaceProvider) {
              mangleVariableNamesFromAst(libB.loadEntryFromQueue(impLoc.name).ast, impLoc.modules);
            }

            removeImportsFromAST(libB.loadEntryFromQueue(impLoc.name).ast, impLoc, dep, libB);

            if (impLoc.name === Graph.entryPoint) {
              removeExportsFromAST(libB.loadEntryFromQueue(impLoc.name).ast, dep, libB);
            }
          }
        }
      }

      if (dep.outBundle !== true) {
        if (libB.isInQueue(dep.name)) {
          if (dep.importLocations[0].modules[0].type === ModuleTypes.EsNamespaceProvider) {
            convertToNamespace(libB.loadEntryFromQueue(dep.name).ast, dep.importLocations[0]);
          }

          removeExportsFromAST(libB.loadEntryFromQueue(dep.name).ast, dep, libB);
        } else {
          //Libraries are skipped completely in Lib Bundle
          if (dep.name.includes('./')) {
            let filename = fs.readFileSync(dep.name).toString();
            libB.addEntryToQueue(new BundleEntry(dep.name, Babel.parse(filename, {
              "sourceType": 'module'
            })));

            if (dep.importLocations[0].modules[0].type === ModuleTypes.EsNamespaceProvider) {
              convertToNamespace(libB.loadEntryFromQueue(dep.name).ast, dep.importLocations[0]);
            }

            removeExportsFromAST(libB.loadEntryFromQueue(dep.name).ast, dep, libB);
          }
        }
      }
    }
  }

  console.log(libB.queue);
  let finalAr = libB.queue.reverse();
  finalBundle += `/*NODE_REQUIRES*/ \n`;
  finalBundle += libB.libs.join('\n');
  finalBundle += `\n /*LIB_CODE*/ \n`;

  for (let ent of finalAr) {
    finalBundle += Division();
    finalBundle += babel_generator_NAMESPACE.default(ent.ast).code;
  }

  finalBundle += `\n /*NODE_EXPORTS*/ \n`;
  finalBundle += libB.exports.join('\n');
  return finalBundle; //console.log(code)
  //return libB.code
}
/**Converts entire dependency file to a ECMAScript Module Namespace.
 *
 * @param {t.File} ast Abstract Syntax Tree (ESTree Format)
 * @param {MDImportLocation} imploc First MDImport Location of current dependency
 */


function convertToNamespace(ast, imploc) {
  var namespace = t.variableDeclaration('var', new Array(t.variableDeclarator(t.identifier(imploc.modules[0].name))));
  babel_traverse_NAMESPACE.default(ast, {
    ExportNamedDeclaration: function (path) {
      if (path.node.declaration !== null) {
        addToNamespace(path.node.declaration, namespace);
        path.remove();
      }
    },
    ExportDefaultDeclaration: function (path) {
      if (path.node.declaration !== null) {
        addToNamespace(path.node.declaration, namespace);
        path.remove();
      }
    }
  });
  ast.program.body.push(namespace);
  ast.program.body.reverse();
}
/**Adds Node (Function/Class/Variable) to given namespace
 *
 * @param {t.FunctionDeclaration|t.ClassDeclaration|t.VariableDeclaration} Node
 * @param {t.VariableDeclaration} namespace
 */


function addToNamespace(Node, namespace) {
  if (namespace.declarations[0].init !== null) {
    if (namespace.declarations[0].init.type === 'ObjectExpression') {
      if (Node.type === 'FunctionDeclaration') {
        let name = Node.id;
        Node.id = null;
        namespace.declarations[0].init.properties.push(t.objectProperty(name, t.functionExpression(null, Node.params, Node.body, Node.generator, Node.async)));
      } else if (Node.type === 'ClassDeclaration') {
        let name = Node.id;
        namespace.declarations[0].init.properties.push(t.objectProperty(name, t.classExpression(null, Node.superClass, Node.body)));
      }
    }
  } else {
    let props = [];

    if (Node.type === 'FunctionDeclaration') {
      let name = Node.id;
      Node.id = null;
      props.push(t.objectProperty(name, t.functionExpression(null, Node.params, Node.body, Node.generator, Node.async)));
      namespace.declarations[0].init = t.objectExpression(props);
    } else if (Node.type === 'ClassDeclaration') {
      let name = Node.id;
      props.push(t.objectProperty(name, t.classExpression(null, Node.superClass, Node.body)));
      namespace.declarations[0].init = t.objectExpression(props);
    }
  }
}
/**
 * Removes imports of CommonJS or ES Modules from the current Import Location depending on the type of Module Dependency given.
 * @param {t.File} ast Abstract Syntax Tree (ESTree Format)
 * @param {MDImportLocation} impLoc Current Import Location
 * @param {ModuleDependency} dep The Module Dependency
 * @param {LibBundle} libBund The Library Bundle
 */


function removeImportsFromAST(ast, impLoc, dep, libBund) {
  //Grabs all requires/imports of libs and converts them to CJS and places them at the top of bundle
  //
  if (dep instanceof CjsModuleDependency) {
    if (dep.name.includes('./') == false) {
      if (libBund.isLibEntryInCode(dep.name, impLoc.modules[0].name) == false) {
        libBund.addEntryToLibs(dep.name, impLoc.modules[0].name);
      }
    }

    if (impLoc.modules[0].type === ModuleTypes.CjsNamespaceProvider) {
      babel_traverse_NAMESPACE.default(ast, {
        // Removes Require statements.
        VariableDeclaration: function (path) {
          if (path.node.declarations[0].init !== null) {
            if (path.node.declarations[0].init.type === 'CallExpression') {
              if (path.node.declarations[0].init.callee.name === 'require') {
                if (path.node.declarations[0].id.name === impLoc.modules[0].name && path.node.declarations[0].init.arguments[0].value === impLoc.relativePathToDep) {
                  path.remove();
                }
              }
            }
          }
        },
        //Removes Namespace from all references calls to namespace
        MemberExpression: function (path) {
          if (dep.name.includes('./')) {
            if (path.node.object.name == impLoc.modules[0].name) {
              if (path.node.property !== null) {
                if (path.node.property.name === 'default') {
                  path.replaceWith(t.identifier(findDefaultExportName(dep)));
                } else {
                  path.replaceWith(t.identifier(path.node.property.name));
                }
              }
            }
          }
        }
      });
    }
  } else if (dep instanceof EsModuleDependency) {
    if (dep.name.includes('./') == false) {
      if (impLoc.modules[0].type === ModuleTypes.EsNamespaceProvider) {
        if (libBund.isLibEntryInCode(dep.name, impLoc.modules[0].name) == false) {
          libBund.addEntryToLibs(dep.name, impLoc.modules[0].name);
        }
      } else {
        var namespace = `${fixDependencyName(dep.name)}_NAMESPACE`;

        if (libBund.isLibEntryInCode(dep.name, namespace) == false) {
          libBund.addEntryToLibs(dep.name, namespace);
        }
      }
    }

    babel_traverse_NAMESPACE.default(ast, {
      ImportDeclaration: function (path) {
        //Removes imports regardless if dep is lib or local file.
        //console.log(impLoc.relativePathToDep)
        if (path.node.trailingComments === undefined) {
          if (path.node.source.value === impLoc.relativePathToDep) {
            path.remove();
          }
        } //Vortex retain feature
        else if (path.node.trailingComments[0].value === 'vortexRetain' && dep.outBundle === true) {
            if (dep.name.includes('./')) {
              libBund.addEntryToLibs(impLoc.relativePathToDep, impLoc.modules[0].name);
              path.remove();
            } else {
              throw new Error(chalk.redBright(`SyntaxError: Cannot use "vortexRetain" keyword on libraries. Line:${impLoc.line} File:${impLoc.name}`));
            }
          } else if (path.node.trailingComments[0].value !== 'vortexRetain') {
            if (path.node.source.value === impLoc.relativePathToDep) {
              path.remove();
            }
          }
      },
      // MemberExpression: function(path) {
      //     //Visits if dep is NOT a lib but is a EsNamespaceProvider
      //     if(dep.name.includes('./')){
      //         if(impLoc.modules[0].type === ModuleTypes.EsNamespaceProvider){
      //             if(path.node.object.name === impLoc.modules[0].name){
      //                 if(path.node.property.name === 'default'){
      //                     path.replaceWith(t.identifier(findDefaultExportName(dep)))
      //                 }
      //                 else{
      //                     path.replaceWith(t.identifier(path.node.property.name))
      //                 }
      //             }
      //         }
      //     }
      // },
      Identifier: function (path) {
        //Visits if dep is a lib but NOT a EsNamespaceProvider
        if (dep.name.includes('./') == false) {
          if (impLoc.modules[0].type !== ModuleTypes.EsNamespaceProvider) {
            for (let mod of impLoc.modules) {
              if (mod.type !== ModuleTypes.EsDefaultModule) {
                if (path.node.name === '_' + mod.name) {
                  path.replaceWith(t.memberExpression(t.identifier(namespace), t.identifier(mod.name)));
                }
              } else if (mod.type === ModuleTypes.EsDefaultModule) {
                if (path.node.name === '_' + mod.name) {
                  path.replaceWith(t.memberExpression(t.identifier(namespace), t.identifier('default')));
                }
              }
            }
          }
        }
      }
    });
  }
}

function findDefaultExportName(dep) {
  let buffer = fs.readFileSync(dep.name).toString();
  let code = Babel.parse(buffer, {
    "sourceType": "module"
  });
  let name;

  if (dep instanceof CjsModuleDependency) {
    babel_traverse_NAMESPACE.default(code, {
      ExpressionStatement: function (path) {
        if (path.node.expression.type === 'AssignmentExpression') {
          if (path.node.expression.left.type === 'MemberExpression') {
            // if(path.node.expression.left !== null){
            //     if(path.node.expression.left.object.name === 'module' && path.node.expression.left.property.name === 'exports'){
            //     }
            // }
            if (path.node.expression.left !== null) {
              if (path.node.expression.left.object.name === 'exports') {
                if (path.node.expression.left.property.name === 'default') {
                  name = path.node.expression.right.name;
                }
              }
            }
          }
        }
      }
    });
  } else if (dep instanceof EsModuleDependency) {
    babel_traverse_NAMESPACE.default(code, {
      ExportDefaultDeclaration: function (path) {
        if (path.node.declaration !== null) {
          name = path.node.declaration.id.name;
        }
      },
      ExportNamedDeclaration: function (path) {
        if (path.node.declaration == null) {
          for (let ImpType of path.node.specifiers) {
            if (ImpType.type === 'ExportSpecifier') {
              if (ImpType.exported.name === 'default') {
                name = ImpType.local.name;
              }
            }
          }
        }
      }
    });
  }

  return name;
}

function removeExportsFromAST(ast, dep, libbund) {
  if (dep instanceof CjsModuleDependency) {
    babel_traverse_NAMESPACE.default(ast, {
      ExpressionStatement: function (path) {
        if (path.node.expression.type === 'AssignmentExpression') {
          if (path.node.expression.left.type === 'MemberExpression') {
            if (path.node.expression.left.object.name === 'module' && path.node.expression.left.property.name === 'exports') {
              path.remove();
            }

            if (path.node.expression.left.object.name === 'exports') {
              path.remove();
            }
          }
        }
      }
    });
  } else if (dep instanceof EsModuleDependency) {
    babel_traverse_NAMESPACE.default(ast, {
      ExportNamedDeclaration: function (path) {
        if (path.node.declaration !== null) {
          if (path.node.declaration.type !== 'Identifier' || path.node.specifiers.length === 0) {
            path.replaceWith(path.node.declaration);
          } else {
            path.remove();
          }
        } else {
          if (findVortexExpose(path.node)) {
            for (let exp of getExposures(path.node)) {
              libbund.addEntryToExposedExports(exp);
            }

            path.remove();
          } else {
            path.remove();
          }
        }
      },
      ExportDefaultDeclaration: function (path) {
        if (path.node.declaration.type !== 'Identifier') {
          path.replaceWith(path.node.declaration);
        } else {
          path.remove();
        }
      }
    });
  }
}

function Division() {
  let code = `\n /*VORTEX_DIVIDER*/ \n`;
  return code;
}
/**
 * The Library Bundle used in libCompile
 */


class LibBundle {
  constructor() {
    /**
     * The LibBundle that contains all Bundle Entries.
     */
    this.queue = [];
    /**Array of compiled requires */

    this.libs = [];
    /**Array of compiled exposures (exports) */

    this.exports = [];
  }
  /**
   * Adds an entry to the lib Bundle Queue
   * @param {BundleEntry} entry
   */


  addEntryToQueue(entry) {
    this.queue.push(entry);
  }
  /**
   * Adds a CommonJS require entry to bundle libraries
   * @param {string} libname Name of library to add to requires
   * @param {string} namespace Namespace applied to the entry
   */


  addEntryToLibs(libname, namespace) {
    const lib = CommonJSTemplate({
      NAMESPACE: t.identifier(namespace),
      LIBNAME: t.stringLiteral(libname)
    });
    const code = babel_generator_NAMESPACE.default(lib);
    this.libs.push(code.code);
  }
  /**
   * Adds a CommonJS exports entry to bundle exposures
   * @param {string} exportName Name of Export to Expose.
   */


  addEntryToExposedExports(exportName) {
    const exp = CJSExportsTemplate({
      EXPORT: t.identifier(exportName)
    });
    const code = babel_generator_NAMESPACE.default(exp);
    this.exports.push(code.code);
  }
  /**
   * Checks to see if export has already been added to exposures
   * @param {string} exportName Name of Exposed Export
   * @return {boolean} True or False
   */


  isExportEntryInCode(exportName) {
    for (let expo of this.exports) {
      if (expo.includes(exportName)) {
        return true;
      }
    }

    return false;
  }
  /**
   * Checks to see if export has already been added to requires.
   * @param {string} libName Name of library
   * @param {string} namespace Namespace applied to the entry
   * @return {boolean} True or False
   */


  isLibEntryInCode(libName, namespace) {
    for (let req of this.libs) {
      if (req.includes(libName) && req.includes(namespace)) {
        return true;
      }
    }

    return false;
  }
  /**
   * Checks to see if entry is in bundle queue already.
   * @param {string} entryName Name of Bundle Entry
   * @return {boolean} True or False
   */


  isInQueue(entryName) {
    for (let ent of this.queue) {
      if (ent.name == entryName) {
        return true;
      }
    }

    return false;
  }
  /**
   * loads bundle entry from queue
   * @param {string} entryName Name of Bundle Entry
   * @returns {BundleEntry} The Bundle Entry if it exists
   */


  loadEntryFromQueue(entryName) {
    for (let ent of this.queue) {
      if (ent.name == entryName) {
        return ent;
      }
    }
  }

}

const CommonJSTemplate = babel_core_NAMESPACE.template(`const NAMESPACE = require(LIBNAME)`);
const CJSExportsTemplate = babel_core_NAMESPACE.template(`exports.EXPORT = EXPORT`);

class BundleEntry {
  constructor(name, ast) {
    this.name = name;
    this.ast = ast;
  }

}

function mangleVariableNamesFromAst(ast, impLocModules) {
  babel_traverse_NAMESPACE.default(ast, {
    Identifier: function (path) {
      for (let mod of impLocModules) {
        if (mod.name === path.node.name) {
          path.node.name = `_${path.node.name}`;
        }
      }
    }
  });
}

function findVortexExpose(exportNode) {
  //console.log(exportNode.trailingComments)
  if (exportNode.trailingComments !== undefined) {
    let comments = exportNode.trailingComments.map(comm => comm.value);

    for (let comm of comments) {
      if (comm === 'vortexExpose') {
        return true;
      }
    }
  } else {
    for (let spec of exportNode.specifiers) {
      if (spec.trailingComments !== undefined) {
        if (spec.trailingComments[0].value === 'vortexExpose') {
          return true;
        }
      }
    }
  }

  return false;
}

function getExposures(exportNode) {
  let allExports = exportNode.specifiers.map(exp => exp.exported.name);

  if (exportNode.trailingComments !== undefined) {
    let comments = exportNode.trailingComments.map(comm => comm.value);

    for (let comm of comments) {
      if (comm === 'vortexExpose') {
        return allExports;
      }
    }
  }

  let exports = [];

  for (let spec of exportNode.specifiers) {
    if (spec.trailingComments[0].value === 'vortexExpose') {
      exports.push(spec.exported.name);
    }
  }

  return exports;
} //
//

/*======WEBAPP COMPILER======*/
//
//
//


const ModuleEvalTemplate = babel_core_NAMESPACE.template('eval(CODE)');
/**
 * Compiles Graph into browser compatible application
 * @param {VortexGraph} Graph
 * @returns {string} WebApp Bundle
 */

function WebAppCompile(Graph) {
  let shuttle = new Shuttle(); //Transforms exports and Imports on all parsed Queue entries.

  for (let dep of Graph.Star) {
    if (dep instanceof ModuleDependency) {
      for (let impLoc of dep.importLocations) {
        TransformImportsFromAST(loadEntryFromQueue(impLoc.name).ast, impLoc, dep);
      }

      TransformExportsFromAST(loadEntryFromQueue(dep.name.includes('./') ? dep.name : dep.libLoc).ast, dep);
    } else if (dep instanceof CSSDependency) {
      for (let impLoc of dep.importLocations) {
        injectCSSDependencyIntoAST(loadEntryFromQueue(impLoc.name).ast, dep, impLoc);
      }
    }
  }

  let bufferNames = []; // Pushes entrypoint into buffer to be compiled.

  const entry = loadEntryFromQueue(Graph.entryPoint);
  stripNodeProcess(entry.ast);
  const COMP = babel_generator_NAMESPACE.default(entry.ast, {
    sourceMaps: false
  });
  const mod = isProduction ? entry.ast.program.body : ModuleEvalTemplate({
    CODE: t.stringLiteral(COMP.code + `\n //# sourceURL=${entry.name} \n`)
  });
  shuttle.addModuleToBuffer(Graph.entryPoint, mod);
  bufferNames.push(Graph.entryPoint); //Pushing modules into buffer to be compiled.

  for (let dep of Graph.Star) {
    if (dep instanceof ModuleDependency) {
      if (dep.libLoc !== undefined) {
        if (bufferNames.includes(dep.libLoc) == false) {
          const entry = loadEntryFromQueue(dep.libLoc);
          stripNodeProcess(entry.ast);
          const COMP = babel_generator_NAMESPACE.default(entry.ast, {
            sourceMaps: false
          });
          const mod = isProduction ? entry.ast.program.body : ModuleEvalTemplate({
            CODE: t.stringLiteral(COMP.code + `\n //# sourceURL=${entry.name} \n`)
          });
          shuttle.addModuleToBuffer(dep.libLoc, mod);
          bufferNames.push(dep.libLoc);
        }
      } else {
        if (bufferNames.includes(dep.name) == false) {
          const entry = loadEntryFromQueue(dep.name);
          stripNodeProcess(entry.ast);
          const COMP = babel_generator_NAMESPACE.default(entry.ast, {
            sourceMaps: false
          });
          const mod = isProduction ? entry.ast.program.body : ModuleEvalTemplate({
            CODE: t.stringLiteral(COMP.code + `\n //#sourceURL:${entry.name} \n`)
          });
          shuttle.addModuleToBuffer(dep.name, mod);
          bufferNames.push(dep.name);
        }
      }
    }
  } // if(dep.libLoc !== undefined){
  //     const mod = ModuleEvalTemplate({CODE:t.stringLiteral(generate(loadEntryFromQueue(dep.libLoc).ast).code)})
  //     shuttle.addModuleToBuffer(dep.libLoc,mod)
  // }
  // else{
  //     const mod = ModuleEvalTemplate({CODE:t.stringLiteral(generate(loadEntryFromQueue(dep.name).ast).code)})
  //     shuttle.addModuleToBuffer(dep.name,mod)
  // }
  //let finalCode = generate(shuttle.buffer).code
  //let tempAST = Babel.parse(generate(t.variableDeclaration('var',[t.variableDeclarator(t.identifier('_NAMESPACE'),shuttle.buffer)])).code)
  // for(let prop of tempAST.program.body[0].declarations[0].init.properties){
  //     prop.value.extra = {}
  //     prop.value.extra.parenthesized = true
  //     prop.value.extra.parenStart = prop.value.start-1
  // }

  /**
   * Factory Shuttle Module Loader (Vortex's Official Module Loader for the browser!)
   */


  let factory = `
    //Named Exports For Module
    var loadedModules = [];
    var loadedStyles = [];
    var loadedExportsByModule = {}; 
    //Shuttle Module Loader
    //Finds exports and returns them under fake namespace.
  
    function shuttle(mod_name) {
      //If module has already been loaded, load the exports that were cached away.
      if (loadedModules.includes(mod_name)) {
        return loadedExportsByModule[mod_name].cachedExports;
      } else {
        var mod = {
          exports: {}
        };
        modules[mod_name](shuttle, mod.exports,loadedStyles);
  
        var o = new Object(mod_name);
        Object.defineProperty(o, 'cachedExports', {
          value: mod.exports,
          writable: false
        });
        Object.defineProperty(loadedExportsByModule, mod_name, {
          value: o
        });
        loadedModules.push(mod_name);
        return mod.exports;
      }
    } 
    //Calls EntryPoint to Initialize
  
  
    return shuttle('${Graph.entryPoint}');`;
  let parsedFactory = Babel.parse(factory, {
    allowReturnOutsideFunction: true
  }).program.body;
  let finalCode = babel_generator_NAMESPACE.default(t.expressionStatement(t.callExpression(t.identifier(''), [t.callExpression(t.functionExpression(null, [t.identifier("modules")], t.blockStatement(parsedFactory), false, false), [shuttle.buffer])])), {
    compact: isProduction ? true : false
  }).code;
  return finalCode;
}

class Shuttle {
  constructor() {
    this.buffer = t.objectExpression([]);
  } //[shuttle,_exports_]


  addModuleToBuffer(entry, evalModule) {
    let func = t.functionExpression(null, [t.identifier('shuttle'), t.identifier('shuttle_exports'), t.identifier('gLOBAL_STYLES')], t.blockStatement(isProduction ? evalModule : [evalModule]), false, false);
    this.buffer.properties.push(t.objectProperty(t.stringLiteral(entry), t.callExpression(t.identifier(''), [func])));
  }

  isInBuffer(entry) {
    for (let ent of this.buffer.properties) {
      if (ent.type === 'ObjectProperty') {
        if (ent.key === t.stringLiteral(entry)) {
          return true;
        }
      }
    }

    return false;
  }

} //Shuttle Module Templates:

/**
 * Vortex's Require Function Template
 */


const ShuttleInitialize = babel_core_NAMESPACE.template("MODULE = shuttle(MODULENAME)");
/**
 * Vortex's Named Export Template
 */

const ShuttleExportNamed = babel_core_NAMESPACE.template("shuttle_exports.EXPORT = LOCAL");
/**
 * Vortex's Default Export Template
 */

const ShuttleExportDefault = babel_core_NAMESPACE.template("shuttle_exports.default = EXPORT");
/**
 * Compiles imports from the provided AST into the Shuttle Module Loader format.
 *
 * @param {t.File} ast Abstract Syntax Tree (ESTree Format)
 * @param {MDImportLocation} currentImpLoc The Current ModuleDependency Import Location
 * @param {ModuleDependency} dep The current ModuleDependency.
 */

function TransformImportsFromAST(ast, currentImpLoc, dep) {
  let namespace = `VORTEX_MODULE_${fixDependencyName(dep.name)}`;

  if (dep instanceof EsModuleDependency) {
    babel_traverse_NAMESPACE.default(ast, {
      ImportDeclaration: function (path) {
        if (path.node.source.value === currentImpLoc.relativePathToDep) {
          if (dep.name.includes('./')) {
            // Uses dep name as replacement module source
            path.replaceWith(t.variableDeclaration('var', [t.variableDeclarator(t.identifier(namespace), t.callExpression(t.identifier('shuttle'), [t.stringLiteral(dep.name)]))]));
          } else {
            //Search for lib bundle if lib
            path.replaceWith(t.variableDeclaration('var', [t.variableDeclarator(t.identifier(namespace), t.callExpression(t.identifier('shuttle'), [t.stringLiteral(dep.libLoc)]))]));
          }
        }
      },
      Identifier: function (path) {
        if (path.parent.type !== 'MemberExpression' && path.parent.type !== 'ImportSpecifier' && path.parent.type !== 'ImportDefaultSpecifier') {
          if (currentImpLoc.indexOfModuleByName(path.node.name) !== null) {
            if (dep.name.includes('./') == false) {
              //If library but NOT default import from lib
              if (currentImpLoc.modules[currentImpLoc.indexOfModuleByName(path.node.name)].type !== ModuleTypes.EsDefaultModule) {
                path.replaceWith(t.memberExpression(t.identifier(namespace), t.identifier(path.node.name)));
              } //if NOT library at all

            } else {
              if (currentImpLoc.modules[currentImpLoc.indexOfModuleByName(path.node.name)].type === ModuleTypes.EsDefaultModule) {
                path.replaceWith(t.memberExpression(t.identifier(namespace), t.identifier('default')));
              } else {
                path.replaceWith(t.memberExpression(t.identifier(namespace), t.identifier(path.node.name)));
              }
            }
          }
        }
      },
      //Reassigns lib default namespace to vortex namespace
      MemberExpression: function (path) {
        if (dep.name.includes('./') == false) {
          if (path.node.object.type === 'Identifier') {
            if (currentImpLoc.modules[currentImpLoc.indexOfModuleByName(path.node.object.name)] !== undefined) {
              // Only passes through here namespace IS the default module.
              let defaultMod = currentImpLoc.modules[currentImpLoc.indexOfModuleByName(path.node.object.name)];

              if (defaultMod.type === ModuleTypes.EsDefaultModule && defaultMod.name === path.node.object.name) {
                path.replaceWith(t.memberExpression(t.identifier(namespace), path.node.property));
              }
            }
          }
        }
      }
    });
  } else if (dep instanceof CjsModuleDependency) {
    if (currentImpLoc.modules[0].type === ModuleTypes.CjsNamespaceProvider) {
      babel_traverse_NAMESPACE.default(ast, {
        VariableDeclaration: function (path) {
          for (let dec of path.node.declarations) {
            if (dec.init !== null) {
              if (dec.init.type === 'CallExpression') {
                if (dec.init.callee.name === 'require' && dec.init.arguments[0].value === currentImpLoc.relativePathToDep) {
                  dec.id.name = namespace;
                  dec.init.callee.name = 'shuttle';
                  dec.init.arguments[0].value = dep.name.includes('./') ? dep.name : dep.libLoc;
                }
              }
            }
          }
        },
        MemberExpression: function (path) {
          //Replaces CommonJs Namespaces if library does NOT have default export.
          if (path.parent.type === 'ObjectProperty') {
            if (path.node.name !== path.parent.key && path.node === path.parent.value) {
              if (path.node.object.name === currentImpLoc.modules[0].name && path.node.property !== null) {
                path.replaceWith(t.memberExpression(t.identifier(namespace), path.node.property));
              }
            }
          } else if (path.node.object.type === 'Identifier') {
            if (path.node.object.name === currentImpLoc.modules[0].name && path.node.property !== null) {
              path.replaceWith(t.memberExpression(t.identifier(namespace), path.node.property));
            }
          }
        },
        Identifier: function (path) {
          if (path.parent.type === 'ObjectProperty') {
            if (path.node.name !== path.parent.key && path.node === path.parent.value) {
              if (path.node.name === currentImpLoc.modules[0].name) {
                path.replaceWith(t.memberExpression(t.identifier(namespace), t.identifier('default')));
              }
            }
          } //Replaces CommonJs Namespace if library DOES have default export.
          else if (path.parent.type !== 'MemberExpression' && path.parent.type !== 'VariableDeclarator' && path.parent.type !== 'FunctionDeclaration') {
              if (path.node.name === currentImpLoc.modules[0].name) {
                if (path.parent.type === 'CallExpression' && path.node.name === path.parent.callee.name) {
                  path.replaceWith(t.memberExpression(t.identifier(namespace), t.identifier('default')));
                } else {
                  //IF there is not functionality whatsoever to this identifier, replace it with the namespace
                  path.node.name = namespace;
                }
              }
            }
        }
      });
    }
  }
}
/**Compiles exports from the provided AST into the Shuttle Module Loader format.
 *
 * @param {t.File} ast Abstract Syntax Tree (ESTree Format)
 * @param {ModuleDependency} dep The Current ModuleDependency
 */


function TransformExportsFromAST(ast, dep) {
  //Removes exports from local file ES Modules only.
  if (dep instanceof EsModuleDependency && dep.libLoc == null) {
    let exportsToBeRolled = [];
    let defaultExport;
    babel_traverse_NAMESPACE.default(ast, {
      ExportNamedDeclaration: function (path) {
        if (path.node.declaration !== undefined) {
          if (path.node.declaration.type === 'FunctionDeclaration') {
            exportsToBeRolled.push(path.node.declaration.id.name);
          } else if (path.node.declaration.type === 'VariableDeclaration') {
            exportsToBeRolled.push(path.node.declaration.declarations[0].id.name);
          }

          path.replaceWith(path.node.declaration);
        } else {
          for (let exp of path.node.specifiers) {
            exportsToBeRolled.push(exp.exported.name);
          }

          path.remove();
        }
      },
      ExportDefaultDeclaration: function (path) {
        if (path.node.declaration.type === 'FunctionDeclaration') {
          defaultExport = path.node.declaration.id.name;
        } else if (path.node.declaration.type === 'Identifier') {
          defaultExport = path.node.declaration.name;
        }

        path.replaceWith(path.node.declaration);
      }
    }); //Rolls out/Converts exports to be read by Shuttle Module Loader

    for (let expo of exportsToBeRolled) {
      ast.program.body.push(ShuttleExportNamed({
        EXPORT: expo,
        LOCAL: expo
      }));
    } //Pushes/converts default export ONLY if it exists be read by Shuttle Module Loader


    if (defaultExport !== undefined) {
      ast.program.body.push(ShuttleExportDefault({
        EXPORT: defaultExport
      }));
    }
  } //Will rewrite exports for not only CJS dependencies but for Node Modules all together.
  else if (dep instanceof CjsModuleDependency || dep.libLoc !== null) {
      babel_traverse_NAMESPACE.default(ast, {
        AssignmentExpression: function (path) {
          if (path.node.left.type === 'MemberExpression') {
            if (path.node.left.object.type === 'Identifier') {
              //Looks for CommonJs named exports
              if (path.node.left.object.name === 'exports') {
                path.replaceWith(ShuttleExportNamed({
                  EXPORT: path.node.left.property.name,
                  LOCAL: path.node.right
                }));
              } else if (path.node.left.object.name === 'module' && path.node.left.property.name === 'exports') {
                path.replaceWith(ShuttleExportDefault({
                  EXPORT: path.node.right.type === 'Identifier' ? path.node.right.name : path.node.right
                }));
              }
            }
          }
        },
        MemberExpression: function (path) {
          if (path.parent.type !== 'AssignmentExpression') {
            if (path.node.object.type === 'Identifier') {
              if (path.node.object.name === 'exports') {
                path.node.object.name = 'shuttle_exports';
              }
            }
          }
        }
      });
    }
}
/** __WARNING: THIS WILL SOON BE DEPRECATED!!__
 *
 * Strips process.node functions/conditionals from the code.
 *
 * @param {t.File} ast Abstract Syntax Tree (ESTree Format)
 */


function stripNodeProcess(ast) {
  babel_traverse_NAMESPACE.default(ast, {
    IfStatement: function (path) {
      //Removes any if statement having any relation with NodeJs process!
      if (path.node.test.type === 'BinaryExpression') {
        if (path.node.test.left.type === 'MemberExpression') {
          if (path.node.test.left.object.type === 'MemberExpression') {
            if (path.node.test.left.object.object.name === 'process') {
              path.replaceWithMultiple(path.node.consequent.body);
            }
          }
        }
      }
    }
  });
}

const CSSInjector = babel_core_NAMESPACE.template("if(!gLOBAL_STYLES.includes(DEPNAME)){var style = document.createElement('style'); style.innerHTML=CSS;document.head.appendChild(style);gLOBAL_STYLES.push(DEPNAME)}");

function injectCSSDependencyIntoAST(ast, dep, currentImpLoc) {
  babel_traverse_NAMESPACE.default(ast, {
    ImportDeclaration: function (path) {
      if (path.node.source.value === currentImpLoc.relativePathToDep) {
        path.replaceWith(CSSInjector({
          DEPNAME: t.stringLiteral(dep.name),
          CSS: t.stringLiteral(dep.stylesheet)
        }));
      }
    }
  });
}
 /*VORTEX_DIVIDER*/ 
/*vortexRetain*/
//import * as Babel_Core from '@babel/core'

/**
 * If checked True, then Vortex will bundle with NO debug tools.
 * If checked False, then Vortex will bundle with debug tools.
 */
var isProduction;
/**
 * If checked true, Vortex will consider your program a library instead of a web application.
 */

var isLibrary;
/**
 * If checked true, Terser will be used to minify production bundle. (Can NOT be used on development bundles.) (Labels it Neutron Star)
 */

var usingTerser = false;
var useDebug;
var extensions = Panel.extensions;

function isJs(filename) {
  let rc;

  if (extensions.includes(getFileExtension(filename))) {
    rc = false;
  } else {
    rc = true;
  }

  return rc;
}
/**Creates a Star or Neutron Star from entry point.
 *
 */


function createStarPackage() {
  let entry = Panel.start;

  if (os.platform() === 'win32') {
    entry = amendEntryPoint(Panel.start);
  }

  const spinner2 = ora('1. Opening the Portal');
  const spinner3 = ora('2. Vortex Commencing');
  spinner3.spinner = cliSpinners.bouncingBar;
  const spinner4 = ora('3. Hypercompressing ');
  spinner4.spinner = cliSpinners.star;
  let outputFilename = Panel.output;

  if (Panel.bundleMode === 'star') {
    isProduction = false;
  } else if (Panel.bundleMode === 'neutronstar') {
    isProduction = true;
  }

  if (Panel.useTerser == true && !isProduction) {
    throw new Error(chalk.redBright('ERROR: Can not use terser on regular star!'));
  } //Assignment to config from Panel


  usingTerser = Panel.useTerser;

  if (Panel.type === 'app') {
    isLibrary = false;
  } else if (Panel.type === 'library') {
    isLibrary = true;
  } // if (isProduction){
  //     process.env.NODE_ENV = 'production'
  // }
  // else{
  //     process.env.NODE_ENV = 'development'
  // }
  //Logger.Log();
  // fs.writeJsonSync('./out/tree.json',Babel.parse(fs.readFileSync('./test/func.js').toString(),{"sourceType":"module"}))


  let yourCredits = fs.readJSONSync('./package.json', {
    encoding: 'utf-8'
  });
  spinner2.spinner = cliSpinners.arc;
  spinner2.start();
  GenerateGraph(entry).then(graph => {
    spinner2.succeed();
    spinner3.start();
    return Compile(graph);
  }).then(bundle => {
    if (usingTerser) {
      spinner3.succeed();
      spinner4.start();
      return terserPackage(outputFilename, yourCredits, bundle);
    } else {
      return regularPackage(outputFilename, yourCredits, bundle);
    }
  }).then(filename => {
    if (usingTerser) {
      spinner4.succeed();
      console.log(chalk.bold.yellowBright(`Successfully Created Neutron Star! (${filename})`));
    } else {
      spinner3.succeed();
      console.log(chalk.bold.redBright(`Successfully Created Star! (${filename})`));
    }

    process.exit();
  });
} // fs.writeJson('./vortex-depGraph.json',Graph, err => {
//     if (err) return console.error(err)
//     console.log('Wrote Star Graph to dep-graph.json ')
//   })
// process.exit(0)
// let buffer = fs.readFileSync('./test/func.js').toString()
// let parsedCode = Babel.parse(buffer)
// fs.writeJson('./debug.json',parsedCode, err => {
//   if (err) return console.error(err)
//   console.log('Wrote debug to ./debug.json ')
// })
//console.log(Graph.display());


async function terserPackage(outputFilename, yourCredits, bundle) {
  if (isLibrary) {
    let credits = `/*NEUTRON-STAR*/ \n /*${yourCredits.name} ${yourCredits.version} _MINIFIED_ \n ${yourCredits.author} \n License: ${yourCredits.license} \n ${yourCredits.description} */ \n`; //console.log(credits)

    let minBundle = terser.minify(bundle, {
      compress: true,
      mangle: true
    }).code;
    let output = credits + minBundle; //console.log(output)

    let newFilename = path.dirname(outputFilename) + '/' + path.basename(outputFilename, '.js') + '.min.js';
    fs.ensureDirSync(path.dirname(outputFilename) + '/');
    fs.writeFileSync(newFilename, output);
    return newFilename;
  } else {
    let credits = `/*NEUTRON-STAR*/ \n /*BUNDLED BY VORTEX*/ \n`;
    let minBundle = terser.minify(bundle, {
      compress: true,
      mangle: true
    }).code;
    let output = credits + minBundle;
    let newFilename = path.dirname(outputFilename) + '/' + path.basename(outputFilename, '.js') + '.min.js';
    fs.ensureDirSync(path.dirname(outputFilename) + '/');
    fs.writeFileSync(newFilename, output);
    return newFilename;
  }
}

async function regularPackage(outputFilename, yourCredits, bundle) {
  if (isLibrary) {
    // let bundle = Compile(Graph);
    ///let transformed = Babel_Core.transformSync(bundle,{sourceType:'module',presets:['@babel/preset-env']}).code
    let credits = `/*STAR*/ \n /*${yourCredits.name} ${yourCredits.version} \n ${yourCredits.author} \n License: ${yourCredits.license} \n ${yourCredits.description} */ \n`;
    fs.ensureDirSync(path.dirname(outputFilename) + '/');
    fs.writeFileSync(outputFilename, credits + bundle);
    return outputFilename;
  } else {
    let credits = isProduction ? `/*NEUTRON-STAR*/ \n /*BUNDLED BY VORTEX*/ \n` : `/*STAR*/ \n /*BUNDLED BY VORTEX*/ \n`;
    let finalBundle = credits + bundle;
    fs.ensureDirSync(path.dirname(outputFilename) + '/');
    fs.writeFileSync(outputFilename, finalBundle);
    return outputFilename;
  }
}

createStarPackage();

function amendEntryPoint(entry) {
  let shortEntry = entry.slice(2);

  while (shortEntry.includes('/')) {
    let i = shortEntry.indexOf('/');
    let a = shortEntry.slice(0, i);
    let b = shortEntry.slice(i + 1);
    shortEntry = `${a}\\${b}`;
  }

  return `./${shortEntry}`;
}
 /*NODE_EXPORTS*/ 
