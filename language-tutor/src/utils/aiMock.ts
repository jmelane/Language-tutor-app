import { Language, Message, Feedback, ProficiencyLevel } from '../types';

const RESPONSES: Record<Language, string[]> = {
  Spanish: [
    "¡Hola! ¿Cómo estás hoy?",
    "Me parece muy interesante. Cuéntame más.",
    "Esa es una excelente pregunta.",
    "Estoy aquí para ayudarte a mejorar tu español."
  ],
  French: [
    "Bonjour! Comment allez-vous aujourd'hui?",
    "C'est très intéressant. Dites-m'en plus.",
    "C'est une excellente question.",
    "Je suis là pour vous aider à améliorer votre français."
  ],
  German: [
    "Hallo! Wie geht es dir heute?",
    "Das finde ich sehr interessant. Erzähl mir mehr.",
    "Das ist eine ausgezeichnete Frage.",
    "Ich bin hier, um dir zu helfen, dein Deutsch zu verbessern."
  ],
  Japanese: [
    "こんにちは！元気ですか？",
    "それはとても興味深いです。もっと教えてください。",
    "それは素晴らしい質問ですね。",
    "あなたの日本語の上達をお手伝いします。"
  ],
  Italian: [
    "Ciao! Come stai oggi?",
    "Mi sembra molto interessante. Dimmi di più.",
    "È un'ottima domanda.",
    "Sono qui per aiutarti a migliorare il tuo italiano."
  ]
};

export const generateAIResponse = async (
  input: string,
  language: Language,
  proficiency: ProficiencyLevel
): Promise<{ content: string; feedback: Feedback }> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

  // Mock response selection
  const responses = RESPONSES[language];
  let content = responses[Math.floor(Math.random() * responses.length)];

  // Very basic echo to simulate context
  if (input.length > 20) {
     content = `${content} (You mentioned: "${input.substring(0, 15)}...")`;
  }

  // Mock feedback generation based on input length or random keywords
  const feedback: Feedback = {
    corrections: [],
    suggestions: [],
    positivePoints: []
  };

  if (input.length < 10) {
    feedback.suggestions.push(`Try to expand your sentence to practice more vocabulary in ${language}.`);
  } else {
    feedback.positivePoints.push("Great sentence structure!");
  }

  if (Math.random() > 0.7) {
    feedback.corrections.push({
      original: input.substring(0, 5) + "...",
      corrected: "Consider using a more formal greeting.",
      explanation: "In this context, formal language might be more appropriate.",
      type: 'vocabulary'
    });
  }
  
  if (input.toLowerCase().includes("fail")) {
     feedback.corrections.push({
        original: "fail",
        corrected: "succeed",
        explanation: "Let's stay positive!",
        type: 'vocabulary'
     });
  }

  return { content, feedback };
};
