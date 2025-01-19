"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductNamesCache = void 0;
const prod_1 = require("./prod");
class ProductNamesCache {
    constructor() {
        this.expirationSeconds = 15;
        this.lastLoad = 0;
        this.lastNameStart = "";
    }
    static getInstance() {
        if (!this._instance) {
            this._instance = new ProductNamesCache();
        }
        return this._instance;
    }
    async getItems(nameStart) {
        const cacheExpiresOn = this.lastLoad + this.expirationSeconds;
        if (!this.lastLoad ||
            new Date().getTime() > cacheExpiresOn ||
            !nameStart.startsWith(this.lastNameStart)) {
            // Using only the first char to avoid errors on new server instances
            this.lastNameStart = nameStart.substring(0, 1);
            this.items = await (0, prod_1.queryProdNamesByName)(this.lastNameStart);
            // Insert 10000 fake recors to this.items
            // for (let i = 1; i <= 10000; i++) {
            //   this.items.push({
            //     prod_id: "I" + i,
            //     name: i + "FAKE ITEM",
            //   });
            // }
            this.lastLoad = new Date().getTime();
            console.log(`Approximate memory usage by cache: ${(JSON.stringify(this.items).length / 1024).toFixed(2)} Kb`);
            return this.items;
        }
        const result = this.items.filter((item) => item.name.startsWith(nameStart));
        console.log(`Products by name from cache with ${this.items.length} items (${nameStart}):`, result);
        return result;
    }
}
exports.ProductNamesCache = ProductNamesCache;
