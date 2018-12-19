export default {
  name: 'Fighter',
  description: 'You fight stuff.',
  health: {
    default: 20,
    increments: 5,
  },
  gold: 50,
  deck: [
    'attack',
    'tackle',
    'swing',
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
    attack: {
      name: 'Attack',
      type: 'attack',
      cost: 1,
      text: 'Deal <b>10</b> damage.',
      target: 'single',
      action(card) {
        this.commit('enemy_take_damage', { target: card.target_id, value: 10 });
      },
    },
    tackle: {
      name: 'Tackle',
      type: 'attack',
      cost: 1,
      text: 'Deal <b>15</b> damage.<br />Suffer <b>5</b> damage.',
      target: 'single',
      action(card) {
        this.commit('enemy_take_damage', { target: card.target_id, value: 15 });
        this.commit('player_take_damage', { value: 5 });
      },
    },
    swing: {
      name: 'Swing',
      type: 'attack',
      cost: 2,
      text: 'Deal <b>5</b> damage to all enemies.',
      target: 'all',
      action(card) {
        const enemies = this.state.battle.enemies.length;
        for (let enemy = 0; enemy < enemies; enemy += 1) {
          this.commit('enemy_take_damage', { target: enemy, value: 5 });
        }
      },
    },
    defend: {
      name: 'Defend',
      type: 'skill',
      cost: 1,
      text: 'Gain <b>8</b> block.',
      target: 'self',
      action() {
        this.commit('player_gain_effect', {
          name: 'block',
          value: 8,
        });
      },
    },
  },
};
