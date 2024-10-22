"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = handler;
async function handler(event) {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    return { result: 'OK - Typescript' };
}
