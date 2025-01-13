"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductNamesCache = void 0;
const prod_1 = require("./prod");
class ProductNamesCache {
    constructor() {
        this.expirationSeconds = 15;
        this.lastLoad = 0;
    }
    static getInstance() {
        if (!this._instance) {
            this._instance = new ProductNamesCache();
        }
        return this._instance;
    }
    async getItems(nameStart) {
        const cacheExpiresOn = this.lastLoad + this.expirationSeconds;
        if (!this.lastLoad || new Date().getTime() > cacheExpiresOn) {
            this.items = await (0, prod_1.queryProdNamesByName)(nameStart);
            this.lastLoad = new Date().getTime();
        }
        return this.items.filter((item) => item.name.startsWith(nameStart));
    }
}
exports.ProductNamesCache = ProductNamesCache;
