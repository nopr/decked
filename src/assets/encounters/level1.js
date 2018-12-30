const Guard = {
  name: 'Guard',
  title: 'Guard',
  description: 'You encounter a weak enforcer.',
  attributes: [
    {
      name: 'Inexperienced',
      description: 'You are scrawny.',
      effects: [
        // { name: 'player_add_card', value: 'strike' },
        // { name: 'player_remove_card', value: 'defend' },
      ],
    },
  ],
  health: {
    current: 25,
    maximum: 25,
  },
  gold: 25,
  intents: {
    attack_once: {
      name: 'Whack',
      hint: '5 Damage',
      async action() {
        await this.dispatch('player_take_damage', { value: 5 });
      },
    },
    attack_twice: {
      name: 'Wild Swing',
      hint: '3 Damage x2',
      async action() {
        await this.dispatch('player_take_damage', { value: 3 });
        await this.dispatch('player_take_damage', { value: 3 });
      },
    },
    buff: {
      name: 'Rage',
      hint: 'Increases strength',
      async action() {
        await this.dispatch('enemy_gain_effect', {
          name: 'strength',
          value: 2,
        });
      },
    },
  },
  sequence: [
    ['attack_once', 'attack_twice'],
    ['buff'],
  ],
};

export default [
  Guard
];
