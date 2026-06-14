# Curated Reciters for Tadabur

These reciters are selected for their suitability in contemplative (tadabur) sessions — calm, clear delivery that supports reflection rather than performance.

---

## Recommended for tadabur

### 1. Mishari Rashid al-Afasy — id: 18
**Style:** Murattal | **Qira'at:** Hafs  
**Character:** Warm, melodious, widely loved. Clear articulation. Excellent default for most users.  
**Best for:** General tadabur sessions; first-time listeners; users who want something beautiful but accessible.

### 2. Yasser Al-Dosari — id: 26
**Style:** Murattal | **Qira'at:** Hafs  
**Character:** Deeply moving, measured pace, soulful delivery. Often brings listeners to tears.  
**Best for:** Grief, loss, hopelessness, and depression sessions. Particularly powerful for emotional healing sessions.

### 3. Hani ar-Rifai — id: 5
**Style:** Murattal | **Qira'at:** Hafs  
**Character:** Soft, gentle, contemplative. Minimal ornamentation.  
**Best for:** Anxiety and stress sessions. The unhurried pace supports breathing and calm.

### 4. Abu Bakr al-Shatri — id: 17
**Style:** Murattal | **Qira'at:** Hafs  
**Character:** Clear, meditative, precise. Slightly slower than average.  
**Best for:** Learning sessions, word-by-word contemplation, users who want to follow along with the Arabic.

### 5. Mohamed Siddiq al-Minshawi — Murattal — id: 24
**Style:** Murattal | **Qira'at:** Hafs  
**Character:** Classic Egyptian style, rich tone, deeply traditional.  
**Best for:** Users who grew up with this voice and find it comforting; widowhood and grief sessions.

---

## Full catalogue style options

### Mujawwad (performed/ornate)
For users who want the full musical beauty of tajweed in a more formal, ceremonial style:
- Abdul Baset Abdul Samad — Mujawwad — id: 14 *(iconic, transcendent)*
- Mohamed Siddiq al-Minshawi — Mujawwad — id: 8
- Mahmoud Khalil Al-Husary — Mujawwad — id: 21

### Murattal (recited/flowing)
For tadabur and listening comprehension:
- All recommended reciters above are Murattal
- Maher Al Muaiqly — id: 13 *(fast-paced, clear)*
- Saad al-Ghamdi — id: 19 *(calm, resonant)*
- Abd ur Rahman as-Sudais — id: 16 *(Masjid al-Haram voice)*
- Khalifa Al-Tunaiji — id: 23

---

## How to play a recitation

Use `play_ayahs` (Server B / Tarthi):

```
play_ayahs(
  ayahs: ["surah:ayah"],  # e.g. ["2:286"] or range ["2:155", "2:156", "2:157"]
  reciter_id: 18           # Mishari Rashid al-Afasy
)
```

**To play a range** (e.g. Al-Inshirah 94:1-8):
```
ayahs: ["94:1", "94:2", "94:3", "94:4", "94:5", "94:6", "94:7", "94:8"]
```

---

## User reciter preferences

When a user expresses a preference or asks to change the reciter, note their choice for the rest of the session and use it for all subsequent `play_ayahs` calls. Offer to remember it for future sessions.

**Matching user descriptions to reciters:**
- "soothing", "calm", "gentle" → Hani ar-Rifai (id: 5) or Yasser Al-Dosari (id: 26)
- "beautiful", "melodious" → Mishari Rashid al-Afasy (id: 18)
- "classic", "traditional Egyptian" → Abdul Baset Abdul Samad Mujawwad (id: 14)
- "from Makkah/Haram" → Abd ur Rahman as-Sudais (id: 16)
- "moving", "makes me cry" → Yasser Al-Dosari (id: 26)
