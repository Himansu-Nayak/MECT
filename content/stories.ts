/**
 * Consented Beneficiary & Field Stories (`content/stories.ts`)
 *
 * Strictly zero invented testimonials. Stories are only added here once
 * written beneficiary/guardian consent and field verification records are
 * archived by MECT's Balangir / Bhubaneswar secretariat.
 */

export interface ConsentedStory {
  id: string;
  title: string;
  district: string;
  programme: string;
  quote: string;
  attribution: string;
  year: string;
}

export const CONSENTED_STORIES: ConsentedStory[] = [];

