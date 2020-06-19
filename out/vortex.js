const fs = require("fs-extra");
const terser = require("terser");
const path = require("path");
const Babel = require("@babel/parser");
const babel_generator_NAMESPACE = require("@babel/generator");
const babel_traverse_NAMESPACE = require("@babel/traverse");
const babel_core_NAMESPACE = require("@babel/core");
const t = require("@babel/types");
const chalk = require("chalk");
const cliSpinners = require("cli-spinners");
const ora = require("ora");
const resolve = require("resolve");
 /******VORTEX_DIVIDER******/ 
function createStarPackage(productionMode, entry) {
  let isProduction = productionMode;
  let outputFilename = './out/vortex.js'; // if (isProduction){
  //     process.env.NODE_ENV = 'production'
  // }
  // else{
  //     process.env.NODE_ENV = 'development'
  // }
  //Logger.Log();
  // fs.writeJsonSync('./out/tree.json',Babel.parse(fs.readFileSync('./test/func.js').toString(),{"sourceType":"module"}))

  stage1();
  let Graph = StarGraph(entry);
  stage2();
  let bundle = Compile(Graph);

  if (usingTerser) {
    stage3();
    let minBundle = terser.minify(bundle, {
      compress: true,
      mangle: true
    }).code;
    let newFilename = path.dirname(outputFilename) + '/' + path.basename(outputFilename, '.js') + '.min.js';
    fs.writeFileSync(newFilename, minBundle);
    finish();
  } else {
    fs.writeFileSync(outputFilename, bundle);
    finish();
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

}
 /******VORTEX_DIVIDER******/ 
//import MDImportLocation from "./MDImportLocation.js";
//
//Transports Dependencies into the Graph
//
function Transport(Dependency, Graph, CurrentFile, CurrentMDImpLoc) {
  let str = './';

  if (Dependency.name.includes(str)) {
    //If local file, then resolve it to root dir.
    Dependency.updateName(LocalizedResolve(CurrentFile, addJsExtensionIfNecessary(Dependency.name)));

    if (Dependency instanceof EsModuleDependency || Dependency instanceof CjsModuleDependency) {
      if (isInQueue(Dependency.name)) {
        Dependency.verifyImportedModules(loadEntryFromQueue(Dependency.name), CurrentMDImpLoc);
      } else {
        addEntryToQueue(new QueueEntry(Dependency.name, Babel.parse(fs.readFileSync(Dependency.name).toString(), {
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

  if (Graph.searchFor(Dependency)) {
    Graph.update(Dependency);
  } else {
    Graph.add(Dependency);
  }
}
 /******VORTEX_DIVIDER******/ 
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

function StarGraph(entry) {
  if (isProduction) {
    fs.emptyDirSync('./cache/files');
    fs.emptyDirSync('./cache/libs');
  }

  const node_modules = 'node_modules'; //let resolvedEntry = path.resolve(entry)

  let Graph = new VortexGraph(entry);
  let fileLoc = './dep-graph.json';
  let loadedFilesCache = [];
  let modEnt = addJsExtensionIfNecessary(entry);
  let entryFile = fs.readFileSync(modEnt).toString();
  let entryAst = Babel.parse(entryFile, {
    "sourceType": 'module'
  });
  addEntryToQueue(new QueueEntry(entry, entryAst));
  GraphDepsAndModsForCurrentFile(loadEntryFromQueue(modEnt), Graph);
  loadedFilesCache.push(entry);

  for (let dep of Graph.Star) {
    let str = './';

    if (loadedFilesCache.includes(dep.name) == false) {
      if (dep.name.includes(str) == true) {
        let modName = addJsExtensionIfNecessary(dep.name);

        if (isInQueue(modName)) {
          GraphDepsAndModsForCurrentFile(loadEntryFromQueue(modName), Graph);
        } else {
          let ent = new QueueEntry(modName, Babel.parse(fs.readFileSync(modName).toString()));
          addEntryToQueue(ent);
          GraphDepsAndModsForCurrentFile(loadEntryFromQueue(ent.name), Graph);
        }

        loadedFilesCache.push(modName);
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

function GraphDepsAndModsForCurrentFile(entry, Graph) {
  SearchAndGraph(entry, Graph);
  SearchAndGraph(entry, Graph);
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
 /******VORTEX_DIVIDER******/ 
function fixDependencyName(name) {
  let NASTY_CHARS = '/@^$#*&!%';
  let newName;

  if (name[0] === '@') {
    newName = name.slice(1);
  }

  for (let char of NASTY_CHARS) {
    if (newName.includes(char)) {
      let a;
      let b;
      a = newName.slice(0, newName.indexOf(char));
      b = newName.slice(newName.indexOf(char) + 1);
      newName = `${a}_${b}`;
    }
  }

  return newName;
} //Transforms VortexGraph into a Star/Bundle


function Compile(Graph) {
  let finalLib = LibCompile(Graph);
  return finalLib; // const buffer = fs.readFileSync('./test/func.js').toString()
  // const code = Babel.parse(buffer,{"sourceType":"module"})
  // let modules = []
  // let testBundle = new LibBundle
  // modules.push(new Module('haha',ModuleTypes.CjsNamespaceProvider))
  // removeImportsFromAST(code,new MDImportLocation('FILE',0,modules),'haha',testBundle)
}

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
              removeExportsFromAST(libB.loadEntryFromQueue(impLoc.name).ast, dep);
            }
          }
        }
      }

      if (libB.isInQueue(dep.name)) {
        removeExportsFromAST(libB.loadEntryFromQueue(dep.name).ast, dep);
      } else {
        if (dep.name.includes('./')) {
          let filename = fs.readFileSync(dep.name).toString();
          libB.addEntryToQueue(new BundleEntry(dep.name, Babel.parse(filename, {
            "sourceType": 'module'
          })));
          removeExportsFromAST(libB.loadEntryFromQueue(dep.name).ast, dep);
        }
      }
    }
  } //console.log(libB.queue)


  finalBundle += libB.libs.join('\n');

  for (let ent of libB.queue) {
    finalBundle += Division();
    finalBundle += babel_generator_NAMESPACE.default(ent.ast).code;
  }

  return finalBundle; //console.log(code)
  //return libB.code
}

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
        if (path.node.source.value === impLoc.relativePathToDep) {
          path.remove();
        }
      },
      MemberExpression: function (path) {
        //Visits if dep is NOT a lib but is a EsNamespaceProvider
        if (dep.name.includes('./')) {
          if (impLoc.modules[0].type === ModuleTypes.EsNamespaceProvider) {
            if (path.node.object.name === impLoc.modules[0].name) {
              if (path.node.property.name === 'default') {
                path.replaceWith(t.identifier(findDefaultExportName(dep)));
              } else {
                path.replaceWith(t.identifier(path.node.property.name));
              }
            }
          }
        }
      },
      Identifier: function (path) {
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

function removeExportsFromAST(ast, dep) {
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
        if (path.node.declaration.type !== 'Identifier' || path.node.specifiers.length === 0) {
          path.replaceWith(path.node.declaration);
        } else {
          path.remove();
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
  let code = `\n /******VORTEX_DIVIDER******/ \n`;
  return code;
}

class LibBundle {
  constructor() {
    this.queue = [];
    this.libs = [];
  }

  addEntryToQueue(entry) {
    this.queue.push(entry);
  }

  addEntryToLibs(libname, namespace) {
    const lib = CommonJSTemplate({
      NAMESPACE: t.identifier(namespace),
      LIBNAME: t.stringLiteral(libname)
    });
    const code = babel_generator_NAMESPACE.default(lib);
    this.libs.push(code.code);
  }

  isLibEntryInCode(libName, namespace) {
    for (let req of this.libs) {
      if (req.includes(libName) && req.includes(namespace)) {
        return true;
      }
    }

    return false;
  }

  isInQueue(entryName) {
    for (let ent of this.queue) {
      if (ent.name == entryName) {
        return true;
      }
    }

    return false;
  }

  loadEntryFromQueue(entryName) {
    for (let ent of this.queue) {
      if (ent.name == entryName) {
        return ent;
      }
    }
  }

}

const CommonJSTemplate = babel_core_NAMESPACE.template(`const NAMESPACE = require(LIBNAME)`);

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
 /******VORTEX_DIVIDER******/ 
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
  let STD_NODE_LIBS = ['path', 'fs', 'module'];

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
 /******VORTEX_DIVIDER******/ 
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
 /******VORTEX_DIVIDER******/ 
//import Dependency from "../Dependency.js";
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
 /******VORTEX_DIVIDER******/ 
const spinner2 = ora('1. Opening the Portal');
const spinner3 = ora('2. Vortex Commencing');
const spinner4 = ora('3. Hypercompressing ');

function stage1() {
  spinner2.spinner = cliSpinners.arc;
  spinner2.start();
}

function stage2() {
  spinner2.succeed();
  spinner3.spinner = cliSpinners.bouncingBar;
  spinner3.start();
}

function stage3() {
  spinner3.succeed();
  spinner4.spinner = cliSpinners.star;
  spinner4.color = 'yellow';
  spinner4.start();
}

function finish() {
  if (usingTerser) {
    spinner4.succeed();
    console.log(chalk.bold.yellowBright('Successfully Created Neutron Star!'));
  } else {
    spinner3.succeed();
    console.log(chalk.bold.redBright('Successfully Created Star!'));
  }

  process.exit();
}
 /******VORTEX_DIVIDER******/ 
var isProduction = false;
var isLibrary = true;
var usingTerser = false;
 /******VORTEX_DIVIDER******/ 
class VortexGraph {
  constructor(entrypoint) {
    this.Star = [];
    this.entryPoint = entrypoint;
  }

  add(Dependency) {
    this.Star.push(Dependency);
  }

  searchFor(Dependency) {
    for (let dep of this.Star) {
      if (Dependency.name == dep.name) {
        return true;
      }
    }

    return false;
  }

  update(newDependency) {
    for (let dep of this.Star) {
      if (newDependency instanceof ModuleDependency && dep instanceof ModuleDependency) {
        ModuleDependencyUpdater(newDependency, dep);
      }
    }
  }

  remove(Dependency) {
    let index = this.Star.indexOf(Dependency);
    this.Star.splice(index);
  }

  display() {
    return this.Star;
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
 /******VORTEX_DIVIDER******/ 
//import { minifyIfProduction } from "../GraphGenerator.js";
function SearchAndGraph(entry, Graph) {
  babel_traverse_NAMESPACE.default(entry.ast, {
    ImportDeclaration: function (path) {
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
      Transport(new EsModuleDependency(path.node.source.value, currentImpLoc), Graph, entry.name, currentImpLoc);
    }
  });
}
 /******VORTEX_DIVIDER******/ 
function SearchAndGraph(entry, Graph) {
  // fs.writeJson('./debug.json',jsCode, err => {
  //         if (err) return console.error(err)
  //         console.log('Debug Written')
  //       })
  babel_traverse_NAMESPACE.default(entry.ast, {
    VariableDeclaration: function (path) {
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
              modules.push(new Module(path.node.declarations[0].id.name, ModuleTypes.CjsNamespaceProvider));
            } //console.log(path.node.declarations[0].init.arguments[0].value)


            let currentImpLoc = new MDImportLocation(entry.name, path.node.loc.start.line, modules, path.node.declarations[0].init.arguments[0].value);
            Transport(new CjsModuleDependency(path.node.declarations[0].init.arguments[0].value, currentImpLoc), Graph, entry.name, currentImpLoc);
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
 /******VORTEX_DIVIDER******/ 
class ModuleDependency extends Dependency {
  constructor(name, initImportLocation) {
    super(name, initImportLocation); //this.acquiredModules = acquiredModules
  }

}
 /******VORTEX_DIVIDER******/ 
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
 /******VORTEX_DIVIDER******/ 
class Module {
  constructor(name, type) {
    this.name = name;
    this.type = type;
  }

}

var ModuleTypes;

(function (ModuleTypes) {
  ModuleTypes[ModuleTypes["EsModule"] = 0] = "EsModule";
  ModuleTypes[ModuleTypes["EsDefaultModule"] = 1] = "EsDefaultModule";
  ModuleTypes[ModuleTypes["EsNamespaceProvider"] = 2] = "EsNamespaceProvider";
  ModuleTypes[ModuleTypes["CjsModule"] = 2] = "CjsModule";
  ModuleTypes[ModuleTypes["CjsDefaultModule"] = 3] = "CjsDefaultModule";
  ModuleTypes[ModuleTypes["CjsDefaultFunction"] = 4] = "CjsDefaultFunction";
  ModuleTypes[ModuleTypes["CjsNamespaceProvider"] = 5] = "CjsNamespaceProvider";
})(ModuleTypes || (ModuleTypes = {}));
 /******VORTEX_DIVIDER******/ 
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
 /******VORTEX_DIVIDER******/ 
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
 /******VORTEX_DIVIDER******/ 
class ImportLocation {
  constructor(name, line) {
    this.name = name;
    this.line = line;
  }

}