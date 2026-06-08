// ============================================================
// DreamScape AI — AI Client Mock
// Used for unit tests to avoid actual API calls.
// ============================================================

export const chat = async (messages: any[], config?: any) => {
  return {
    content: JSON.stringify({
      summary: "Test dream summary",
      keyPoints: ["point 1", "point 2"],
    }),
    tokenUsage: {
      inputTokens: 50,
      outputTokens: 30,
      totalTokens: 80,
      cost: 0.002,
    },
  };
};

export const chatStructured = async <T>(messages: any[], config?: any) => {
  // Return different mock data based on the pipeline function
  const systemContent = messages.find((m: any) => m.role === "system")?.content || "";
  const userContent = messages.find((m: any) => m.role === "user")?.content || "";

  // Detect which pipeline is calling based on system prompt content
  if (systemContent.includes("reconstruct")) {
    return {
      data: {
        summary: "A dream about flying over a neon city",
        story: "I was soaring above a sprawling metropolis at dusk. The buildings pulsed with neon light. Below me, rivers of traffic flowed like liquid fire. I felt weightless and free, carried by an unseen current. A giant moon hung on the horizon, so close I could almost touch it. Then I saw her — a woman made of starlight, dancing on the highest spire.",
        keySymbols: ["flying", "neon city", "moon", "starlight woman", "height"],
        emotionalThemes: ["freedom", "awe", "wonder", "slight anxiety"],
        characters: [
          { name: "The Dreamer", role: "protagonist", description: "Yourself, flying above the city" },
          { name: "Starlight Woman", role: "guide", description: "A luminous figure made of starlight" },
        ],
        locations: [
          { name: "Neon City", description: "A sprawling futuristic city at dusk with neon-lit buildings" },
        ],
        timeline: [
          { scene: "Soaring above the city skyline", order: 0 },
          { scene: "Floating through neon canyons", order: 1 },
          { scene: "Approaching the giant moon", order: 2 },
          { scene: "Encountering the Starlight Woman", order: 3 },
        ],
        sensoryDetails: [
          "Wind rushing past",
          "Neon light reflections",
          "Feeling of weightlessness",
          "Distant city hum",
        ],
        completenessScore: 78,
        estimatedDuration: { min: 15, max: 25 },
      },
      tokenUsage: { inputTokens: 150, outputTokens: 200, totalTokens: 350, cost: 0.008 },
    };
  }

  if (systemContent.includes("interpret")) {
    return {
      data: {
        insights: {
          psychological: {
            title: "The Skyward Reach: A Psychological View",
            content: "Dreams of flying often represent a desire for freedom or escape from constraints. The neon city may symbolize a technologically-driven modern life, while the act of flying suggests you are seeking perspective above your daily concerns. The starlight woman could represent an idealized aspect of yourself or a guiding intuition.",
            symbols: [
              { symbol: "flying", meaning: "Desire for freedom, perspective, or transcendence", confidence: 0.85 },
              { symbol: "neon city", meaning: "Modern life, technology, artificiality", confidence: 0.7 },
            ],
          },
          symbolic: {
            title: "Wings of the Soul: A Symbolic View",
            content: "Across cultures, flying in dreams is associated with spiritual ascension and liberation. The moon represents the unconscious, intuition, and feminine energy. Starlight is often seen as divine guidance or inspiration. The combination suggests a journey of spiritual awakening guided by inner wisdom.",
            symbols: [
              { symbol: "moon", meaning: "The unconscious mind, intuition, feminine energy", confidence: 0.8 },
              { symbol: "starlight", meaning: "Divine guidance, inspiration, higher self", confidence: 0.75 },
            ],
          },
          archetypal: {
            title: "The Mercurial Messenger: An Archetypal View",
            content: "This dream carries strong themes of the Mercurial archetype — the messenger, the traveler between worlds. Flying represents the ability to move between conscious and unconscious realms. The starlight woman embodies the Anima (the feminine aspect of the male psyche) or the Wise Woman archetype, offering guidance from the depths.",
            symbols: [
              { symbol: "flying", meaning: "Mercurial transcendence, boundary-crossing", confidence: 0.82 },
              { symbol: "starlight woman", meaning: "Anima/Animus, the inner guide, the muse", confidence: 0.78 },
            ],
          },
        },
        reflectionQuestions: [
          "What is currently making you feel trapped or constrained?",
          "What aspects of yourself feel 'neon' or artificially brightened?",
          "Who or what in your life serves as a guiding light?",
          "How does freedom feel in your waking life right now?",
        ],
        personalPatternInsights: [
          "This is your first recorded dream — patterns will emerge as you record more.",
        ],
      },
      tokenUsage: { inputTokens: 300, outputTokens: 400, totalTokens: 700, cost: 0.015 },
    };
  }

  if (systemContent.includes("film director") || systemContent.includes("movie")) {
    return {
      data: {
        title: "Neon Ascension",
        tagline: "Above the city of lights, the soul takes flight",
        scenes: [
          {
            sceneNumber: 1,
            sceneTitle: "The Ascent",
            description: "Camera rises from ground level through neon-lit streets, ascending past towering glass buildings towards the night sky.",
            mood: "Awe-inspiring",
            cameraDirection: "Crane shot rising vertically",
            visualPrompt: "Cinematic drone shot rising through a futuristic city at dusk. Neon lights in purple and cyan reflect off rain-slicked streets. Camera smoothly ascends past towering glass skyscrapers with holographic advertisements. The city stretches to the horizon in a grid of light. Cyberpunk aesthetic meets dreamlike quality. 8K resolution, warm amber tones transitioning to cool blues.",
            duration: 12,
            characterFocus: ["The Dreamer"],
          },
          {
            sceneNumber: 2,
            sceneTitle: "The Moon's Embrace",
            description: "The dreamer floats towards an enormous moon that fills the sky, feeling its gravitational pull.",
            mood: "Ethereal",
            cameraDirection: "Slow dolly zoom towards the moon with dreamer in foreground",
            visualPrompt: "A lone figure floating in a star-filled sky, arms outstretched towards a giant luminous moon. The moon has intricate crater details visible, glowing with soft silver light. Stars twinkle in deep indigo space. Figure silhouetted against lunar glow. Ethereal atmosphere, floating sensation, cosmic scale. Studio Ghibli meets 2001: A Space Odyssey.",
            duration: 15,
            characterFocus: ["The Dreamer"],
          },
          {
            sceneNumber: 3,
            sceneTitle: "The Starlight Encounter",
            description: "A woman composed of starlight appears, dancing on the highest spire, inviting the dreamer closer.",
            mood: "Magical",
            cameraDirection: "Wide shot revealing the spire, then slow push-in",
            visualPrompt: "A luminous feminine figure made of flowing starlight dancing atop a crystalline spire. Her form shimmers with constellations and nebulae. The spire rises from the highest skyscraper, surrounded by swirling aurora. Sparks of light trail her movements. Magical realism style, bioluminescent colors, dreamlike atmosphere. Cinematic lighting with volumetric fog.",
            duration: 18,
            characterFocus: ["The Dreamer", "Starlight Woman"],
          },
        ],
        totalDuration: 45,
        narrationPrompt: "You rise through a world of neon and glass, carried by an invisible current. Above you, the moon waits. Beyond it, something ancient and luminous calls you home.",
      },
      tokenUsage: { inputTokens: 250, outputTokens: 500, totalTokens: 750, cost: 0.018 },
    };
  }

  if (systemContent.includes("alternate ending") || systemContent.includes("dream continuation")) {
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
      scenes: [
        {
          sceneNumber: 1,
          sceneTitle: "The Void Opens",
          description: "A dark vortex tears open beneath the neon city, and a shadow figure emerges.",
          mood: "Tense",
          cameraDirection: "Low angle looking up at the shadow",
          visualPrompt: "A dark swirling vortex opens beneath a neon city skyline. From it rises a shadowy figure made of living darkness with faint human features. Neon lights reflect off its surface. The dreamer floats above, backlit by moonlight. Tension between light and dark. Cinematic contrast.",
          duration: 10,
        },
        {
          sceneNumber: 2,
          sceneTitle: "The Embrace",
          description: "Rather than fleeing, the dreamer reaches out and embraces the shadow, which dissolves into light.",
          mood: "Cathartic",
          cameraDirection: "Close-up on hands touching, then wide as shadow explodes into light",
          visualPrompt: "Two hands reaching towards each other — one bathed in moonlight, one made of shadow. As they touch, the shadow figure dissolves into a burst of golden light that spreads across the entire sky. The starlight woman watches with approval. Emotional, warm, transformative. Volumetric light rays.",
          duration: 15,
          characterFocus: ["The Dreamer", "Shadow Self", "Starlight Woman"],
        },
      ],
    };
  }

  // Default mock response for unknown pipelines
  return {
    data: {
      summary: "Mock dream data",
      story: "Mock story for testing.",
      keySymbols: ["test"],
      emotionalThemes: ["curiosity"],
      characters: [{ name: "Test Character", role: "protagonist", description: "A test character" }],
      locations: [{ name: "Test Location", description: "A test location" }],
      timeline: [{ scene: "Test scene", order: 0 }],
      sensoryDetails: [],
      completenessScore: 50,
      estimatedDuration: { min: 5, max: 10 },
    },
    tokenUsage: { inputTokens: 100, outputTokens: 150, totalTokens: 250, cost: 0.005 },
  };
};

export const chatStream = async (
  messages: any[],
  onChunk: (chunk: any) => void,
  config?: any
) => {
  // Simulate streaming chunks
  const words = [
    "Let's", "explore", "your", "dream", "together.",
    "Where", "did", "it", "take", "place?",
  ];
  for (const word of words) {
    onChunk({ delta: word + " ", finishReason: null });
  }
  onChunk({ delta: "", finishReason: "stop" });

  return {
    inputTokens: 20,
    outputTokens: 15,
    totalTokens: 35,
    cost: 0.0005,
  };
};
