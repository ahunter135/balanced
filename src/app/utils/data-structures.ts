

/* Class that represents a map with object keys, but
 * uses the underlying JSON string as the key. This
 * avoids the problem of reference equality when using
 * objects as keys.
 */
export class ObjValueMap<K, V>  {
  private map: Map<string, V>;
  constructor() {
    this.map = new Map<string, V>();
  }

  get(key: K): V | undefined {
    return this.map.get(this.transformKey(key));
  }

  set(key: K, value: V): void {
    this.map.set(this.transformKey(key), value);
  }

  has(key: K): boolean {
    return this.map.has(this.transformKey(key));
  }

  delete(key: K): boolean {
    return this.map.delete(this.transformKey(key));
  }

  private transformKey(key: K): string {
    return JSON.stringify(key);
  }
}
