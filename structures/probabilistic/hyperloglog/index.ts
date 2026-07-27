/**
 * HyperLogLog - Probabilistic cardinality estimation data structure.
 *
 * HyperLogLog estimates the number of distinct elements in a dataset
 * using very small amounts of memory.
 *
 * Instead of storing all unique values, it uses stochastic averaging
 * and leading-zero counting to approximate cardinality.
 *
 * **Time Complexity:**
 * - add(): O(1)
 * - count(): O(m)
 *
 * Where:
 * - m = number of registers
 *
 * **Space Complexity:**
 * - O(m)
 *
 * **Key Characteristics:**
 * - Extremely memory efficient
 * - Approximate distinct counting
 * - Fixed-size memory usage
 * - Excellent for streaming systems
 * - Mergeable across distributed systems
 *
 * **Common Use Cases:**
 * - Counting unique website visitors
 * - Analytics dashboards
 * - Distributed telemetry aggregation
 * - Database query optimization
 * - Network traffic analysis
 * - Real-time event processing
 *
 * **How It Works:**
 * 1. Hash incoming values
 * 2. Split hash into:
 *    - Register index
 *    - Remaining bits
 * 3. Count leading zeros in remaining bits
 * 4. Store the maximum leading-zero count per register
 * 5. Estimate cardinality using harmonic mean
 *
 * **Accuracy:**
 * Standard error:
 * 1.04 / sqrt(m)
 *
 * Where:
 * - m = number of registers
 *
 * @date 13/07/2026
 */

export interface HyperLogLogOptions {
  /**
   * Precision value.
   *
   * Typical values:
   * - 4  => low memory, lower accuracy
   * - 10 => balanced
   * - 14 => high accuracy
   */
  precision?: number;
}

/**
 * Generates a deterministic 32-bit hash for a string.
 */
function hash(value: string): number {
  let hashValue = 2166136261;

  for (let i = 0; i < value.length; i++) {
    hashValue ^= value.charCodeAt(i);
    hashValue = Math.imul(hashValue, 16777619);
  }

  return hashValue >>> 0;
}

/**
 * Counts leading zeros in a 32-bit integer.
 */
function countLeadingZeros(value: number): number {
  return Math.clz32(value) + 1;
}

/**
 * HyperLogLog implementation.
 *
 * @example
 * const hll = new HyperLogLog({ precision: 10 });
 *
 * hll.add("user-1");
 * hll.add("user-2");
 * hll.add("user-1");
 *
 * console.log(hll.count()); // approximately 2
 */
export class HyperLogLog {
  private readonly precision: number;
  private readonly registerCount: number;
  private readonly registers: Uint8Array;

  constructor(options: HyperLogLogOptions = {}) {
    this.precision = options.precision ?? 10;

    if (this.precision < 4 || this.precision > 16) {
      throw new Error("Precision must be between 4 and 16");
    }

    this.registerCount = 1 << this.precision;
    this.registers = new Uint8Array(this.registerCount);
  }

  /**
   * Adds a value to the estimator.
   *
   * @param value Value to insert
   * @time O(1)
   */
  add(value: string): void {
    const hashed = hash(value);

    const registerIndex = hashed >>> (32 - this.precision);

    const remainingBits =
      (hashed << this.precision) | (1 << (this.precision - 1));

    const leadingZeros = countLeadingZeros(remainingBits);

    this.registers[registerIndex] = Math.max(
      this.registers[registerIndex],
      leadingZeros,
    );
  }

  /**
   * Estimates the number of distinct elements.
   *
   * Uses harmonic mean aggregation.
   *
   * @returns Approximate cardinality
   * @time O(m)
   */
  count(): number {
    let harmonicMean = 0;
    let zeroRegisters = 0;

    for (const register of this.registers) {
      harmonicMean += Math.pow(2, -register);

      if (register === 0) {
        zeroRegisters++;
      }
    }

    const alpha = this.getAlphaConstant();

    let estimate =
      alpha * this.registerCount * this.registerCount * (1 / harmonicMean);

    // Small-range correction
    if (estimate <= 2.5 * this.registerCount && zeroRegisters > 0) {
      estimate =
        this.registerCount * Math.log(this.registerCount / zeroRegisters);
    }

    return Math.round(estimate);
  }

  /**
   * Returns the expected standard error.
   *
   * Formula:
   * 1.04 / sqrt(m)
   */
  standardError(): number {
    return 1.04 / Math.sqrt(this.registerCount);
  }

  /**
   * Merges another HyperLogLog into this one.
   *
   * Both structures must use the same precision.
   */
  merge(other: HyperLogLog): void {
    if (this.precision !== other.precision) {
      throw new Error("Cannot merge HyperLogLogs with different precisions");
    }

    for (let i = 0; i < this.registerCount; i++) {
      this.registers[i] = Math.max(this.registers[i], other.registers[i]);
    }
  }

  /**
   * Returns the number of registers.
   */
  getRegisterCount(): number {
    return this.registerCount;
  }

  /**
   * Returns the configured precision.
   */
  getPrecision(): number {
    return this.precision;
  }

  /**
   * HyperLogLog bias correction constant.
   */
  private getAlphaConstant(): number {
    switch (this.registerCount) {
      case 16:
        return 0.673;
      case 32:
        return 0.697;
      case 64:
        return 0.709;
      default:
        return 0.7213 / (1 + 1.079 / this.registerCount);
    }
  }
}

// ============================================================================
// EXAMPLES
// ============================================================================

if (require.main === module) {
  console.log("=== HyperLogLog Examples ===\n");

  const hyperLogLog = new HyperLogLog({
    precision: 10,
  });

  // Simulate repeated users
  for (let i = 0; i < 10000; i++) {
    hyperLogLog.add(`user-${i}`);
  }

  // Add duplicates
  for (let i = 0; i < 5000; i++) {
    hyperLogLog.add(`user-${i}`);
  }

  console.log("Estimated unique users:", hyperLogLog.count());
  console.log("Expected unique users:", 10000);

  console.log("Expected standard error:", hyperLogLog.standardError());

  console.log("Register count:", hyperLogLog.getRegisterCount());

  console.log("Precision:", hyperLogLog.getPrecision());

  console.log();

  // Distributed merge example
  const shardA = new HyperLogLog({ precision: 10 });
  const shardB = new HyperLogLog({ precision: 10 });

  for (let i = 0; i < 5000; i++) {
    shardA.add(`user-${i}`);
  }

  for (let i = 2500; i < 7500; i++) {
    shardB.add(`user-${i}`);
  }

  shardA.merge(shardB);

  console.log("Merged distributed estimate:", shardA.count());

  console.log("Expected merged unique users:", 7500);
}
