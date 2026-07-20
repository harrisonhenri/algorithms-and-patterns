/**
 * Probabilistic Data Structures
 *
 * These data structures trade absolute precision for:
 * - Lower memory usage
 * - Faster processing
 * - Better scalability
 *
 * They are heavily used in:
 * - Distributed systems
 * - Large-scale analytics
 * - Databases
 * - Search engines
 * - Streaming systems
 * - Caching infrastructure
 *
 * Included structures:
 * - Bloom Filter:
 *   Probabilistic membership testing
 *
 * - HyperLogLog:
 *   Approximate distinct counting
 *
 * @date 13/07/2026
 */

export * from "./bloom-filter";
export * from "./hyperloglog";
