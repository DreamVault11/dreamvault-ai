// ============================================================
// DreamScape AI — Seed Data Generator
// Generates demo dream content for testing and previews.
// ============================================================

import {
  DreamReconstruction,
  DreamInterpretation,
  MovieGenerationOutput,
  ScenePrompt,
  PatternAnalytics,
  MonthlyReport,
  AlternateEndingOutput,
} from "@/types/ai";

// ── Seed Dream Reconstructions ────────────────────────────
export function generateSeedDreams(count: number = 5): DreamReconstruction[] {
  const dreamTemplates: Array<Partial<DreamReconstruction>> = [
    {
      summary: "Flying over a neon-lit city at dusk, guided by a mysterious starlight figure",
      story: "I was soaring above a sprawling metropolis at dusk. The buildings pulsed with neon light in shades of purple and cyan. Below me, rivers of traffic flowed like liquid fire. I felt weightless and free, carried by an unseen current. A giant moon hung on the horizon, so close I could almost touch it. Then I saw her — a woman made of starlight, dancing on the highest spire. She gestured for me to follow, and we flew together through canyons of glass and light.",
      keySymbols: ["flying", "neon city", "moon", "starlight woman", "height"],
      emotionalThemes: ["freedom", "awe", "wonder", "slight anxiety"],
      characters: [
        { name: "The Dreamer", role: "protagonist", description: "Yourself, flying above the city" },
        { name: "Starlight Woman", role: "guide", description: "A luminous figure made of starlight" },
      ],
      locations: [
        { name: "Neon City", description: "A sprawling futuristic city at dusk" },
        { name: "The Moon", description: "A giant, impossibly close moon on the horizon" },
      ],
      timeline: [
        { scene: "Soaring above the city skyline", order: 0 },
        { scene: "Floating through neon canyons", order: 1 },
        { scene: "Approaching the giant moon", order: 2 },
        { scene: "Encountering the Starlight Woman", order: 3 },
      ],
      sensoryDetails: ["Wind rushing past skin", "Neon light reflections on glass", "Feeling of weightlessness", "Distant city hum"],
    },
    {
      summary: "Being chased through an endless library where the books whisper secrets",
      story: "I was running through corridors of infinite bookshelves that stretched into darkness. The books on the shelves were alive — they whispered in languages I could almost understand. Each aisle I turned down looked the same, yet different. A faceless figure in a grey robe was following me, not running, but always there when I looked back. I grabbed a random book and opened it. The words glowed and wrapped around my hands like vines. I woke up with the feeling that I had learned something important but couldn't remember what.",
      keySymbols: ["library", "books", "whispers", "faceless figure", "glowing words"],
      emotionalThemes: ["curiosity", "fear", "confusion", "urgency"],
      characters: [
        { name: "The Dreamer", role: "protagonist", description: "Yourself, running through the library" },
        { name: "The Grey Figure", role: "antagonist", description: "A faceless figure in grey robes, always following" },
      ],
      locations: [
        { name: "Infinite Library", description: "Endless corridors of towering bookshelves" },
      ],
      timeline: [
        { scene: "Running through library corridors", order: 0 },
        { scene: "Hearing whispers from the books", order: 1 },
        { scene: "The Grey Figure appears", order: 2 },
        { scene: "Opening the glowing book", order: 3 },
      ],
      sensoryDetails: ["Musty paper smell", "Whispering voices", "Cold marble floor", "Glowing light from books"],
    },
    {
      summary: "Standing on a beach where the waves were made of glass shards that sang as they broke",
      story: "I stood on a beach of black sand under a green sky. The waves that rolled in were not water but thousands of pieces of sea glass, tumbling and clinking together in a haunting melody. Each wave sang a different note. I walked to the water's edge and the glass didn't cut me — it felt warm and familiar. I picked up a piece of blue glass and held it to my ear. I could hear my grandmother's voice, though she passed away years ago. She was singing a lullaby. I sat down on the black sand and listened until I woke up crying.",
      keySymbols: ["beach", "glass waves", "black sand", "green sky", "grandmother's voice"],
      emotionalThemes: ["melancholy", "peace", "grief", "comfort", "nostalgia"],
      characters: [
        { name: "The Dreamer", role: "protagonist", description: "Yourself on the glass beach" },
        { name: "Grandmother", role: "guide", description: "Voice of the dreamer's deceased grandmother" },
      ],
      locations: [
        { name: "Glass Beach", description: "A beach with black sand under a green sky" },
      ],
      timeline: [
        { scene: "Arriving on the black sand beach", order: 0 },
        { scene: "Watching the glass waves sing", order: 1 },
        { scene: "Finding the blue glass piece", order: 2 },
        { scene: "Hearing grandmother's voice", order: 3 },
      ],
      sensoryDetails: ["Glass tinkling like wind chimes", "Black sand warm underfoot", "Green sky with no sun", "Salty air"],
    },
    {
      summary: "Living in a house where every door opened to a different season of my life",
      story: "I was in my childhood home, but it was impossibly large inside. The front door opened to summer — a golden field of wheat where I was 7 years old, chasing fireflies. The basement door opened to winter — I was 16, standing in the snow outside a hospital. The attic door opened to spring — I was 22, walking through a rainstorm with an umbrella and laughing. Every room held a different age, a different memory. I wanted to stay in the summer room forever, but a gentle voice told me the doors only open once. I chose the spring door and stepped through. I woke up feeling like I had made the right choice.",
      keySymbols: ["house", "doors", "seasons", "childhood home", "fireflies", "memories"],
      emotionalThemes: ["nostalgia", "bittersweet", "acceptance", "growth"],
      characters: [
        { name: "The Dreamer", role: "protagonist", description: "Yourself at different ages" },
        { name: "Gentle Voice", role: "guide", description: "An unseen voice offering guidance" },
      ],
      locations: [
        { name: "Childhood Home", description: "The dreamer's childhood home, impossibly large inside" },
        { name: "Summer Field", description: "A golden wheat field at dusk with fireflies" },
        { name: "Winter Hospital", description: "A snowy hospital entrance" },
        { name: "Spring Rainstorm", description: "A city street in warm spring rain" },
      ],
      timeline: [
        { scene: "Exploring the impossible house", order: 0 },
        { scene: "Summer door — childhood memories", order: 1 },
        { scene: "Winter door — adolescent memories", order: 2 },
        { scene: "Spring door — young adult memories", order: 3 },
        { scene: "Choosing the spring door", order: 4 },
      ],
      sensoryDetails: ["Warm summer air", "Cold winter wind", "Spring rain on skin", "Smell of old wood in the house"],
    },
    {
      summary: "Being the conductor of a symphony orchestra made entirely of animals in formal wear",
      story: "I was standing on a grand stage in a velvet tuxedo, baton in hand. Facing me was a full orchestra of animals — a bear playing cello, foxes on violins, an owl conducting the woodwinds with its hooting, rabbits on percussion. They were all wearing tiny tuxedos or elegant gowns. The music was the most beautiful thing I've ever heard — it told a story without words. I raised my baton and they watched me with complete trust. As I conducted, the music became visible — ribbons of color flowing from their instruments, wrapping around the concert hall. I woke up humming a melody I'd never heard before.",
      keySymbols: ["symphony", "animals", "formal wear", "music", "colored ribbons"],
      emotionalThemes: ["joy", "whimsy", "harmony", "wonder", "creativity"],
      characters: [
        { name: "The Dreamer", role: "protagonist", description: "Yourself as the conductor in a velvet tuxedo" },
        { name: "Bear Cellist", role: "musician", description: "A large brown bear playing cello" },
        { name: "Fox Violinists", role: "musicians", description: "A trio of foxes playing violins" },
        { name: "Owl Conductor", role: "musician", description: "An owl conducting the woodwind section" },
      ],
      locations: [
        { name: "Grand Concert Hall", description: "An opulent concert hall with golden ceilings" },
      ],
      timeline: [
        { scene: "Stepping onto the stage in a tuxedo", order: 0 },
        { scene: "Seeing the animal orchestra", order: 1 },
        { scene: "Raising the baton", order: 2 },
        { scene: "Music becoming visible ribbons of color", order: 3 },
      ],
      sensoryDetails: ["Rich velvet texture of the tuxedo", "Warm wood and brass smell", "Music as visible color", "Soft stage lighting"],
      completenessScore: 92,
    },
  ];

  const dreams: DreamReconstruction[] = [];
  const dates = generateDateRange(count);

  for (let i = 0; i < count; i++) {
    const template = dreamTemplates[i % dreamTemplates.length];
    dreams.push({
      summary: template.summary || `Dream ${i + 1}`,
      story: template.story || "A mysterious dream...",
      keySymbols: template.keySymbols || ["unknown"],
      emotionalThemes: template.emotionalThemes || ["curiosity"],
      characters: template.characters || [],
      locations: template.locations || [],
      timeline: template.timeline || [],
      sensoryDetails: template.sensoryDetails || [],
      completenessScore: template.completenessScore || Math.floor(50 + Math.random() * 45),
      estimatedDuration: { min: 10 + Math.floor(Math.random() * 20), max: 20 + Math.floor(Math.random() * 30) },
    });
  }

  return dreams;
}

// ── Seed Dream IDs ────────────────────────────────────────
export function generateSeedDreamIds(count: number = 5): string[] {
  return Array.from({ length: count }, (_, i) => `seed_dream_${i + 1}`);
}

// ── Seed Dream Dates ─────────────────────────────────────
export function generateSeedDates(count: number = 5): string[] {
  return generateDateRange(count);
}

function generateDateRange(count: number): string[] {
  const dates: string[] = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i * 3); // Every 3 days
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}

// ── Seed Dream Interpretation ────────────────────────────
export function generateSeedInterpretation(): DreamInterpretation {
  return {
    dreamId: "seed_dream_1",
    insights: [
      {
        perspective: "psychological",
        title: "The Skyward Reach: A Psychological View",
        content: "Dreams of flying often represent a desire for freedom or escape from constraints. The neon city may symbolize a technologically-driven modern life, while the act of flying suggests you are seeking perspective above your daily concerns. The starlight woman could represent an idealized aspect of yourself or a guiding intuition.",
        symbols: [
          { symbol: "flying", meaning: "Desire for freedom, perspective, or transcendence", confidence: 0.85, perspective: "psychological" },
          { symbol: "neon city", meaning: "Modern life, technology, artificiality", confidence: 0.7, perspective: "psychological" },
        ],
      },
      {
        perspective: "symbolic",
        title: "Wings of the Soul: A Symbolic View",
        content: "Across cultures, flying in dreams is associated with spiritual ascension and liberation. The moon represents the unconscious, intuition, and feminine energy. Starlight is often seen as divine guidance or inspiration.",
        symbols: [
          { symbol: "moon", meaning: "The unconscious mind, intuition, feminine energy", confidence: 0.8, perspective: "symbolic" },
          { symbol: "starlight", meaning: "Divine guidance, inspiration, higher self", confidence: 0.75, perspective: "symbolic" },
        ],
      },
      {
        perspective: "archetypal",
        title: "The Mercurial Messenger: An Archetypal View",
        content: "This dream carries strong themes of the Mercurial archetype — the messenger, the traveler between worlds. Flying represents the ability to move between conscious and unconscious realms. The starlight woman embodies the Anima, offering guidance from the depths.",
        symbols: [
          { symbol: "flying", meaning: "Mercurial transcendence, boundary-crossing", confidence: 0.82, perspective: "archetypal" },
          { symbol: "starlight woman", meaning: "Anima/Animus, the inner guide", confidence: 0.78, perspective: "archetypal" },
        ],
      },
    ],
    reflectionQuestions: [
      "What is currently making you feel trapped or constrained?",
      "What aspects of yourself feel 'neon' or artificially brightened?",
      "Who or what in your life serves as a guiding light?",
    ],
    personalPatternInsights: [
      "This dream shows a strong desire for transcendence and perspective.",
      "Recurring light imagery suggests a search for clarity or guidance.",
    ],
    disclaimer: "Dream interpretation is not an exact science. These insights are suggestions and perspectives — not definitive meanings. Your own intuition about your dream is the most valid interpretation.",
  };
}

// ── Seed Movie Generation Output ──────────────────────────
export function generateSeedMovieOutput(): MovieGenerationOutput {
  const scenes: ScenePrompt[] = [
    {
      sceneNumber: 1,
      sceneTitle: "The Ascent",
      visualPrompt: "Cinematic drone shot rising through a futuristic city at dusk. Neon lights in purple and cyan reflect off rain-slicked streets. Camera smoothly ascends past towering glass skyscrapers.",
      duration: 12,
      style: "cinematic",
      aspectRatio: "16:9",
      description: "Camera rises from ground level through neon-lit streets, ascending past towering glass buildings.",
      mood: "Awe-inspiring",
      cameraDirection: "Crane shot rising vertically",
      characterFocus: ["The Dreamer"],
    },
    {
      sceneNumber: 2,
      sceneTitle: "The Moon's Embrace",
      visualPrompt: "A lone figure floating in a star-filled sky, arms outstretched towards a giant luminous moon with intricate crater details.",
      duration: 15,
      style: "fantasy",
      aspectRatio: "16:9",
      description: "The dreamer floats towards an enormous moon that fills the sky.",
      mood: "Ethereal",
      cameraDirection: "Slow dolly zoom towards the moon",
      characterFocus: ["The Dreamer"],
    },
    {
      sceneNumber: 3,
      sceneTitle: "The Starlight Encounter",
      visualPrompt: "A luminous feminine figure made of flowing starlight dancing atop a crystalline spire. Her form shimmers with constellations and nebulae.",
      duration: 18,
      style: "fantasy",
      aspectRatio: "16:9",
      description: "A woman composed of starlight appears, dancing on the highest spire.",
      mood: "Magical",
      cameraDirection: "Wide shot revealing the spire, then slow push-in",
      characterFocus: ["The Dreamer", "Starlight Woman"],
    },
  ];

  return {
    title: "Neon Ascension",
    tagline: "Above the city of lights, the soul takes flight",
    storyboard: { scenes },
    totalDuration: 45,
    style: "cinematic",
    aspectRatio: "16:9",
    narrationPrompt: "You rise through a world of neon and glass, carried by an invisible current. Above you, the moon waits.",
  };
}

// ── Seed Pattern Analytics ────────────────────────────────
export function generateSeedAnalytics(userId: string = "seed_user"): PatternAnalytics {
  return {
    userId,
    totalDreamsAnalyzed: 5,
    dateRange: { start: "2026-05-20", end: "2026-06-05" },
    symbolFrequency: [
      { symbol: "flying", count: 3, percentage: 60, firstAppearance: "2026-05-20", lastAppearance: "2026-06-02" },
      { symbol: "water", count: 2, percentage: 40, firstAppearance: "2026-05-23", lastAppearance: "2026-06-05" },
      { symbol: "doors", count: 2, percentage: 40, firstAppearance: "2026-05-26", lastAppearance: "2026-05-26" },
      { symbol: "animals", count: 1, percentage: 20, firstAppearance: "2026-06-05", lastAppearance: "2026-06-05" },
    ],
    emotionCorrelations: [
      {
        emotion: "wonder",
        frequency: 3,
        associatedSymbols: ["flying", "starlight", "music"],
        typicalCompletenessScore: 85,
      },
      {
        emotion: "curiosity",
        frequency: 2,
        associatedSymbols: ["library", "books", "doors"],
        typicalCompletenessScore: 72,
      },
      {
        emotion: "freedom",
        frequency: 2,
        associatedSymbols: ["flying", "sky"],
        typicalCompletenessScore: 88,
      },
    ],
    characterRecurrences: [
      { name: "the dreamer", role: "protagonist", appearances: 5, dreamIds: ["1", "2", "3", "4", "5"] },
      { name: "starlight woman", role: "guide", appearances: 1, dreamIds: ["1"] },
    ],
    locationPatterns: [
      { name: "neon city", frequency: 1, dreamIds: ["1"] },
      { name: "infinite library", frequency: 1, dreamIds: ["2"] },
      { name: "glass beach", frequency: 1, dreamIds: ["3"] },
    ],
    moodCorrelations: [
      { moodTag: "joy", totalDreams: 3, commonSymbols: ["flying", "music", "starlight"], averageCompleteness: 86 },
      { moodTag: "sadness", totalDreams: 1, commonSymbols: ["grandmother", "glass", "beach"], averageCompleteness: 78 },
      { moodTag: "fear", totalDreams: 1, commonSymbols: ["faceless figure", "library"], averageCompleteness: 65 },
    ],
    topInsights: [
      "Flying appears in 60% of your dreams, suggesting a strong desire for freedom and perspective.",
      "Your most vivid dreams involve wonder and awe — these are your deepest emotional connections.",
      "Recurring guide figures (Starlight Woman, Grandmother's voice) suggest you seek wisdom from within.",
    ],
  };
}

// ── Seed Monthly Report ───────────────────────────────────
export function generateSeedMonthlyReport(
  userId: string = "seed_user",
  month: string = "2026-06"
): MonthlyReport {
  return {
    userId,
    month,
    generatedAt: new Date().toISOString(),
    summary: {
      month,
      totalDreams: 5,
      averageCompleteness: 78,
      mostCommonEmotion: "wonder",
      mostRecurringSymbol: "flying",
      dreamStreak: 4,
    },
    stats: [
      { label: "Total Dreams", value: 5 },
      { label: "Avg. Completeness", value: "78%", change: 12 },
      { label: "Longest Streak", value: "4 days" },
      { label: "Total Symbols", value: 18 },
      { label: "Unique Symbols", value: 14 },
      { label: "Avg. Dream Duration", value: "15-28 min" },
      { label: "Most Common Emotion", value: "wonder" },
      { label: "Dreams with Characters", value: "100%" },
      { label: "Dreams with Locations", value: "100%" },
    ],
    topSymbols: [
      { symbol: "flying", count: 3, percentage: 60, firstAppearance: "2026-05-20", lastAppearance: "2026-06-02" },
      { symbol: "water", count: 2, percentage: 40, firstAppearance: "2026-05-23", lastAppearance: "2026-06-05" },
    ],
    emotionalJourney: "This month's dreams show a rich emotional landscape dominated by wonder and curiosity. Your flying dreams suggest a period of personal growth and desire for broader perspective. The appearance of nostalgic elements (grandmother's voice, childhood home) indicates a period of reflection and integration.",
    notableDreams: ["seed_dream_1", "seed_dream_3"],
    insightsAndPatterns: "A clear pattern of transcendent imagery emerges — flying, starlight, music. These elements correlate with your highest completeness scores, suggesting these dreams carry particular emotional weight. The recurrence of guide figures (both luminous and shadowy) suggests an active inner dialogue.",
    recommendation: "Your dreams are telling you to look up — literally and metaphorically. The flying and starlight imagery suggests you're ready to expand your perspective.",
    nextMonthGoal: "Try setting an intention before sleep to explore what the 'doors' in your dreams might open to.",
    chartData: {
      emotionsOverTime: [
        { date: "2026-05-20", emotion: "freedom", intensity: 0.9 },
        { date: "2026-05-23", emotion: "curiosity", intensity: 0.7 },
        { date: "2026-05-26", emotion: "melancholy", intensity: 0.8 },
        { date: "2026-05-29", emotion: "nostalgia", intensity: 0.85 },
        { date: "2026-06-02", emotion: "joy", intensity: 0.95 },
      ],
      symbolsOverTime: [
        { date: "2026-05-20", symbol: "flying", count: 1 },
        { date: "2026-05-20", symbol: "neon city", count: 1 },
        { date: "2026-05-23", symbol: "library", count: 1 },
        { date: "2026-05-26", symbol: "beach", count: 1 },
        { date: "2026-06-02", symbol: "house", count: 1 },
      ],
      completenessTrend: [
        { date: "2026-05-20", score: 78 },
        { date: "2026-05-23", score: 72 },
        { date: "2026-05-26", score: 85 },
        { date: "2026-05-29", score: 65 },
        { date: "2026-06-02", score: 92 },
      ],
    },
  };
}

// ── Generate Alternate Ending ─────────────────────────────
export function generateSeedAlternateEnding(): AlternateEndingOutput {
  return {
    type: "face-the-threat",
    title: "Confronting the Shadow",
    narrative: "As you float towards the starlight woman, a dark vortex opens beneath the city. From it emerges a shadow version of yourself, made of forgotten fears and suppressed memories. Instead of fleeing, you turn to face it. The starlight woman's light intensifies, and you feel her power flowing through you. You reach out your hand to the shadow, and instead of fighting, you embrace it. The darkness dissolves into light, and you understand that every shadow is just light waiting to be seen. You wake with tears on your face and a profound sense of peace.",
    keyChanges: [
      "The dreamer confronts rather than avoids the darkness",
      "The shadow is revealed as a part of the self",
      "The ending transforms from wonder to integration",
      "The dream ends with emotional catharsis rather than mystery",
    ],
    emotionalTone: "Cathartic and peaceful",
    sceneBreakdown: [
      {
        sceneNumber: 1,
        sceneTitle: "The Void Opens",
        visualPrompt: "A dark swirling vortex opens beneath a neon city skyline. From it rises a shadowy figure made of living darkness.",
        duration: 10,
        style: "cinematic",
        aspectRatio: "16:9",
        description: "A dark vortex tears open beneath the neon city.",
        mood: "Tense",
        cameraDirection: "Low angle looking up at the shadow",
      },
      {
        sceneNumber: 2,
        sceneTitle: "The Embrace",
        visualPrompt: "Two hands reaching towards each other — one bathed in moonlight, one made of shadow. As they touch, the shadow dissolves into golden light.",
        duration: 15,
        style: "cinematic",
        aspectRatio: "16:9",
        description: "The dreamer embraces the shadow, which dissolves into light.",
        mood: "Cathartic",
        cameraDirection: "Close-up on hands touching, then wide",
        characterFocus: ["The Dreamer", "Shadow Self", "Starlight Woman"],
      },
    ],
  };
}

// ── Generate Dream Universe Entities ──────────────────────
export function generateSeedUniverse(dreams: DreamReconstruction[] = generateSeedDreams(5)) {
  // Extract recurring characters, locations, and symbols from dreams
  const characterMap = new Map<string, { name: string; role: string; descriptions: string[]; dreamCount: number }>();
  const locationMap = new Map<string, { name: string; descriptions: string[]; dreamCount: number }>();
  const symbolSet = new Set<string>();

  dreams.forEach((dream) => {
    (dream.characters || []).forEach((char) => {
      const key = char.name.toLowerCase();
      const existing = characterMap.get(key);
      if (existing) {
        existing.descriptions.push(char.description);
        existing.dreamCount++;
      } else {
        characterMap.set(key, {
          name: char.name,
          role: char.role,
          descriptions: [char.description],
          dreamCount: 1,
        });
      }
    });

    (dream.locations || []).forEach((loc) => {
      const key = loc.name.toLowerCase();
      const existing = locationMap.get(key);
      if (existing) {
        existing.descriptions.push(loc.description);
        existing.dreamCount++;
      } else {
        locationMap.set(key, {
          name: loc.name,
          descriptions: [loc.description],
          dreamCount: 1,
        });
      }
    });

    (dream.keySymbols || []).forEach((s) => symbolSet.add(s));
  });

  return {
    characters: Array.from(characterMap.values()).map((c) => ({
      name: c.name,
      role: c.role,
      description: c.descriptions[0],
      appearances: c.dreamCount,
      firstSeen: "2026-05-20",
      lastSeen: "2026-06-05",
    })),
    locations: Array.from(locationMap.values()).map((l) => ({
      name: l.name,
      description: l.descriptions[0],
      appearances: l.dreamCount,
    })),
    symbols: Array.from(symbolSet).map((s) => ({
      symbol: s,
      appearances: dreams.filter((d) => (d.keySymbols || []).includes(s)).length,
    })),
    totalDreamsAnalyzed: dreams.length,
  };
}