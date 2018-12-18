export default {
  name: 'Adventurer',
  description: 'You\'re ready to adventure!',
  health: {
    default: 10,
    increments: 5,
  },
  gold: 50,
  deck: [
    'strike',
    'strike',
    'strike',
    'defend',
    'defend',
    'defend',
  ],
  attributes: [
    {
      name: 'Tough',
      description: 'You are tough.',
      effects: [
        // { name: 'player_increase_health', value: 10 },
        // { name: 'player_heal', value: 10 },
      ],
    },
    {
      name: 'Smart',
      description: 'You are smart.',
      effects: [
        // { name: 'player_add_card', value: 'strike' },
        // { name: 'player_remove_card', value: 'defend' },
      ],
    },
    {
      name: 'Quick',
      description: 'You are quick.',
      effects: [
        // { name: 'player_add_card', value: 'shieldbash' },
        // { name: 'player_remove_card', value: 'defend' },
      ],
    },
    {
      name: 'Strong',
      description: 'You are strong.',
      effects: [
        // { name: 'player_add_card', value: 'quickstrike' },
        // { name: 'player_remove_card', value: 'strike' },
      ],
    },
  ],
  cards: {
    strike: {
      name: 'Strike',
      type: 'attack',
      cost: 1,
      text: 'Deal <b>10</b> damage.',
      action() {
        this.commit('enemy_take_damage', 10);
      },
    },
    defend: {
      name: 'Defend',
      type: 'skill',
      cost: 1,
      text: 'Gain <b>8</b> block.',
      action() {
        this.commit('player_gain_effect', {
          name: 'block',
          value: 8,
        });
      },
    },
  },
};
