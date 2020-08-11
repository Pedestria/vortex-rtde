
import {LivePush} from './ts/live/LivePush'
import VortexRTDEAPI from './API_AND_Types'
declare namespace VortexRTDE {

    /**Creates a star Package
 * 
 * @param {string} resolvedPath A resolved Path to the vortex panel config!
 */
  export function createStarPackage(resolvedPath:string):Promise<void>
  

  export {LivePush, VortexRTDEAPI}

}

export = VortexRTDE
