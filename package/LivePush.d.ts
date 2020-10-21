/// <reference types="node" />
import * as e from 'express';
import * as io from 'socket.io';
declare class LivePushRTEventSystem {
    private ioserver;
    constructor(io: io.Server);
    emitEvent(eventID: string, ...args: []): void;
    on(eventID: string, listener: (socket: io.Socket) => void): void;
}
/**
 *
 * The Vortex Live Updater!
 *
 */
export declare class LivePush {
    events: LivePushRTEventSystem;
    /**
     *
     * @param {string} dirToControlPanel Resolved Dir to Vortex Control Panel
     * @param {Express} expressRouter Server router
     * @param {io.Server} server Node.js Server object (Used for binding socket.io)
     * @param {number} portNum Port num for given node.js server to listen on.
     * @param {boolean} preLoadHTMLPage Option to load from already prepared HTML page.
     */
    constructor(dirToControlPanel: string, expressRouter: e.Express, server: Server, portNum: number, preLoadHTMLPage: boolean);
    /**
     * Intializes live interpreter.
     * @param {string} dirToHTML
     * @param {string} dirToEntry
     * @param {Express} router
     */
    run(dirToHTML: string, dirToEntry: string, router: e.Express): void;
}
export {};
