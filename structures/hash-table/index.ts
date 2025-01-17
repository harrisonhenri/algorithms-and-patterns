/**
 * Basic hash table.
 * @date 14/12/2025 - 00:00:00
 *
 */
class HashTable {
  private readonly size: number;
  private keys: (number | null)[];
  private values: (string | null)[];
  private limit: number;

  constructor(size: number) {
    this.size = size;
    this.keys = this.initArray(size);
    this.values = this.initArray(size);
    this.limit = 0;
  }

  put(key: number, value: string): void {
    if (this.limit >= this.size) {
      throw new Error("Hash table is full");
    }

    let hashedIndex = this.hash(key);

    while (this.keys[hashedIndex] !== null) {
      hashedIndex = (hashedIndex + 1) % this.size;
    }

    this.keys[hashedIndex] = key;
    this.values[hashedIndex] = value;
    this.limit++;
  }

  get(key: number): string | null {
    let hashedIndex = this.hash(key);

    while (this.keys[hashedIndex] !== key) {
      hashedIndex = (hashedIndex + 1) % this.size;
    }

    return this.values[hashedIndex];
  }

  private hash(key: number): number {
    if (!Number.isInteger(key)) {
      throw new Error("Key must be an integer");
    }

    return key % this.size;
  }

  private initArray<U>(size: number): (U | null)[] {
    return Array(size).fill(null);
  }
}

const hashTable = new HashTable(13);
hashTable.put(7, "hi");
hashTable.put(20, "hello");
hashTable.put(33, "sunny");
hashTable.put(46, "weather");
hashTable.put(59, "wow");
hashTable.put(72, "forty");
hashTable.put(85, "happy");
hashTable.put(98, "sad");

console.log(hashTable);
