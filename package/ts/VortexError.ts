import chalk from 'chalk'

export class VortexError extends Error{
    constructor(error_message:string,type:VortexErrorType) {
        super(chalk.redBright(`${type.toString()} NOVA ${error_message}`));
    }
}

export enum VortexErrorType {
    PortalPanelError = 1,
    StarSyntaxError = 2
}