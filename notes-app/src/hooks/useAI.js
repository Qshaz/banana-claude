import { suggestCategoriesLocal } from '../utils/localAI'

export function useAI() {
  function suggestCategories(content, existingTags = [], allNoteTags = []) {
    return suggestCategoriesLocal(content, existingTags, allNoteTags)
  }

  return { suggestCategories }
}
