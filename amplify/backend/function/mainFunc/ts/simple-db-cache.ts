import { queryProdNamesByName } from "./prod";

export class ProductNamesCache {
  private static _instance: ProductNamesCache;
  private items: { prod_id: string; name: string }[];
  private expirationSeconds = 15;
  private lastLoad = 0;
  private lastNameStart = "";
  constructor() {}
  public static getInstance() {
    if (!this._instance) {
      this._instance = new ProductNamesCache();
    }
    return this._instance;
  }
  public async getItems(nameStart: string) {
    const cacheExpiresOn = this.lastLoad + this.expirationSeconds;
    if (
      !this.lastLoad ||
      new Date().getTime() > cacheExpiresOn ||
      !nameStart.startsWith(this.lastNameStart)
    ) {
      // Using only the first char to avoid errors on new server instances
      this.lastNameStart = nameStart.substring(0, 1);
      this.items = await queryProdNamesByName(this.lastNameStart);

      // Insert 10000 fake recors to this.items
      // for (let i = 1; i <= 10000; i++) {
      //   this.items.push({
      //     prod_id: "I" + i,
      //     name: i + "FAKE ITEM",
      //   });
      // }

      this.lastLoad = new Date().getTime();
      console.log(
        `Approximate memory usage by cache: ${(
          JSON.stringify(this.items).length / 1024
        ).toFixed(2)} Kb`
      );
      return this.items;
    }
    const result = this.items.filter((item) => item.name.startsWith(nameStart));
    console.log(
      `Products by name from cache with ${this.items.length} items (${nameStart}):`,
      result
    );
    return result;
  }
}
