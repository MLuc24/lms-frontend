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
  MULTIPLE_CHOICE = 'mcq',
  FILL_BLANK = 'fill_blank',
  MATCHING = 'matching',
  LISTENING = 'listening',
  SPEAKING = 'speaking',
  WRITING = 'writing',
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
