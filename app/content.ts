// Everything you might want to tweak lives here: names, copy, and asset paths.

export const NAME = process.env.NEXT_PUBLIC_CELEBRANT_NAME?.trim() || "Birthday Star";
export const SENDER = process.env.NEXT_PUBLIC_SENDER_NAME?.trim() || "";

export const assets = {
  photo: "/celebrant.jpeg",
  // Your recorded voice note (a WhatsApp .m4a). Swap the file to change it.
  voice: "/voice-message.m4a",
};

export const copy = {
  welcome: {
    title: "Well, well, well… look who's getting older!",
    sub: "But before you get too carried away, someone has a little something for you.",
    button: "Open your surprise",
  },
  reveal: {
    eyebrow: "It's your day! 🥳",
    headline: "Happy Birthday",
    line: "Today the world celebrates you, and I couldn't let the day pass without making it a little extra special.",
  },
  letter: {
    title: "A little note",
    paragraphs: [
      "Some people deserve to be celebrated beyond the usual birthday messages, and today I want to take a moment to celebrate you.",
      "Thank you for being the kind of person who makes things lighter just by showing up. Another year means another chapter, and you've earned every page of it.",
      "I hope this new chapter brings you closer to everything you've been working towards. May your prayers find answers, your effort find rewards, and your days find plenty of reasons to laugh.",
    ],
  },
  voice: {
    title: "There's something I want you to hear.",
    button: "Play my message",
    pause: "Pause",
    replay: "Play again",
  },
  gift: {
    eyebrow: "Wait, you thought that was all?",
    title: "There's just one more thing.",
    hint: "Tap the gift",
    wish: "My wish for you: that you never lose the reasons that make you happy. May life keep handing you beautiful ones, and may this new chapter bring you joy, growth, answered prayers, and everything your heart genuinely wants.",
  },
  closing: {
    title: "Happy birthday once again.",
    sub: "And that's my little way of making your day a little more special. Here's to another beautiful chapter. 🥂",
    made: "Made with love, especially for you.",
    replay: "Replay your surprise",
  },
  next: "Continue",
};
