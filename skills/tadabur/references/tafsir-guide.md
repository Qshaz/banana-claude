# Tafsir Guide for Tadabur Sessions

This file documents which tafsir collections to use, when to use each, and how to present them.

---

## English tafsir (primary sources)

### 1. Ibn Kathir (English) — `en-tafsir-ibn-kathir`

**Best for:** Historical context, asbab al-nuzul (occasion of revelation), cited hadiths, scholarly consensus, classical explanation.

**How to present:** This is the default tafsir for every session. Extract:
- The core meaning of the verse
- Any asbab al-nuzul mentioned
- Hadiths the tafsir cites (only quote what is actually in the fetched text)
- Key scholarly points

**Excerpt length:** 200–350 words. If the text is longer, distill rather than truncate arbitrarily.

### 2. Ma'arif al-Quran (English) — `en-tafsir-maarif-quran`

**Author:** Mufti Muhammad Shafi Usmani  
**Best for:** Practical guidance, fiqh implications, spiritual benefit, accessible depth.

**When to use:** Offer as a second opinion when the user wants more depth, or when Ibn Kathir is primarily technical and the user wants more spiritual application.

### 3. Mukhtasar / Condensed (English) — `en-tafsir-mokhtasar`

**Best for:** Quick, clear summary. Useful for shorter sessions or when the user wants brevity.

**When to use:** When the user is in emotional distress and a long scholarly text would be too much. Give the essence in a few sentences.

### 4. Tazkirul Quran (English) — `en-tafsir-tazkirul-quran`

**Best for:** Reflection and spiritual awakening. More devotional in tone.

**When to use:** For Layer 3 and Layer 4 of the reflection framework — when moving from understanding to personal application.

---

## Arabic tafsir (for Arabic-speaking or Arabic-reading users)

Offer these when the user indicates they read Arabic.

### 1. Ibn Kathir (Arabic) — `ar-tafsir-ibn-kathir`
The authoritative classical reference. The source text for the English translation above.

### 2. Al-Kashshaf by Al-Zamakhshari — `al-kashshaf-al-zamakhshari`
**Best for:** Linguistic and rhetorical analysis of the Arabic text. Excellent for users who want to understand the beauty of Quranic Arabic. Note: Al-Zamakhshari had Mu'tazilite leanings; present his linguistic insights without endorsing theological positions.

### 3. As-Sa'di — `tafsir-as-saadi`
**Best for:** Clear, accessible, practical Arabic. Modern-readable classical tafsir. Highly recommended for general use.

### 4. Tadabbur wa Amal — `tadabbur-wa-amal`
**Best for:** This collection is specifically designed for contemplation and action — perfect for tadabur sessions. Use for Layer 4 (action prompts) when available.

### 5. Al-Tabari — `ar-tafsir-tabari`
**Best for:** Early scholarly opinions, chains of narration, historical context. Detailed and encyclopedic. Use when the user wants deep historical grounding.

### 6. Al-Qurtubi — `ar-tafsir-qurtubi`
**Best for:** Fiqh implications, legal dimensions of verses, comprehensive scholarly discussion.

---

## How to present tafsir in a session

1. **Lead with the meaning:** In 2–3 sentences, summarise what Ibn Kathir says the verse means. Write this in your own voice, based on the fetched text.

2. **Occasion of revelation:** If the tafsir mentions asbab al-nuzul, include it in a paragraph: "This verse was revealed when..." Briefly explain why that context matters.

3. **Relevant hadith:** Only include hadiths that appear in the fetched tafsir text. Quote them with the attribution given: "Ibn Kathir cites [Narrator] who narrated..." Never generate or recall hadiths independently.

4. **Key insight:** One powerful sentence or concept from the tafsir that speaks to the user's situation. This is where you make the connection between the classical commentary and the person in front of you.

---

## Attribution format

Always attribute tafsir clearly:

> *From Tafsir Ibn Kathir:* "[quoted text]"

> *From Ma'arif al-Quran (Mufti Shafi Usmani):* "[quoted text]"

Never blend tafsir sources in a single paragraph without clear attribution. Do not paraphrase tafsir in a way that obscures the source.

---

## What NOT to do

- Do not generate tafsir from memory, even for well-known verses.
- Do not blend multiple tafsir opinions into a single statement without attribution.
- Do not present your own interpretation as tafsir.
- Do not use tafsir content to issue religious rulings (fatwa). If a user asks a fiqh question, refer them to a scholar.
- Do not quote hadiths that do not appear in the fetched tafsir text.
