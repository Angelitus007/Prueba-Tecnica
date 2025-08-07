export const Dialogs = {
  deleteHero: 'deleteHero',
  updateHero: 'updateHero',
  createHero: 'createHero',
} as const;

export type DialogType = typeof Dialogs[keyof typeof Dialogs];
