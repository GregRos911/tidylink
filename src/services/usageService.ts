
// This file is kept for backward compatibility
// It re-exports all usage-related functionality from the new modular structure

export { 
  FREE_PLAN_LIMITS,
  useUserUsage,
  useIncrementUsage,
  useResetUsage,
  type UsageData
} from './usage';
