/**
 * Free Education for 200 Students — Funding & Cohort Records (`content/funding.ts`)
 *
 * Never invent funded-seat counts. Update `confirmedFundedPlaces` only from
 * verified trust disbursement / scholarship allotment registers.
 */

export const FREE_EDUCATION_200 = {
  targetCount: 200,
  confirmedFundedPlaces: 0,
  statusLabel: "Target Cohort (200 Outlined Places)",
  sourceNote:
    "200-student programme target; confirmed funded seats are updated only against verified secretariat allotment records.",
} as const;

