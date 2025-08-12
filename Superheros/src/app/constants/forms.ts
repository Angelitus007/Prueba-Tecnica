export const Forms = {
  createHero: 'createHero',
  updateHero: 'updateHero'
} as const;

export type FormType = typeof Forms[keyof typeof Forms];
