export const formTypes = {
  createHero: 'createHero',
  updateHero: 'updateHero'
} as const;

export type FormType = typeof formTypes[keyof typeof formTypes];
