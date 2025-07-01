/**
 * Configuration type for individual seed operations
 */
export type SeedConfig = {
  /** Unique identifier for the seed */
  readonly name: string;
  /** Execution order (lower numbers run first) */
  readonly order: number;
  /** Human-readable description of what this seed does */
  readonly description: string;
};

/**
 * Result of a seed operation
 */
export type SeedResult = {
  /** Name of the seed that was executed */
  readonly name: string;
  /** Number of records created */
  readonly recordsCreated: number;
  /** Execution time in milliseconds */
  readonly executionTime: number;
  /** Whether the operation was successful */
  readonly success: boolean;
  /** Error message if operation failed */
  readonly error?: string;
};

/**
 * Interface for seed operations
 */
export type SeedOperation = {
  /** Configuration for this seed */
  readonly config: SeedConfig;
  /** Function to execute the seed */
  readonly execute: () => Promise<number>;
  /** Function to clear data (for cleanup) */
  readonly clear: () => Promise<void>;
};
