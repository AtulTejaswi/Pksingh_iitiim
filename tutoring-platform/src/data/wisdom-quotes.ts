export type QuoteCategory = 'bhagavad-gita' | 'vedas' | 'upanishads';

export interface WisdomQuote {
  text: string;
  source: string;
  category: QuoteCategory;
}

export const wisdomQuotes: WisdomQuote[] = [
  { text: 'Set thy heart upon thy work, but never on its reward.', source: 'Bhagavad Gita 2.47', category: 'bhagavad-gita' },
  { text: 'Undisturbed by success or failure, such a person is wise.', source: 'Bhagavad Gita 2.48', category: 'bhagavad-gita' },
  { text: 'The mind is restless and difficult to restrain, but it is subdued by constant practice and dispassion.', source: 'Bhagavad Gita 6.35', category: 'bhagavad-gita' },
  { text: 'Let noble thoughts come to us from every side.', source: 'Rig Veda 1.89.1', category: 'vedas' },
  { text: 'Lead me from the unreal to the real. Lead me from darkness to light.', source: 'Brihadaranyaka Upanishad 1.3.28', category: 'upanishads' },
  { text: 'You are what your deepest desire is. As your desire is, so is your will.', source: 'Brihadaranyaka Upanishad 4.4.5', category: 'upanishads' },
];
