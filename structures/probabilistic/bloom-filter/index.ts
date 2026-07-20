/**
 * Bloom Filter - Probabilistic data structure for set membership testing.
 *
 * A Bloom Filter answers:
 * - "Definitely not in the set"
 * - "Possibly in the set"
 *
 * False positives are possible.
 * False negatives are not possible.
 *
 * **Time Complexity:**
 * - add(): O(k)
 * - mightContain(): O(k)
 *
 * Where:
 * - k = number of hash functions
 *
 * **Space Complexity:**
 * - O(m)
 *
 * Where:
 * - m = number of bits in the filter
 *
 * **Key Characteristics:**
 * - Extremely memory efficient
 * - Fast membership checks
 * - Probabilistic answers
 * - No deletions in the classic implementation
 * - Excellent for very large datasets
 *
 * **Common Use Cases:**
 * - Web crawler URL deduplication
 * - Database negative lookups
 * - Malicious URL detection
 * - CDN cache filtering
 * - Distributed systems synchronization
 * - Preventing duplicate processing in streams
 *
 * **False Positive Probability:**
 * p ≈ (1 - e^(-kn/m))^k
 *
 * Where:
 * - n = number of inserted elements
 * - m = bit array size
 * - k = number of hash functions
 *
 * **Optimal Configuration:**
 * m = -(n * ln(p)) / (ln(2)^2)
 * k = (m / n) * ln(2)
 *
 * @date 13/07/2026
 */

export interface BloomFilterOptions {
  size: number;
  hashFunctions: number;
}

/**
 * Generates a deterministic hash value for a string.
 *
 * This implementation uses a variation of djb2 hashing
 * combined with a seed to simulate multiple hash functions.
 */
function hash(value: string, seed: number): number {
  let hashValue = 5381 + seed;

  for (let i = 0; i < value.length; i++) {
    hashValue = (hashValue * 33) ^ value.charCodeAt(i);
  }

  return Math.abs(hashValue);
}

/**
 * Calculates the optimal number of bits for a Bloom Filter.
 *
 * @param expectedItems Expected number of inserted items
 * @param falsePositiveRate Desired false positive rate (e.g. 0.01 for 1%)
 * @returns Optimal bit array size
 */
export function optimalBloomFilterSize(
  expectedItems: number,
  falsePositiveRate: number,
): number {
  return Math.ceil(
    -(expectedItems * Math.log(falsePositiveRate)) / Math.pow(Math.log(2), 2),
  );
}

/**
 * Calculates the optimal number of hash functions.
 *
 * @param size Bloom filter bit array size
 * @param expectedItems Expected number of inserted items
 * @returns Optimal number of hash functions
 */
export function optimalHashCount(size: number, expectedItems: number): number {
  return Math.max(1, Math.round((size / expectedItems) * Math.log(2)));
}

/**
 * Classic Bloom Filter implementation.
 *
 * @example
 * const filter = new BloomFilter({
 *   size: 1000,
 *   hashFunctions: 4,
 * });
 *
 * filter.add("google.com");
 *
 * console.log(filter.mightContain("google.com")); // true
 * console.log(filter.mightContain("openai.com")); // false (probably)
 */
export class BloomFilter {
  private readonly size: number;
  private readonly hashFunctions: number;
  private readonly bits: Uint8Array;
  private insertedItems = 0;

  constructor(options: BloomFilterOptions) {
    this.size = options.size;
    this.hashFunctions = options.hashFunctions;
    this.bits = new Uint8Array(this.size);
  }

  /**
   * Inserts an item into the Bloom Filter.
   *
   * @param value Item to insert
   * @time O(k)
   */
  add(value: string): void {
    for (let i = 0; i < this.hashFunctions; i++) {
      const index = hash(value, i) % this.size;
      this.bits[index] = 1;
    }

    this.insertedItems++;
  }

  /**
   * Checks whether an item might exist in the set.
   *
   * Returns:
   * - false => definitely not present
   * - true => possibly present
   *
   * @param value Item to query
   * @returns Membership approximation
   * @time O(k)
   */
  mightContain(value: string): boolean {
    for (let i = 0; i < this.hashFunctions; i++) {
      const index = hash(value, i) % this.size;

      if (this.bits[index] === 0) {
        return false;
      }
    }

    return true;
  }

  /**
   * Estimates the current false positive rate.
   *
   * Formula:
   * p ≈ (1 - e^(-kn/m))^k
   */
  estimateFalsePositiveRate(): number {
    return Math.pow(
      1 - Math.exp((-this.hashFunctions * this.insertedItems) / this.size),
      this.hashFunctions,
    );
  }

  /**
   * Returns how many bits are currently set.
   */
  setBitsCount(): number {
    let count = 0;

    for (const bit of this.bits) {
      if (bit === 1) {
        count++;
      }
    }

    return count;
  }

  /**
   * Returns the filter bit array size.
   */
  getSize(): number {
    return this.size;
  }

  /**
   * Returns the number of inserted items.
   */
  getInsertedItems(): number {
    return this.insertedItems;
  }
}

// ============================================================================
// EXAMPLES
// ============================================================================

if (require.main === module) {
  console.log("=== Bloom Filter Examples ===\n");

  const expectedItems = 1000;
  const falsePositiveRate = 0.01;

  const optimalSize = optimalBloomFilterSize(expectedItems, falsePositiveRate);

  const optimalHashes = optimalHashCount(optimalSize, expectedItems);

  console.log("Optimal Bloom Filter Configuration:");
  console.log("Expected items:", expectedItems);
  console.log("Target false positive rate:", falsePositiveRate);
  console.log("Bit array size:", optimalSize);
  console.log("Hash functions:", optimalHashes);
  console.log();

  const bloomFilter = new BloomFilter({
    size: optimalSize,
    hashFunctions: optimalHashes,
  });

  bloomFilter.add("reddit.com/r/typescript");
  bloomFilter.add("google.com");
  bloomFilter.add("openai.com");
  bloomFilter.add("github.com");

  console.log("Inserted URLs:");
  console.log("- reddit.com/r/typescript");
  console.log("- google.com");
  console.log("- openai.com");
  console.log("- github.com");
  console.log();

  console.log("Contains google.com:", bloomFilter.mightContain("google.com"));

  console.log(
    "Contains wikipedia.org:",
    bloomFilter.mightContain("wikipedia.org"),
  );

  console.log(
    "Estimated false positive rate:",
    bloomFilter.estimateFalsePositiveRate(),
  );

  console.log("Bits set:", bloomFilter.setBitsCount());
}
