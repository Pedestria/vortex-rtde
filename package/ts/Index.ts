// import VortexRTDEAPI from './API'
import {createStarPackage} from './Main'
import {LivePush}  from './live/LivePush'
import {Command} from 'commander'
import {VortexRTDEAPI} from './API'

if(/vortex\.(?:min\.)?js$/g.test(require.main.filename)){

    const program = new Command();
    program
        .option("-c, --config <configLocation>","Vortex Panel Config location")
        .on("--help", () => {
            console.log(program.opts());
        })
        .option('-i, --input <input>',"Entry point for App")
        .option('-o, --output-file <output>',"Output Location for bundle!")
        .option("-n, --neutronstar","Vortex will bundle for production mode!")
        .option("-m, --mode <modeType>","Webapp or library mode!","app")
        .parse(process.argv);

    if(!program.config){

        let programMode:"app"|"library" = program.mode === "app"? "app" : program.mode === "library"? "library" : undefined;
        let isProduction = program.neutronstar? true : false
        let input = program.input
        let output = program.outputFile

        createStarPackage(undefined,{
            output:output,
            start:input,
            type:programMode,
            bundleMode:isProduction? "neutronstar": "star"
        }).then(() => {
            process.exit(0);
        })

    } else {
        createStarPackage(program.config).then(() => {
            process.exit(0);
        });
    }

}

export {createStarPackage,LivePush,VortexRTDEAPI}/*vortexExpose*/