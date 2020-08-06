import * as chalk from 'chalk'

export class VortexError{

    message:string

    constructor(error_message:string,type:VortexErrorType){
        this.message = chalk.redBright(`${VortexErrorType[type]} NOVA ${error_message}`);
    }

    printOut():string{
        return this.message
    }
}

export enum VortexErrorType {
    PortalPanelError = 1,
    StarSyntaxError = 2,
    StarSelfImposedError = 3
}