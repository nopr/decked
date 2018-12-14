export default {
  name: 'Warrior',
  description: 'You are a physical fighter who relies on combining precise strikes and defends.',
  health: {
    default: 30,
    increments: 5,
  },
  deck: [
    'strike',
    'strike',
    'defend',
    'defend',
    'defend',
  ],
  attributes: [
    {
      name: 'Tough',
      description: 'Start with more Health than normal.',
      effects: [
        { name: 'player_increase_health', value: 10 },
        { name: 'player_heal', value: 10 },
      ],
    },
    {
      name: 'Harsh',
      description: 'Start with more Strikes than Defends.',
      effects: [
        { name: 'player_add_card', value: 'strike' },
        { name: 'player_remove_card', value: 'defend' },
      ],
    },
    {
      name: 'Defensive',
      description: 'Start with a Shield Bash instead of a Defend.',
      effects: [
        { name: 'player_add_card', value: 'shieldbash' },
        { name: 'player_remove_card', value: 'defend' },
      ],
    },
    {
      name: 'Quick',
      description: 'Start with a Quick Strike instead of a Strike.',
      effects: [
        { name: 'player_add_card', value: 'quickstrike' },
        { name: 'player_remove_card', value: 'strike' },
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
    quickstrike: {
      name: 'Quick Strike',
      type: 'attack',
      cost: 1,
      text: 'Deal <b>5</b> damage.<br />&times;2',
      action() {
        this.commit('enemy_take_damage', 5);
        this.commit('enemy_take_damage', 5);
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
    shieldbash: {
      name: 'Shield Bash',
      type: 'attack',
      cost: 1,
      text: 'Gain <b>4</b> block.<br />Deal <b>5</b> damage.',
      action() {
        this.commit('player_gain_effect', {
          name: 'block',
          value: 4,
        });
        this.commit('enemy_take_damage', {
          name: 'block',
          value: 5,
        });
      },
    },
  },
};
