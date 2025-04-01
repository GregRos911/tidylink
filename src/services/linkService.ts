
// This file is kept for backward compatibility
// It re-exports all link-related functionality from the new modular structure

export { 
  useCreateLink,
  useUserLinks,
  useIncrementLinkClicks,
  generateRandomAlias,
  type LinkData,
  type CreateLinkParams
} from './links';
