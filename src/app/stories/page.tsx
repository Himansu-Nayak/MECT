import { redirect } from "next/navigation";

/**
 * Field Dispatches Consolidation (Phase 23)
 * Consolidated with the Documentary Memories & Archival Gallery to unify
 * visual photographic evidence and operational field dispatches.
 */
export default function StoriesPage() {
  redirect("/memories-gallery#field-dispatches");
}
