export type QuoteCategory = 'bhagavad-gita' | 'ashtavakra-gita' | 'vedas' | 'upanishads';

export interface WisdomQuote {
  text: string;
  source: string;
  category: QuoteCategory;
}

export const wisdomQuotes: WisdomQuote[] = [
  // ── Bhagavad Gita ──
  { text: 'You have the right to perform your prescribed duties, but you are not entitled to the fruits of your actions.', source: 'Bhagavad Gita 2.47', category: 'bhagavad-gita' },
  { text: 'The soul is neither born, nor does it ever die; nor having once been, does it again cease to be.', source: 'Bhagavad Gita 2.20', category: 'bhagavad-gita' },
  { text: 'When meditation is mastered, the mind is unwavering like the flame of a lamp in a windless place.', source: 'Bhagavad Gita 6.19', category: 'bhagavad-gita' },
  { text: 'Set thy heart upon thy work, but never on its reward.', source: 'Bhagavad Gita 2.47', category: 'bhagavad-gita' },
  { text: 'The peace that is born of discipline is greater than the enjoyment of the senses.', source: 'Bhagavad Gita 2.66', category: 'bhagavad-gita' },
  { text: 'Perform every action with your heart fixed on the Supreme Lord. Renounce attachment to the results.', source: 'Bhagavad Gita 3.30', category: 'bhagavad-gita' },
  { text: 'Undisturbed by success or failure, such a person is wise.', source: 'Bhagavad Gita 2.48', category: 'bhagavad-gita' },
  { text: 'The mind is restless and difficult to restrain, but it is subdued by constant practice and dispassion.', source: 'Bhagavad Gita 6.35', category: 'bhagavad-gita' },
  { text: 'A person can rise through the effort of their own mind; they can also fall through their own mind.', source: 'Bhagavad Gita 6.5', category: 'bhagavad-gita' },
  { text: 'There is neither this world nor the world beyond nor happiness for the one who doubts.', source: 'Bhagavad Gita 4.40', category: 'bhagavad-gita' },

  // ── Ashtavakra Gita ──
  { text: 'You are not the body, nor is the body yours. You are neither the doer nor the enjoyer. You are the free, eternal consciousness itself.', source: 'Ashtavakra Gita 1.4', category: 'ashtavakra-gita' },
  { text: 'There is no world, no thinker, no thought. You are the pure, non-dual consciousness in which all this appears.', source: 'Ashtavakra Gita 2.16', category: 'ashtavakra-gita' },
  { text: 'The wise one is like the sky — beyond all defilement, serene, and utterly content.', source: 'Ashtavakra Gita 15.4', category: 'ashtavakra-gita' },
  { text: 'You are already free. Knowing this, abide in peace. There is nothing to attain.', source: 'Ashtavakra Gita 1.1', category: 'ashtavakra-gita' },
  { text: 'Being desireless, seeing all as the Self, how can the wise one be bound?', source: 'Ashtavakra Gita 14.3', category: 'ashtavakra-gita' },
  { text: 'The pure consciousness in which the world appears is indivisible, one without a second.', source: 'Ashtavakra Gita 3.1', category: 'ashtavakra-gita' },
  { text: 'Abandon all cravings and live without longing. Be happy and at peace.', source: 'Ashtavakra Gita 15.2', category: 'ashtavakra-gita' },
  { text: 'Let the mind be free of clinging, see the truth, and find tranquillity that nothing can disturb.', source: 'Ashtavakra Gita 11.5', category: 'ashtavakra-gita' },
  { text: 'True freedom is the absence of all craving and the effortless abiding in one\'s own nature.', source: 'Ashtavakra Gita 18.1', category: 'ashtavakra-gita' },
  { text: 'You are not bound by anything. You are pure, free, and the witness of all that happens.', source: 'Ashtavakra Gita 1.3', category: 'ashtavakra-gita' },

  // ── Vedas ──
  { text: 'Truth is one, but the wise speak of it in many ways.', source: 'Rig Veda 1.164.46', category: 'vedas' },
  { text: 'Let noble thoughts come to us from every side.', source: 'Rig Veda 1.89.1', category: 'vedas' },
  { text: 'The wind has no form, no shape, yet it moves everything. So too does the spirit.', source: 'Rig Veda', category: 'vedas' },
  { text: 'He who sees all beings in the Self and the Self in all beings never turns away from it.', source: 'Yajur Veda', category: 'vedas' },
  { text: 'May we speak with love. May we walk together in harmony. May our minds be united.', source: 'Atharva Veda 3.30', category: 'vedas' },
  { text: 'The Self is the same in all beings. The wise see no distinction.', source: 'Sama Veda', category: 'vedas' },
  { text: 'A person is not great because of wealth or fame, but by the purity of their heart.', source: 'Yajur Veda', category: 'vedas' },
  { text: 'The one who knows the Self crosses beyond sorrow.', source: 'Rig Veda', category: 'vedas' },
  { text: 'What you sow, you reap. Every action returns to its doer.', source: 'Atharva Veda', category: 'vedas' },
  { text: 'May all beings look at each other with the eyes of a friend.', source: 'Yajur Veda 36.18', category: 'vedas' },

  // ── Upanishads ──
  { text: 'Lead me from the unreal to the real. Lead me from darkness to light. Lead me from death to immortality.', source: 'Brihadaranyaka Upanishad 1.3.28', category: 'upanishads' },
  { text: 'That which is the source of all life, all thought, and all consciousness — know that to be the Self.', source: 'Mandukya Upanishad', category: 'upanishads' },
  { text: 'You are what your deepest desire is. As your desire is, so is your will. As your will is, so is your deed.', source: 'Brihadaranyaka Upanishad 4.4.5', category: 'upanishads' },
  { text: 'The Self is not known through discourse, nor through intellect, nor through study. It is known only through the grace of the one who yearns for it.', source: 'Katha Upanishad 1.2.23', category: 'upanishads' },
  { text: 'When the wise realize the Self, they transcend all grief.', source: 'Chandogya Upanishad 7.1.3', category: 'upanishads' },
  { text: 'The whole universe is contained within the Self. There is no separation.', source: 'Isha Upanishad', category: 'upanishads' },
  { text: 'The knower of the Self is never afraid. For them, the world is filled with joy.', source: 'Taittiriya Upanishad 2.9', category: 'upanishads' },
  { text: 'Through constant meditation, the restless mind becomes still, like a flame in a windless place.', source: 'Shvetashvatara Upanishad 2.9', category: 'upanishads' },
  { text: 'That which is the finest essence — the whole universe has that as its Self.', source: 'Chandogya Upanishad 6.8.7', category: 'upanishads' },
  { text: 'Infinite is the Self, peaceful is the Self, and beyond all darkness is the Self.', source: 'Mundaka Upanishad 2.2.10', category: 'upanishads' },
];