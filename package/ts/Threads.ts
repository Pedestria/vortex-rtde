import { VortexGraph } from "./Graph";
import {Worker} from 'worker_threads'
import * as path from 'path'

// export async function TestThread(Graph:VortexGraph){
//     return new Promise( (resolve,reject) => {
//         const thread = new Worker(path.resolve(__dirname,'./test/Barricade.js'),{workerData:Graph})
//         thread.on('message', resolve)
//         thread.on('error',reject)
//         thread.on('exit', (err) => {
//             if(err !== 0){
//                 reject(new Error(`Thread closed with this code:`+err))
//             }
//         })
//     })
// } 

