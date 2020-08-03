/*STAR*/ 
 /*@vortex-rtde/core 0.8.6 
 Alex Topper 
 License: MIT 
 A real time web application/js library development environment. */ 
(function (local_files) {
  var fileExportBuffer = {};

  const fs_extra_NAMESPACE = require("fs-extra");

  const FSEXTRA = require("fs-extra");

  const terser = require("terser");

  const path = require("path");

  const chalk = require("chalk");

  const cli_spinners_NAMESPACE = require("cli-spinners");

  const ora = require("ora");

  const os = require("os");

  const os_NAMESPACE = require("os");

  const fs = require("fs/promises");

  const fs_promises_NAMESPACE = require("fs/promises");

  const FS = require("fs/promises");

  const babel_core_NAMESPACE = require("@babel/core");

  const t = require("@babel/types");

  const babel_generator_NAMESPACE = require("@babel/generator");

  const Parse5 = require("parse5");

  const resolve = require("resolve");

  const util_NAMESPACE = require("util");

  const e = require("express");

  const chokidar = require("chokidar");

  const diff_NAMESPACE = require("diff");

  const io = require("socket.io");

  const Babel = require("@babel/parser");

  const css = require("css");

  const babel_traverse_NAMESPACE = require("@babel/traverse");

  const babel_template_NAMESPACE = require("@babel/template");

  const _ = require("lodash");

  const uuid_NAMESPACE = require("uuid");

  function _localRequire(id) {
    if (fileExportBuffer[id] && fileExportBuffer[id].built) {
      return fileExportBuffer[id].exports;
    } else {
      var localFile = {
        built: false,
        exports: {}
      };
      local_files[id](_localRequire, localFile.exports, fs_extra_NAMESPACE, FSEXTRA, terser, path, chalk, cli_spinners_NAMESPACE, ora, os, os_NAMESPACE, fs, fs_promises_NAMESPACE, FS, babel_core_NAMESPACE, t, babel_generator_NAMESPACE, Parse5, resolve, util_NAMESPACE, e, chokidar, diff_NAMESPACE, io, Babel, css, babel_traverse_NAMESPACE, babel_template_NAMESPACE, _, uuid_NAMESPACE);
      localFile.built = true;
      Object.defineProperty(fileExportBuffer, id, {
        value: localFile,
        writable: false,
        enumerable: true
      });
      return localFile.exports;
    }
  }

  return _localRequire("./test\\vortex\\Index.js");
})({
  "./test\\vortex\\Index.js": (function (_localRequire, _localExports, fs_extra_NAMESPACE, FSEXTRA, terser, path, chalk, cli_spinners_NAMESPACE, ora, os, os_NAMESPACE, fs, fs_promises_NAMESPACE, FS, babel_core_NAMESPACE, t, babel_generator_NAMESPACE, Parse5, resolve, util_NAMESPACE, e, chokidar, diff_NAMESPACE, io, Babel, css, babel_traverse_NAMESPACE, babel_template_NAMESPACE, _, uuid_NAMESPACE) {
    // import VortexRTDEAPI from './API'
    var __TEST_VORTEX_MAIN_JS = _localRequire("./test\\vortex\\Main.js"),
        createStarPackage = __TEST_VORTEX_MAIN_JS.createStarPackage;

    var __TEST_VORTEX_LIVE_LIVEPUSH_JS = _localRequire("./test\\vortex\\live\\LivePush.js"),
        LivePush = __TEST_VORTEX_LIVE_LIVEPUSH_JS.LivePush;
    /*vortexExpose*/


    exports.createStarPackage = createStarPackage;
    exports.LivePush = LivePush;
  }),
  "./test\\vortex\\Main.js": (function (_localRequire, _localExports, fs_extra_NAMESPACE, FSEXTRA, terser, path, chalk, cli_spinners_NAMESPACE, ora, os, os_NAMESPACE, fs, fs_promises_NAMESPACE, FS, babel_core_NAMESPACE, t, babel_generator_NAMESPACE, Parse5, resolve, util_NAMESPACE, e, chokidar, diff_NAMESPACE, io, Babel, css, babel_traverse_NAMESPACE, babel_template_NAMESPACE, _, uuid_NAMESPACE) {
    var __TEST_VORTEX_GRAPHGENERATOR_JS = _localRequire("./test\\vortex\\GraphGenerator.js"),
        queue = __TEST_VORTEX_GRAPHGENERATOR_JS.queue,
        GenerateGraph = __TEST_VORTEX_GRAPHGENERATOR_JS.GenerateGraph;

    var __TEST_VORTEX_COMPILER_JS = _localRequire("./test\\vortex\\Compiler.js"),
        Compile = __TEST_VORTEX_COMPILER_JS.Compile;

    var __TEST_VORTEX_PLANET_JS = _localRequire("./test\\vortex\\Planet.js"),
        assignDependencyType = __TEST_VORTEX_PLANET_JS.assignDependencyType;

    var __TEST_VORTEX_DEPENDENCYFACTORY_JS = _localRequire("./test\\vortex\\DependencyFactory.js"),
        notNativeDependency = __TEST_VORTEX_DEPENDENCYFACTORY_JS.notNativeDependency;

    var __TEST_VORTEX_DEPENDENCY_JS = _localRequire("./test\\vortex\\Dependency.js"),
        Dependency = __TEST_VORTEX_DEPENDENCY_JS.default;

    function ParseAddons(Addons) {
      var INTERALS = {
        extensions: {
          js: _.flatten(Addons.map(addon => addon.handler.exports.extend.jsExtensions)),
          other: _.flatten(Addons.map(addon => addon.handler.exports.extend.extensions))
        },
        importedDependencies: _.flatten(Addons.map(addon => addon.handler.exports.extend.custom.graph.dependenciesMap)),
        importedGraphers: _.flatten(Addons.map(addon => addon.handler.exports.extend.custom.graph.graphers)),
        importedCompilers: _.flatten(Addons.map(addon => addon.handler.exports.extend.custom.compiler.dependencyMapCompiler))
      };
      return INTERALS;
    } //import * as Babel_Core from '@babel/core'


    var ControlPanel;

    (function (ControlPanel) {})(ControlPanel || (ControlPanel = {}));
    /**Creates a Star/Neutron Star/Solar System from entry point.
     *
     */


    async function createStarPackage(resolvedPath) {
      const Panel = require(path.relative(__dirname, resolvedPath));
      /*vortexRetain*/


      ControlPanel.usingTerser = Panel.useTerser !== null ? Panel.useTerser : false;
      ControlPanel.outputFile = Panel.output;
      ControlPanel.encodeFilenames = Panel.encodeFilenames !== null ? Panel.encodeFilenames : true;
      ControlPanel.startingPoint = Panel.start;
      ControlPanel.extensions = Panel.extensions;
      ControlPanel.polyfillPromise = Panel.polyfillPromise;
      ControlPanel.externalLibs = Panel.outBundle !== undefined ? Panel.outBundle : [];
      ControlPanel.InstalledAddons = Panel.addons.length > 0 ? ParseAddons(Panel.addons) : null;
      ControlPanel.cssPlanet = Panel.cssPlanet;
      ControlPanel.minifyCssPlanet = Panel.minifyCssPlanet; //SPINNERS -->

      const spinner2 = ora('1. Opening the Portal');
      const spinner3 = ora('2. Vortex Commencing');
      spinner3.spinner = cliSpinners.bouncingBar;
      const spinner4 = ora('3. Hypercompressing ');
      spinner4.spinner = cliSpinners.star; //CONFIG -->
      //Defaults to false when no input is given.

      let entry = Panel.start;

      if (os.platform() === 'win32') {
        entry = amendEntryPoint(Panel.start);
      }

      let outputFilename = Panel.output;

      if (Panel.bundleMode === 'star') {
        ControlPanel.isProduction = false;
      } else if (Panel.bundleMode === 'neutronstar') {
        ControlPanel.isProduction = true;
      }

      if (ControlPanel.usingTerser === true && !ControlPanel.isProduction) {
        throw new Error(chalk.redBright('ERROR: Can not use terser on regular star!'));
      }

      if (Panel.type === 'app') {
        ControlPanel.isLibrary = false;
      } else if (Panel.type === 'library') {
        ControlPanel.isLibrary = true;
      } //PROGRAM -->


      let yourCredits = fs_extra_NAMESPACE.readJSONSync('./package.json', {
        encoding: 'utf-8'
      });
      spinner2.spinner = cliSpinners.dots11;
      spinner2.start();
      let Graph = await GenerateGraph(entry, os.platform() === 'win32' ? amendEntryPoint2(Panel.start) : Panel.start, ControlPanel).catch(err => {
        console.log(err);
        process.exit(1);
      });
      spinner2.succeed();
      spinner3.start(); //Assign Entry Dependency For Planets

      for (let planet of Graph.Planets) {
        if (!notNativeDependency(planet.entryModule, ControlPanel)) {
          planet = assignDependencyType(planet, queue);
        } else {
          planet.entryDependency = new Dependency(planet.entryModule);
        }
      }

      let bundles = await Compile(Graph, ControlPanel).catch(err => {
        console.log(err);
        process.exit(1);
      });

      if (ControlPanel.usingTerser) {
        spinner3.succeed();
        spinner4.start();
        await terserPackage(outputFilename, yourCredits, bundles).catch(err => {
          console.log(err);
          process.exit(1);
        });
        spinner4.succeed();

        if (bundles.length === 1) {
          console.log(chalk.yellowBright(`Successfully Created Neutron Star! ('${outputFilename}')`));
        } else {
          console.log(chalk.yellowBright(`Successfully Created Neutron Star! (Neutron Star outputed to '${outputFilename}')`));
          console.log(chalk.greenBright(`Planets Created: \n `));

          for (let bundle of bundles) {
            if (bundle.value !== 'star') {
              console.log(chalk.magentaBright(` \n ${bundle.value}`));
            }
          }
        }
      } else {
        await regularPackage(outputFilename, yourCredits, bundles).catch(err => {
          console.log(err);
          process.exit(1);
        });
        spinner3.succeed();

        if (bundles.length === 1) {
          console.log(chalk.rgb(252, 160, 20)(`Successfully Created Star! ('${outputFilename}')`));
        } else {
          console.log(chalk.rgb(252, 160, 20)(`Successfully Created Star! (Star outputed to '${outputFilename}') \n`));
          console.log(chalk.greenBright.underline(`Planets Created:`));

          for (let bundle of bundles) {
            if (bundle.value !== 'star') {
              console.log(chalk.yellowBright(` \n ${bundle.value}`));
            }
          }
        }
      }
    }
    /**Packages bundles to files + minifies with Terser
     *
     * @param {string} outputFilename Star output file
     * @param yourCredits Credit JSON
     * @param {Bundle[]} bundleObjects Bundle Code Objects outputed by Compiler
     */


    async function terserPackage(outputFilename, yourCredits, bundleObjects) {
      if (ControlPanel.isLibrary) {
        let credits = `/*NEUTRON-STAR*/ \n /*${yourCredits.name} ${yourCredits.version} _MINIFIED_ \n ${yourCredits.author} \n License: ${yourCredits.license} \n ${yourCredits.description} */ \n`; // var compileDownBundle = (await transformAsync(bundleObjects[0].code,{presets:[['@babel/preset-env',{modules:'commonjs'}]]})).code
        //console.log(credits)

        var minBundle = terser.minify(bundleObjects[0].code, {
          compress: true,
          mangle: true
        }).code;
        let output = credits + minBundle; //console.log(output)

        let newMainFilename = path.dirname(outputFilename) + '/' + path.basename(outputFilename, '.js') + '.min.js';
        fs_extra_NAMESPACE.ensureDirSync(path.dirname(outputFilename) + '/');
        fs_extra_NAMESPACE.writeFileSync(newMainFilename, output);
      } else {
        let credits = `/*NEUTRON-STAR*/ \n /*BUNDLED BY VORTEX*/ \n`;
        let planetCredits = `/*PLANET*/ \n /*BUNDLED BY VORTEX*/ \n`;
        fs_extra_NAMESPACE.ensureDirSync(path.dirname(outputFilename) + '/');

        for (let bundle of bundleObjects) {
          let filename;

          if (bundle.value === 'star') {
            filename = outputFilename;
            let mini = terser.minify(bundle.code, {
              compress: true,
              mangle: true
            }).code;
            let finalB = credits + mini;
            fs_extra_NAMESPACE.writeFileSync(filename, finalB);
          } else {
            filename = path.dirname(outputFilename) + '/' + bundle.value;
            let mini = terser.minify(bundle.code, {
              compress: true,
              mangle: true
            }).code;
            let finalB = planetCredits + mini;
            fs_extra_NAMESPACE.writeFileSync(filename, finalB);
          }
        }
      }
    }

    async function regularPackage(outputFilename, yourCredits, bundleObjects) {
      if (ControlPanel.isLibrary) {
        let finBund;
        finBund = bundleObjects[0].code;
        let credits = `/*STAR*/ \n /*${yourCredits.name} ${yourCredits.version} \n ${yourCredits.author} \n License: ${yourCredits.license} \n ${yourCredits.description} */ \n`;
        fs_extra_NAMESPACE.ensureDirSync(path.dirname(outputFilename) + '/');
        fs_extra_NAMESPACE.writeFileSync(outputFilename, credits + finBund);
      } else {
        let credits = ControlPanel.isProduction ? `/*NEUTRON-STAR*/ \n /*BUNDLED BY VORTEX*/ \n` : `/*STAR*/ \n /*BUNDLED BY VORTEX*/ \n`;
        let planetCredits = `/*PLANET*/ \n /*BUNDLED BY VORTEX*/ \n`;
        fs_extra_NAMESPACE.ensureDirSync(path.dirname(outputFilename) + '/');

        for (let bundle of bundleObjects) {
          let filename;

          if (bundle.value === 'star') {
            filename = outputFilename;
            let finalB = credits + bundle.code;
            fs_extra_NAMESPACE.writeFileSync(filename, finalB);
          } else {
            filename = path.dirname(outputFilename) + '/' + bundle.value;
            let finalB = planetCredits + bundle.code;
            fs_extra_NAMESPACE.writeFileSync(filename, finalB);
          }
        }
      }
    }

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

    function amendEntryPoint2(entry) {
      let shortEntry = entry.slice(2);

      while (shortEntry.includes('/')) {
        let i = shortEntry.indexOf('/');
        let a = shortEntry.slice(0, i);
        let b = shortEntry.slice(i + 1);
        shortEntry = `${a}\\\\${b}`;
      }

      return `./${shortEntry}`;
    } // if(Panel.type !== 'live'){
    //     createStarPackage();
    // } else if(Panel.type === 'live'){
    // }
    //fs.writeJSONSync('out/importcool.json',Babel.parse(fs.readFileSync('./test/func.js').toString(),{"plugins":["dynamicImport"],"sourceType":"module"}))


    _localExports.createStarPackage = createStarPackage;
  }),
  "./test\\vortex\\live\\LivePush.js": (function (_localRequire, _localExports, fs_extra_NAMESPACE, FSEXTRA, terser, path, chalk, cli_spinners_NAMESPACE, ora, os, os_NAMESPACE, fs, fs_promises_NAMESPACE, FS, babel_core_NAMESPACE, t, babel_generator_NAMESPACE, Parse5, resolve, util_NAMESPACE, e, chokidar, diff_NAMESPACE, io, Babel, css, babel_traverse_NAMESPACE, babel_template_NAMESPACE, _, uuid_NAMESPACE) {
    var tag = "Reload";
    var resolveAsync = util_NAMESPACE.promisify(resolve);
    var diffLinesAsync = util_NAMESPACE.promisify(diff_NAMESPACE.diffLines);
    var LooseParseOptions = {
      sourceType: "module",
      allowReturnOutsideFunction: true,
      allowImportExportEverywhere: true,
      allowSuperOutsideMethod: true,
      allowAwaitOutsideFunction: true,
      allowUndeclaredExports: true
    };
    var loadedModules = [];
    var queue = [];
    var htmlClientDependenciesAdded;
    var globalStylesFile = '/GLOBAL_STYLES.css';
    var assetsFolder = '/assets';
    var IO;
    var stylesheets = [];
    var NON_JS_REGEX = /(\.css|\.ttf|\.png|\.jpe?g)$/g;
    var fileRegex = /(\.ttf|\.png|\.jpe?g)/g;
    var INITSTAGE = `
    ============================= 
                            
        Welcome To LivePush!
                        
    =============================
`;
    var controlPanelDIR;
    var InternalLivePushOptions;

    function readControlPanel(ControlPanelObject) {
      return {
        externals: ControlPanelObject.livePushOptions.CDNImports,
        entry: ControlPanelObject.livePushOptions.entry,
        dirToHTML: ControlPanelObject.livePushOptions.dirToHTML
      };
    }
    /**
     *
     * The Vortex Live Updater!
     *
     */


    class LivePush {
      /**
       *
       * @param {string} dirToControlPanel Resolved Dir to Vortex Control Panel
       * @param {Express} expressRouter Server router
       * @param {Server} server Node.js Server object (Used for binding socket.io)
       * @param {number} portNum Port num for given node.js server to listen on.
       * @param {boolean} preLoadHTMLPage Option to load from already prepared HTML page.
       */
      constructor(dirToControlPanel, expressRouter, server, portNum, preLoadHTMLPage) {
        controlPanelDIR = dirToControlPanel;

        const Panel = require(dirToControlPanel);
        /*vortexRetain*/


        InternalLivePushOptions = readControlPanel(Panel); //Init Socket.Io

        IO = io(server);
        htmlClientDependenciesAdded = preLoadHTMLPage;
        server.listen(portNum);
        this.run(InternalLivePushOptions.dirToHTML, InternalLivePushOptions.entry, expressRouter);
      }
      /**
       * Intializes live interpreter.
       * @param {string} dirToHTML
       * @param {string} dirToEntry
       * @param {Express} router
       */


      run(dirToHTML, dirToEntry, router) {
        //Start Spinner!
        const initStage = ora({
          prefixText: chalk.yellowBright("Initializing..."),
          spinner: cliSpinners.dots10
        });
        initStage.start(); //Init LivePush!

        initLiveDependencyTree(dirToEntry, dirToHTML).then(LiveTree => {
          router.get('/*', (req, res) => {
            res.sendFile(dirToHTML);
          });
          FSEXTRA.ensureDir(path.resolve(path.dirname(dirToHTML), assetsFolder)).then(() => {
            router.use(assetsFolder, e.static(path.resolve(path.dirname(dirToHTML), assetsFolder)));
            initStage.stop();
            console.log(chalk.greenBright(INITSTAGE));
            initWatch(LiveTree, router, dirToHTML);
          });
        }).catch(err => console.log(err));
      }

    }

    class LiveTree {
      constructor() {
        this.memory = [];
        /**
         * The pre-processed local file code.
         */

        this.preProcessQueue = [];
        this.moduleBuffer = [];
        this.branches = [];
        this.contexts = [];
        this.fileBin = [];
        this.requests = [];
      }

      addBranch(branch) {
        this.branches.push(branch);
      }

      branchExists(branchMain) {
        for (let branch of this.branches) {
          if (branch.main === branchMain) {
            return true;
          }
        }

        return false;
      }

      removeBranch(branchMain) {
        this.branches.filter(branch => branch.main !== branchMain);
      }

      contextExists(contextID) {
        for (let context of this.contexts) {
          if (context.provider === contextID) {
            return true;
          }
        }

        return false;
      }

      loadContext(contextID) {
        return this.contexts.find(context => contextID === context.provider);
      }

      replaceContext(contextID, newContext) {
        for (let context of this.contexts) {
          if (context.provider === contextID) {
            context = newContext;
            return;
          }
        }
      }

      removeContext(contextID) {
        this.contexts.filter(context => context.provider !== contextID);
      }

      memoryExists(address) {
        if (this.memory.find(mem => mem.address === address)) {
          return true;
        } else {
          return false;
        }
      }

      loadMemory(address) {
        return this.memory.find(mem => mem.address === address);
      }

      addMemory(mem) {
        this.memory.push(mem);
      }

      addImportToMemory(address, IMPORT, importFrom) {
        this.memory.find(mem => mem.address === address).imports.push({
          name: importFrom,
          varDeclaration: IMPORT
        });
      }

      refreshMemory(address, IMPORTS) {
        this.memory.find(mem => mem.address === address).imports = IMPORTS;
      }

    }

    class ModuleContext {
      constructor() {
        this.addresses = [];
      }

      addAddress(address) {
        this.addresses.push(address.ID);
      }

      addressExists(addressID) {
        for (let ID of this.addresses) {
          if (ID === addressID) {
            return true;
          }
        }

        return false;
      }

      removeAddress(addressID) {
        this.addresses.filter(ID => ID !== addressID);
      }

    }

    class CSSContext {
      constructor() {
        this.addresses = [];
      }

      addAddress(address) {
        this.addresses.push(address.ID);
      }

      addressExists(addressID) {
        for (let ID of this.addresses) {
          if (ID === addressID) {
            return true;
          }
        }

        return false;
      }

      removeAddress(addressID) {
        this.addresses.filter(ID => ID !== addressID);
      }

    }

    class LiveModule {
      constructor(source) {
        this.branches = [];
        this.fileBin = [];
        this.requests = [];
        this.main = source;
        this.ID = source;
      }

      addBranch(branch) {
        this.branches.push(branch);
      }

      branchExists(branchMain) {
        for (let branch of this.branches) {
          if (branch.main === branchMain) {
            return true;
          }
        }

        return false;
      }

      removeBranch(branchMain) {
        this.branches.filter(branch => branch.main !== branchMain);
      }

    }

    class LiveCSS {
      constructor(source) {
        this.branches = [];
        this.fileBin = [];
        this.main = source;
      }

      addBranch(branch) {
        this.branches.push(branch);
      }

      branchExists(branchMain) {
        for (let branch of this.branches) {
          if (branch.main === branchMain) {
            return true;
          }
        }

        return false;
      }

      removeBranch(branchMain) {
        this.branches.filter(branch => branch.main !== branchMain);
      }

    }

    function isModule(moduleName) {
      if (NON_JS_REGEX.test(moduleName)) {
        return false;
      } else if (!path.extname(moduleName)) {
        return true;
      } else if (/\.m?jsx?$/g.test(moduleName)) {
        return true;
      }
    }

    function ResolveRelative(from, to) {
      return './' + path.join(path.dirname(from), to);
    }

    function addJSExtIfPossible(filename) {
      let regexp = /\.m?js$/g;
      return regexp.test(filename) ? filename : filename + '.js';
    }

    async function resolveNodeLibrary(nodelibName) {
      let stage1 = await resolveAsync(nodelibName);
      let stage2 = await RelayFetch(stage1);

      if (stage2.length === 0) {
        return stage1;
      } else {
        return stage2[0];
      }
    }

    async function RelayFetch(index) {
      const ast = await babel_core_NAMESPACE.parseAsync((await fs.readFile(index)).toString());
      let GLOBAL_RESOLVE = path.join;
      let DIRNAME = path.dirname;
      let exports = [];
      babel_core_NAMESPACE.traverse(ast, {
        AssignmentExpression: function (path) {
          if (path.node.left.type === "MemberExpression" && path.node.left.object.type === 'Identifier' && path.node.left.object.name === 'module' && path.node.left.property.name === 'exports' && path.node.right.type === 'CallExpression' && path.node.right.callee.type === 'Identifier' && path.node.right.callee.name === 'require') {
            exports.push(GLOBAL_RESOLVE(DIRNAME(index), addJSExtIfPossible(path.node.right.arguments[0].value)));
          }
        }
      });
      return exports.filter(lib => !lib.includes('prod') && !lib.includes('min'));
    }

    function pushRequests(currentBranch, path, context) {
      let type = "Module";
      let namespaceRequest;

      if (context.provider.includes('.css')) {
        type = "CSS";
      } //ES IMPORT CHECK!!


      if (path.node.type === "ImportDeclaration") {
        if (path.node.specifiers.length === 0) {
          currentBranch.requests.push({
            contextID: context.provider,
            requests: [],
            type,
            namespaceRequest: null
          });
          return;
        }

        let imports = path.node.specifiers.map(imp => imp.local.name);

        if (path.node.specifiers[0].type === 'ImportDefaultSpecifier' && imports.length > 1 || !context.provider.includes('./')) {
          namespaceRequest = imports[0];
        }

        currentBranch.requests.push({
          contextID: context.provider,
          requests: imports,
          type,
          namespaceRequest
        });
        return; //COMMON JS IMPORT CHECK!!
      } else if (path.node.type === "VariableDeclarator") {
        currentBranch.requests.push({
          contextID: context.provider,
          requests: [path.node.id.name],
          type,
          namespaceRequest: path.node.id.name
        });
      }
    }
    /**Manages Live Tree addtions/removals
     *
     * @param {string} name
     * @param {LiveAddress&LiveBranch|LiveTree} currentBranch
     * @param {LiveTree} tree
     * @param {boolean} isTree
     * @param {NodePath<t.ImportDeclaration>|NodePath<t.VariableDeclarator>} path
     */


    function TreeBuilder(name, currentBranch, tree, isTree, path) {
      let module;

      if (isModule(name)) {
        name = name.includes('./') ? addJSExtIfPossible(name) : name;
        module = new LiveModule(name);
      } else if (name.includes('.css')) {
        module = new LiveCSS(name);
      } //If is live Branch


      if (!isTree) {
        if (tree.contextExists(name)) {
          let context = tree.loadContext(name);

          if (!context.addressExists(currentBranch.ID)) {
            context.addAddress(currentBranch);
          }

          pushRequests(currentBranch, path, context);
        } else {
          let context;

          if (module) {
            if (module instanceof LiveCSS) {
              context = new CSSContext();
              context.provider = name;
            } else {
              context = new ModuleContext();
              context.provider = name;
            }

            context.addAddress(currentBranch);
            tree.contexts.push(context);
            pushRequests(currentBranch, path, context);
          }
        } //If Live Tree

      } else {
        let context;

        if (module) {
          if (module instanceof LiveCSS) {
            context = new CSSContext();
          } else {
            context = new ModuleContext();
          }

          context.provider = name;
          context.addAddress(currentBranch);
          currentBranch.contexts.push(context);
          pushRequests(currentBranch, path, context);
        }
      }

      currentBranch.addBranch(module);
    }

    var fileDependencies = new Set();

    function resolveAssetToHTMLPage(resolvedPath) {
      if (!fileDependencies.has(resolvedPath)) {
        fileDependencies.add(resolvedPath);
      }

      return path.join('.' + assetsFolder, path.basename(resolvedPath));
    }

    const PATH = path;
    /**Traverses Branch and Builds Imports/Requests
     *
     * @param {LPEntry} entry
     * @param {LiveBranch&LiveAddress|LiveTree} currentBranch
     * @param {LiveTree} tree
     */

    function TraverseAndTransform(entry, currentBranch, tree) {
      var isTree = false;

      if (currentBranch instanceof LiveTree) {
        isTree = true;
      }

      var defaultExport;
      var rolledExports = [];
      babel_core_NAMESPACE.traverse(entry.ast, {
        // ES6 Imports
        ImportDeclaration: function (path) {
          let name = path.node.source.value.includes('./') ? ResolveRelative(entry.name, path.node.source.value) : path.node.source.value;

          if (fileRegex.test(name)) {
            path.replaceWith(t.variableDeclaration("var", [t.variableDeclarator(t.identifier(path.node.specifiers[0].local.name), t.stringLiteral(resolveAssetToHTMLPage(name)))]));
            return;
          } else {
            TreeBuilder(name, currentBranch, tree, isTree, path);
            path.remove();
          }
        },
        //CommonJS Requires!
        VariableDeclarator: function (path) {
          if (path.node.init !== null && path.node.init.type === 'CallExpression' && path.node.init.callee.type === 'Identifier' && path.node.init.callee.name === 'require') {
            let name = path.node.init.arguments[0].value.includes('./') && entry.name.includes('./') ? ResolveRelative(entry.name, path.node.init.arguments[0].value) : path.node.init.arguments[0].value;
            TreeBuilder(name, currentBranch, tree, isTree, path);
            path.remove(); // Interop Require Wildcard!!
          } else if (path.node.init !== null && path.node.init.type === "CallExpression" && path.node.init.callee.type === "Identifier" && path.node.init.callee.name.includes("_interop") && path.node.init.arguments[0].type === "CallExpression" && path.node.init.arguments[0].callee.type === "Identifier" && path.node.init.arguments[0].callee.name === "require") {
            let name = path.node.init.arguments[0].arguments[0].value.includes('./') && entry.name.includes('./') ? ResolveRelative(entry.name, path.node.init.arguments[0].arguments[0].value) : path.node.init.arguments[0].arguments[0].value;
            TreeBuilder(name, currentBranch, tree, isTree, path);
            path.remove();
          }
        },
        //Envify Modules!
        MemberExpression: function (path) {
          if (path.node.object.type === 'MemberExpression' && path.node.object.object.type === 'Identifier' && path.node.object.object.name === 'process' && path.node.object.property.name === 'env' && path.node.property.name === 'NODE_ENV') {
            path.replaceWith(t.stringLiteral('live'));
          }
        },
        ExportNamedDeclaration: function (path) {
          if (path.node.specifiers.length > 0) {
            for (let specifier of path.node.specifiers) {
              if (specifier.type === "ExportSpecifier") {
                rolledExports.push(t.expressionStatement(t.assignmentExpression("=", t.memberExpression(t.identifier("exports"), t.identifier(specifier.exported)), t.identifier(specifier.local))));
              }
            }

            path.remove();
          } else {
            if (path.node.declaration.type === "ClassDeclaration") {
              rolledExports.push(t.expressionStatement(t.assignmentExpression("=", t.memberExpression(t.identifier("exports"), t.identifier(path.node.declaration.id.name)), t.identifier(path.node.declaration.id.name))));
              path.replaceWith(path.node.declaration);
            } else if (path.node.declaration.type === "FunctionDeclaration") {
              path.replaceWith(t.assignmentExpression("=", t.memberExpression(t.identifier("exports"), t.identifier(path.node.declaration.id.name)), t.functionExpression(path.node.declaration.id, path.node.declaration.params, path.node.declaration.body, path.node.declaration.generator, path.node.declaration.async)));
            }
          }
        },
        ExportDefaultDeclaration: function (path) {
          defaultExport = t.expressionStatement(t.assignmentExpression("=", t.memberExpression(t.identifier("module"), t.identifier("exports")), t.identifier(path.node.declaration.id.name)));
          path.replaceWith(path.node.declaration);
        }
      });
      entry.ast.program.body = entry.ast.program.body.concat(rolledExports);

      if (defaultExport) {
        entry.ast.program.body.push(defaultExport);
      }
    }

    async function RecursiveTraverse(branch, liveTree, queue) {
      for (let subBranch of branch.branches) {
        if (subBranch instanceof LiveModule) {
          if (!loadedModules.includes(subBranch.main)) {
            if (subBranch.main.includes('./')) {
              let location = branch.libLoc ? path.join(path.dirname(branch.libLoc), subBranch.main) : ResolveRelative(branch.main, subBranch.main);
              let transformed = (await babel_core_NAMESPACE.transformAsync((await fs.readFile(location)).toString(), {
                sourceType: "module",
                presets: ['@babel/preset-react'],
                plugins: ['@babel/plugin-proposal-class-properties']
              })).code;
              liveTree.preProcessQueue.push({
                name: location,
                code: transformed
              });
              let ENTRY = {
                name: subBranch.main,
                ast: await babel_core_NAMESPACE.parseAsync(transformed, {
                  sourceType: "module",
                  presets: ['@babel/preset-react']
                })
              };
              queue.push(ENTRY);
              TraverseAndTransform(ENTRY, subBranch, liveTree);

              if (subBranch.branches.length > 0) {
                await RecursiveTraverse(subBranch, liveTree, queue);
              }

              loadedModules.push(subBranch.main);
            } else {
              let libLoc = await resolveNodeLibrary(subBranch.main);
              subBranch.libLoc = libLoc;
              let ENTRY = {
                name: subBranch.main,
                ast: await babel_core_NAMESPACE.parseAsync((await fs.readFile(libLoc)).toString(), {
                  sourceType: "module",
                  presets: ['@babel/preset-react']
                })
              };
              queue.push(ENTRY);
              TraverseAndTransform(ENTRY, subBranch, liveTree);

              if (subBranch.branches.length > 0) {
                await RecursiveTraverse(subBranch, liveTree, queue);
              }

              loadedModules.push(subBranch.main);
            }
          }
        }
      }
    }

    function fetchLPEntry(entry_name) {
      return queue.find(entry => entry.name === entry_name);
    }
    /**
     * Recursivly fetches Live Branch from tree!
     * @param {string} addressID
     * @param {LiveTree|LiveModule} tree_OR_branch
     */


    function fetchAddressFromTree(addressID, tree_OR_branch) {
      if (tree_OR_branch.ID === addressID) {
        return tree_OR_branch;
      } else {
        for (let branch of tree_OR_branch.branches) {
          if (branch instanceof LiveModule) {
            if (branch.ID === addressID) {
              return branch;
            } else {
              var subBranch = fetchAddressFromTree(addressID, branch);

              if (subBranch) {
                return subBranch;
              }
            }
          }
        } // for(let branch of tree_OR_branch.branches){
        //     if(branch instanceof LiveModule){
        //         return fetchAddressFromTree(addressID,branch);
        //     }
        // }

      }
    }

    function loadRequestFromAddress(address, context_ID) {
      return address.requests.find(request => request.contextID === context_ID);
    }

    function normalizeModuleName(name) {
      if (name[0] === '@') {
        name = name.slice(1);
      }

      let NASTY_CHARS = /(@|\/|\^|\$|#|\*|&|!|%|-|\.|\\)/g;
      return name.replace(NASTY_CHARS, "_");
    }
    /**
     * Create a Live Tree.
     * @param {string} root Entry Point
     * @param dirToHtml Directory to HTML Page
     */


    async function initLiveDependencyTree(root, dirToHtml) {
      var ROOT = amendEntryPoint(root);
      var ROOT2 = amendEntryPoint2(root);

      function amendEntryPoint(entry) {
        if (os_NAMESPACE.platform() !== "win32") {
          return entry;
        } else {
          let shortEntry = entry.slice(2);
          return `./${shortEntry.replace(/\//g, "\\")}`;
        }
      }

      function amendEntryPoint2(entry) {
        if (os_NAMESPACE.platform() !== "win32") {
          return entry;
        } else {
          let shortEntry = entry.slice(2);
          return `./${shortEntry.replace(/\//g, "\\\\")}`;
        }
      }

      var liveTree = new LiveTree();
      liveTree.root = ROOT;
      liveTree.ID = ROOT;
      var transformed = (await babel_core_NAMESPACE.transformAsync((await fs.readFile(ROOT)).toString(), {
        sourceType: "module",
        presets: ['@babel/preset-react'],
        plugins: ['@babel/plugin-proposal-class-properties']
      })).code;
      liveTree.preProcessQueue.push({
        name: ROOT,
        code: transformed
      });
      var rootEntry = {
        name: ROOT,
        ast: await babel_core_NAMESPACE.parseAsync(transformed, {
          sourceType: "module"
        })
      };
      queue.push(rootEntry);
      loadedModules.push(ROOT);
      TraverseAndTransform(rootEntry, liveTree);

      for (let branch of liveTree.branches) {
        if (branch instanceof LiveModule) {
          if (!loadedModules.includes(branch.main)) {
            if (branch.main.includes('./')) {
              let transformed = (await babel_core_NAMESPACE.transformAsync((await fs.readFile(branch.main)).toString(), {
                sourceType: "module",
                presets: ['@babel/preset-react'],
                plugins: ['@babel/plugin-proposal-class-properties']
              })).code;
              liveTree.preProcessQueue.push({
                name: branch.main,
                code: transformed
              });
              let ENTRY = {
                name: branch.main,
                ast: await babel_core_NAMESPACE.parseAsync(transformed, {
                  sourceType: "module",
                  presets: ['@babel/preset-react']
                })
              };
              queue.push(ENTRY);
              TraverseAndTransform(ENTRY, branch, liveTree);

              if (branch.branches.length > 0) {
                await RecursiveTraverse(branch, liveTree, queue);
              }

              loadedModules.push(branch.main);
            } else {
              let libLoc = await resolveNodeLibrary(branch.main);
              branch.libLoc = libLoc;
              let ENTRY = {
                name: branch.main,
                ast: await babel_core_NAMESPACE.parseAsync((await fs.readFile(libLoc)).toString(), {
                  sourceType: "module",
                  presets: ['@babel/preset-react']
                })
              };
              queue.push(ENTRY);
              TraverseAndTransform(ENTRY, branch, liveTree);

              if (branch.branches.length > 0) {
                await RecursiveTraverse(branch, liveTree, queue);
              }

              loadedModules.push(branch.main);
            }
          }
        }
      }

      for (let context of liveTree.contexts) {
        if (context instanceof ModuleContext) {
          for (let address of context.addresses) {
            let ast = fetchLPEntry(address).ast;
            let module = fetchAddressFromTree(address, liveTree);

            if (module instanceof LiveModule || module instanceof LiveTree) {
              let contextRequest = loadRequestFromAddress(module, context.provider);

              if (contextRequest.type === 'Module') {
                //Build Imports
                let imports = [];
                let newName = normalizeModuleName(context.provider.toUpperCase());
                let declarator;

                if (contextRequest.namespaceRequest) {
                  declarator = t.variableDeclarator(t.identifier(newName), t.callExpression(t.identifier('loadExports'), [t.stringLiteral(context.provider), t.stringLiteral(contextRequest.namespaceRequest)]));
                } else {
                  declarator = t.variableDeclarator(t.identifier(newName), t.callExpression(t.identifier('loadExports'), [t.stringLiteral(context.provider)]));
                }

                imports.push(declarator);

                for (let request of contextRequest.requests) {
                  imports.push(t.variableDeclarator(t.identifier(request), t.memberExpression(t.identifier(newName), t.identifier(request))));
                }

                let VARDEC = t.variableDeclaration('var', imports);
                ast.program.body.unshift(VARDEC);

                if (liveTree.memoryExists(address)) {
                  liveTree.addImportToMemory(address, VARDEC, context.provider);
                } else {
                  liveTree.addMemory({
                    address,
                    imports: [{
                      varDeclaration: VARDEC,
                      name: context.provider
                    }]
                  });
                }
              }
            }
          }
        } else if (context instanceof CSSContext) {
          stylesheets.push({
            name: context.provider,
            code: (await fs.readFile(context.provider)).toString()
          });
        }
      }

      var STYLENAME = `${path.dirname(dirToHtml)}${globalStylesFile}`;
      let factory = `
    var loadedModules = [];
    var loadedExportsByModule = {};
  
    function loadExports(module0, namespace) {
      if (loadedModules.includes(module0)) {
        if (namespace && !loadedExportsByModule[module0].cachedExports.exports) {
          var namespace0 = {};
          Object.defineProperty(namespace0, namespace, {
            writable: false,
            enumerable: true,
            value: loadedExportsByModule[module0].cachedExports
          });
          var obj = Object.entries(loadedExportsByModule[module0].cachedExports).concat(Object.entries(namespace0));
          return Object.fromEntries(obj);
        } else if(namespace && loadedExportsByModule[module0].cachedExports.exports) {
          var namespace0 = {};
          Object.defineProperty(namespace0, namespace, {
            writable: false,
            enumerable: true,
            value: loadedExportsByModule[module0].cachedExports.exports
          });
          console.log(namespace0)
          return namespace0;
        }
        else {
          return loadedExportsByModule[module0].cachedExports;
        }
      } else {
        //Named Exports
        var exports = {}; //Default Export
  
        var module = {};
  
        live_modules[module0](loadExports,exports,module);
  
        if (module0.includes('./')) {
          var obj = {};
          Object.defineProperty(obj, namespace, {
            value: module,
            enumerable: true
          });
  
          if (namespace) {
            var exps = Object.assign(exports, obj);
            cacheExports(module0, exps);
            return exps;
          } else {
            var exps = Object.assign(exports, module.exports);
            cacheExports(module0, exps);
            return exps;
          }
        } else {
          if (namespace && module.exports && Object.entries(module).length > 1) {
            var finalNamespace = {};
            Object.defineProperty(finalNamespace, namespace, {
              value: exports,
              enumerable: true,
              writable: false
            });
            var entries = Object.entries(exports).concat(Object.entries(finalNamespace));
            var exps = Object.fromEntries(entries);
            cacheExports(module0, exports);
            return exps;
  
          }else if (namespace && module.exports && Object.entries(module).length === 1){
            var finalName = {};
            cacheExports(module0,module);
            Object.defineProperty(finalName,namespace, {
              value:module.exports,
              enumerable:true,
              writable:false
            });
            return finalName
  
        } else if(namespace && !module.exports){
          var finalNamespac1 = {};
          Object.defineProperty(finalNamespac1,namespace, {
            value:exports,
            enumerable:true,
            writable:false
          })
  
          var entries = Object.entries(exports).concat(Object.entries(finalNamespac1))
          cacheExports(module0,exports)
          var exps = Object.fromEntries(entries)
          return exps
        } 
        else if (Object.entries(exports).length > 0) {
            cacheExports(module0, exports);
            return exports;
          } else if (module.exports && Object.entries(module).length > 0) {
            cacheExports(module0, module);
            return module;
          }
        }
      }
    }
  
    function cacheExports(mod_name, mod_exports) {
      var o = new Object(mod_name);
      Object.defineProperty(o, 'cachedExports', {
        value: mod_exports,
        writable: false
      });
      Object.defineProperty(loadedExportsByModule, mod_name, {
        value: o
      });
      loadedModules.push(mod_name);
    }

    ${stylesheets.length > 0 ? ` 
    var cssPlanet = document.createElement("link");
    cssPlanet.rel = "stylesheet";
    cssPlanet.href = "${'.' + globalStylesFile}";
    document.head.appendChild(cssPlanet);
    ` : ''}
  
    return loadExports('${os_NAMESPACE.platform() === "win32" ? ROOT2 : ROOT}');`;
      let styleFactory = `
    var loadedModules = [];
    var loadedExportsByModule = {};
  
    function loadExports(module0, namespace) {
      if (loadedModules.includes(module0)) {
        if (namespace && !loadedExportsByModule[module0].cachedExports.exports) {
          var namespace0 = {};
          Object.defineProperty(namespace0, namespace, {
            writable: false,
            enumerable: true,
            value: loadedExportsByModule[module0].cachedExports
          });
          var obj = Object.entries(loadedExportsByModule[module0].cachedExports).concat(Object.entries(namespace0));
          return Object.fromEntries(obj);
        } else if(namespace && loadedExportsByModule[module0].cachedExports.exports) {
          var namespace0 = {};
          Object.defineProperty(namespace0, namespace, {
            writable: false,
            enumerable: true,
            value: loadedExportsByModule[module0].cachedExports.exports
          });
          console.log(namespace0)
          return namespace0;
        }
        else {
          return loadedExportsByModule[module0].cachedExports;
        }
      } else {
        //Named Exports
        var exports = {}; //Default Export
  
        var module = {};
  
        live_modules[module0](loadExports,exports,module);
  
        if (module0.includes('./')) {
          var obj = {};
          Object.defineProperty(obj, namespace, {
            value: module,
            enumerable: true
          });
  
          if (namespace) {
            var exps = Object.assign(exports, obj);
            cacheExports(module0, exps);
            return exps;
          } else {
            var exps = Object.assign(exports, module.exports);
            cacheExports(module0, exps);
            return exps;
          }
        } else {
          if (namespace && module.exports && Object.entries(module).length > 1) {
            var finalNamespace = {};
            Object.defineProperty(finalNamespace, namespace, {
              value: exports,
              enumerable: true,
              writable: false
            });
            var entries = Object.entries(exports).concat(Object.entries(finalNamespace));
            var exps = Object.fromEntries(entries);
            cacheExports(module0, exports);
            return exps;
  
          }else if (namespace && module.exports && Object.entries(module).length === 1){
            var finalName = {};
            cacheExports(module0,module);
            Object.defineProperty(finalName,namespace, {
              value:module.exports,
              enumerable:true,
              writable:false
            });
            return finalName
  
        } else if(namespace && !module.exports){
          var finalNamespac1 = {};
          Object.defineProperty(finalNamespac1,namespace, {
            value:exports,
            enumerable:true,
            writable:false
          })
  
          var entries = Object.entries(exports).concat(Object.entries(finalNamespac1))
          cacheExports(module0,exports)
          var exps = Object.fromEntries(entries)
          return exps
        } 
        else if (Object.entries(exports).length > 0) {
            cacheExports(module0, exports);
            return exports;
          } else if (module.exports && Object.entries(module).length > 0) {
            cacheExports(module0, module);
            return module;
          }
        }
      }
    }
  
    function cacheExports(mod_name, mod_exports) {
      var o = new Object(mod_name);
      Object.defineProperty(o, 'cachedExports', {
        value: mod_exports,
        writable: false
      });
      Object.defineProperty(loadedExportsByModule, mod_name, {
        value: o
      });
      loadedModules.push(mod_name);
    }
    var cssPlanet = document.createElement("link");
    cssPlanet.rel = "stylesheet";
    cssPlanet.href = "${'.' + globalStylesFile}";
    document.head.appendChild(cssPlanet);
  
    return loadExports('${os_NAMESPACE.platform() === "win32" ? ROOT2 : ROOT}')`;

      if (stylesheets.length > 0) {
        await fs.writeFile(STYLENAME, stylesheets.map(entry => entry.code).join('\n'));
        liveTree.dirToCssPlanet = STYLENAME;
      }

      let parsedFactory = (await babel_core_NAMESPACE.parseAsync(factory, {
        sourceType: 'module',
        parserOpts: {
          allowReturnOutsideFunction: true
        }
      })).program.body;
      let parsedCSSFactory = (await babel_core_NAMESPACE.parseAsync(styleFactory, {
        sourceType: 'module',
        parserOpts: {
          allowReturnOutsideFunction: true
        }
      })).program.body;
      liveTree.factory = parsedFactory;
      liveTree.cssFactory = parsedCSSFactory;
      await FSEXTRA.ensureDir(path.resolve(path.dirname(InternalLivePushOptions.dirToHTML), './assets/'));

      if (fileDependencies.size > 0) {
        for (let dep of fileDependencies) {
          await FSEXTRA.copy(dep, path.resolve(path.dirname(InternalLivePushOptions.dirToHTML), path.join('./assets/', path.basename(dep))));
        }
      }

      let buffer = [];

      for (let ent of queue) {
        buffer.push(t.objectProperty(t.stringLiteral(ent.name), t.callExpression(t.identifier(''), [t.functionExpression(null, [t.identifier('loadExports'), t.identifier('exports'), t.identifier('module')], t.blockStatement(ent.ast.program.body))])));
      }

      liveTree.moduleBuffer = buffer;
      let final0 = t.objectExpression(buffer);
      let final1 = babel_generator_NAMESPACE.default(t.expressionStatement(t.callExpression(t.identifier(''), [t.callExpression(t.functionExpression(null, [t.identifier('live_modules')], t.blockStatement(parsedFactory)), [final0])])));

      if (!htmlClientDependenciesAdded) {
        await appendToHTMLPage(dirToHtml, final1.code);
      } else {
        await fs.writeFile(path.dirname(dirToHtml) + '/LIVEPUSH.js', final1.code);
      }

      return liveTree;
    }

    async function appendToHTMLPage(dirToHTML, livePushPackage) {
      let fileloc = path.dirname(dirToHTML) + '/LIVEPUSH.js';
      await fs.writeFile(fileloc, livePushPackage);
      const document = Parse5.parse((await fs.readFile(dirToHTML)).toString());
      const HTML = document.childNodes[0];
      const PackageScript = {
        nodeName: "script",
        tagName: "script",
        attrs: [{
          name: "src",
          value: './LIVEPUSH.js'
        }]
      };

      if (HTML.childNodes[0].nodeName === "body") {
        HTML.childNodes[0].childNodes.push(PackageScript);
      } else if (HTML.childNodes[0].nodeName === "head" && HTML.childNodes[1].nodeName === "body") {
        HTML.childNodes[1].childNodes.push(PackageScript);
      }

      const result = Parse5.serialize(document);
      await fs.writeFile(dirToHTML, result);
      return;
    }

    var CSSREGEX = /\.css$/;

    async function initWatch(Tree, router, htmlDir) {
      var reloadcount = 0;
      reloadHTML(true, tag + "0");
      const watcher = ora({
        prefixText: 'Watching Files...',
        spinner: cliSpinners.circleHalves
      });
      var TREE = Tree;
      const pushStage = ora({
        prefixText: chalk.yellowBright('Pushing...'),
        spinner: cliSpinners.bouncingBar
      }); // Modules to Watch (Includes Entry Point!)

      var modulesAndStylesToWatch = loadedModules.filter(filename => filename.includes('./')).concat(stylesheets.map(entry => entry.name));
      var Watcher = new chokidar.FSWatcher({
        persistent: true
      });
      TREE.preProcessQueue = TREE.preProcessQueue.filter(entry => entry.name.includes('./'));
      Watcher.add(modulesAndStylesToWatch);
      watcher.start();
      Watcher.on("change", filename => {
        filename = './' + filename; // console.log(`${filename} has been Changed!`)

        watcher.stop();
        pushStage.start();
        console.log(filename);

        if (CSSREGEX.test(filename)) {
          updateCSS(filename, TREE.dirToCssPlanet).then(() => {
            pushStage.succeed();
            console.log(chalk.redBright('Successfully Pushed CSS Changes!'));
            reloadcount += 1;
            reloadHTML(false, tag + reloadcount);
            watcher.start();
          }).catch(err => console.log(err));
        } else if (isModule(filename)) {
          updateTree(filename, TREE, TREE.preProcessQueue, htmlDir).then(({
            liveTree,
            delta
          }) => {
            TREE = liveTree;

            if (delta.length > 0) {
              let newModulesToWatch = delta.filter(filename => filename.includes('./'));

              if (newModulesToWatch.length > 0) {
                Watcher.add(newModulesToWatch);
                console.log('Watching new modules:' + newModulesToWatch.join(','));
              }

              console.log('New modules added to project:' + delta.join(','));
            }

            pushStage.succeed();
            console.log(chalk.greenBright("Successfully Pushed Changes!"));
            reloadcount += 1;
            reloadHTML(false, tag + reloadcount);
            watcher.start();
          }).catch(err => {
            console.log(err);
          });
        }
      });
    }

    async function updateTree(filename, liveTree, preProcessQueue, dirToHTML) {
      console.log("Hello");
      let priorloadedFiles = new Set(...fileDependencies);
      let priorloadedStyles = new Array(...stylesheets.map(entry => entry.name));
      let priorLoadedModules = new Array(...loadedModules);
      let newFile = (await babel_core_NAMESPACE.transformAsync((await fs.readFile(filename)).toString(), {
        sourceType: 'module',
        presets: ['@babel/preset-react'],
        plugins: ['@babel/plugin-proposal-class-properties']
      })).code;
      let oldTrans = preProcessQueue.find(entry => entry.name === filename).code;
      var CHANGES = await diffLinesAsync(await processJSForRequests(oldTrans), await processJSForRequests(newFile));
      var REQUESTDIFF = await diffRequests(CHANGES, filename);
      preProcessQueue.find(entry => entry.name === filename).code = newFile;
      let AST = await babel_core_NAMESPACE.parseAsync(newFile, {
        sourceType: 'module',
        parserOpts: {
          strictMode: false
        }
      });
      removeImportsAndExportsFromAST(AST, filename);
      fetchLPEntry(filename).ast = AST;
      var delta = [];

      if (REQUESTDIFF.length > 0) {
        let REMOVED_OR_MODIFIED_IMPORTNAMES = [];
        let NEWMEMORYIMPORTS = [];

        for (let reqDiff of REQUESTDIFF) {
          //Import has been added!
          if (reqDiff.added) {
            if (liveTree.contextExists(reqDiff.resolvedSource)) {
              //If Css is added already, continue!!!
              if (CSSREGEX.test(reqDiff.source)) {
                let context = liveTree.loadContext(reqDiff.resolvedSource);
                context.addresses.push(filename);
                continue;
              }

              let context = liveTree.loadContext(reqDiff.resolvedSource);
              let module = fetchAddressFromTree(filename, liveTree);
              let cntRqt = {
                contextID: context.provider,
                requests: reqDiff.newRequests,
                type: 'Module',
                namespaceRequest: reqDiff.namespace
              };
              context.addAddress(module);
              module.requests.push(cntRqt);
              await buildImports(AST, cntRqt, context, NEWMEMORYIMPORTS);
            } else {
              let NAME = reqDiff.source.includes('./') ? ResolveRelative(filename, reqDiff.source) : reqDiff.source;
              let newModule;

              if (isModule(NAME)) {
                newModule = new LiveModule(NAME);
              } else {
                //If new Css module is added to system, continue!!!
                if (CSSREGEX.test(NAME)) {
                  let cssContext = new CSSContext();
                  cssContext.provider = reqDiff.resolvedSource;
                  cssContext.addresses.push(filename);
                  liveTree.contexts.push(cssContext);

                  if (liveTree.factory !== liveTree.cssFactory) {
                    liveTree.factory = liveTree.cssFactory;
                  }

                  delta.push(NAME);
                  stylesheets.push({
                    name: NAME,
                    code: (await fs.readFile(NAME)).toString()
                  });
                  continue;
                }
              }

              fetchAddressFromTree(filename, liveTree).addBranch(newModule);

              if (newModule instanceof LiveModule) {
                if (NAME.includes('./')) {
                  let trans = (await babel_core_NAMESPACE.transformAsync((await fs.readFile(NAME)).toString(), {
                    sourceType: 'module',
                    presets: ['@babel/preset-react'],
                    plugins: ['@babel/plugin-proposal-class-properties']
                  })).code;
                  liveTree.preProcessQueue.push({
                    name: NAME,
                    code: trans
                  });
                  let ENTRY = {
                    name: NAME,
                    ast: await babel_core_NAMESPACE.parseAsync(trans, {
                      sourceType: 'module'
                    })
                  };
                  queue.push(ENTRY);
                  TraverseAndTransform(ENTRY, newModule, liveTree);

                  if (newModule.branches.length > 0) {
                    await RecursiveTraverse(newModule, liveTree, queue);
                  }
                } else {
                  let libloc = await resolveNodeLibrary(NAME);
                  newModule.libLoc = libloc;
                  let ENTRY = {
                    name: NAME,
                    ast: await babel_core_NAMESPACE.parseAsync((await fs.readFile(libloc)).toString(), {
                      sourceType: 'module'
                    })
                  };
                  queue.push(ENTRY);
                  TraverseAndTransform(ENTRY, newModule, liveTree);

                  if (newModule.branches.length > 0) {
                    await RecursiveTraverse(newModule, liveTree, queue);
                  }
                }

                loadedModules.push(NAME);
              }

              let context = new ModuleContext();
              context.provider = NAME;
              let module = fetchAddressFromTree(filename, liveTree);
              context.addAddress(module);
              let cntRqt = {
                contextID: context.provider,
                requests: reqDiff.newRequests,
                type: 'Module',
                namespaceRequest: reqDiff.namespace
              };
              module.requests.push(cntRqt);
              liveTree.contexts.push(context);
              await buildImports(AST, cntRqt, context, NEWMEMORYIMPORTS);
            } //Import has been removed!

          } else if (reqDiff.removed) {
            if (CSSREGEX.test(reqDiff.source)) {
              let cssContext = liveTree.loadContext(reqDiff.resolvedSource);
              cssContext.removeAddress(filename);

              if (cssContext.addresses.length === 0) {
                liveTree.removeContext(reqDiff.resolvedSource);
                stylesheets.filter(entry => entry.name !== reqDiff.resolvedSource);
              }

              continue;
            }

            REMOVED_OR_MODIFIED_IMPORTNAMES.push(reqDiff.source);
            let context = liveTree.loadContext(reqDiff.resolvedSource);
            let module = fetchAddressFromTree(filename, liveTree);
            context.removeAddress(module.main);
            module.requests.filter(contextrequest => contextrequest.contextID !== context.provider);

            if (context.addresses.length === 0) {
              liveTree.removeContext(context.provider);
            } //Import requests have been modified!

          } else {
            REMOVED_OR_MODIFIED_IMPORTNAMES.push(reqDiff.source);
            let context = liveTree.loadContext(reqDiff.resolvedSource);
            let contextRequest = fetchAddressFromTree(filename, liveTree).requests.find(contextrequest => contextrequest.contextID === context.provider);
            contextRequest.requests = contextRequest.requests.concat(reqDiff.newRequests);
            contextRequest.requests = contextRequest.requests.filter(request => !reqDiff.removedRequests.includes(request));
            await buildImports(AST, contextRequest, context, NEWMEMORYIMPORTS);
          }
        }

        let OLDMEMORYIMPORTS = liveTree.loadMemory(filename).imports.filter(IMPORT => !REMOVED_OR_MODIFIED_IMPORTNAMES.includes(IMPORT.name));

        for (let imp of OLDMEMORYIMPORTS) {
          await buildImportFromMemory(AST, imp.varDeclaration);
        }

        liveTree.refreshMemory(filename, OLDMEMORYIMPORTS.concat(NEWMEMORYIMPORTS));
      } else {
        for (let imp of liveTree.loadMemory(filename).imports) {
          await buildImportFromMemory(AST, imp.varDeclaration);
        }
      }

      let updatedModule = t.objectProperty(t.stringLiteral(filename), t.callExpression(t.identifier(''), [t.functionExpression(null, [t.identifier('loadExports'), t.identifier('exports'), t.identifier('module')], t.blockStatement(AST.program.body))])); //Replace Module in Buffer!! Technically same as HMR.

      liveTree.moduleBuffer.find(value => value.key.value === updatedModule.key.value).value = updatedModule.value; //If new modules were added on push!!

      if (loadedModules.length > priorLoadedModules.length) {
        let newloadedModules = loadedModules.filter(module => !priorLoadedModules.includes(module));
        delta = newloadedModules;

        for (let module of newloadedModules) {
          let Entry = fetchLPEntry(module);

          for (let request of fetchAddressFromTree(module, liveTree).requests) {
            await buildImportsFromNewModule(Entry, request, liveTree.loadContext(request.contextID), liveTree);
          }

          let newModule = t.objectProperty(t.stringLiteral(module), t.callExpression(t.identifier(''), [t.functionExpression(null, [t.identifier('loadExports'), t.identifier('exports'), t.identifier('module')], t.blockStatement(Entry.ast.program.body))]));
          liveTree.moduleBuffer.push(newModule);
        }
      } //CSS Additions!


      if (priorloadedStyles.length < stylesheets.map(entry => entry.name).length) {
        let cssPlanetloc = path.dirname(dirToHTML) + globalStylesFile;
        await fs.writeFile(cssPlanetloc, stylesheets.map(entry => entry.code).join('\n'));

        if (!liveTree.dirToCssPlanet) {
          liveTree.dirToCssPlanet = cssPlanetloc;
        }
      }

      for (let file of fileDependencies) {
        if (!priorloadedFiles.has(file)) {
          await FSEXTRA.copy(file, path.resolve(path.dirname(InternalLivePushOptions.dirToHTML), path.join('./assets/', path.basename(file))));
        }
      }

      let final0 = t.objectExpression(liveTree.moduleBuffer);
      let final1 = babel_generator_NAMESPACE.default(t.expressionStatement(t.callExpression(t.identifier(''), [t.callExpression(t.functionExpression(null, [t.identifier('live_modules')], t.blockStatement(liveTree.factory)), [final0])]))).code;
      await fs.writeFile(path.dirname(dirToHTML) + '/LIVEPUSH.js', final1);
      return {
        liveTree,
        delta
      };
    }

    async function buildImports(ast, contextRequest, context, currentMemoryImports) {
      if (contextRequest.type === 'Module') {
        //Build Imports
        let imports = [];
        let newName = normalizeModuleName(context.provider.toUpperCase());
        let declarator;

        if (contextRequest.namespaceRequest) {
          declarator = t.variableDeclarator(t.identifier(newName), t.callExpression(t.identifier('loadExports'), [t.stringLiteral(context.provider), t.stringLiteral(contextRequest.namespaceRequest)]));
        } else {
          declarator = t.variableDeclarator(t.identifier(newName), t.callExpression(t.identifier('loadExports'), [t.stringLiteral(context.provider)]));
        }

        imports.push(declarator);

        if (contextRequest.requests[0] !== "NONE") {
          for (let request of contextRequest.requests) {
            imports.push(t.variableDeclarator(t.identifier(request), t.memberExpression(t.identifier(newName), t.identifier(request))));
          }
        }

        let VARDEC = t.variableDeclaration('var', imports);
        ast.program.body.unshift(VARDEC);
        currentMemoryImports.push({
          name: context.provider,
          varDeclaration: VARDEC
        });
      }
    }

    async function buildImportsFromNewModule(Entry, contextRequest, context, liveTree) {
      if (contextRequest.type === 'Module') {
        //Build Imports
        let imports = [];
        let newName = normalizeModuleName(context.provider.toUpperCase());
        let declarator;

        if (contextRequest.namespaceRequest) {
          declarator = t.variableDeclarator(t.identifier(newName), t.callExpression(t.identifier('loadExports'), [t.stringLiteral(context.provider), t.stringLiteral(contextRequest.namespaceRequest)]));
        } else {
          declarator = t.variableDeclarator(t.identifier(newName), t.callExpression(t.identifier('loadExports'), [t.stringLiteral(context.provider)]));
        }

        imports.push(declarator);

        if (contextRequest.requests[0] !== "NONE") {
          for (let request of contextRequest.requests) {
            imports.push(t.variableDeclarator(t.identifier(request), t.memberExpression(t.identifier(newName), t.identifier(request))));
          }
        }

        let VARDEC = t.variableDeclaration('var', imports);
        Entry.ast.program.body.unshift(VARDEC);

        if (liveTree.memoryExists(Entry.name)) {
          liveTree.addImportToMemory(Entry.name, VARDEC, context.provider);
        } else {
          liveTree.addMemory({
            address: Entry.name,
            imports: [{
              varDeclaration: VARDEC,
              name: context.provider
            }]
          });
        }
      }
    }

    async function buildImportFromMemory(ast, IMPORT) {
      ast.program.body.unshift(IMPORT);
    }

    async function diffRequests(changes, filename) {
      if (changes.length === 0) {
        return [];
      }

      let addedChanges = changes.filter(change => change.added === true).map(change => change.value).join('\n');
      let removedChanges = changes.filter(change => change.removed === true).map(change => change.value).join('\n');
      let ADDED_AST = await babel_core_NAMESPACE.parseAsync(addedChanges, {
        parserOpts: LooseParseOptions
      }).catch(err => {
        return {
          program: {
            body: []
          }
        };
      });
      let REMOVED_AST = await babel_core_NAMESPACE.parseAsync(removedChanges, {
        parserOpts: LooseParseOptions
      }).catch(err => {
        return {
          program: {
            body: []
          }
        };
      });
      ;
      let possibleRequests = []; //Added Request Diff

      for (let node of ADDED_AST.program.body) {
        if (node.type === "ImportDeclaration") {
          if (node.specifiers.length > 0) {
            possibleRequests.push({
              source: node.source.value,
              resolvedSource: node.source.value.includes('./') ? ResolveRelative(filename, node.source.value) : node.source.value,
              added: true,
              removed: undefined,
              newRequests: node.specifiers.map(specifier => specifier.local.name),
              namespace: node.specifiers.find(specifier => specifier.type === "ImportDefaultSpecifier") ? node.specifiers.find(specifier => specifier.type === "ImportDefaultSpecifier").local.name : undefined
            });
          } else {
            possibleRequests.push({
              source: node.source.value,
              added: true,
              removed: undefined,
              newRequests: ["NONE"],
              resolvedSource: node.source.value.includes('./') ? ResolveRelative(filename, node.source.value) : node.source.value
            });
          }
        } else if (node.type === "ExpressionStatement" && node.expression.type === "AssignmentExpression" && node.expression.left.type === "Identifier" && node.expression.right.type === "CallExpression" && node.expression.right.callee.type === "Identifier" && node.expression.right.callee.name === "require") {
          possibleRequests.push({
            source: node.expression.right.arguments[0].value,
            resolvedSource: node.expression.right.arguments[0].value.includes('./') ? ResolveRelative(filename, node.expression.right.arguments[0].value) : node.expression.right.arguments[0].value,
            added: true,
            removed: undefined,
            newRequests: [node.expression.left.name],
            namespace: node.expression.left.name
          });
        }
      } //Removed Requests Diff


      for (let node of REMOVED_AST.program.body) {
        if (node.type === "ImportDeclaration") {
          let NODE = node;

          if (node.specifiers.length > 0) {
            if (possibleRequests.findIndex(request => request.source === NODE.source.value) === -1) {
              possibleRequests.push({
                source: node.source.value,
                added: undefined,
                removed: true,
                removedRequests: node.specifiers.map(specifier => specifier.local.name),
                resolvedSource: node.source.value.includes('./') ? ResolveRelative(filename, node.source.value) : node.source.value
              });
            } else {
              let request = possibleRequests.find(request => request.source === NODE.source.value);
              request.removedRequests = node.specifiers.map(specifier => specifier.local.name);
              request.added = undefined;
            }
          } else {
            possibleRequests.push({
              source: node.source.value,
              added: undefined,
              removed: true,
              removedRequests: ["NONE"],
              resolvedSource: node.source.value.includes('./') ? ResolveRelative(filename, node.source.value) : node.source.value
            });
          }
        } else if (node.type === "ExpressionStatement" && node.expression.type === "AssignmentExpression" && node.expression.left.type === "Identifier" && node.expression.right.type === "CallExpression" && node.expression.right.callee.type === "Identifier" && node.expression.right.callee.name === "require") {
          if (possibleRequests.findIndex(request => request.source === node.expression.right.arguments[0].value) === -1) {
            possibleRequests.push({
              source: node.expression.right.arguments[0].value,
              added: undefined,
              removed: true,
              removedRequests: [node.expression.left.name],
              resolvedSource: node.expression.right.arguments[0].value.includes('./') ? ResolveRelative(filename, node.expression.right.arguments[0].value) : node.expression.right.arguments[0].value
            });
          } else {
            let request = possibleRequests.find(request => request.source === node.expression.right.arguments[0].value);
            request.removedRequests = node.expression.left.name;
            request.added = undefined;
          }
        }
      } //Amending ES Requests!!


      for (let diff of possibleRequests) {
        if (diff.newRequests && diff.removedRequests) {
          let buffer = new Array(...diff.newRequests);
          diff.newRequests = diff.newRequests.filter(value => !diff.removedRequests.includes(value));
          diff.removedRequests = diff.removedRequests.filter(value => !buffer.includes(value));
        }
      } //Removes File Dependency diffs


      return possibleRequests.filter(requestdiff => !fileRegex.test(requestdiff.source));
    }

    function removeImportsAndExportsFromAST(ast, currentFile) {
      let exportsToBeRolled = [];
      let defaultExport;
      babel_core_NAMESPACE.traverse(ast, {
        ImportDeclaration: function (path) {
          if (fileRegex.test(path.node.source.value)) {
            path.replaceWith(t.variableDeclaration("var", [t.variableDeclarator(t.identifier(path.node.specifiers[0].local.name), t.stringLiteral(resolveAssetToHTMLPage(ResolveRelative(currentFile, path.node.source.value))))]));
          } else {
            path.remove();
          }
        },
        VariableDeclarator: function (path) {
          if (path.node.init.type === "CallExpression" && path.node.init.callee.type === "Identifier" && path.node.init.callee.name === "require") {
            path.remove();
          }
        },
        ExportNamedDeclaration: function (path) {
          if (path.node.specifiers.length > 0) {
            for (let specifier of path.node.specifiers) {
              if (specifier.type === "ExportSpecifier") {
                exportsToBeRolled.push(t.expressionStatement(t.assignmentExpression("=", t.memberExpression(t.identifier("exports"), t.identifier(specifier.exported.name)), t.identifier(specifier.local.name))));
              }
            }

            path.remove();
          } else {
            if (path.node.declaration.type === "ClassDeclaration") {
              path.replaceWith(t.assignmentExpression("=", t.memberExpression(t.identifier("exports"), t.identifier(path.node.declaration.id.name)), path.node.declaration));
            } else if (path.node.declaration.type === "FunctionDeclaration") {
              path.replaceWith(t.assignmentExpression("=", t.memberExpression(t.identifier("exports"), t.identifier(path.node.declaration.id.name)), t.functionExpression(path.node.declaration.id, path.node.declaration.params, path.node.declaration.body, path.node.declaration.generator, path.node.declaration.async)));
            }
          }
        },
        ExportDefaultDeclaration: function (path) {
          defaultExport = t.expressionStatement(t.assignmentExpression("=", t.memberExpression(t.identifier("module"), t.identifier("exports")), t.identifier(path.node.declaration.id.name)));
          path.replaceWith(path.node.declaration);
        }
      });
      ast.program.body = ast.program.body.concat(exportsToBeRolled);

      if (defaultExport) {
        ast.program.body.push(defaultExport);
      }
    }

    async function processJSForRequests(code) {
      let commentregex = /(\/\/.*)|(\/\*(.|\n)*\*\/)/g;
      let requestregex = /(import ((['|"][\w\/.]+['|"])|( *{[\w\W,]+} from ['|"][\w\/.]+['|"])|(\w+ *[, ] *(?:(?<=,)( *{[\w, ]+} from ['|"][\w\/.]+['|"])|(?<!,)(from ['|"][\w\/.]+['|"]))|(from ['|"]\w+['|"])))|((const|var|let)( +[\w$!]+ *= *require\(['|"][\w\/.]+['|"]\))))/g;
      let newCode = code.replace(commentregex, "");
      let matches = newCode.match(requestregex);
      return matches === null ? "" : matches.join("\n");
    }

    async function updateCSS(filename, cssPlanetLocation) {
      let newCSS = (await fs.readFile(filename)).toString();
      stylesheets.find(entry => entry.name === filename).code = newCSS;
      await fs.writeFile(cssPlanetLocation, stylesheets.map(entry => entry.code).join('\n'));
      return;
    }

    function reloadHTML(initStage, tag) {
      IO.emit("LP_RELOAD", tag);
    }

    _localExports.LivePush = LivePush;
  }),
  "./test\\vortex\\GraphGenerator.js": (function (_localRequire, _localExports, fs_extra_NAMESPACE, FSEXTRA, terser, path, chalk, cli_spinners_NAMESPACE, ora, os, os_NAMESPACE, fs, fs_promises_NAMESPACE, FS, babel_core_NAMESPACE, t, babel_generator_NAMESPACE, Parse5, resolve, util_NAMESPACE, e, chokidar, diff_NAMESPACE, io, Babel, css, babel_traverse_NAMESPACE, babel_template_NAMESPACE, _, uuid_NAMESPACE) {
    var __TEST_VORTEX_GRAPH_JS = _localRequire("./test\\vortex\\Graph.js"),
        VortexGraph = __TEST_VORTEX_GRAPH_JS.VortexGraph;

    var EsModuleGrapher = _localRequire("./test\\vortex\\graphers\\EsModuleGrapher.js");

    var CjsModuleGrapher = _localRequire("./test\\vortex\\graphers\\CommonJsModuleGrapher.js");

    var __TEST_VORTEX_RESOLVE_JS = _localRequire("./test\\vortex\\Resolve.js"),
        addJsExtensionIfNecessary = __TEST_VORTEX_RESOLVE_JS.addJsExtensionIfNecessary;

    var __TEST_VORTEX_DEPENDENCY_JS = _localRequire("./test\\vortex\\Dependency.js"),
        Dependency = __TEST_VORTEX_DEPENDENCY_JS.default;

    var __TEST_VORTEX_DEPENDENCIES_MODULEDEPENDENCY_JS = _localRequire("./test\\vortex\\dependencies\\ModuleDependency.js"),
        ModuleDependency = __TEST_VORTEX_DEPENDENCIES_MODULEDEPENDENCY_JS.default;

    var __TEST_VORTEX_OPTIONS_JS = _localRequire("./test\\vortex\\Options.js"),
        BabelSettings = __TEST_VORTEX_OPTIONS_JS.BabelSettings,
        ParseSettings = __TEST_VORTEX_OPTIONS_JS.ParseSettings;

    var __TEST_VORTEX_DEPENDENCIES_CSSDEPENDENCY_JS = _localRequire("./test\\vortex\\dependencies\\CSSDependency.js"),
        CSSDependency = __TEST_VORTEX_DEPENDENCIES_CSSDEPENDENCY_JS.CSSDependency;

    var CSSGrapher = _localRequire("./test\\vortex\\graphers\\CSSGrapher.js");

    var PlanetGrapher = _localRequire("./test\\vortex\\graphers\\PlanetGrapher.js");

    var __TEST_VORTEX_DEPENDENCYFACTORY_JS = _localRequire("./test\\vortex\\DependencyFactory.js"),
        notNativeDependency = __TEST_VORTEX_DEPENDENCYFACTORY_JS.notNativeDependency,
        resolveGrapherForNonNativeDependency = __TEST_VORTEX_DEPENDENCYFACTORY_JS.resolveGrapherForNonNativeDependency;

    var readFileAsync = fs_promises_NAMESPACE.readFile;
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
      return;
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
        this.external = false;
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


    async function GenerateGraph(entry, modEntry, ControlPanel) {
      var ASTQueue = {
        isInQueue: isInQueue,
        addEntryToQueue: addEntryToQueue,
        loadEntryFromQueue: loadEntryFromQueue,
        QueueEntry: QueueEntry,
        queue: queue
      }; //let resolvedEntry = path.resolve(entry)

      let Graph = new VortexGraph(entry);
      Graph.shuttleEntry = modEntry;
      let loadedFilesCache = [];
      let modEnt = addJsExtensionIfNecessary(entry);
      var entryFile = (await readFileAsync(modEnt)).toString();

      if (!ControlPanel.isLibrary) {
        entryFile = (await babel_core_NAMESPACE.transformAsync(entryFile.toString(), BabelSettings)).code;
      }

      if (ControlPanel.polyfillPromise) {
        entryFile = "import promisePolyfill from 'es6-promise' \n promisePolyfill.polyfill() \n" + entryFile;
      }

      let entryAst = Babel.parse(entryFile.toString(), ParseSettings);
      addEntryToQueue(new QueueEntry(entry, entryAst));
      GraphDepsAndModsForCurrentFile(loadEntryFromQueue(modEnt), Graph, undefined, ControlPanel, ASTQueue);
      loadedFilesCache.push(entry); //Star Graph

      for (let dep of Graph.Star) {
        if (dep instanceof ModuleDependency) {
          if (dep.outBundle !== true) {
            let str = './';

            if (loadedFilesCache.includes(dep.name) == false) {
              if (dep.name.includes(str) == true) {
                let modName = addJsExtensionIfNecessary(dep.name);

                if (isInQueue(modName)) {
                  GraphDepsAndModsForCurrentFile(loadEntryFromQueue(modName), Graph, undefined, ControlPanel, ASTQueue);
                } else {
                  let file = (await readFileAsync(modEntry)).toString();

                  if (!ControlPanel.isLibrary) {
                    file = (await babel_core_NAMESPACE.transformAsync(file.toString(), BabelSettings)).code;
                  }

                  let entryAst = Babel.parse(file.toString(), ParseSettings);
                  let ent = new QueueEntry(modName, entryAst);
                  addEntryToQueue(ent);
                  GraphDepsAndModsForCurrentFile(loadEntryFromQueue(ent.name), Graph, undefined, ControlPanel, ASTQueue);
                }

                loadedFilesCache.push(modName);
              } else {
                if (dep instanceof ModuleDependency) {
                  if (!ControlPanel.isLibrary) {
                    if (isInQueue(dep.libLoc)) {
                      GraphDepsAndModsForCurrentFile(loadEntryFromQueue(dep.libLoc), Graph, undefined, ControlPanel, ASTQueue);
                    } else {
                      let ent = new QueueEntry(dep.libLoc, Babel.parse((await readFileAsync(dep.libLoc)).toString(), ParseSettings));
                      addEntryToQueue(ent);
                      GraphDepsAndModsForCurrentFile(loadEntryFromQueue(ent.name), Graph, undefined, ControlPanel, ASTQueue);
                    }
                  }

                  loadedFilesCache.push(dep.name);
                }
              }
            }
          }
        } else if (dep instanceof CSSDependency) {
          if (loadedFilesCache.includes(dep.name) == false) {
            if (isInQueue(dep.name)) {
              CSSGrapher.SearchAndGraph(loadEntryFromQueue(dep.name).ast, dep);
            } else {
              let sheet;

              if (notNativeDependency(dep.name, ControlPanel)) {
                sheet = css.parse(dep.stylesheet, {
                  source: dep.name
                });
              } else {
                sheet = css.parse((await readFileAsync(dep.name)).toString(), {
                  source: dep.name
                });
              }

              let entry = new QueueEntry(dep.name, sheet);
              addEntryToQueue(entry);
              CSSGrapher.SearchAndGraph(loadEntryFromQueue(dep.name).ast, dep);
            }
          } // IF dependency is added from Addon

        } else if (notNativeDependency(dep.name, ControlPanel)) {
          let grapher = resolveGrapherForNonNativeDependency(dep, ControlPanel);
          await grapher(dep, Graph);
        }
      } //Planet Graph


      for (let planet of Graph.Planets) {
        let modEnt = planet.entryModule;

        if (!notNativeDependency(planet.entryModule, ControlPanel)) {
          modEnt = addJsExtensionIfNecessary(planet.entryModule);
        }

        if (!notNativeDependency(planet.entryModule, ControlPanel)) {
          let entryFile = (await readFileAsync(modEnt)).toString();

          if (!ControlPanel.isLibrary && !planet.entryModuleIsLibrary) {
            entryFile = (await babel_core_NAMESPACE.transformAsync(entryFile.toString(), BabelSettings)).code;
          }

          let entryAst = Babel.parse(entryFile.toString(), ParseSettings);
          addEntryToQueue(new QueueEntry(modEnt, entryAst));
          GraphDepsAndModsForCurrentFile(loadEntryFromQueue(modEnt), Graph, planet.name, ControlPanel, ASTQueue);
        } else {
          let depLie = new Dependency(planet.entryModule);
          let grapher = resolveGrapherForNonNativeDependency(depLie, ControlPanel);
          await grapher(depLie, Graph, planet.name);
        }

        loadedFilesCache.push(planet.entryModule);

        for (let dep of planet.modules) {
          if (dep instanceof ModuleDependency) {
            if (dep.outBundle !== true) {
              let str = './';

              if (loadedFilesCache.includes(dep.name) == false) {
                if (dep.name.includes(str) == true) {
                  let modName = addJsExtensionIfNecessary(dep.name);

                  if (isInQueue(modName)) {
                    GraphDepsAndModsForCurrentFile(loadEntryFromQueue(modName), Graph, planet.name, ControlPanel, ASTQueue);
                  } else {
                    let file = (await readFileAsync(modName)).toString();

                    if (!ControlPanel.isLibrary) {
                      file = (await babel_core_NAMESPACE.transformAsync(file.toString(), BabelSettings)).code;
                    }

                    let entryAst = Babel.parse(file.toString(), ParseSettings);
                    let ent = new QueueEntry(modName, entryAst);
                    addEntryToQueue(ent);
                    GraphDepsAndModsForCurrentFile(loadEntryFromQueue(ent.name), Graph, planet.name, ControlPanel, ASTQueue);
                  }

                  loadedFilesCache.push(modName);
                } else {
                  if (dep instanceof ModuleDependency) {
                    if (!ControlPanel.isLibrary) {
                      if (isInQueue(dep.libLoc)) {
                        GraphDepsAndModsForCurrentFile(loadEntryFromQueue(dep.libLoc), Graph, planet.name, ControlPanel, ASTQueue);
                      } else {
                        let ent = new QueueEntry(dep.libLoc, Babel.parse((await readFileAsync(dep.libLoc)).toString(), ParseSettings));
                        addEntryToQueue(ent);
                        GraphDepsAndModsForCurrentFile(loadEntryFromQueue(ent.name), Graph, planet.name, ControlPanel, ASTQueue);
                      }
                    }

                    loadedFilesCache.push(dep.name);
                  }
                }
              }
            }
          } else if (dep instanceof CSSDependency) {
            if (loadedFilesCache.includes(dep.name) == false) {
              if (isInQueue(dep.name)) {
                CSSGrapher.SearchAndGraph(loadEntryFromQueue(dep.name).ast, dep);
              } else {
                let sheet;

                if (notNativeDependency(dep.name, ControlPanel)) {
                  sheet = css.parse(dep.stylesheet, {
                    source: dep.name
                  });
                } else {
                  sheet = css.parse((await readFileAsync(dep.name)).toString(), {
                    source: dep.name
                  });
                }

                let entry = new QueueEntry(dep.name, sheet);
                addEntryToQueue(entry);
                CSSGrapher.SearchAndGraph(loadEntryFromQueue(dep.name).ast, dep);
              }
            } // IF dependency is added from Addon

          } else if (notNativeDependency(dep.name, ControlPanel)) {
            let grapher = resolveGrapherForNonNativeDependency(dep, ControlPanel);
            await grapher(dep, Graph, planet.name);
          }
        }
      }

      return Graph;
    }

    function GraphDepsAndModsForCurrentFile(entry, Graph, planetName, panel, ASTQueue) {
      EsModuleGrapher.SearchAndGraph(entry, Graph, planetName, panel, ASTQueue);
      CjsModuleGrapher.SearchAndGraph(entry, Graph, planetName, panel, ASTQueue);
      PlanetGrapher.SearchAndGraph(entry, Graph, panel);
    } // function GraphDepsForLib(dep:Dependency,Graph:VortexGraph){
    //     if(dep instanceof ModuleDependency){
    //         GraphDepsAndModsForCurrentFile(resolveLibBundle(dep.name),Graph)
    //     }
    // }
    // export function minifyIfProduction(file:string){
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


    _localExports.queue = queue;
    _localExports.isInQueue = isInQueue;
    _localExports.addEntryToQueue = addEntryToQueue;
    _localExports.loadEntryFromQueue = loadEntryFromQueue;
    _localExports.QueueEntry = QueueEntry;
    _localExports.GenerateGraph = GenerateGraph;
    _localExports.GraphDepsAndModsForCurrentFile = GraphDepsAndModsForCurrentFile;
  }),
  "./test\\vortex\\Compiler.js": (function (_localRequire, _localExports, fs_extra_NAMESPACE, FSEXTRA, terser, path, chalk, cli_spinners_NAMESPACE, ora, os, os_NAMESPACE, fs, fs_promises_NAMESPACE, FS, babel_core_NAMESPACE, t, babel_generator_NAMESPACE, Parse5, resolve, util_NAMESPACE, e, chokidar, diff_NAMESPACE, io, Babel, css, babel_traverse_NAMESPACE, babel_template_NAMESPACE, _, uuid_NAMESPACE) {
    var __TEST_VORTEX_DEPENDENCIES_ESMODULEDEPENDENCY_JS = _localRequire("./test\\vortex\\dependencies\\EsModuleDependency.js"),
        EsModuleDependency = __TEST_VORTEX_DEPENDENCIES_ESMODULEDEPENDENCY_JS.default;

    var __TEST_VORTEX_IMPORTLOCATIONS_MDIMPORTLOCATION_JS = _localRequire("./test\\vortex\\importlocations\\MDImportLocation.js"),
        MDImportLocation = __TEST_VORTEX_IMPORTLOCATIONS_MDIMPORTLOCATION_JS.default;

    var __TEST_VORTEX_MODULE_JS = _localRequire("./test\\vortex\\Module.js"),
        ModuleTypes = __TEST_VORTEX_MODULE_JS.ModuleTypes;

    var __TEST_VORTEX_DEPENDENCIES_MODULEDEPENDENCY_JS = _localRequire("./test\\vortex\\dependencies\\ModuleDependency.js"),
        ModuleDependency = __TEST_VORTEX_DEPENDENCIES_MODULEDEPENDENCY_JS.default;

    var __TEST_VORTEX_DEPENDENCIES_CJSMODULEDEPENDENCY_JS = _localRequire("./test\\vortex\\dependencies\\CjsModuleDependency.js"),
        CjsModuleDependency = __TEST_VORTEX_DEPENDENCIES_CJSMODULEDEPENDENCY_JS.default;

    var __TEST_VORTEX_DEPENDENCIES_CSSDEPENDENCY_JS = _localRequire("./test\\vortex\\dependencies\\CSSDependency.js"),
        CSSDependency = __TEST_VORTEX_DEPENDENCIES_CSSDEPENDENCY_JS.CSSDependency;

    var __TEST_VORTEX_VORTEXERROR_JS = _localRequire("./test\\vortex\\VortexError.js"),
        VortexError = __TEST_VORTEX_VORTEXERROR_JS.VortexError,
        VortexErrorType = __TEST_VORTEX_VORTEXERROR_JS.VortexErrorType;

    var __TEST_VORTEX_DEPENDENCIES_FILEDEPENDENCY_JS = _localRequire("./test\\vortex\\dependencies\\FileDependency.js"),
        FileDependency = __TEST_VORTEX_DEPENDENCIES_FILEDEPENDENCY_JS.FileDependency;

    var __TEST_VORTEX_RESOLVE_JS = _localRequire("./test\\vortex\\Resolve.js"),
        LocalizedResolve = __TEST_VORTEX_RESOLVE_JS.LocalizedResolve;

    var __TEST_VORTEX_GRAPHGENERATOR_JS = _localRequire("./test\\vortex\\GraphGenerator.js"),
        addEntryToQueue = __TEST_VORTEX_GRAPHGENERATOR_JS.addEntryToQueue,
        loadEntryFromQueue = __TEST_VORTEX_GRAPHGENERATOR_JS.loadEntryFromQueue,
        QueueEntry = __TEST_VORTEX_GRAPHGENERATOR_JS.QueueEntry,
        queue = __TEST_VORTEX_GRAPHGENERATOR_JS.queue;

    var __TEST_VORTEX_DEPENDENCYFACTORY_JS = _localRequire("./test\\vortex\\DependencyFactory.js"),
        notNativeDependency = __TEST_VORTEX_DEPENDENCYFACTORY_JS.notNativeDependency,
        resolveTransformersForNonNativeDependency = __TEST_VORTEX_DEPENDENCYFACTORY_JS.resolveTransformersForNonNativeDependency,
        CustomDependencyIsBundlable = __TEST_VORTEX_DEPENDENCYFACTORY_JS.CustomDependencyIsBundlable;

    var CSS_PLANET_ID = uuid_NAMESPACE.v4();
    var cssStorage = [];

    function pipeCSSContentToBuffer(content) {
      cssStorage.push(content);
    }

    function fixDependencyName(name) {
      if (name[0] === '@') {
        name = name.slice(1);
      }

      let NASTY_CHARS = /(@|\/|\^|\$|#|\*|&|!|%|-|\.|\\)/g;
      return name.replace(NASTY_CHARS, "_");
    }
    /**
     * Creates a Star/Solar System depending on the global config/async imports.
     * @param {VortexGraph} Graph The Dependency Graph created by the Graph Generator
     * @returns {Promise<Bundle[]>} An Array of Bundle Code Objects
     */


    async function Compile(Graph, ControlPanel) {
      let final;

      if (ControlPanel.isLibrary) {
        //Returns a single bundle code object
        final = await LibCompile(Graph, ControlPanel);
      } else {
        //Returns single/many bundle code object/s.
        final = await WebAppCompile(Graph, ControlPanel);
      }

      return final;
    }
    /**Compiles a library bundle from a given Vortex Graph into CommonJS Format (Eventually into CommonJS IIFE!)
     *
     * @param {VortexGraph} Graph
     */


    async function LibCompile(Graph, ControlPanel) {
      let libB = new LibBundle();

      for (let dep of Graph.Star) {
        if (dep instanceof ModuleDependency) {
          for (let impLoc of dep.importLocations) {
            if (impLoc instanceof MDImportLocation) {
              convertImportsFromAST(loadEntryFromQueue(impLoc.name).ast, impLoc, dep, libB);

              if (impLoc.name === Graph.entryPoint) {
                convertExportsFromAST(loadEntryFromQueue(impLoc.name).ast, dep, libB);
              }
            }
          }

          if (dep.outBundle !== true) {
            //Libraries are skipped completely in Lib Bundle
            if (dep.name.includes('./')) {
              convertExportsFromAST(loadEntryFromQueue(dep.name).ast, dep, libB);
            }
          }
        }
      }

      console.log(libB.libs);
      let cjsIIFE = `var fileExportBuffer = {};

    ${libB.libs.join('\n')}

    function _localRequire(id){
        if(fileExportBuffer[id] && fileExportBuffer[id].built){
            return fileExportBuffer[id].exports
        }
        else {
            var localFile = {
                built:false,
                exports:{}
            }
            local_files[id](_localRequire,localFile.exports,${libB.namespaceLibNames.join(',')})

            localFile.built = true

            Object.defineProperty(fileExportBuffer,id,{
                value:localFile,
                writable:false,
                enumerable:true
            })

            return localFile.exports
        }
    }

    return _localRequire("${Graph.shuttleEntry}");`;
      let parsedFactory = Babel.parse(cjsIIFE, {
        allowReturnOutsideFunction: true
      }).program.body;
      let localFileIIFEBuffer = [];
      let entryFuncArgs = libB.namespaceLibNames.map(arg => t.identifier(arg));

      for (let entry of queue) {
        localFileIIFEBuffer.push(t.objectProperty(t.stringLiteral(entry.name), t.callExpression(t.identifier(""), [t.functionExpression(null, [t.identifier("_localRequire"), t.identifier("_localExports")].concat(entryFuncArgs), t.blockStatement(entry.ast.program.body))])));
      }

      let finalCode = babel_generator_NAMESPACE.default(t.callExpression(t.callExpression(t.identifier(""), [t.functionExpression(null, [t.identifier("local_files")], t.blockStatement(parsedFactory))]), [t.objectExpression(localFileIIFEBuffer)]));
      var o = {
        value: 'star',
        code: finalCode.code
      };
      return [o]; //console.log(code)
      //return libB.code
    }
    /**
     * Removes imports of CommonJS or ES Modules from the current Import Location depending on the type of Module Dependency given.
     * @param {t.File} ast Abstract Syntax Tree (ESTree Format)
     * @param {MDImportLocation} impLoc Current Import Location
     * @param {ModuleDependency} dep The Module Dependency
     * @param {LibBundle} libBund The Library Bundle
     */


    function convertImportsFromAST(ast, impLoc, dep, libBund) {
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
                      if (dep.name.includes('./')) {
                        path.node.declarations[0].init.callee.name = "_localRequire";
                      } else {
                        path.remove();
                      }
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
            if (path.node.trailingComments === undefined || path.node.trailingComments[0].value !== 'vortexRetain') {
              if (path.node.source.value === impLoc.relativePathToDep) {
                if (dep.name.includes('./')) {
                  //TODO!! Make Function to Build Requests for imports
                  path.replaceWith(buildImportsFromImportLocation(impLoc, dep));
                } else {
                  path.remove();
                }
              }
            } //Vortex retain feature
            else if (path.node.trailingComments[0].value === 'vortexRetain' && dep.outBundle === true) {
                if (dep.name.includes('./')) {
                  libBund.addEntryToLibs(impLoc.relativePathToDep, impLoc.modules[0].name);
                  path.remove();
                } else {
                  throw new VortexError(`Cannot use "vortexRetain" keyword on libraries. Line:${impLoc.line} File:${impLoc.name}`, VortexErrorType.StarSyntaxError);
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
            if (path.parent.type !== "MemberExpression") {
              //Visits if dep is a lib but NOT a EsNamespaceProvider
              if (dep.name.includes('./') == false) {
                if (impLoc.modules[0].type !== ModuleTypes.EsNamespaceProvider) {
                  for (let mod of impLoc.modules) {
                    if (mod.type !== ModuleTypes.EsDefaultModule) {
                      if (path.node.name === mod.name) {
                        path.replaceWith(t.memberExpression(t.identifier(namespace), t.identifier(mod.name)));
                      }
                    } else if (mod.type === ModuleTypes.EsDefaultModule) {
                      if (path.node.name === mod.name) {
                        path.replaceWith(t.memberExpression(t.identifier(namespace), t.identifier('default')));
                      }
                    }
                  }
                }
              }
            }
          }
        });
      }
    }

    function buildImportsFromImportLocation(currentMDImpLoc, currentDependency) {
      let declarators = [];

      if (currentDependency instanceof EsModuleDependency) {
        if (currentMDImpLoc.modules[0].type === ModuleTypes.EsNamespaceProvider) {
          declarators.push(t.variableDeclarator(t.identifier(currentMDImpLoc.modules[0].name), t.callExpression(t.identifier("_localRequire"), [t.stringLiteral(currentDependency.name)])));
          return t.variableDeclaration("var", declarators);
        }

        declarators.push(t.variableDeclarator(t.identifier(fixDependencyName(currentDependency.name.toUpperCase())), t.callExpression(t.identifier("_localRequire"), [t.stringLiteral(currentDependency.name)])));

        for (let IMPORT of currentMDImpLoc.modules) {
          if (IMPORT.type === ModuleTypes.EsDefaultModule) {
            declarators.push(t.variableDeclarator(t.identifier(IMPORT.name), t.memberExpression(t.identifier(fixDependencyName(currentDependency.name.toUpperCase())), t.identifier("default"))));
            continue;
          }

          declarators.push(t.variableDeclarator(t.identifier(IMPORT.name), t.memberExpression(t.identifier(fixDependencyName(currentDependency.name.toUpperCase())), t.identifier(IMPORT.name))));
        }
      }

      return t.variableDeclaration("var", declarators);
    }

    function convertExportsFromAST(ast, dep, libbund) {
      if (dep instanceof CjsModuleDependency) {
        babel_traverse_NAMESPACE.default(ast, {
          ExpressionStatement: function (path) {
            if (path.node.expression.type === 'AssignmentExpression') {
              if (path.node.expression.left.type === 'MemberExpression') {
                if (path.node.expression.left.object.name === 'module' && path.node.expression.left.property.name === 'exports') {
                  path.node.expression.left.object.name = "_localExports";
                  path.node.expression.left.property.name = "default";
                }

                if (path.node.expression.left.object.name === 'exports') {
                  path.node.expression.left.object.name = "_localExports";
                }
              }
            }
          }
        });
      } else if (dep instanceof EsModuleDependency) {
        let exposedExports = [];
        let regularExports = [];
        babel_traverse_NAMESPACE.default(ast, {
          ExportNamedDeclaration: function (path) {
            if (path.node.declaration !== null && path.node.declaration) {
              if (path.node.declaration.type !== 'Identifier' || path.node.specifiers.length === 0) {
                if (path.node.declaration.type === "VariableDeclaration") {
                  regularExports.push(t.expressionStatement(t.assignmentExpression("=", t.memberExpression(t.identifier("_localExports"), t.identifier(path.node.declaration.declarations[0].id.name)), t.identifier(path.node.declaration.declarations[0].id.name))));
                  path.replaceWith(path.node.declaration);
                  return;
                }

                regularExports.push(t.expressionStatement(t.assignmentExpression("=", t.memberExpression(t.identifier("_localExports"), t.identifier(path.node.declaration.id.name)), t.identifier(path.node.declaration.id.name))));
                path.replaceWith(path.node.declaration);
                return;
              } else {
                regularExports.push(t.expressionStatement(t.assignmentExpression("=", t.memberExpression(t.identifier("_localExports"), t.identifier(path.node.declaration.name)), t.identifier(path.node.declaration.name))));
                path.remove();
                return;
              }
            } else {
              if (findVortexExpose(path.node)) {
                for (let exp of getExposures(path.node)) {
                  exposedExports.push(t.expressionStatement(t.assignmentExpression("=", t.memberExpression(t.identifier("exports"), t.identifier(exp)), t.identifier(exp))));
                }

                path.remove();
              } else {
                for (let exp of path.node.specifiers) {
                  if (exp.type === "ExportSpecifier") {
                    regularExports.push(t.expressionStatement(t.assignmentExpression("=", t.memberExpression(t.identifier("_localExports"), t.identifier(exp.exported.name)), t.identifier(exp.local.name))));
                  }
                }

                path.remove();
              }
            }
          },
          ExportDefaultDeclaration: function (path) {
            if (path.node.declaration.type !== 'Identifier') {
              regularExports.push(t.expressionStatement(t.assignmentExpression("=", t.memberExpression(t.identifier("_localExports"), t.identifier("default")), t.identifier(path.node.declaration.id.name))));
              path.replaceWith(path.node.declaration);
            } else {
              regularExports.push(t.expressionStatement(t.assignmentExpression("=", t.memberExpression(t.identifier("_localExports"), t.identifier("default")), t.identifier(path.node.declaration.name))));
              path.remove();
            }
          }
        });
        ast.program.body = ast.program.body.concat(regularExports);
        ast.program.body = ast.program.body.concat(exposedExports);
      }
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
        this.namespaceLibNames = [];
        /**Array of compiled exposures (exports) */

        this.exports = [];
      }
      /**
       * Adds a CommonJS require entry to bundle libraries
       * @param {string} libname Name of library to add to requires
       * @param {string} namespace Namespace applied to the entry
       */


      addEntryToLibs(libname, namespace) {
        this.namespaceLibNames.push(namespace);
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

    const CommonJSTemplate = babel_template_NAMESPACE.default(`const NAMESPACE = require(LIBNAME)`);
    const CJSExportsTemplate = babel_template_NAMESPACE.default(`exports.EXPORT = EXPORT`);

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


    const ModuleEvalTemplate = babel_template_NAMESPACE.default('eval(CODE)');
    /**
     * Compiles Graph into browser compatible application
     * @param {VortexGraph} Graph
     * @returns {Object[]} WebApp Bundle
     */

    async function WebAppCompile(Graph, ControlPanel) {
      class Shuttle {
        constructor() {
          this.buffer = t.objectExpression([]);
        } //[shuttle,_exports_]


        addModuleToBuffer(entry, evalModule) {
          let func = t.functionExpression(null, [t.identifier('shuttle'), t.identifier('shuttle_exports'), t.identifier('gLOBAL_STYLES')], t.blockStatement(ControlPanel.isProduction ? evalModule : [evalModule]), false, false);
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

      }

      let shuttle = new Shuttle();
      const BrowserGlobalTemplate = babel_template_NAMESPACE.default('if(window.GLOBAL){shuttle_exports.MAPPED_DEFAULT = GLOBAL}', {
        placeholderWhitelist: new Set(['GLOBAL']),
        placeholderPattern: false
      });
      /**
       * Transformed Exports from File/lib
       */

      let transdExps = [];
      /**
       * Resolved CSSs
       */

      let resolveCSS = [];
      /**
       * Resolved Files
       */

      let resolvedFiles = []; //Transforms exports and Imports on all parsed Queue entries.

      var assetsFolder = './assets';
      var dir = LocalizedResolve(ControlPanel.outputFile, assetsFolder); // Transform Star

      for (let dep of Graph.Star) {
        if (dep instanceof ModuleDependency) {
          for (let impLoc of dep.importLocations) {
            TransformImportsFromAST(loadEntryFromQueue(impLoc.name).ast, impLoc, dep);
          }

          if (transdExps.includes(dep.name) == false && !dep.outBundle) {
            TransformExportsFromAST(loadEntryFromQueue(dep.name.includes('./') ? dep.name : dep.libLoc).ast, dep);
            transdExps.push(dep.name);
          } else if (dep.outBundle && transdExps.includes(dep.name) == false) {
            let exportCheck = dep.importLocations.map(imploc => imploc.modules[0].name);

            let verify = _.uniq(exportCheck);

            if (verify.length === 1) {
              let ent = new QueueEntry(dep.name, t.file(t.program([BrowserGlobalTemplate({
                GLOBAL: t.identifier(verify[0])
              })]), null, null));
              ent.external = true;
              addEntryToQueue(ent);
              transdExps.push(dep.name);
            }
          }
        } else if (dep instanceof CSSDependency) {
          if (resolveCSS.includes(dep.name) == false) {
            let nCSS = await resolveCSSDependencies(dep, assetsFolder);
            resolveCSS.push(dep.name);
            dep.stylesheet = nCSS;
          }

          if (ControlPanel.cssPlanet) {
            pipeCSSContentToBuffer(dep.stylesheet);

            for (let impLoc of dep.importLocations) {
              removeCSSImportsFromAST(loadEntryFromQueue(impLoc.name).ast, dep, impLoc);
            }
          } else {
            for (let impLoc of dep.importLocations) {
              injectCSSDependencyIntoAST(loadEntryFromQueue(impLoc.name).ast, dep, impLoc);
            }
          }
        } else if (dep instanceof FileDependency) {
          let outFile = ControlPanel.encodeFilenames ? `${dep.uuid}${path.extname(dep.name)}` : path.basename(dep.name);
          let newName = `${dir}/${outFile}`;
          let localNewName = `${assetsFolder}/${outFile}`;

          if (resolvedFiles.includes(dep.name) == false) {
            await fs.ensureDir(dir);
            await fs.copyFile(dep.name, newName);
            resolvedFiles.push(dep.name);
          }

          for (let impLoc of dep.importLocations) {
            resolveFileDependencyIntoAST(loadEntryFromQueue(impLoc.name).ast, dep, impLoc, localNewName);
          }
        } else if (notNativeDependency(dep.name, ControlPanel)) {
          let {
            importsTransformer,
            exportsTransformer
          } = resolveTransformersForNonNativeDependency(dep, ControlPanel);

          for (let impLoc of dep.importLocations) {
            importsTransformer(loadEntryFromQueue(impLoc.name).ast, dep, impLoc);
          } // Node libraries are NATIVE ONLY therefore no need to verify if Dependency is a local file.


          exportsTransformer(loadEntryFromQueue(dep.name).ast, dep);
        }
      } // Transform Planets (Will crosscheck with already transformed files)


      for (let planet of Graph.Planets) {
        //Transforms: import(**) to shuttle.planet(**) syntax
        for (let impLoc of planet.importedAt) {
          // If current import location is NOT a cluster import
          if (!impLoc.clusterImport) {
            TransformAsyncImportFromAST(loadEntryFromQueue(impLoc.name).ast, planet);
          }
        }

        if (transdExps.includes(planet.entryModule) == false) {
          if (!notNativeDependency(planet.entryModule, ControlPanel)) {
            TransformExportsFromAST(loadEntryFromQueue(planet.entryModule).ast, planet.entryDependency);
          } else {
            let {
              exportsTransformer
            } = resolveTransformersForNonNativeDependency(planet.entryDependency);
            exportsTransformer(loadEntryFromQueue(planet.entryModule).ast, planet.entryDependency);
          }

          transdExps.push(planet.entryModule);
        }

        for (let dep of planet.modules) {
          if (dep instanceof ModuleDependency) {
            for (let impLoc of dep.importLocations) {
              TransformImportsFromAST(loadEntryFromQueue(impLoc.name).ast, impLoc, dep);
            }

            if (transdExps.includes(dep.name) == false && !dep.outBundle) {
              TransformExportsFromAST(loadEntryFromQueue(dep.name.includes('./') ? dep.name : dep.libLoc).ast, dep);
              transdExps.push(dep.name);
            } else if (dep.outBundle && transdExps.includes(dep.name) == false) {
              let exportCheck = dep.importLocations.map(imploc => imploc.modules[0].name);

              let verify = _.uniq(exportCheck);

              if (verify.length === 1) {
                let ent = new QueueEntry(dep.name, BrowserGlobalTemplate({
                  GLOBAL: t.identifier(verify[0])
                }));
                ent.external = true;
                addEntryToQueue(ent);
                transdExps.push(dep.name);
              }
            }
          } else if (dep instanceof CSSDependency) {
            if (resolveCSS.includes(dep.name) == false) {
              let nCSS = await resolveCSSDependencies(dep, assetsFolder);
              resolveCSS.push(dep.name);
              dep.stylesheet = nCSS;
            }

            if (ControlPanel.cssPlanet) {
              pipeCSSContentToBuffer(dep.stylesheet);

              for (let impLoc of dep.importLocations) {
                removeCSSImportsFromAST(loadEntryFromQueue(impLoc.name).ast, dep, impLoc);
              }
            } else {
              for (let impLoc of dep.importLocations) {
                injectCSSDependencyIntoAST(loadEntryFromQueue(impLoc.name).ast, dep, impLoc);
              }
            }
          } else if (dep instanceof FileDependency) {
            let outFile = ControlPanel.encodeFilenames ? `${dep.uuid}${path.extname(dep.name)}` : path.basename(dep.name);
            let newName = `${dir}/${outFile}`;
            let localNewName = `${assetsFolder}/${outFile}`;

            if (resolvedFiles.includes(dep.name) == false) {
              await fs.ensureDir(dir);
              await fs.copyFile(dep.name, newName);
              resolvedFiles.push(dep.name);
            }

            for (let impLoc of dep.importLocations) {
              resolveFileDependencyIntoAST(loadEntryFromQueue(impLoc.name).ast, dep, impLoc, localNewName);
            }
          } else if (notNativeDependency(dep.name, ControlPanel)) {
            let {
              importsTransformer,
              exportsTransformer
            } = resolveTransformersForNonNativeDependency(dep, ControlPanel);

            for (let impLoc of dep.importLocations) {
              importsTransformer(loadEntryFromQueue(impLoc.name).ast, dep, impLoc);
            } // Node libraries are NATIVE ONLY therefore no need to verify if Dependency is a local file.


            exportsTransformer(loadEntryFromQueue(dep.name).ast, dep);
          }
        }
      } //AMD Define Transform


      for (let planetClusterMapObj of Graph.PlanetClusterMap) {
        for (let imploc of planetClusterMapObj.importedAt) {
          TransformAsyncClusterImportFromAST(loadEntryFromQueue(imploc).ast, planetClusterMapObj);
        }
      }
      /**Names of ALL modules added to buffers. (Includes Planets)
       *
       */


      let bufferNames = []; //
      // Star Foldup.
      //
      // Pushes entrypoint into buffer to be compiled.

      const entry = loadEntryFromQueue(Graph.entryPoint);
      stripNodeProcess(entry.ast, ControlPanel);
      const COMP = babel_generator_NAMESPACE.default(entry.ast, {
        sourceMaps: true,
        sourceFileName: path.relative(path.dirname(ControlPanel.outputFile), entry.name)
      });
      const mod = ControlPanel.isProduction ? entry.ast.program.body : ModuleEvalTemplate({
        CODE: t.stringLiteral(COMP.code + `\n //# sourceURL=${path.resolve(entry.name)} \n  //# sourceMappingURL=data:text/json;base64,${Buffer.from(JSON.stringify(COMP.map)).toString('base64')}`)
      });
      shuttle.addModuleToBuffer(Graph.entryPoint, mod);
      bufferNames.push(Graph.entryPoint); //Pushing modules into buffer to be compiled.

      for (let dep of Graph.Star) {
        if (dep instanceof ModuleDependency) {
          if (dep.libLoc !== undefined) {
            if (bufferNames.includes(dep.libLoc) == false) {
              const entry = loadEntryFromQueue(dep.libLoc);

              if (entry.external) {
                const COMP = babel_generator_NAMESPACE.default(entry.ast, {
                  sourceMaps: true,
                  sourceFileName: path.relative(path.dirname(ControlPanel.outputFile), entry.name)
                });
                const mod = ControlPanel.isProduction ? entry.ast.program.body : ModuleEvalTemplate({
                  CODE: t.stringLiteral(COMP.code)
                });
                shuttle.addModuleToBuffer(dep.libLoc, mod);
                bufferNames.push(dep.libLoc);
                continue;
              }

              stripNodeProcess(entry.ast, ControlPanel);
              const COMP = babel_generator_NAMESPACE.default(entry.ast, {
                sourceMaps: true,
                sourceFileName: path.relative(path.dirname(ControlPanel.outputFile), entry.name)
              });
              const mod = ControlPanel.isProduction ? entry.ast.program.body : ModuleEvalTemplate({
                CODE: t.stringLiteral(COMP.code + `\n //# sourceURL=${path.resolve(entry.name)} \n //# sourceMappingURL=data:text/json;base64,${Buffer.from(JSON.stringify(COMP.map)).toString('base64')}`)
              });
              shuttle.addModuleToBuffer(dep.libLoc, mod);
              bufferNames.push(dep.libLoc);
            }
          } else {
            if (bufferNames.includes(dep.name) == false) {
              const entry = loadEntryFromQueue(dep.name);

              if (entry.external) {
                const COMP = babel_generator_NAMESPACE.default(entry.ast, {
                  sourceMaps: true,
                  sourceFileName: path.relative(path.dirname(ControlPanel.outputFile), entry.name)
                });
                const mod = ControlPanel.isProduction ? entry.ast.program.body : ModuleEvalTemplate({
                  CODE: t.stringLiteral(COMP.code)
                });
                shuttle.addModuleToBuffer(dep.name, mod);
                bufferNames.push(dep.name);
                continue;
              }

              stripNodeProcess(entry.ast, ControlPanel);
              const COMP = babel_generator_NAMESPACE.default(entry.ast, {
                sourceMaps: true,
                sourceFileName: path.relative(path.dirname(ControlPanel.outputFile), entry.name)
              });
              const mod = ControlPanel.isProduction ? entry.ast.program.body : ModuleEvalTemplate({
                CODE: t.stringLiteral(COMP.code + `\n //# sourceURL=${path.resolve(entry.name)} \n //# sourceMappingURL=data:text/json;base64,${Buffer.from(JSON.stringify(COMP.map)).toString('base64')}`)
              });
              shuttle.addModuleToBuffer(dep.name, mod);
              bufferNames.push(dep.name);
            }
          }
        } else if (notNativeDependency(dep.name, ControlPanel) && CustomDependencyIsBundlable(dep, ControlPanel)) {
          if (bufferNames.includes(dep.name) == false) {
            const entry = loadEntryFromQueue(dep.name);

            if (entry.external) {
              const COMP = babel_generator_NAMESPACE.default(entry.ast, {
                sourceMaps: true,
                sourceFileName: path.relative(path.dirname(ControlPanel.outputFile), entry.name)
              });
              const mod = ControlPanel.isProduction ? entry.ast.program.body : ModuleEvalTemplate({
                CODE: t.stringLiteral(COMP.code)
              });
              shuttle.addModuleToBuffer(dep.name, mod);
              bufferNames.push(dep.name);
              continue;
            }

            stripNodeProcess(entry.ast, ControlPanel);
            const COMP = babel_generator_NAMESPACE.default(entry.ast, {
              sourceMaps: true,
              sourceFileName: path.relative(path.dirname(ControlPanel.outputFile), entry.name)
            });
            const mod = ControlPanel.isProduction ? entry.ast.program.body : ModuleEvalTemplate({
              CODE: t.stringLiteral(COMP.code + `\n //# sourceURL=${path.resolve(entry.name)} \n //# sourceMappingURL=data:text/json;base64,${Buffer.from(JSON.stringify(COMP.map)).toString('base64')}`)
            });
            shuttle.addModuleToBuffer(dep.name, mod);
            bufferNames.push(dep.name);
          }
        }
      } //
      // Planet Foldup
      //


      let PlanetShuttles = [];

      for (let planet of Graph.Planets) {
        let local_shuttle = new Shuttle();
        local_shuttle.name = planet.name;
        local_shuttle.entry = planet.entryModule;
        const entry = loadEntryFromQueue(planet.entryModule);
        stripNodeProcess(entry.ast, ControlPanel);
        const COMP = babel_generator_NAMESPACE.default(entry.ast, {
          sourceMaps: true,
          sourceFileName: path.relative(path.dirname(ControlPanel.outputFile), entry.name)
        });
        const mod = ControlPanel.isProduction ? entry.ast.program.body : ModuleEvalTemplate({
          CODE: t.stringLiteral(COMP.code + `\n //# sourceURL=${path.resolve(entry.name)} \n //# sourceMappingURL=data:text/json;base64,${Buffer.from(JSON.stringify(COMP.map)).toString('base64')}`)
        });
        local_shuttle.addModuleToBuffer(planet.entryModule, mod);
        bufferNames.push(planet.entryModule); //Pushing modules into buffer to be compiled.

        for (let dep of planet.modules) {
          if (dep instanceof ModuleDependency) {
            if (dep.libLoc !== undefined) {
              if (bufferNames.includes(dep.libLoc) == false) {
                const entry = loadEntryFromQueue(dep.libLoc);

                if (entry.external) {
                  const COMP = babel_generator_NAMESPACE.default(entry.ast, {
                    sourceMaps: true,
                    sourceFileName: path.relative(path.dirname(ControlPanel.outputFile), entry.name)
                  });
                  const mod = ControlPanel.isProduction ? entry.ast.program.body : ModuleEvalTemplate({
                    CODE: t.stringLiteral(COMP.code)
                  });
                  local_shuttle.addModuleToBuffer(dep.libLoc, mod);
                  bufferNames.push(dep.libLoc);
                  continue;
                }

                stripNodeProcess(entry.ast, ControlPanel);
                const COMP = babel_generator_NAMESPACE.default(entry.ast, {
                  sourceMaps: true,
                  sourceFileName: path.relative(path.dirname(ControlPanel.outputFile), entry.name)
                });
                const mod = ControlPanel.isProduction ? entry.ast.program.body : ModuleEvalTemplate({
                  CODE: t.stringLiteral(COMP.code + `\n //# sourceURL=${path.resolve(entry.name)} \n //# sourceMappingURL=data:text/json;base64,${Buffer.from(JSON.stringify(COMP.map)).toString('base64')}`)
                });
                local_shuttle.addModuleToBuffer(dep.libLoc, mod);
                bufferNames.push(dep.libLoc);
              }
            } else {
              if (bufferNames.includes(dep.name) == false) {
                const entry = loadEntryFromQueue(dep.name);

                if (entry.external) {
                  const COMP = babel_generator_NAMESPACE.default(entry.ast, {
                    sourceMaps: true,
                    sourceFileName: path.relative(path.dirname(ControlPanel.outputFile), entry.name)
                  });
                  const mod = ControlPanel.isProduction ? entry.ast.program.body : ModuleEvalTemplate({
                    CODE: t.stringLiteral(COMP.code)
                  });
                  local_shuttle.addModuleToBuffer(dep.name, mod);
                  bufferNames.push(dep.name);
                  continue;
                }

                stripNodeProcess(entry.ast, ControlPanel);
                const COMP = babel_generator_NAMESPACE.default(entry.ast, {
                  sourceMaps: true,
                  sourceFileName: path.relative(path.dirname(ControlPanel.outputFile), entry.name)
                });
                const mod = ControlPanel.isProduction ? entry.ast.program.body : ModuleEvalTemplate({
                  CODE: t.stringLiteral(COMP.code + `\n //#sourceURL=${path.resolve(entry.name)} \n //# sourceMappingURL=data:text/json;base64,${Buffer.from(JSON.stringify(COMP.map)).toString('base64')}`)
                });
                local_shuttle.addModuleToBuffer(dep.name, mod);
                bufferNames.push(dep.name);
              }
            }
          } else if (notNativeDependency(dep.name, ControlPanel) && CustomDependencyIsBundlable(dep, ControlPanel)) {
            if (bufferNames.includes(dep.name) == false) {
              const entry = loadEntryFromQueue(dep.name);

              if (entry.external) {
                const COMP = babel_generator_NAMESPACE.default(entry.ast, {
                  sourceMaps: true,
                  sourceFileName: path.relative(path.dirname(ControlPanel.outputFile), entry.name)
                });
                const mod = ControlPanel.isProduction ? entry.ast.program.body : ModuleEvalTemplate({
                  CODE: t.stringLiteral(COMP.code)
                });
                local_shuttle.addModuleToBuffer(dep.name, mod);
                bufferNames.push(dep.name);
                continue;
              }

              const COMP = babel_generator_NAMESPACE.default(entry.ast, {
                sourceMaps: true,
                sourceFileName: path.relative(path.dirname(ControlPanel.outputFile), entry.name)
              });
              const mod = ControlPanel.isProduction ? entry.ast.program.body : ModuleEvalTemplate({
                CODE: t.stringLiteral(COMP.code + `\n //# sourceURL=${path.resolve(entry.name)} \n //# sourceMappingURL=data:text/json;base64,${Buffer.from(JSON.stringify(COMP.map)).toString('base64')}`)
              });
              local_shuttle.addModuleToBuffer(dep.name, mod);
              bufferNames.push(dep.name);
            }
          }
        }

        PlanetShuttles.push(local_shuttle);
      }
      /**
       * Factory Shuttle Module Loader (Vortex's Official Module Loader for the browser!)
       * If there are no planets, export top factory. IF there are, export bottom factory with Promises.
       */


      let factory = Graph.Planets.length === 0 ? `
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
        if(mod.exports.MAPPED_DEFAULT){
            mod.exports = mod.exports.MAPPED_DEFAULT
        }
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

    ${ControlPanel.cssPlanet ? `shuttle.cssPlanet = function(){
        var planetSrc = './${CSS_PLANET_ID}.css'
        var sheet = document.createElement('link')
        sheet.rel = "stylesheet"
        sheet.type = "text/css"
        sheet.href = planetSrc
        document.head.appendChild(sheet)
      }
  
      shuttle.cssPlanet()` : ''}
  
  
    return shuttle("${Graph.shuttleEntry}");` : `var loadedModules = [];
    var loadedStyles = [];
    var loadedExportsByModule = {}; 
  
    var loadedPlanets = [];
    var loadedPlanetEntryExports = {}
  
    var local_modules = modules
    
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
  
        local_modules[mod_name](shuttle, mod.exports, loadedStyles);
        var o = new Object(mod_name);
        if(mod.exports.MAPPED_DEFAULT){
            mod.exports = mod.exports.MAPPED_DEFAULT
        }
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
  
    // SML's version of ES Dynamic Import (Returns entry point module export of planet)
    
    shuttle.planet = function(planet_name) {
  
      return new Promise(function(resolve,reject){
          if(loadedPlanets.includes(planet_name)){
              resolve(loadedPlanetEntryExports[planet_name].cachedExports);
          }
          else{
              var planet = document.createElement('script');
              planet.src = planet_name;
              document.body.appendChild(planet);
              planet.addEventListener('load',function(){
                  planetLoaded().then(
                      function(exports){
                          loadedPlanets.push(planet_name);
                          var o = new Object(planet_name);
                          Object.defineProperty(o, 'cachedExports', {
                              value: exports,
                              writable: false
                          });
                          Object.defineProperty(loadedPlanetEntryExports, planet_name, {
                              value: o
                          });
                          resolve(exports);
                      })
              },false)
  
              var entryPoint
  
              function planetLoaded(){
                  return new Promise(function(resolve,reject){
                      console.log('Loading from '+planet_name);
                      shuttle.override(planetmodules);
                      entryPoint = entry;
                      resolve(shuttle(entryPoint));
                  })
              }
  
          }
      })
  
        
    }
  
    shuttle.override = function(mods){
        local_modules = mods
    }

    shuttle.planetCluster = function(planets_array,callback){
        function defineCluster(){
          return new Promise(function(resolve, reject){
              var moduleObjects = planets_array.map(function(planet) { return shuttle.planet(planet)})
              Promise.all(moduleObjects).then(function(module_objs) {
                  resolve(module_objs)
              })
          })
      }
        defineCluster().then(function (moduleObjects) {
            callback.apply(null,moduleObjects)
        })
    }

    //AMD Registration Object!

    shuttle.planetCluster.amdRegistrar = {};
    
    
    
    //Calls EntryPoint to Initialize

    ${ControlPanel.cssPlanet ? `shuttle.cssPlanet = function(){
        var planetSrc = './${CSS_PLANET_ID}.css'
        var sheet = document.createElement('link')
        sheet.rel = "stylesheet"
        sheet.type = "text/css"
        sheet.href = planetSrc
        document.head.appendChild(sheet)
      }
  
      shuttle.cssPlanet()` : ''}
  
  
    return shuttle("${Graph.shuttleEntry}");`;
      let parsedFactory = Babel.parse(factory, {
        allowReturnOutsideFunction: true
      }).program.body;
      let finalCode = babel_generator_NAMESPACE.default(t.expressionStatement(t.callExpression(t.identifier(''), [t.callExpression(t.functionExpression(null, [t.identifier("modules")], t.blockStatement(parsedFactory), false, false), [shuttle.buffer])])), {
        compact: ControlPanel.isProduction ? true : false
      }).code;

      if (ControlPanel.cssPlanet) {
        await writeCSSPlanet(cssStorage, ControlPanel);
      }

      let codeEntries = [];
      let o = {
        value: 'star',
        code: finalCode
      };
      codeEntries.push(o);

      for (let _shuttle of PlanetShuttles) {
        let code = babel_generator_NAMESPACE.default(t.program([t.variableDeclaration('var', [t.variableDeclarator(t.identifier('entry'), t.stringLiteral(_shuttle.entry)), t.variableDeclarator(t.identifier('planetmodules'), _shuttle.buffer)])]), {
          compact: ControlPanel.isProduction ? true : false
        }).code;
        let o = {
          value: _shuttle.name,
          code: code
        };
        codeEntries.push(o);
      }

      return codeEntries;
    } //Shuttle Module Templates:

    /**
     * Vortex's Require Function Template
     */


    const ShuttleInitialize = babel_template_NAMESPACE.default("MODULE = shuttle(MODULENAME)");
    /**
     * Vortex's Named Export Template
     */

    const ShuttleExportNamed = babel_template_NAMESPACE.default("shuttle_exports.EXPORT = LOCAL");
    /**
     * Vortex's Default Export Template
     */

    const ShuttleExportDefault = babel_template_NAMESPACE.default("shuttle_exports.default = EXPORT");
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
            if (path.parent.type !== 'MemberExpression' && path.parent.type !== 'ImportSpecifier' && path.parent.type !== 'ImportDefaultSpecifier' && path.parent.type !== 'ObjectProperty') {
              if (currentImpLoc.indexOfModuleByName(path.node.name) !== null) {
                if (dep.name.includes('./') == false) {
                  //If library but NOT default import from lib
                  if (currentImpLoc.modules[currentImpLoc.indexOfModuleByName(path.node.name)].type !== ModuleTypes.EsDefaultModule && currentImpLoc.modules[currentImpLoc.indexOfModuleByName(path.node.name)].type !== ModuleTypes.EsDefaultNamespaceProvider) {
                    path.replaceWith(t.memberExpression(t.identifier(namespace), t.identifier(path.node.name)));
                  } else if (currentImpLoc.modules[currentImpLoc.indexOfModuleByName(path.node.name)].type === ModuleTypes.EsDefaultModule || currentImpLoc.modules[currentImpLoc.indexOfModuleByName(path.node.name)].type === ModuleTypes.EsDefaultNamespaceProvider) {
                    path.replaceWith(t.memberExpression(t.identifier(namespace), t.identifier('default')));
                  } //if NOT library at all

                } else {
                  //If Object Property, replace with module Object Namespace
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
                  } else if (defaultMod.type === ModuleTypes.EsDefaultNamespaceProvider && defaultMod.name === path.node.object.name) {
                    // IF Namespace is the default export and is used as new or call expression elsewhere.
                    path.replaceWith(t.memberExpression(t.memberExpression(t.identifier(namespace), t.identifier('default')), path.node.property));
                  }
                }
              }
            }
          },
          ObjectProperty: function (path) {
            if (path.node.value.type === "Identifier") {
              if (currentImpLoc.modules[currentImpLoc.indexOfModuleByName(path.node.value.name)] !== undefined) {
                if (path.node.value.name === currentImpLoc.modules[currentImpLoc.indexOfModuleByName(path.node.value.name)].name) {
                  path.node.value.name = namespace;
                }
              }
            }
          }
        });
      } else if (dep instanceof CjsModuleDependency) {
        if (currentImpLoc.modules[0].type === ModuleTypes.CjsNamespaceProvider || currentImpLoc.modules[0].type === ModuleTypes.CjsInteropRequire) {
          babel_traverse_NAMESPACE.default(ast, {
            VariableDeclaration: function (path) {
              for (let dec of path.node.declarations) {
                if (dec.init !== null) {
                  if (dec.init.type === 'CallExpression') {
                    if (dec.init.callee.name === 'require' && dec.init.arguments[0].value === currentImpLoc.relativePathToDep) {
                      dec.id.name = namespace;
                      dec.init.callee.name = 'shuttle';
                      dec.init.arguments[0].value = dep.name.includes('./') ? dep.name : dep.libLoc;
                    } else if (dec.init.callee.type === 'Identifier' && dec.init.callee.name === '_interopDefault' && dec.init.arguments[0].type === 'CallExpression' && dec.init.arguments[0].callee.name === 'require' && dec.init.arguments[0].arguments[0].value === currentImpLoc.relativePathToDep) {
                      dec.init.arguments[0].callee.name = 'shuttle';
                      dec.id.name = namespace;
                      dec.init.arguments[0].arguments[0].value = dep.name.includes('./') ? dep.name : dep.libLoc;
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
            if (path.node.declaration !== undefined && path.node.declaration !== null) {
              if (path.node.declaration.type === 'FunctionDeclaration') {
                exportsToBeRolled.push(path.node.declaration.id.name);
              } else if (path.node.declaration.type === 'VariableDeclaration') {
                exportsToBeRolled.push(path.node.declaration.declarations[0].id.name);
              }

              path.replaceWith(path.node.declaration);
            } else {
              for (let exp of path.node.specifiers) {
                if (exp.type === 'ExportSpecifier') {
                  if (exp.exported.name === 'default') {
                    defaultExport = exp.local.name;
                  } else {
                    exportsToBeRolled.push(exp.exported.name);
                  }
                }
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
                  } else if (path.node.left.object.name === 'freeModule' && path.node.left.property.name === 'exports') {
                    //Vue.js template compiler polyfill fix.. (For dependency 'he')
                    path.node.left.property.name = 'default';
                  }
                }
              }
            },
            MemberExpression: function (path) {
              if (path.parent.type !== 'AssignmentExpression') {
                if (path.node.object.type === 'Identifier') {
                  if (path.node.object.name === 'exports') {
                    path.node.object.name = 'shuttle_exports';
                  } else if (path.node.object.name === 'module') {
                    path.node.object.name = 'shuttle_exports';

                    if (path.node.property.name === 'exports') {
                      path.node.property.name = 'default';
                    }
                  }
                }
              }
            },
            Identifier: function (path) {
              if (path.parent.type !== 'MemberExpression') {
                if (path.node.name === 'exports') {
                  path.node.name = 'shuttle_exports';
                } else if (path.node.name === 'module') {
                  path.node.name = 'shuttle_exports';
                }
              }
            }
          });
        }
    }
    /**
     *
     * Strips process.node functions/conditionals from the code. (Also strips Object.defineProperty(exports,_esModule))
     *
     * @param {t.File} ast Abstract Syntax Tree (ESTree Format)
     */


    function stripNodeProcess(ast, ControlPanel) {
      babel_traverse_NAMESPACE.default(ast, {
        CallExpression: function (path) {
          if (path.node.callee.type === 'MemberExpression' && path.node.callee.object.type === "Identifier" && path.node.callee.object.name === 'Object' && path.node.callee.property.name === 'defineProperty' && path.node.arguments[0].type === 'Identifier' && path.node.arguments[0].name === 'exports') {
            path.remove();
          }
        },
        MemberExpression: function (path) {
          if (path.node.object.type === 'Identifier' && path.node.object.name === 'process' && path.node.property.name === 'env') {
            path.replaceWith(t.stringLiteral(ControlPanel.isProduction ? 'production' : 'development'));
          } else if (path.node.object.type === 'MemberExpression' && path.node.object.object.type === 'Identifier' && path.node.object.object.name === 'process' && path.node.object.property.name === 'env' && path.node.property.name === 'NODE_ENV') {
            path.replaceWith(t.stringLiteral(ControlPanel.isProduction ? 'production' : 'development'));
          }
        }
      });
    }

    const CSSInjector = babel_template_NAMESPACE.default("if(!gLOBAL_STYLES.includes(DEPNAME)){var style = document.createElement('style'); style.innerHTML=CSS;document.head.appendChild(style);gLOBAL_STYLES.push(DEPNAME)}");
    /**Injects CSS into import location
     *
     * @param {t.File} ast Abstract Syntax Tree (ESTree Format)
     * @param {CSSDependency} dep CSS Dependency
     * @param {FileImportLocation} currentImpLoc CUrrent File Import Location
     */

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

    function removeCSSImportsFromAST(ast, dep, currentImpLoc) {
      babel_traverse_NAMESPACE.default(ast, {
        ImportDeclaration: function (path) {
          if (path.node.source.value === currentImpLoc.relativePathToDep) {
            path.remove();
          }
        }
      });
    }
    /**Resolves File Dependency name with new name from a given AST.
     *
     * @param {t.File} ast Abstract Syntax Tree (ESTree Format)
     * @param {FileDependency} dep Dependency to resolve
     * @param {FileImportLocation} currentImpLoc Current Import Location
     * @param {string} newFileName New name to resolve dependency under
     */


    function resolveFileDependencyIntoAST(ast, dep, currentImpLoc, newFileName) {
      babel_traverse_NAMESPACE.default(ast, {
        ImportDeclaration: function (path) {
          if (path.node.source.value === currentImpLoc.relativePathToDep) {
            path.replaceWith(t.variableDeclaration('var', [t.variableDeclarator(t.identifier(currentImpLoc.localName), t.stringLiteral(newFileName))]));
          }
        },
        CallExpression: function (path) {
          if (path.node.callee.type === 'Identifier' && path.node.callee.name === 'require' && path.node.arguments[0].value === currentImpLoc.relativePathToDep) {
            path.replaceWith(t.stringLiteral(newFileName));
          }
        }
      });
    }
    /**Similar to {@link resolveFileDependencyIntoAST}, but only applies for CSS files.
     *
     *
     * @param {css.Stylesheet} ast Abstract Syntax Tree (CSS Parser Format)
     * @param {string} fileDep
     * @param {string} newName
     */


    function replaceFileDependencyIntoCSS(ast, fileDep, newName) {
      for (let rule of ast.stylesheet.rules) {
        if (rule.type === 'font-face') {
          for (let dec of rule.declarations) {
            if (dec.property === 'src' && dec.value.includes(path.basename(fileDep))) {
              let a = dec.value.slice(0, 4);
              let b = dec.value.slice(dec.value.indexOf(')'));
              dec.value = `${a}'${newName}'${b}`;
            }
          }
        }
      }
    }
    /**Resolves/Transforms CSS's Dependencies.
     *
     * @param {CSSDependency} dep
     * @param {string} assets_folder
     */


    async function resolveCSSDependencies(dep, assets_folder) {
      let parsedCss = css.parse(dep.stylesheet);
      let outputDest = LocalizedResolve(ControlPanel.outputFile, assets_folder);
      await fs.ensureDir(outputDest);

      for (let d of dep.dependencies) {
        if (d instanceof FileDependency) {
          let outFile = ControlPanel.encodeFilenames ? `${d.uuid}${path.extname(d.name)}` : path.basename(d.name);
          let newName = `${assets_folder}/${outFile}`;
          await fs.copyFile(d.name, `${outputDest}/${outFile}`);
          replaceFileDependencyIntoCSS(parsedCss, d.name, newName);
        }
      }

      return css.stringify(parsedCss);
    }
    /**Transforms Async Import (ES Dynamic Import Syntax) to be used by Shuttle Module Loader
     * @example
     *
     * import('module') // Into This -->
     *
     * shuttle.planet('planet.js')
     *
     *
     * @param {t.File} ast Abstract Syntax Tree
     * @param {Planet} planet
     */


    function TransformAsyncImportFromAST(ast, planet) {
      babel_traverse_NAMESPACE.default(ast, {
        CallExpression: function (path) {
          if (path.node.callee.type === "Import" && path.node.arguments[0].value === planet.originalName) {
            path.replaceWith(t.callExpression(t.memberExpression(t.identifier("shuttle"), t.identifier("planet")), [t.stringLiteral(planet.name)]));
          }
        }
      });
    }
    /**Transforms AMD Define to be used by SML
     *
     * @example
     *
     * //Transforms
     * define(['module0','module1'],function(module0Object,module1Object){
     * // Access Module Exports Here!
     * })
     * //To -->
     * shuttle.planetCluster(['planet_0.js','planet_1.js'],function(module0Object,module1Object){
     * // Access Module Exports Here!
     * })
     *
     *
     *
     * @param {t.File} ast
     * @param {PlanetClusterMapObject} planetClusterMap
     */


    function TransformAsyncClusterImportFromAST(ast, planetClusterMap) {
      babel_traverse_NAMESPACE.default(ast, {
        CallExpression: function (path) {
          if (path.node.callee.type === 'Identifier' && path.node.callee.name === 'define' && path.node.arguments[0].type === 'ArrayExpression') {
            let args = path.node.arguments[0].elements.map(argumnt => argumnt.value); // If there is NO difference between args and module names.

            if (_.difference(args, planetClusterMap.planetsByOriginalName).length === 0) {
              //Converts strings to Stringliterals
              let planetNameNodes = planetClusterMap.planetsByNewName.map(value => t.stringLiteral(value));
              path.replaceWith(t.callExpression(t.memberExpression(t.identifier("shuttle"), t.identifier("planetCluster")), [t.arrayExpression(planetNameNodes), path.node.arguments[1]]));
            }
          }
        }
      });
    }

    async function writeCSSPlanet(stylesheetBuffer, ControlPanel) {
      let cssPlanetLoc = LocalizedResolve(ControlPanel.outputFile, `./${CSS_PLANET_ID}.css`);
      let OUT_STYLESHEET = stylesheetBuffer.join('');

      if (ControlPanel.minifyCssPlanet) {
        OUT_STYLESHEET = await minifyCss(OUT_STYLESHEET);
      }

      await FS.writeFile(cssPlanetLoc, OUT_STYLESHEET);
    }

    async function minifyCss(styles) {
      let regexp = /(\s*|(\n)*|(\r\n)*)/g;
      return styles.replace(regexp, "");
    }

    _localExports.pipeCSSContentToBuffer = pipeCSSContentToBuffer;
    _localExports.Compile = Compile;
    _localExports.TransformImportsFromAST = TransformImportsFromAST;
    _localExports.TransformExportsFromAST = TransformExportsFromAST;
    _localExports.CSSInjector = CSSInjector;
  }),
  "./test\\vortex\\Planet.js": (function (_localRequire, _localExports, fs_extra_NAMESPACE, FSEXTRA, terser, path, chalk, cli_spinners_NAMESPACE, ora, os, os_NAMESPACE, fs, fs_promises_NAMESPACE, FS, babel_core_NAMESPACE, t, babel_generator_NAMESPACE, Parse5, resolve, util_NAMESPACE, e, chokidar, diff_NAMESPACE, io, Babel, css, babel_traverse_NAMESPACE, babel_template_NAMESPACE, _, uuid_NAMESPACE) {
    var __TEST_VORTEX_DEPENDENCIES_ESMODULEDEPENDENCY_JS = _localRequire("./test\\vortex\\dependencies\\EsModuleDependency.js"),
        EsModuleDependency = __TEST_VORTEX_DEPENDENCIES_ESMODULEDEPENDENCY_JS.default;

    var __TEST_VORTEX_DEPENDENCIES_CJSMODULEDEPENDENCY_JS = _localRequire("./test\\vortex\\dependencies\\CjsModuleDependency.js"),
        CjsModuleDependency = __TEST_VORTEX_DEPENDENCIES_CJSMODULEDEPENDENCY_JS.default;
    /**
     * A module container that is loaded asynchronously (via dynamic import or AMD Define)
     */


    class Planet {
      constructor(name, entryModule) {
        this.importedAt = [];
        this.modules = [];
        this.name = name;
        this.entryModule = entryModule;
      }

    }
    /**Figure which type of Exports are being made in entry module so it can be transformed properly.
     *
     * @param {Planet} planet
     */


    function assignDependencyType(planet, queue) {
      let DepTypes;

      (function (DepTypes) {
        DepTypes[DepTypes["CJS"] = 1] = "CJS";
        DepTypes[DepTypes["ESM"] = 2] = "ESM";
        DepTypes[DepTypes["AMD"] = 3] = "AMD";
      })(DepTypes || (DepTypes = {}));

      let entrydepType;
      babel_traverse_NAMESPACE.default(loadEntryFromSpecificQueue(planet.entryModule, queue).ast, {
        enter(path) {
          if (path.isExportDefaultDeclaration) {
            entrydepType = DepTypes.ESM;
          } else if (path.isExportDeclaration) {
            entrydepType = DepTypes.ESM;
          }
        },

        MemberExpression: function (path) {
          if (path.parent.type !== 'MemberExpression') {
            if (path.node.object.type === 'Identifier') {
              if (path.node.object.name === 'exports') {
                entrydepType = DepTypes.CJS;
              } else if (path.node.object.name === 'module' && path.node.property.name === 'exports') {
                entrydepType = DepTypes.CJS;
              }
            }
          }
        }
      });
      let dep;

      if (entrydepType = DepTypes.ESM) {
        dep = new EsModuleDependency(null);

        if (planet.originalName.includes('./') == false) {
          dep.libLoc = planet.entryModule;
        }

        planet.entryDependency = dep;
        return planet;
      } else if (entrydepType = DepTypes.CJS) {
        dep = new CjsModuleDependency(null);

        if (planet.originalName.includes('./') == false) {
          dep.libLoc = planet.entryModule;
        }

        planet.entryDependency = dep;
        return planet;
      }
    }

    class PlanetClusterMapObject {
      constructor() {
        this.importedAt = [];
      }

    }

    class PlanetImportLocation {
      constructor(name, clusterImport) {
        this.name = name;
        this.clusterImport = clusterImport;
      }

    }

    function loadEntryFromSpecificQueue(entryName, queue) {
      for (let ent of queue) {
        if (ent.name === entryName) {
          return ent;
        }
      }
    }

    _localExports.Planet = Planet;
    _localExports.assignDependencyType = assignDependencyType;
    _localExports.PlanetClusterMapObject = PlanetClusterMapObject;
    _localExports.PlanetImportLocation = PlanetImportLocation;
  }),
  "./test\\vortex\\DependencyFactory.js": (function (_localRequire, _localExports, fs_extra_NAMESPACE, FSEXTRA, terser, path, chalk, cli_spinners_NAMESPACE, ora, os, os_NAMESPACE, fs, fs_promises_NAMESPACE, FS, babel_core_NAMESPACE, t, babel_generator_NAMESPACE, Parse5, resolve, util_NAMESPACE, e, chokidar, diff_NAMESPACE, io, Babel, css, babel_traverse_NAMESPACE, babel_template_NAMESPACE, _, uuid_NAMESPACE) {
    var __TEST_VORTEX_DEPENDENCIES_CSSDEPENDENCY_JS = _localRequire("./test\\vortex\\dependencies\\CSSDependency.js"),
        CSSDependency = __TEST_VORTEX_DEPENDENCIES_CSSDEPENDENCY_JS.CSSDependency;

    var __TEST_VORTEX_RESOLVE_JS = _localRequire("./test\\vortex\\Resolve.js"),
        LocalizedResolve = __TEST_VORTEX_RESOLVE_JS.LocalizedResolve;

    var __TEST_VORTEX_DEPENDENCIES_FILEDEPENDENCY_JS = _localRequire("./test\\vortex\\dependencies\\FileDependency.js"),
        FileDependency = __TEST_VORTEX_DEPENDENCIES_FILEDEPENDENCY_JS.FileDependency;

    /**Resolves a Non-JS dependency type.
     *
     * @param {string} name Name of Dependency
     * @param {FileImportLocation} initImportLoc Intial Import Location
     * @param {string} currentFile Current File Being Graphed
     */
    function resolveDependencyType(name, initImportLoc, currentFile) {
      let resolvedDependency;

      switch (path.extname(name)) {
        case '.css':
          resolvedDependency = new CSSDependency(LocalizedResolve(currentFile, name), initImportLoc, fs.readFileSync(LocalizedResolve(currentFile, name)).toString());
          break;

        case '.png':
          resolvedDependency = new FileDependency(LocalizedResolve(currentFile, name), initImportLoc);
          break;

        case '.otf':
          resolvedDependency = new FileDependency(LocalizedResolve(currentFile, name), initImportLoc);
          break;

        case '.ttf':
          resolvedDependency = new FileDependency(LocalizedResolve(currentFile, name), initImportLoc);
          break;
      }

      return resolvedDependency;
    }
    /**Checks `depName` to see if the Dependency is NOT Native to Vortex's Internal Dependencies.
     *
     * @param {string} depName
     */


    function notNativeDependency(depName, ControlPanel) {
      if (!ControlPanel.InstalledAddons) {
        return false;
      }

      let ALL_ADDON_EXNTS = _.concat(ControlPanel.InstalledAddons.extensions.js, ControlPanel.InstalledAddons.extensions.other);

      for (let ext of ALL_ADDON_EXNTS) {
        if (path.extname(depName) === ext) {
          return true;
        }
      }

      return false;
    }

    function resolveNonNativeDependency(depName, initImportLoc, ControlPanel) {
      let resolvedDependency;

      for (let depMapObject of ControlPanel.InstalledAddons.importedDependencies) {
        if (depMapObject.extension === path.extname(depName)) {
          resolvedDependency = new depMapObject.dependency(depName, initImportLoc);
        }
      }

      return resolvedDependency;
    }

    function resolveGrapherForNonNativeDependency(Dependency, ControlPanel) {
      for (let GrapherMap of ControlPanel.InstalledAddons.importedGraphers) {
        if (GrapherMap.name === path.extname(Dependency.name)) {
          return GrapherMap.grapher;
        }
      }
    }

    function resolveTransformersForNonNativeDependency(Dependency, ControlPanel) {
      for (let CompilerMap of ControlPanel.InstalledAddons.importedCompilers) {
        if (CompilerMap.extname === path.extname(Dependency.name)) {
          let {
            importsTransformer,
            exportsTransformer
          } = CompilerMap;
          return {
            importsTransformer,
            exportsTransformer
          };
        }
      }
    }

    function CustomDependencyIsBundlable(Dependency, ControlPanel) {
      for (let depMapObject of ControlPanel.InstalledAddons.importedDependencies) {
        if (depMapObject.extension === path.extname(Dependency.name)) {
          return depMapObject.bundlable;
        }
      }
    }

    _localExports.resolveDependencyType = resolveDependencyType;
    _localExports.notNativeDependency = notNativeDependency;
    _localExports.resolveNonNativeDependency = resolveNonNativeDependency;
    _localExports.resolveGrapherForNonNativeDependency = resolveGrapherForNonNativeDependency;
    _localExports.resolveTransformersForNonNativeDependency = resolveTransformersForNonNativeDependency;
    _localExports.CustomDependencyIsBundlable = CustomDependencyIsBundlable;
  }),
  "./test\\vortex\\Dependency.js": (function (_localRequire, _localExports, fs_extra_NAMESPACE, FSEXTRA, terser, path, chalk, cli_spinners_NAMESPACE, ora, os, os_NAMESPACE, fs, fs_promises_NAMESPACE, FS, babel_core_NAMESPACE, t, babel_generator_NAMESPACE, Parse5, resolve, util_NAMESPACE, e, chokidar, diff_NAMESPACE, io, Babel, css, babel_traverse_NAMESPACE, babel_template_NAMESPACE, _, uuid_NAMESPACE) {
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

    _localExports.default = Dependency;
  }),
  "./test\\vortex\\Graph.js": (function (_localRequire, _localExports, fs_extra_NAMESPACE, FSEXTRA, terser, path, chalk, cli_spinners_NAMESPACE, ora, os, os_NAMESPACE, fs, fs_promises_NAMESPACE, FS, babel_core_NAMESPACE, t, babel_generator_NAMESPACE, Parse5, resolve, util_NAMESPACE, e, chokidar, diff_NAMESPACE, io, Babel, css, babel_traverse_NAMESPACE, babel_template_NAMESPACE, _, uuid_NAMESPACE) {
    class VortexGraph {
      /**
       * @param {string} entrypoint Entry point
       */
      constructor(entrypoint) {
        /**
         * List of ALL Dependencys that are imported synchronously for app/library
         */
        this.Star = [];
        /**
         * List of ALL Planets for app/library
         */

        this.Planets = [];
        this.PlanetClusterMap = [];
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

            break;
          }
        }
      }

      remove(Dependency) {
        let index = this.Star.indexOf(Dependency);
        this.Star.splice(index);
      }
      /**Adds dependency to specified planet.
       *
       * @param {Dependency} Dependency
       * @param {string} planetName Planet to add dependency to.
       */


      addToPlanet(Dependency, planetName) {
        for (let planet of this.Planets) {
          if (planet.name === planetName) {
            planet.modules.push(Dependency);
            break;
          }
        }
      }
      /**Searchs for dependency on given planet.
       *
       * @param {Dependency} Dependency
       * @param {string} planetName Planet to search for dependency on
       * @returns {boolean} True or False
       */


      searchForOnPlanet(Dependency, planetName) {
        for (let planet of this.Planets) {
          if (planet.name === planetName) {
            for (let dep of planet.modules) {
              if (dep.name === Dependency.name) {
                return true;
              }
            }

            return false;
          }
        }
      }
      /**Updates dependency with new given dependency that share the same name
       *
       * @param newDependency The __New__ Dependency.
       * @param planetName The Planet of where old dependency is located.
       */


      updateOnPlanet(newDependency, planetName) {
        for (let planet of this.Planets) {
          if (planet.name === planetName) {
            for (let dep of planet.modules) {
              if (dep.name === newDependency.name) {
                for (let newImpLoc of newDependency.importLocations) {
                  if (dep.testForImportLocation(newImpLoc.name) == false) {
                    dep.importLocations.push(newImpLoc);
                  }
                }

                break;
              }
            }
          }
        }
      }
      /**Tests to see if planet has been created via the entry module.
       *
       * @param {string} entryModule Entry module
       * @returns {boolean} True or False
       */


      planetExists(entryModule) {
        for (let planet of this.Planets) {
          if (planet.entryModule === entryModule) {
            return true;
          }
        }

        return false;
      }
      /**Finds index of planet via entry module.
       *
       * @param {string} entryModule Entry Module
       * @returns {number} Index
       */


      indexOfPlanet(entryModule) {
        for (let planet of this.Planets) {
          if (planet.entryModule === entryModule) {
            return this.Planets.indexOf(planet);
          }
        }

        return null;
      }

    }

    _localExports.VortexGraph = VortexGraph;
  }),
  "./test\\vortex\\graphers\\EsModuleGrapher.js": (function (_localRequire, _localExports, fs_extra_NAMESPACE, FSEXTRA, terser, path, chalk, cli_spinners_NAMESPACE, ora, os, os_NAMESPACE, fs, fs_promises_NAMESPACE, FS, babel_core_NAMESPACE, t, babel_generator_NAMESPACE, Parse5, resolve, util_NAMESPACE, e, chokidar, diff_NAMESPACE, io, Babel, css, babel_traverse_NAMESPACE, babel_template_NAMESPACE, _, uuid_NAMESPACE) {
    var __TEST_VORTEX_MODULE_JS = _localRequire("./test\\vortex\\Module.js"),
        Module = __TEST_VORTEX_MODULE_JS.default; //import Dependency from "../Dependency.js";


    var __TEST_VORTEX_DEPENDENCIES_ESMODULEDEPENDENCY_JS = _localRequire("./test\\vortex\\dependencies\\EsModuleDependency.js"),
        EsModuleDependency = __TEST_VORTEX_DEPENDENCIES_ESMODULEDEPENDENCY_JS.default; //import { minifyIfProduction } from "../GraphGenerator.js";


    var __TEST_VORTEX_TRANSPORT_JS = _localRequire("./test\\vortex\\Transport.js"),
        Transport = __TEST_VORTEX_TRANSPORT_JS.Transport;

    var __TEST_VORTEX_IMPORTLOCATIONS_MDIMPORTLOCATION_JS = _localRequire("./test\\vortex\\importlocations\\MDImportLocation.js"),
        MDImportLocation = __TEST_VORTEX_IMPORTLOCATIONS_MDIMPORTLOCATION_JS.default;

    var __TEST_VORTEX_DEPENDENCYFACTORY_JS = _localRequire("./test\\vortex\\DependencyFactory.js"),
        resolveDependencyType = __TEST_VORTEX_DEPENDENCYFACTORY_JS.resolveDependencyType,
        notNativeDependency = __TEST_VORTEX_DEPENDENCYFACTORY_JS.notNativeDependency,
        resolveNonNativeDependency = __TEST_VORTEX_DEPENDENCYFACTORY_JS.resolveNonNativeDependency;

    var __TEST_VORTEX_IMPORTLOCATIONS_FILEIMPORTLOCATION_JS = _localRequire("./test\\vortex\\importlocations\\FileImportLocation.js"),
        FileImportLocation = __TEST_VORTEX_IMPORTLOCATIONS_FILEIMPORTLOCATION_JS.FileImportLocation;

    var __TEST_VORTEX_RESOLVE_JS = _localRequire("./test\\vortex\\Resolve.js"),
        isJs = __TEST_VORTEX_RESOLVE_JS.isJs,
        LocalizedResolve = __TEST_VORTEX_RESOLVE_JS.LocalizedResolve;
    /**Searchs and Graphs JS code for ECMAScript Module Dependencies
     *
     * @param {QueueEntry} entry
     * @param {VortexGraph} Graph
     */


    function SearchAndGraph(entry, Graph, planetName, ControlPanel, ASTQueue) {
      babel_traverse_NAMESPACE.default(entry.ast, {
        ImportDeclaration: function (path) {
          if (isJs(path.node.source.value, ControlPanel)) {
            let modules = []; //console.log(path.node);

            for (let ImportType of path.node.specifiers) {
              if (ImportType.type === 'ImportDefaultSpecifier') {
                let mod;
                mod = new Module(ImportType.local.name, "EsDefaultModule"); // else{
                //     mod = new Module(ImportType.local.name,ModuleTypes.CjsNamespaceProvider)
                // }

                modules.push(mod);
              } else if (ImportType.type === 'ImportSpecifier') {
                let mod = new Module(ImportType.local.name, "EsModule");
                modules.push(mod);
              } else {
                let mod = new Module(ImportType.local.name, "EsNamespaceProvider");
                modules.push(mod);
              }
            } //console.log(modules)


            let currentImpLoc = new MDImportLocation(entry.name, path.node.loc.start.line, modules, path.node.source.value);
            let name = path.node.source.value; //If the Module dependency is NOT Built in to Vortex.

            if (notNativeDependency(name, ControlPanel)) {
              Transport(resolveNonNativeDependency(LocalizedResolve(entry.name, name), currentImpLoc, ControlPanel), Graph, entry.name, currentImpLoc, planetName, ControlPanel, ASTQueue);
            } else {
              let dep = new EsModuleDependency(name, currentImpLoc);

              if (path.node.trailingComments !== undefined) {
                if (path.node.trailingComments[0].value === 'vortexRetain') {
                  dep.outBundle = true;
                }
              } //Browser Externals!


              if (ControlPanel.externalLibs.includes(dep.name)) {
                dep.outBundle = true;
                dep.libLoc = dep.name;
              }

              Transport(dep, Graph, entry.name, currentImpLoc, planetName, ControlPanel, ASTQueue);
            }
          } else {
            //For Non-Module Dependencies.
            let impLoc = new FileImportLocation(entry.name, path.node.loc.start.line, path.node.source.value, path.node.specifiers[0] !== undefined ? path.node.specifiers[0].local.name : null);

            if (notNativeDependency(path.node.source.value, ControlPanel)) {
              Transport(resolveNonNativeDependency(LocalizedResolve(entry.name, path.node.source.value), impLoc, ControlPanel), Graph, entry.name, null, planetName, ControlPanel, ASTQueue);
            }

            let dep = resolveDependencyType(path.node.source.value, impLoc, entry.name);
            Transport(dep, Graph, entry.name, null, planetName, ControlPanel, ASTQueue);
          }
        }
      });
    }

    _localExports.SearchAndGraph = SearchAndGraph;
  }),
  "./test\\vortex\\graphers\\CommonJsModuleGrapher.js": (function (_localRequire, _localExports, fs_extra_NAMESPACE, FSEXTRA, terser, path, chalk, cli_spinners_NAMESPACE, ora, os, os_NAMESPACE, fs, fs_promises_NAMESPACE, FS, babel_core_NAMESPACE, t, babel_generator_NAMESPACE, Parse5, resolve, util_NAMESPACE, e, chokidar, diff_NAMESPACE, io, Babel, css, babel_traverse_NAMESPACE, babel_template_NAMESPACE, _, uuid_NAMESPACE) {
    var __TEST_VORTEX_MODULE_JS = _localRequire("./test\\vortex\\Module.js"),
        Module = __TEST_VORTEX_MODULE_JS.default;

    var __TEST_VORTEX_DEPENDENCIES_CJSMODULEDEPENDENCY_JS = _localRequire("./test\\vortex\\dependencies\\CjsModuleDependency.js"),
        CjsModuleDependency = __TEST_VORTEX_DEPENDENCIES_CJSMODULEDEPENDENCY_JS.default;

    var __TEST_VORTEX_TRANSPORT_JS = _localRequire("./test\\vortex\\Transport.js"),
        Transport = __TEST_VORTEX_TRANSPORT_JS.Transport;

    var __TEST_VORTEX_IMPORTLOCATIONS_MDIMPORTLOCATION_JS = _localRequire("./test\\vortex\\importlocations\\MDImportLocation.js"),
        MDImportLocation = __TEST_VORTEX_IMPORTLOCATIONS_MDIMPORTLOCATION_JS.default;

    var __TEST_VORTEX_RESOLVE_JS = _localRequire("./test\\vortex\\Resolve.js"),
        isJs = __TEST_VORTEX_RESOLVE_JS.isJs;

    var __TEST_VORTEX_IMPORTLOCATIONS_FILEIMPORTLOCATION_JS = _localRequire("./test\\vortex\\importlocations\\FileImportLocation.js"),
        FileImportLocation = __TEST_VORTEX_IMPORTLOCATIONS_FILEIMPORTLOCATION_JS.FileImportLocation;

    var __TEST_VORTEX_DEPENDENCYFACTORY_JS = _localRequire("./test\\vortex\\DependencyFactory.js"),
        resolveDependencyType = __TEST_VORTEX_DEPENDENCYFACTORY_JS.resolveDependencyType;
    /**Searchs and Graphs JS code for CommonJS Dependencies
     *
     * @param {QueueEntry} entry
     * @param {VortexGraph} Graph
     */


    function SearchAndGraph(entry, Graph, planetName, ControlPanel, ASTQueue) {
      // fs.writeJson('./debug.json',jsCode, err => {
      //         if (err) return console.error(err)
      //         console.log('Debug Written')
      //       })
      babel_traverse_NAMESPACE.default(entry.ast, {
        VariableDeclarator: function (path) {
          if (path.parent.type === "VariableDeclaration" && path.parent.trailingComments && path.parent.trailingComments.find(comment => comment.value === "vortexRetain")) {
            return;
          }

          let modules = [];

          if (path.node.init !== null) {
            if (path.node.init.type === 'CallExpression') {
              if (path.node.init.callee.name === 'require') {
                if (path.node.id.type === 'ObjectPattern') {
                  for (let namedRequires of path.node.id.properties) {
                    //console.log(namedRequires.value)
                    modules.push(new Module(namedRequires.value.name, "CjsModule"));
                  }
                } else {
                  modules.push(new Module(path.node.id.name, "CjsNamespaceProvider"));
                } //console.log(path.node.declarations[0].init.arguments[0].value)


                let currentImpLoc = new MDImportLocation(entry.name, path.node.loc.start.line, modules, path.node.init.arguments[0].value);
                Transport(new CjsModuleDependency(path.node.init.arguments[0].value, currentImpLoc), Graph, entry.name, currentImpLoc, planetName, ControlPanel, ASTQueue);
              } else if (path.node.init.callee.name === '_interopDefault') {
                if (path.node.init.arguments[0].type === 'CallExpression') {
                  if (path.node.init.arguments[0].callee.name === 'require') {
                    modules.push(new Module(path.node.id.name, "CjsInteropRequire"));
                    let currentImpLoc = new MDImportLocation(entry.name, path.node.loc.start.line, modules, path.node.init.arguments[0].arguments[0].value);
                    Transport(new CjsModuleDependency(path.node.init.arguments[0].arguments[0].value, currentImpLoc), Graph, entry.name, currentImpLoc, planetName, ControlPanel, ASTQueue);
                  }
                }
              }
            }
          }
        },
        ExpressionStatement: function (path) {
          let modules = [];

          if (path.node.expression.type === 'AssignmentExpression') {
            if (path.node.expression.left.type === 'MemberExpression' && path.node.expression.right.type === 'CallExpression') {
              if (path.node.expression.right.callee.name === 'require') {
                modules.push(new Module(path.node.expression.right.arguments[0].value, "CjsNamespaceProvider"));
                let currentImpLoc = new MDImportLocation(entry.name, path.node.loc.start.line, modules, path.node.expression.right.arguments[0].value);
                Transport(new CjsModuleDependency(path.node.expression.right.arguments[0].value, currentImpLoc), Graph, entry.name, currentImpLoc, planetName, ControlPanel, ASTQueue);
              }
            }
          }

          if (path.node.expression.type === 'CallExpression') {
            if (path.node.expression.callee.type === 'Identifier' && path.node.expression.callee.name == 'require') {
              modules.push(new Module('_Default_', "CjsDefaultModule"));
              let currentImpLoc = new MDImportLocation(entry.name, path.node.loc.start.line, modules, path.node.expression.arguments[0].value);
              Transport(new CjsModuleDependency(path.node.expression.arguments[0].value, currentImpLoc), Graph, entry.name, currentImpLoc, planetName, ControlPanel, ASTQueue);
            }

            if (path.node.expression.callee.type === 'CallExpression') {
              if (path.node.expression.callee.callee.name === 'require') {
                modules.push(new Module('_DefaultFunction_', "CjsDefaultFunction"));
                let currentImpLoc = new MDImportLocation(entry.name, path.node.loc.start.line, modules, path.node.expression.callee.arguments[0].value);
                Transport(new CjsModuleDependency(path.node.expression.callee.arguments[0].value, currentImpLoc), Graph, entry.name, currentImpLoc, planetName, ControlPanel, ASTQueue);
              }
            }
          }
        },
        ObjectProperty: function (path) {
          let modules = [];

          if (path.node.value.type === 'CallExpression' && path.node.value.callee.type === 'Identifier' && path.node.value.callee.name === 'require') {
            if (isJs(path.node.value.arguments[0].value, ControlPanel)) {
              modules.push(new Module('CJSLoad', "CJSLoad"));
              let currentImpLoc = new MDImportLocation(entry.name, 0, modules, path.node.value.arguments[0].value);
              Transport(new CjsModuleDependency(path.node.value.arguments[0].value, currentImpLoc), Graph, entry.name, currentImpLoc, planetName, ControlPanel, ASTQueue);
            } else {
              nonModuleDependencyResolve(path.node.value.arguments[0].value, Graph);
            }
          }
        }
      });

      function nonModuleDependencyResolve(DepLoc, Graph) {
        let fileImpLoc = new FileImportLocation(entry.name, 0, DepLoc);
        let dep = resolveDependencyType(DepLoc, fileImpLoc, entry.name);
        Transport(dep, Graph, entry.name, null, planetName, ControlPanel, ASTQueue);
      }
    }

    _localExports.SearchAndGraph = SearchAndGraph;
  }),
  "./test\\vortex\\Resolve.js": (function (_localRequire, _localExports, fs_extra_NAMESPACE, FSEXTRA, terser, path, chalk, cli_spinners_NAMESPACE, ora, os, os_NAMESPACE, fs, fs_promises_NAMESPACE, FS, babel_core_NAMESPACE, t, babel_generator_NAMESPACE, Parse5, resolve, util_NAMESPACE, e, chokidar, diff_NAMESPACE, io, Babel, css, babel_traverse_NAMESPACE, babel_template_NAMESPACE, _, uuid_NAMESPACE) {
    var __TEST_VORTEX_QUARKTABLE_JS = _localRequire("./test\\vortex\\QuarkTable.js"),
        DefaultQuarkTable = __TEST_VORTEX_QUARKTABLE_JS.DefaultQuarkTable;

    var __TEST_VORTEX_OPTIONS_JS = _localRequire("./test\\vortex\\Options.js"),
        ParseSettings = __TEST_VORTEX_OPTIONS_JS.ParseSettings;

    var __TEST_VORTEX_VORTEXERROR_JS = _localRequire("./test\\vortex\\VortexError.js"),
        VortexError = __TEST_VORTEX_VORTEXERROR_JS.VortexError,
        VortexErrorType = __TEST_VORTEX_VORTEXERROR_JS.VortexErrorType;
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


    function resolveLibBundle(nodeLibName, ControlPanel) {
      //GraphDepsAndModsForCurrentFile(ResolveLibrary(nodeLibName),Graph)
      let STD_NODE_LIBS = ['path', 'fs', 'module', 'os', 'fs/promises'];

      if (STD_NODE_LIBS.includes(nodeLibName)) {
        return 'node.js';
      }

      let bundles = ResolveLibrary(nodeLibName);

      if (bundles instanceof Array) {
        if (bundles.length === 1) {
          return addJsExtensionIfNecessary(bundles[0]);
        }

        for (let bund of bundles) {
          if (ControlPanel.isProduction) {
            if (bund.includes('min') || bund.includes('prod')) {
              return addJsExtensionIfNecessary(bund);
            }
          } else {
            if (!bund.includes('min') && !bund.includes('prod')) {
              return addJsExtensionIfNecessary(bund);
            }
          }
        }
      } else {
        // else{
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
        return bundles;
      } // }

    }

    function ResolveLibrary(packageName) {
      let packageIndexDirname = './' + path.relative(path.join(__dirname, '../'), resolve.sync(packageName));
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
      const buffer = fs_extra_NAMESPACE.readFileSync(packageIndexDirname, 'utf-8').toString();
      let regexp = new RegExp('./');
      const jsCode = Babel.parse(buffer, ParseSettings);
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

    function addJsExtensionIfNecessary(file) {
      if (file.includes('.js') || file.includes('.mjs')) {
        return file;
      } else {
        return file + '.js';
      }
    }

    function isJs(filename, ControlPanel) {
      if (path.basename(filename) === filename) {
        return true;
      } else if (ControlPanel.extensions.includes(path.extname(filename))) {
        return false;
      } else if (filename.includes('./') && path.extname(filename) === '') {
        return true;
      } else if (filename.includes('.js') || filename.includes('.mjs') || filename.includes('.') == false) {
        return true;
      } else if (ControlPanel.InstalledAddons.extensions.js.includes(path.extname(filename))) {
        return true;
      } else if (ControlPanel.InstalledAddons.extensions.other.includes(path.extname(filename))) {
        return false;
      } else {
        throw new VortexError(`Cannot resolve extension: "${path.extname(filename)}" If you wish to include this in your Solar System, include it in the resolvable extensions option in the vortex.panel.js`, VortexErrorType.PortalPanelError);
      }
    }

    _localExports.LocalizedResolve = LocalizedResolve;
    _localExports.resolveLibBundle = resolveLibBundle;
    _localExports.ResolveLibrary = ResolveLibrary;
    _localExports.addJsExtensionIfNecessary = addJsExtensionIfNecessary;
    _localExports.isJs = isJs;
  }),
  "./test\\vortex\\dependencies\\ModuleDependency.js": (function (_localRequire, _localExports, fs_extra_NAMESPACE, FSEXTRA, terser, path, chalk, cli_spinners_NAMESPACE, ora, os, os_NAMESPACE, fs, fs_promises_NAMESPACE, FS, babel_core_NAMESPACE, t, babel_generator_NAMESPACE, Parse5, resolve, util_NAMESPACE, e, chokidar, diff_NAMESPACE, io, Babel, css, babel_traverse_NAMESPACE, babel_template_NAMESPACE, _, uuid_NAMESPACE) {
    var __TEST_VORTEX_DEPENDENCY_JS = _localRequire("./test\\vortex\\Dependency.js"),
        Dependency = __TEST_VORTEX_DEPENDENCY_JS.default;
    /**
     * A JavaScript Dependency where modules are acquired from.
     * @abstract
     * @extends Dependency
     *
     */


    class ModuleDependency extends Dependency {
      constructor(name, initImportLocation) {
        super(name, initImportLocation);
        this.outBundle = false; //this.acquiredModules = acquiredModules
      }

    }

    _localExports.default = ModuleDependency;
  }),
  "./test\\vortex\\Options.js": (function (_localRequire, _localExports, fs_extra_NAMESPACE, FSEXTRA, terser, path, chalk, cli_spinners_NAMESPACE, ora, os, os_NAMESPACE, fs, fs_promises_NAMESPACE, FS, babel_core_NAMESPACE, t, babel_generator_NAMESPACE, Parse5, resolve, util_NAMESPACE, e, chokidar, diff_NAMESPACE, io, Babel, css, babel_traverse_NAMESPACE, babel_template_NAMESPACE, _, uuid_NAMESPACE) {
    var BabelSettings = {
      sourceType: 'module',
      presets: [['@babel/preset-env', {
        modules: false
      }], ['@babel/preset-react', {
        modules: false
      }]],
      plugins: ["@babel/plugin-transform-runtime"]
    };
    var ParseSettings = {
      sourceType: 'module',
      plugins: ['asyncGenerators', 'dynamicImport'],
      strictMode: false
    };
    _localExports.BabelSettings = BabelSettings;
    _localExports.ParseSettings = ParseSettings;
  }),
  "./test\\vortex\\dependencies\\CSSDependency.js": (function (_localRequire, _localExports, fs_extra_NAMESPACE, FSEXTRA, terser, path, chalk, cli_spinners_NAMESPACE, ora, os, os_NAMESPACE, fs, fs_promises_NAMESPACE, FS, babel_core_NAMESPACE, t, babel_generator_NAMESPACE, Parse5, resolve, util_NAMESPACE, e, chokidar, diff_NAMESPACE, io, Babel, css, babel_traverse_NAMESPACE, babel_template_NAMESPACE, _, uuid_NAMESPACE) {
    var __TEST_VORTEX_DEPENDENCY_JS = _localRequire("./test\\vortex\\Dependency.js"),
        Dependency = __TEST_VORTEX_DEPENDENCY_JS.default;
    /**
     * A Stylesheet Dependency
     * @extends Dependency
     */


    class CSSDependency extends Dependency {
      constructor(name, initImportLocation, stylesheet) {
        super(name, initImportLocation);
        this.dependencies = [];
        this.stylesheet = stylesheet;
      }

    }

    _localExports.CSSDependency = CSSDependency;
  }),
  "./test\\vortex\\graphers\\CSSGrapher.js": (function (_localRequire, _localExports, fs_extra_NAMESPACE, FSEXTRA, terser, path, chalk, cli_spinners_NAMESPACE, ora, os, os_NAMESPACE, fs, fs_promises_NAMESPACE, FS, babel_core_NAMESPACE, t, babel_generator_NAMESPACE, Parse5, resolve, util_NAMESPACE, e, chokidar, diff_NAMESPACE, io, Babel, css, babel_traverse_NAMESPACE, babel_template_NAMESPACE, _, uuid_NAMESPACE) {
    var __TEST_VORTEX_IMPORTLOCATIONS_FILEIMPORTLOCATION_JS = _localRequire("./test\\vortex\\importlocations\\FileImportLocation.js"),
        FileImportLocation = __TEST_VORTEX_IMPORTLOCATIONS_FILEIMPORTLOCATION_JS.FileImportLocation;

    var __TEST_VORTEX_DEPENDENCYFACTORY_JS = _localRequire("./test\\vortex\\DependencyFactory.js"),
        resolveDependencyType = __TEST_VORTEX_DEPENDENCYFACTORY_JS.resolveDependencyType;

    function SearchAndGraph(ast, Dep) {
      for (let rule of ast.stylesheet.rules) {
        //Font Dependencies
        if (rule.type === 'font-face') {
          for (let dec of rule.declarations) {
            if (dec.property === 'src') {
              let depname = parseDependencyFromValue(dec.value);
              let impLoc = new FileImportLocation(Dep.name, null, depname, null);
              Dep.dependencies.push(resolveDependencyType(depname, impLoc, Dep.name));
            }
          }
        }
      }
    }

    function parseDependencyFromValue(value) {
      let depName;

      if (value.includes('url')) {
        depName = value.slice(5);
        depName = depName.slice(0, depName.indexOf(')') - 1);
      }

      return depName;
    }

    _localExports.SearchAndGraph = SearchAndGraph;
  }),
  "./test\\vortex\\graphers\\PlanetGrapher.js": (function (_localRequire, _localExports, fs_extra_NAMESPACE, FSEXTRA, terser, path, chalk, cli_spinners_NAMESPACE, ora, os, os_NAMESPACE, fs, fs_promises_NAMESPACE, FS, babel_core_NAMESPACE, t, babel_generator_NAMESPACE, Parse5, resolve, util_NAMESPACE, e, chokidar, diff_NAMESPACE, io, Babel, css, babel_traverse_NAMESPACE, babel_template_NAMESPACE, _, uuid_NAMESPACE) {
    var __TEST_VORTEX_PLANET_JS = _localRequire("./test\\vortex\\Planet.js"),
        Planet = __TEST_VORTEX_PLANET_JS.Planet,
        PlanetClusterMapObject = __TEST_VORTEX_PLANET_JS.PlanetClusterMapObject,
        PlanetImportLocation = __TEST_VORTEX_PLANET_JS.PlanetImportLocation;

    var __TEST_VORTEX_RESOLVE_JS = _localRequire("./test\\vortex\\Resolve.js"),
        LocalizedResolve = __TEST_VORTEX_RESOLVE_JS.LocalizedResolve,
        resolveLibBundle = __TEST_VORTEX_RESOLVE_JS.resolveLibBundle;

    function namePlanet(Graph) {
      return `planet_${Graph.Planets.length}.js`;
    }
    /**Searchs code of provided entry and Graphs Planets from ES Dynamic Imports and AMD Define Imports.
     *
     * @param {QueueEntry} entry
     * @param {VortexGraph} Graph
     */


    function SearchAndGraph(entry, Graph, ControlPanel) {
      babel_traverse_NAMESPACE.default(entry.ast, {
        CallExpression: function (path) {
          //Dynamic Import Grapher
          if (path.node.callee.type === "Import") {
            let name = path.node.arguments[0].value;
            let isLib;
            let ent;

            if (name.includes('./')) {
              ent = LocalizedResolve(entry.name, name);
              isLib = false;
            } else {
              ent = resolveLibBundle(name, ControlPanel);
              isLib = true;
            }

            if (Graph.planetExists(ent)) {
              Graph.Planets[Graph.indexOfPlanet(ent)].importedAt.push(new PlanetImportLocation(entry.name, false));
            } else {
              let planet = new Planet(namePlanet(Graph), ent);
              planet.originalName = path.node.arguments[0].value;
              planet.entryModuleIsLibrary = isLib;
              Graph.Planets.push(planet);
              Graph.Planets[Graph.indexOfPlanet(ent)].importedAt.push(new PlanetImportLocation(entry.name, false));
            }
          } // AMD Define Grapher
          else if (path.node.callee.type === "Identifier" && path.node.callee.name === 'define' && path.node.arguments[0].type === 'ArrayExpression') {
              let originalNames = [];
              let newNames = [];

              if (path.node.arguments[0].type === 'ArrayExpression') {
                for (let imprt of path.node.arguments[0].elements) {
                  //imprt is a String Literal in this case!
                  let name = imprt.value;
                  let isLib;
                  let ent;

                  if (name.includes('./')) {
                    ent = LocalizedResolve(entry.name, name);
                    isLib = false;
                  } else {
                    ent = resolveLibBundle(name, ControlPanel);
                    isLib = true;
                  }

                  if (Graph.planetExists(ent)) {
                    Graph.Planets[Graph.indexOfPlanet(ent)].importedAt.push(new PlanetImportLocation(entry.name, true));
                  } else {
                    let planet = new Planet(namePlanet(Graph), ent);
                    planet.originalName = imprt.value;
                    originalNames.push(planet.originalName);
                    newNames.push(planet.name);
                    planet.entryModuleIsLibrary = isLib;
                    Graph.Planets.push(planet);
                    Graph.Planets[Graph.indexOfPlanet(ent)].importedAt.push(new PlanetImportLocation(entry.name, true));
                  }
                }
              }

              let PlanetClusterMapObj = new PlanetClusterMapObject();
              PlanetClusterMapObj.importedAt.push(entry.name);
              PlanetClusterMapObj.planetsByOriginalName = originalNames;
              PlanetClusterMapObj.planetsByNewName = newNames;
              Graph.PlanetClusterMap.push(PlanetClusterMapObj);
            }
        }
      });
    }

    _localExports.SearchAndGraph = SearchAndGraph;
  }),
  "./test\\vortex\\dependencies\\EsModuleDependency.js": (function (_localRequire, _localExports, fs_extra_NAMESPACE, FSEXTRA, terser, path, chalk, cli_spinners_NAMESPACE, ora, os, os_NAMESPACE, fs, fs_promises_NAMESPACE, FS, babel_core_NAMESPACE, t, babel_generator_NAMESPACE, Parse5, resolve, util_NAMESPACE, e, chokidar, diff_NAMESPACE, io, Babel, css, babel_traverse_NAMESPACE, babel_template_NAMESPACE, _, uuid_NAMESPACE) {
    var __TEST_VORTEX_MODULE_JS = _localRequire("./test\\vortex\\Module.js"),
        Module = __TEST_VORTEX_MODULE_JS.default;

    var __TEST_VORTEX_DEPENDENCIES_MODULEDEPENDENCY_JS = _localRequire("./test\\vortex\\dependencies\\ModuleDependency.js"),
        ModuleDependency = __TEST_VORTEX_DEPENDENCIES_MODULEDEPENDENCY_JS.default;

    var __TEST_VORTEX_IMPORTLOCATIONS_MDIMPORTLOCATION_JS = _localRequire("./test\\vortex\\importlocations\\MDImportLocation.js"),
        MDImportLocation = __TEST_VORTEX_IMPORTLOCATIONS_MDIMPORTLOCATION_JS.default;

    var __TEST_VORTEX_DEPENDENCIES_NAMESPACESEARCH_JS = _localRequire("./test\\vortex\\dependencies\\NamespaceSearch.js"),
        findModulesUnderNamespace = __TEST_VORTEX_DEPENDENCIES_NAMESPACESEARCH_JS.findModulesUnderNamespace,
        searchForModuleUnderNamespace = __TEST_VORTEX_DEPENDENCIES_NAMESPACESEARCH_JS.searchForModuleUnderNamespace;

    var __TEST_VORTEX_VORTEXERROR_JS = _localRequire("./test\\vortex\\VortexError.js"),
        VortexError = __TEST_VORTEX_VORTEXERROR_JS.VortexError,
        VortexErrorType = __TEST_VORTEX_VORTEXERROR_JS.VortexErrorType;
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
            modBuffer.push(new Module(modid, "EsDefaultModule"));

            if (path.node.declaration.type === 'ClassDeclaration') {
              let mod = path.node.declaration.id.name;
              modBuffer.push(new Module(mod, "EsDefaultModule"));
            }

            if (path.node.declaration.type === 'FunctionDeclaration') {
              let mod = path.node.declaration.id.name;
              modBuffer.push(new Module(mod, "EsDefaultModule"));
            }
          },
          ExportNamedDeclaration: function (path) {
            if (path.node.declaration.type === 'VariableDeclaration') {
              let mod = path.node.declaration.declarations[0].id.name;
              modBuffer.push(new Module(mod, "EsModule"));
            } else if (path.node.declaration.type === 'ClassDeclaration') {
              let mod = path.node.declaration.id.name;
              modBuffer.push(new Module(mod, "EsModule"));
            } else if (path.node.declaration.type === 'FunctionDeclaration') {
              let mod = path.node.declaration.id.name;
              modBuffer.push(new Module(mod, "EsModule"));
            } else {
              for (let ExportType of path.node.specifiers) {
                if (ExportType.type === 'ExportSpecifier') {
                  let mod = ExportType.exported.name;
                  modBuffer.push(new Module(mod, "EsModule"));
                }
              }

              let mod = path.node.declaration.id.name;
              modBuffer.push(new Module(mod, "EsModule"));
            }
          }
        });
        let dummyImpLoc = new MDImportLocation('buffer', 0, modBuffer, ''); //let confModImp = []
        //let confModExp = []
        //let index = this.indexOfImportLocation(file)
        //console.log(modBuffer)
        //console.log(currentImpLoc.modules)
        //console.log(confModExp,confModImp)

        let NonExtError = new VortexError('Non Existent Modules Imported from ' + entry.name, VortexErrorType.StarSyntaxError);

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

    _localExports.default = EsModuleDependency;
  }),
  "./test\\vortex\\importlocations\\MDImportLocation.js": (function (_localRequire, _localExports, fs_extra_NAMESPACE, FSEXTRA, terser, path, chalk, cli_spinners_NAMESPACE, ora, os, os_NAMESPACE, fs, fs_promises_NAMESPACE, FS, babel_core_NAMESPACE, t, babel_generator_NAMESPACE, Parse5, resolve, util_NAMESPACE, e, chokidar, diff_NAMESPACE, io, Babel, css, babel_traverse_NAMESPACE, babel_template_NAMESPACE, _, uuid_NAMESPACE) {
    var __TEST_VORTEX_IMPORTLOCATION_JS = _localRequire("./test\\vortex\\ImportLocation.js"),
        ImportLocation = __TEST_VORTEX_IMPORTLOCATION_JS.default;

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

    _localExports.default = MDImportLocation;
  }),
  "./test\\vortex\\Module.js": (function (_localRequire, _localExports, fs_extra_NAMESPACE, FSEXTRA, terser, path, chalk, cli_spinners_NAMESPACE, ora, os, os_NAMESPACE, fs, fs_promises_NAMESPACE, FS, babel_core_NAMESPACE, t, babel_generator_NAMESPACE, Parse5, resolve, util_NAMESPACE, e, chokidar, diff_NAMESPACE, io, Babel, css, babel_traverse_NAMESPACE, babel_template_NAMESPACE, _, uuid_NAMESPACE) {
    class Module {
      /**
       *
       * @param {string} name Name of Module
       * @param {ModuleTypes} type Type of Module
       */
      constructor(name, type) {
        this.name = name;
        let TYPE = type;
        this.type = ModuleTypes[TYPE];
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

      ModuleTypes[ModuleTypes["CjsModule"] = 3] = "CjsModule";
      /**
       * Defualt CommonJs Module
       */

      ModuleTypes[ModuleTypes["CjsDefaultModule"] = 4] = "CjsDefaultModule";
      /**
       * Default CommonJS Module Executed on Call.
       * __(module.exports = () => {--MODULE CODE HERE--})__
       */

      ModuleTypes[ModuleTypes["CjsDefaultFunction"] = 5] = "CjsDefaultFunction";
      /**
       * CommonJS Namespace __(const -- = require(--))__
       */

      ModuleTypes[ModuleTypes["CjsNamespaceProvider"] = 6] = "CjsNamespaceProvider";
      ModuleTypes[ModuleTypes["CjsInteropRequire"] = 7] = "CjsInteropRequire";
      ModuleTypes[ModuleTypes["EsDefaultNamespaceProvider"] = 8] = "EsDefaultNamespaceProvider";
      ModuleTypes[ModuleTypes["CJSAsset"] = 9] = "CJSAsset";
      ModuleTypes[ModuleTypes["CJSLoad"] = 10] = "CJSLoad";
    })(ModuleTypes || (ModuleTypes = {}));

    _localExports.default = Module;
    _localExports.ModuleTypes = ModuleTypes;
  }),
  "./test\\vortex\\dependencies\\CjsModuleDependency.js": (function (_localRequire, _localExports, fs_extra_NAMESPACE, FSEXTRA, terser, path, chalk, cli_spinners_NAMESPACE, ora, os, os_NAMESPACE, fs, fs_promises_NAMESPACE, FS, babel_core_NAMESPACE, t, babel_generator_NAMESPACE, Parse5, resolve, util_NAMESPACE, e, chokidar, diff_NAMESPACE, io, Babel, css, babel_traverse_NAMESPACE, babel_template_NAMESPACE, _, uuid_NAMESPACE) {
    var __TEST_VORTEX_DEPENDENCIES_MODULEDEPENDENCY_JS = _localRequire("./test\\vortex\\dependencies\\ModuleDependency.js"),
        ModuleDependency = __TEST_VORTEX_DEPENDENCIES_MODULEDEPENDENCY_JS.default;

    var __TEST_VORTEX_MODULE_JS = _localRequire("./test\\vortex\\Module.js"),
        Module = __TEST_VORTEX_MODULE_JS.default,
        ModuleTypes = __TEST_VORTEX_MODULE_JS.ModuleTypes;

    var __TEST_VORTEX_IMPORTLOCATIONS_MDIMPORTLOCATION_JS = _localRequire("./test\\vortex\\importlocations\\MDImportLocation.js"),
        MDImportLocation = __TEST_VORTEX_IMPORTLOCATIONS_MDIMPORTLOCATION_JS.default;

    //import Dependency from "../Dependency.js";
    var __TEST_VORTEX_DEPENDENCIES_NAMESPACESEARCH_JS = _localRequire("./test\\vortex\\dependencies\\NamespaceSearch.js"),
        findModulesUnderNamespace = __TEST_VORTEX_DEPENDENCIES_NAMESPACESEARCH_JS.findModulesUnderNamespace,
        searchForModuleUnderNamespace = __TEST_VORTEX_DEPENDENCIES_NAMESPACESEARCH_JS.searchForModuleUnderNamespace;

    var __TEST_VORTEX_VORTEXERROR_JS = _localRequire("./test\\vortex\\VortexError.js"),
        VortexError = __TEST_VORTEX_VORTEXERROR_JS.VortexError,
        VortexErrorType = __TEST_VORTEX_VORTEXERROR_JS.VortexErrorType;
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
        let dummyImpLoc = new MDImportLocation('buffer', 0, modBuffer, ''); // let confModImp = []
        // let confModExp = []
        //let index = this.indexOfImportLocation(file)
        // console.log(confModExp,confModImp)
        // console.log(this.acquiredModules)
        // console.log(modBuffer)
        //console.log(currentImpLoc)

        let NonExtError = new VortexError('Non Existant Modules Imported from ' + entry.name, VortexErrorType.StarSyntaxError);

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

    _localExports.default = CjsModuleDependency;
  }),
  "./test\\vortex\\VortexError.js": (function (_localRequire, _localExports, fs_extra_NAMESPACE, FSEXTRA, terser, path, chalk, cli_spinners_NAMESPACE, ora, os, os_NAMESPACE, fs, fs_promises_NAMESPACE, FS, babel_core_NAMESPACE, t, babel_generator_NAMESPACE, Parse5, resolve, util_NAMESPACE, e, chokidar, diff_NAMESPACE, io, Babel, css, babel_traverse_NAMESPACE, babel_template_NAMESPACE, _, uuid_NAMESPACE) {
    class VortexError extends Error {
      constructor(error_message, type) {
        super(chalk.redBright(`${type} NOVA ${error_message}`));
      }

    }

    var VortexErrorType;

    (function (VortexErrorType) {
      VortexErrorType[VortexErrorType["PortalPanelError"] = 1] = "PortalPanelError";
      VortexErrorType[VortexErrorType["StarSyntaxError"] = 2] = "StarSyntaxError";
    })(VortexErrorType || (VortexErrorType = {}));

    _localExports.VortexError = VortexError;
    _localExports.VortexErrorType = VortexErrorType;
  }),
  "./test\\vortex\\dependencies\\FileDependency.js": (function (_localRequire, _localExports, fs_extra_NAMESPACE, FSEXTRA, terser, path, chalk, cli_spinners_NAMESPACE, ora, os, os_NAMESPACE, fs, fs_promises_NAMESPACE, FS, babel_core_NAMESPACE, t, babel_generator_NAMESPACE, Parse5, resolve, util_NAMESPACE, e, chokidar, diff_NAMESPACE, io, Babel, css, babel_traverse_NAMESPACE, babel_template_NAMESPACE, _, uuid_NAMESPACE) {
    var __TEST_VORTEX_DEPENDENCY_JS = _localRequire("./test\\vortex\\Dependency.js"),
        Dependency = __TEST_VORTEX_DEPENDENCY_JS.default;

    /**A Non JS Dependency
     * @extends Dependency
     */
    class FileDependency extends Dependency {
      constructor(name, initImportLocation) {
        super(name, initImportLocation);
        this.uuid = uuid.v4();
      }

    }

    _localExports.FileDependency = FileDependency;
  }),
  "./test\\vortex\\Transport.js": (function (_localRequire, _localExports, fs_extra_NAMESPACE, FSEXTRA, terser, path, chalk, cli_spinners_NAMESPACE, ora, os, os_NAMESPACE, fs, fs_promises_NAMESPACE, FS, babel_core_NAMESPACE, t, babel_generator_NAMESPACE, Parse5, resolve, util_NAMESPACE, e, chokidar, diff_NAMESPACE, io, Babel, css, babel_traverse_NAMESPACE, babel_template_NAMESPACE, _, uuid_NAMESPACE) {
    var __TEST_VORTEX_RESOLVE_JS = _localRequire("./test\\vortex\\Resolve.js"),
        LocalizedResolve = __TEST_VORTEX_RESOLVE_JS.LocalizedResolve,
        addJsExtensionIfNecessary = __TEST_VORTEX_RESOLVE_JS.addJsExtensionIfNecessary,
        resolveLibBundle = __TEST_VORTEX_RESOLVE_JS.resolveLibBundle;

    var __TEST_VORTEX_DEPENDENCIES_MODULEDEPENDENCY_JS = _localRequire("./test\\vortex\\dependencies\\ModuleDependency.js"),
        ModuleDependency = __TEST_VORTEX_DEPENDENCIES_MODULEDEPENDENCY_JS.default;

    var __TEST_VORTEX_DEPENDENCIES_ESMODULEDEPENDENCY_JS = _localRequire("./test\\vortex\\dependencies\\EsModuleDependency.js"),
        EsModuleDependency = __TEST_VORTEX_DEPENDENCIES_ESMODULEDEPENDENCY_JS.default;

    var __TEST_VORTEX_DEPENDENCIES_CJSMODULEDEPENDENCY_JS = _localRequire("./test\\vortex\\dependencies\\CjsModuleDependency.js"),
        CjsModuleDependency = __TEST_VORTEX_DEPENDENCIES_CJSMODULEDEPENDENCY_JS.default;

    var __TEST_VORTEX_OPTIONS_JS = _localRequire("./test\\vortex\\Options.js"),
        BabelSettings = __TEST_VORTEX_OPTIONS_JS.BabelSettings;

    var __TEST_VORTEX_MODULE_JS = _localRequire("./test\\vortex\\Module.js"),
        ModuleTypes = __TEST_VORTEX_MODULE_JS.ModuleTypes;

    var __TEST_VORTEX_DEPENDENCIES_NAMESPACESEARCH_JS = _localRequire("./test\\vortex\\dependencies\\NamespaceSearch.js"),
        searchForDefaultNamespace = __TEST_VORTEX_DEPENDENCIES_NAMESPACESEARCH_JS.searchForDefaultNamespace; //import MDImportLocation from "./MDImportLocation.js";

    /**Transports the given dependency to given Graph.
     *
     * @param {Dependency} Dependency Dependency to Transport
     * @param {VortexGraph} Graph Graph to Use
     * @param {string} CurrentFile Current file being loading from.
     * @param {MDImportLocation} CurrentMDImpLoc Curret Module Dependency Import Location
     */


    function Transport(Dependency, Graph, CurrentFile, CurrentMDImpLoc, planetName, ControlPanel, ASTQueue) {
      verifyModules(Dependency, CurrentFile, CurrentMDImpLoc, ControlPanel, ASTQueue); //If transporting to Star 

      if (planetName === undefined) {
        if (Graph.searchFor(Dependency)) {
          Graph.update(Dependency);
        } else {
          Graph.add(Dependency);
        } //Else transport to planet if currently graphing for one.

      } else {
        if (Graph.searchForOnPlanet(Dependency, planetName)) {
          Graph.updateOnPlanet(Dependency, planetName);
        } else {
          Graph.addToPlanet(Dependency, planetName);
        }
      }

      return;
    }

    function verifyModules(Dependency, CurrentFile, CurrentMDImpLoc, ControlPanel, ASTQueue) {
      let str = './';

      if (Dependency instanceof ModuleDependency) {
        if (Dependency.outBundle !== true) {
          if (Dependency.name.includes(str)) {
            Dependency.updateName(LocalizedResolve(CurrentFile, addJsExtensionIfNecessary(Dependency.name)));

            if (Dependency instanceof EsModuleDependency || Dependency instanceof CjsModuleDependency) {
              if (ASTQueue.isInQueue(Dependency.name)) {
                if (CurrentMDImpLoc.modules.length > 0) {
                  Dependency.verifyImportedModules(ASTQueue.loadEntryFromQueue(Dependency.name), CurrentMDImpLoc);
                }
              } else {
                let file = fs_extra_NAMESPACE.readFileSync(Dependency.name).toString();

                if (!ControlPanel.isLibrary) {
                  file = babel_core_NAMESPACE.transformSync(file, BabelSettings).code;
                }

                ASTQueue.addEntryToQueue(new ASTQueue.QueueEntry(Dependency.name, Babel.parse(file, {
                  "sourceType": 'module'
                })));

                if (CurrentMDImpLoc.modules.length > 0) {
                  Dependency.verifyImportedModules(ASTQueue.loadEntryFromQueue(Dependency.name), CurrentMDImpLoc);
                }
              }
            }
          } else if (!ControlPanel.isLibrary) {
            // Else Find library bundle location
            if (Dependency instanceof ModuleDependency) {
              Dependency.libLoc = resolveLibBundle(Dependency.name, ControlPanel);

              if (CurrentMDImpLoc.modules[0] !== undefined) {
                if (Dependency instanceof EsModuleDependency && CurrentMDImpLoc.modules[0].type === ModuleTypes.EsDefaultModule) {
                  if (searchForDefaultNamespace(Dependency.libLoc, CurrentMDImpLoc.modules[0].name, ControlPanel)) {
                    CurrentMDImpLoc.modules[0].type = ModuleTypes.EsDefaultNamespaceProvider; // console.log(CurrentMDImpLoc.modules[0].name)
                  }
                }
              }
            }
          }
        }
      }
    }

    _localExports.Transport = Transport;
  }),
  "./test\\vortex\\importlocations\\FileImportLocation.js": (function (_localRequire, _localExports, fs_extra_NAMESPACE, FSEXTRA, terser, path, chalk, cli_spinners_NAMESPACE, ora, os, os_NAMESPACE, fs, fs_promises_NAMESPACE, FS, babel_core_NAMESPACE, t, babel_generator_NAMESPACE, Parse5, resolve, util_NAMESPACE, e, chokidar, diff_NAMESPACE, io, Babel, css, babel_traverse_NAMESPACE, babel_template_NAMESPACE, _, uuid_NAMESPACE) {
    var __TEST_VORTEX_IMPORTLOCATION_JS = _localRequire("./test\\vortex\\ImportLocation.js"),
        ImportLocation = __TEST_VORTEX_IMPORTLOCATION_JS.default;

    class FileImportLocation extends ImportLocation {
      constructor(name, line, relativePathToDep, localName) {
        super(name, line);
        this.relativePathToDep = relativePathToDep;
        this.localName = localName;
      }

    }

    _localExports.FileImportLocation = FileImportLocation;
  }),
  "./test\\vortex\\QuarkTable.js": (function (_localRequire, _localExports, fs_extra_NAMESPACE, FSEXTRA, terser, path, chalk, cli_spinners_NAMESPACE, ora, os, os_NAMESPACE, fs, fs_promises_NAMESPACE, FS, babel_core_NAMESPACE, t, babel_generator_NAMESPACE, Parse5, resolve, util_NAMESPACE, e, chokidar, diff_NAMESPACE, io, Babel, css, babel_traverse_NAMESPACE, babel_template_NAMESPACE, _, uuid_NAMESPACE) {
    class QuarkLibTable {
      constructor() {
        this.QuarkLibs = [];
      }

      addEntry(entry) {
        this.QuarkLibs.push(entry);
        return this;
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
    DefaultQuarkTable.addEntry(new QuarkLibEntry('aws-sdk', ['./node_modules/aws-sdk/dist/aws-sdk.min.js', './node_modules/aws-sdk/dist/aws-sdk.js']));
    _localExports.QuarkLibTable = QuarkLibTable;
    _localExports.QuarkLibEntry = QuarkLibEntry;
    _localExports.DefaultQuarkTable = DefaultQuarkTable;
  }),
  "./test\\vortex\\dependencies\\NamespaceSearch.js": (function (_localRequire, _localExports, fs_extra_NAMESPACE, FSEXTRA, terser, path, chalk, cli_spinners_NAMESPACE, ora, os, os_NAMESPACE, fs, fs_promises_NAMESPACE, FS, babel_core_NAMESPACE, t, babel_generator_NAMESPACE, Parse5, resolve, util_NAMESPACE, e, chokidar, diff_NAMESPACE, io, Babel, css, babel_traverse_NAMESPACE, babel_template_NAMESPACE, _, uuid_NAMESPACE) {
    var __TEST_VORTEX_OPTIONS_JS = _localRequire("./test\\vortex\\Options.js"),
        ParseSettings = __TEST_VORTEX_OPTIONS_JS.ParseSettings;

    function findModulesUnderNamespace(file, Namespace) {
      const buffer = fs.readFileSync(file, 'utf-8').toString();
      const jsCode = Babel.parse(buffer, ParseSettings);
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
      const jsCode = Babel.parse(buffer, ParseSettings);
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

    function searchForDefaultNamespace(file, Namespace, ControlPanel) {
      const buffer = fs.readFileSync(file).toString();
      const jsCode = Babel.parse(buffer, ParseSettings);
      let rc = false;
      babel_traverse_NAMESPACE.default(jsCode, {
        MemberExpression: function (path) {
          if (path.node.object.type === "Identifier" && path.node.object.name === 'module' && path.node.property.name === 'exports' && path.parent.type === 'AssignmentExpression' && path.parent.right.type === 'Identifier' && path.parent.right.name === Namespace) {
            rc = true;
          } else if (path.node.object.type === "Identifier" && path.node.object.name === 'module' && path.node.property.name === 'exports' && path.parent.type === 'AssignmentExpression' && path.parent.right.type === 'CallExpression' && path.parent.right.callee.type === 'Identifier' && path.parent.right.callee.name === 'factory') {
            rc = true;
          } else if (ControlPanel.isProduction) {
            if (path.node.object.type === "Identifier" && path.node.object.name === 'module' && path.node.property.name === 'exports' && path.parent.type === 'AssignmentExpression') {
              rc = true;
            }
          }
        }
      });
      return rc;
    }

    _localExports.findModulesUnderNamespace = findModulesUnderNamespace;
    _localExports.searchForModuleUnderNamespace = searchForModuleUnderNamespace;
    _localExports.searchForDefaultNamespace = searchForDefaultNamespace;
  }),
  "./test\\vortex\\ImportLocation.js": (function (_localRequire, _localExports, fs_extra_NAMESPACE, FSEXTRA, terser, path, chalk, cli_spinners_NAMESPACE, ora, os, os_NAMESPACE, fs, fs_promises_NAMESPACE, FS, babel_core_NAMESPACE, t, babel_generator_NAMESPACE, Parse5, resolve, util_NAMESPACE, e, chokidar, diff_NAMESPACE, io, Babel, css, babel_traverse_NAMESPACE, babel_template_NAMESPACE, _, uuid_NAMESPACE) {
    class ImportLocation {
      constructor(name, line) {
        this.name = name;
        this.line = line;
      }

    }

    _localExports.default = ImportLocation;
  })
})