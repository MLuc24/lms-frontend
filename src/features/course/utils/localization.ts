/**
 * Localization Utilities
 * Helpers for handling multi-language content
 */

import type {
  CourseLocalization,
  UnitLocalization,
  SkillLocalization,
  LessonLocalization,
} from '@/types';

type LocalizationItem =
  | CourseLocalization
  | UnitLocalization
  | SkillLocalization
  | LessonLocalization;

/**
 * Get localized content from an array of localizations
 * Falls back to first available localization if preferred language not found
 */
export function getLocalization<T extends LocalizationItem>(
  localizations: T[],
  languageId: number,
): T | undefined {
  if (!localizations || localizations.length === 0) {
    return undefined;
  }

  // Try to find exact match
  const match = localizations.find((l) => l.languageId === languageId);
  if (match) {
    return match;
  }

  // Fallback to first available
  return localizations[0];
}

/**
 * Get localized title from entity with localizations
 */
export function getLocalizedTitle<T extends { localizations: LocalizationItem[]; title?: string }>(
  entity: T,
  languageId: number,
): string {
  // If title is already populated (from backend), use it
  if (entity.title) {
    return entity.title;
  }

  // Otherwise, extract from localizations
  const localization = getLocalization(entity.localizations, languageId);
  return localization?.title || 'Untitled';
}

/**
 * Get localized description from entity with localizations
 */
export function getLocalizedDescription<
  T extends { localizations: (CourseLocalization | UnitLocalization | SkillLocalization)[]; description?: string },
>(entity: T, languageId: number): string | undefined {
  if (entity.description) {
    return entity.description;
  }

  const localization = getLocalization(entity.localizations, languageId);
  return (localization as CourseLocalization | UnitLocalization | SkillLocalization)?.description;
}

/**
 * Get localized intro text for lessons
 */
export function getLocalizedIntroText<
  T extends { localizations: LessonLocalization[]; introText?: string },
>(entity: T, languageId: number): string | undefined {
  if (entity.introText) {
    return entity.introText;
  }

  const localization = getLocalization(entity.localizations, languageId);
  return (localization as LessonLocalization)?.introText;
}

// Default language ID (can be configured based on user preferences)
export const DEFAULT_LANGUAGE_ID = 1; // English
