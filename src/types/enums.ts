// ============ USER ENUMS ============

export enum UserRole {
  STUDENT = 'STUDENT',
  INSTRUCTOR = 'INSTRUCTOR',
  ADMIN = 'ADMIN',
  CONTENT_EDITOR = 'CONTENT_EDITOR',
  MODERATOR = 'MODERATOR',
}

export enum UserStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  DELETED = 'deleted',
}

// ============ COURSE ENUMS ============

export enum CourseLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
}

export enum CourseVersionStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

// ============ SKILL & LESSON ENUMS ============

export enum SkillType {
  VOCABULARY = 'vocabulary',
  GRAMMAR = 'grammar',
  LISTENING = 'listening',
  SPEAKING = 'speaking',
  READING = 'reading',
  WRITING = 'writing',
  MIXED = 'mixed',
}

export enum LessonType {
  PRACTICE = 'practice',
  STORY = 'story',
  DIALOGUE = 'dialogue',
  TEST = 'test',
  REVIEW = 'review',
}

export enum ExerciseType {
  MCQ = 'mcq',
  FILL_BLANK = 'fill_blank',
  MATCHING = 'matching',
  REORDER = 'reorder',
  TRANSLATION = 'translation',
  LISTENING_MCQ = 'listening_mcq',
  SPEAKING = 'speaking',
  DICTATION = 'dictation',
  WRITING = 'writing',
}

export enum ExerciseItemType {
  QUESTION = 'question',
  PAIR = 'pair',
  BLANK = 'blank',
  TOKEN = 'token',
}

export enum SessionMode {
  LEARN = 'learn',
  REVIEW = 'review',
  TEST = 'test',
}

// ============ PROGRESS & ENROLLMENT ENUMS ============

export enum EnrollmentStatus {
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  DROPPED = 'dropped',
}

export enum ProgressStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}
