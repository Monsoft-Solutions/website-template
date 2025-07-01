/**
 * Represents a single step in a service delivery process
 */
export type ProcessStep = {
  /** Step number in the process sequence */
  readonly step: number;
  /** Title of the process step */
  readonly title: string;
  /** Detailed description of what happens in this step */
  readonly description: string;
  /** Optional duration for this step */
  readonly duration?: string;
};
