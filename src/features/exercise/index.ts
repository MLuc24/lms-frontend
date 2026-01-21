/**
 * Exercise Feature Barrel Export
 */

// Services
export { exerciseService } from './services/exercise.service';

// Hooks
export { useExercises, useExerciseDetail, exerciseKeys } from './hooks/useExercises';
export {
  useStartSession,
  useCompleteSession,
  useStartAttempt,
  useSubmitAnswer,
  useSubmitAttempt,
} from './hooks/useSession';

// Components
export {
  MCQExercise,
  FillBlankExercise,
  ExerciseRenderer,
  SessionResult,
  ExerciseProgress,
} from './components';

// Types
export type {
  ExerciseSessionState,
  ExerciseWithProgress,
  UserAnswer,
  ExerciseBaseProps,
  MCQExerciseProps,
  MCQOption,
  FillBlankExerciseProps,
  BlankItem,
  MatchingExerciseProps,
  MatchingPair,
  SessionResultData,
} from './types';
