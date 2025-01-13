import { queryProdNamesByName } from "./prod";

export class ProductNamesCache {
  private static _instance: ProductNamesCache;
  private items: { prod_id: string; name: string }[];
  private expirationSeconds = 15;
  private lastLoad: number = 0;
  constructor() {}
  public static getInstance() {
    if (!this._instance) {
      this._instance = new ProductNamesCache();
    }
    return this._instance;
  }
  public async getItems(nameStart: string) {
    const cacheExpiresOn = this.lastLoad + this.expirationSeconds;
    if (!this.lastLoad || new Date().getTime() > cacheExpiresOn) {
      this.items = await queryProdNamesByName(nameStart);
      this.lastLoad = new Date().getTime();
    }
    return this.items.filter((item) => item.name.startsWith(nameStart));
  }
}
