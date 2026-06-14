export interface Category {
  slug: string;
  name: string;
  arabicName: string;
  icon: string;
  description: string;
  color: string;
  searchKeywords: string[];
  reflectionPrompts: string[];
}

export const CATEGORIES: Category[] = [
  {
    slug: 'patience',
    name: 'Patience',
    arabicName: 'الصبر',
    icon: '🌿',
    description: 'Enduring hardship with steadfastness',
    color: '#4A8C70',
    searchKeywords: ['sabr', 'patience', 'endure', 'hardship', 'trial', 'perseverance'],
    reflectionPrompts: [
      'What specific hardship are you facing that requires patience right now?',
      'How has Allah helped you endure difficulties in the past? What does that tell you about His care for you?',
      'What would it look like to respond to this trial with sabr rather than frustration?',
    ],
  },
  {
    slug: 'hope',
    name: 'Hope',
    arabicName: 'الرجاء',
    icon: '🌅',
    description: 'Finding light when all feels dark',
    color: '#C9982D',
    searchKeywords: ['hope', 'relief', 'light', 'future', 'promise', 'ease'],
    reflectionPrompts: [
      'What area of your life feels hopeless right now, and why?',
      'What promise of Allah gives you the most comfort in this moment?',
      'How can you cultivate hope without losing sight of trust in Allah\'s plan?',
    ],
  },
  {
    slug: 'hopelessness',
    name: 'Hopelessness',
    arabicName: 'اليأس',
    icon: '🌑',
    description: 'When despair feels overwhelming',
    color: '#6B7280',
    searchKeywords: ['despair', 'hopeless', 'no way out', 'lost', 'meaningless', 'dark'],
    reflectionPrompts: [
      'In what area of your life do you feel most hopeless right now?',
      'Allah says never despair of His mercy — what makes that hard to believe today?',
      'What is one small thing you can hold onto, even in the darkness?',
    ],
  },
  {
    slug: 'anxiety',
    name: 'Anxiety',
    arabicName: 'القلق',
    icon: '🌊',
    description: 'Calming the restless heart',
    color: '#5B8DB8',
    searchKeywords: ['anxiety', 'worry', 'fear', 'nervous', 'overthinking', 'restless'],
    reflectionPrompts: [
      'What specific worry keeps returning to your mind today?',
      'How much of what you fear is within your control, and how much is in Allah\'s hands?',
      'What does "hearts find rest in the remembrance of Allah" mean to you personally?',
    ],
  },
  {
    slug: 'depression',
    name: 'Depression',
    arabicName: 'الاكتئاب',
    icon: '🍂',
    description: 'When the soul feels heavy',
    color: '#8B6F8B',
    searchKeywords: ['depression', 'sadness', 'heavy', 'empty', 'numb', 'grief', 'low'],
    reflectionPrompts: [
      'How would you describe what you\'re feeling in your own words?',
      'When was the last time you felt close to Allah? What helped then?',
      'What is one act of worship or kindness you could do today, even something very small?',
    ],
  },
  {
    slug: 'stress',
    name: 'Stress',
    arabicName: 'التوتر',
    icon: '⚡',
    description: 'Finding calm in overwhelm',
    color: '#D4713D',
    searchKeywords: ['stress', 'overwhelm', 'pressure', 'busy', 'too much', 'exhausted'],
    reflectionPrompts: [
      'What is the main source of your stress right now?',
      'Which of your current burdens can you let go of, and which must you carry?',
      'How can you invite Allah into the busyness of your day today?',
    ],
  },
  {
    slug: 'trust-in-allah',
    name: 'Trust in Allah',
    arabicName: 'التوكل',
    icon: '🤲',
    description: 'Surrendering to divine wisdom',
    color: '#1C5D52',
    searchKeywords: ['tawakkul', 'trust', 'reliance', 'surrender', 'submit', 'depend'],
    reflectionPrompts: [
      'Where in your life are you struggling to truly trust Allah\'s plan?',
      'What does tawakkul (reliance on Allah) look like in practice for your current situation?',
      'What past experience has shown you that Allah\'s plan was better than your own?',
    ],
  },
  {
    slug: 'love',
    name: 'Love',
    arabicName: 'المحبة',
    icon: '❤️',
    description: 'Love for Allah, family, and creation',
    color: '#C0392B',
    searchKeywords: ['love', 'heart', 'affection', 'care', 'compassion', 'mercy'],
    reflectionPrompts: [
      'How does your love for Allah manifest in your daily actions?',
      'Is there someone in your life you need to love more generously?',
      'How does knowing Allah loves you more than anyone affect how you see yourself?',
    ],
  },
  {
    slug: 'gratitude',
    name: 'Gratitude',
    arabicName: 'الشكر',
    icon: '🌸',
    description: 'Recognizing and counting blessings',
    color: '#4A8C70',
    searchKeywords: ['gratitude', 'shukr', 'thankful', 'blessing', 'niamah', 'appreciate'],
    reflectionPrompts: [
      'Name three specific blessings you\'ve taken for granted recently.',
      'How does expressing gratitude change your relationship with Allah?',
      'When is gratitude hardest for you, and why?',
    ],
  },
  {
    slug: 'rizq',
    name: 'Rizq & Provision',
    arabicName: 'الرزق',
    icon: '🌾',
    description: 'Trust in Allah\'s provision and sustenance',
    color: '#C9982D',
    searchKeywords: ['rizq', 'provision', 'money', 'wealth', 'job', 'financial', 'sustenance'],
    reflectionPrompts: [
      'What worry about provision is weighing on you most right now?',
      'Do you believe Allah will provide for you? What makes that belief strong or weak?',
      'How can you take practical steps while keeping your heart fully reliant on Allah?',
    ],
  },
  {
    slug: 'childlessness',
    name: 'Childlessness',
    arabicName: 'العقم',
    icon: '🌱',
    description: 'The ache of unfulfilled parenthood',
    color: '#7B9E87',
    searchKeywords: ['infertility', 'childless', 'no children', 'pregnancy', 'longing', 'motherhood'],
    reflectionPrompts: [
      'How has this experience shaped your relationship with Allah?',
      'Where do you find meaning and purpose outside of what you\'re waiting for?',
      'What would it mean to trust Allah\'s wisdom in this specific area of your life?',
    ],
  },
  {
    slug: 'widowhood',
    name: 'Widowhood',
    arabicName: 'الترمل',
    icon: '🕊️',
    description: 'Navigating loss and rebuilding',
    color: '#8B8B8B',
    searchKeywords: ['widow', 'widower', 'spouse died', 'husband passed', 'wife passed', 'loss'],
    reflectionPrompts: [
      'What do you miss most, and how are you honoring that love?',
      'Where has Allah shown you He hasn\'t abandoned you in this grief?',
      'What does healing look like for you — not forgetting, but continuing?',
    ],
  },
  {
    slug: 'gossip',
    name: 'Gossip & Backbiting',
    arabicName: 'الغيبة',
    icon: '👂',
    description: 'Protecting the tongue and honor',
    color: '#B8860B',
    searchKeywords: ['gossip', 'backbiting', 'ghibah', 'talking about others', 'rumor', 'slander'],
    reflectionPrompts: [
      'Have you said or heard something about someone that you shouldn\'t have?',
      'What drives you to talk about others — boredom, connection, anger?',
      'How can you redirect gossip conversations without alienating people?',
    ],
  },
  {
    slug: 'betrayal',
    name: 'Betrayal',
    arabicName: 'الخيانة',
    icon: '💔',
    description: 'When trust is broken',
    color: '#8B4513',
    searchKeywords: ['betrayal', 'betrayed', 'broken trust', 'cheated', 'lied to', 'hurt'],
    reflectionPrompts: [
      'How has this betrayal changed how you see yourself and others?',
      'Is there a difference between forgiving someone and trusting them again?',
      'What does it mean to seek justice vs. seeking revenge in Islam?',
    ],
  },
  {
    slug: 'scandal',
    name: 'Reputation & Scandal',
    arabicName: 'الفضيحة',
    icon: '🌫️',
    description: 'When reputation is under attack',
    color: '#696969',
    searchKeywords: ['reputation', 'scandal', 'embarrassment', 'exposed', 'humiliation', 'shame'],
    reflectionPrompts: [
      'What are you most afraid people will think or say about you?',
      'How does Allah see you versus how others see you — which matters more?',
      'What past mistake or situation is still causing you pain or shame?',
    ],
  },
  {
    slug: 'loneliness',
    name: 'Loneliness',
    arabicName: 'الوحدة',
    icon: '🌙',
    description: 'The ache of feeling unseen',
    color: '#4B6FA0',
    searchKeywords: ['lonely', 'alone', 'isolated', 'no friends', 'disconnected', 'unseen'],
    reflectionPrompts: [
      'When do you feel most alone, and what triggers that feeling?',
      'Allah is always with you — what makes that hard to feel right now?',
      'What is one step you could take toward genuine human connection this week?',
    ],
  },
  {
    slug: 'forgiveness',
    name: 'Forgiveness',
    arabicName: 'العفو',
    icon: '🤍',
    description: 'Releasing resentment, seeking pardon',
    color: '#9B8EAE',
    searchKeywords: ['forgiveness', 'forgive', 'afw', 'pardon', 'resentment', 'grudge', 'repentance'],
    reflectionPrompts: [
      'Who do you need to forgive, and what makes that difficult?',
      'How does holding onto resentment affect your relationship with Allah?',
      'What would freedom from this burden feel like?',
    ],
  },
  {
    slug: 'healing',
    name: 'Healing',
    arabicName: 'الشفاء',
    icon: '🌼',
    description: 'Physical and emotional recovery',
    color: '#5B9B5B',
    searchKeywords: ['healing', 'shifa', 'sick', 'illness', 'recovery', 'health', 'chronic'],
    reflectionPrompts: [
      'What are you healing from — physically, emotionally, or spiritually?',
      'How has illness or pain changed your relationship with Allah?',
      'What does trusting Allah with your health look like in practice?',
    ],
  },
  {
    slug: 'death-loss',
    name: 'Death & Loss',
    arabicName: 'الموت والحزن',
    icon: '🌹',
    description: 'Grief, loss, and remembering death',
    color: '#7C6B4E',
    searchKeywords: ['death', 'grief', 'loss', 'died', 'funeral', 'mourning', 'bereavement'],
    reflectionPrompts: [
      'Who or what are you grieving right now?',
      'How does Islam\'s view of death as a return to Allah comfort or challenge you?',
      'What do you want to carry forward from the life of the person you\'ve lost?',
    ],
  },
  {
    slug: 'fear-of-allah',
    name: 'Fear of Allah',
    arabicName: 'خشية الله',
    icon: '✨',
    description: 'Awe, reverence, and accountability',
    color: '#1C5D52',
    searchKeywords: ['taqwa', 'fear Allah', 'khashyah', 'accountability', 'hereafter', 'akhira', 'judgment'],
    reflectionPrompts: [
      'What does "fear of Allah" mean to you — punishment, or something deeper?',
      'How does awareness of Allah\'s presence change the way you act when no one is watching?',
      'What would your life look like if you truly lived with taqwa every day?',
    ],
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getCategoryIcon(slug: string): string {
  return getCategoryBySlug(slug)?.icon ?? '📖';
}

export function getCategoryName(slug: string): string {
  return getCategoryBySlug(slug)?.name ?? slug;
}
