const TAXONOMY = {
  work: ['meeting', 'project', 'deadline', 'client', 'office', 'team', 'email', 'report', 'presentation', 'budget', 'manager', 'colleague', 'company', 'business', 'job', 'career', 'boss', 'hire', 'contract', 'proposal', 'agenda', 'quarter', 'strategy', 'revenue', 'kpi'],
  travel: ['trip', 'flight', 'hotel', 'vacation', 'passport', 'visa', 'itinerary', 'airport', 'destination', 'booking', 'tour', 'journey', 'abroad', 'country', 'city', 'tickets', 'luggage', 'transit', 'layover'],
  health: ['doctor', 'appointment', 'medicine', 'exercise', 'diet', 'symptoms', 'hospital', 'therapy', 'wellness', 'fitness', 'workout', 'medication', 'pain', 'sleep', 'mental', 'anxiety', 'nutrition', 'calories', 'blood', 'prescription'],
  finance: ['budget', 'expense', 'invoice', 'payment', 'bank', 'savings', 'investment', 'tax', 'cost', 'money', 'salary', 'income', 'spend', 'price', 'bill', 'debt', 'loan', 'credit', 'insurance', 'stocks', 'crypto', 'rent'],
  family: ['mom', 'dad', 'sister', 'brother', 'kids', 'children', 'spouse', 'wedding', 'birthday', 'anniversary', 'parent', 'daughter', 'son', 'husband', 'wife', 'grandma', 'grandpa', 'nephew', 'niece', 'cousin', 'family'],
  ideas: ['idea', 'concept', 'brainstorm', 'explore', 'possibility', 'innovation', 'creative', 'imagine', 'design', 'vision', 'dream', 'inspiration', 'invention', 'hypothesis', 'theory', 'proposal'],
  food: ['recipe', 'restaurant', 'cook', 'ingredient', 'meal', 'dinner', 'lunch', 'breakfast', 'eat', 'taste', 'cuisine', 'dish', 'kitchen', 'bake', 'grill', 'spice', 'vegetable', 'protein', 'snack'],
  learning: ['book', 'course', 'study', 'learn', 'research', 'university', 'class', 'lecture', 'read', 'knowledge', 'skill', 'practice', 'lesson', 'tutorial', 'certificate', 'degree', 'chapter', 'notes'],
  tech: ['code', 'software', 'app', 'website', 'computer', 'programming', 'database', 'api', 'bug', 'feature', 'develop', 'deploy', 'server', 'data', 'algorithm', 'framework', 'cloud', 'git', 'docker', 'python', 'javascript'],
  personal: ['journal', 'thoughts', 'feelings', 'reflection', 'habit', 'mindset', 'growth', 'believe', 'grateful', 'anxiety', 'confidence', 'purpose', 'values', 'identity', 'emotion', 'mood', 'journal'],
  shopping: ['buy', 'purchase', 'order', 'price', 'store', 'delivery', 'wishlist', 'shop', 'sale', 'discount', 'amazon', 'cart', 'shipping', 'item', 'product'],
  home: ['house', 'apartment', 'furniture', 'repair', 'renovation', 'landlord', 'mortgage', 'rent', 'decor', 'bedroom', 'garden', 'cleaning', 'organize', 'storage', 'lease'],
  islam: ['prayer', 'salah', 'quran', 'dua', 'hadith', 'sunnah', 'ramadan', 'eid', 'mosque', 'fasting', 'zakat', 'hajj', 'islamic', 'allah', 'prophet', 'bismillah', 'inshallah', 'alhamdulillah'],
  goals: ['goal', 'target', 'achieve', 'milestone', 'progress', 'track', 'habit', 'routine', 'discipline', 'resolution', 'improve', 'plan', 'commit'],
  social: ['friend', 'party', 'event', 'invite', 'gathering', 'celebrate', 'date', 'relationship', 'network', 'connect', 'community'],
}

const STOP_WORDS = new Set([
  'the','a','an','and','or','but','in','on','at','to','for','of','with','by',
  'is','are','was','were','be','been','have','has','had','do','does','did',
  'will','would','could','should','may','might','that','this','these','those',
  'it','its','we','they','he','she','you','i','my','your','our','their','his',
  'her','not','no','so','as','if','then','than','from','into','about','up',
  'out','what','which','who','how','when','where','why','all','any','some',
  'more','also','just','can','get','got','go','going','being','very','really',
  'one','two','three','new','old','good','great','like','know','want','need',
  'time','day','week','month','year','today','tomorrow','yesterday','now','still',
])

export function suggestCategoriesLocal(content, existingTags = [], allNoteTags = []) {
  if (!content || content.trim().length < 30) return []

  const words = content
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w))

  const wordSet = new Set(words)
  const scores = {}

  // Existing tags score 3x — prefer consistency with user's library
  for (const tag of allNoteTags) {
    const tagWords = tag.toLowerCase().split(/[-_]/)
    const directMatch = tagWords.filter(w => w.length > 2 && wordSet.has(w)).length
    if (directMatch > 0) scores[tag] = (scores[tag] || 0) + directMatch * 3
    if (content.toLowerCase().includes(tag.replace(/[-_]/g, ' '))) {
      scores[tag] = (scores[tag] || 0) + 2
    }
  }

  // Taxonomy topics
  for (const [topic, keywords] of Object.entries(TAXONOMY)) {
    const matches = keywords.filter(k => wordSet.has(k)).length
    if (matches > 0) scores[topic] = (scores[topic] || 0) + matches
  }

  return Object.entries(scores)
    .filter(([tag]) => !existingTags.includes(tag))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([tag]) => tag)
}
