const EnemyBigRat = {
  name: 'Big Rat',
  title: null,
  health: {
    current: 15,
    maximum: 15,
  },
  intents: {
    attack: {
      hint: '5 Damage',
      action() {
        this.commit('player_take_damage', { value: 5 });
      },
    },
    buff: {
      hint: 'Buffing',
      action(self) {
        this.commit('enemy_gain_effect', {
          target: self,
          name: 'strength',
          value: 1,
        });
      },
    },
  },
  sequence: [
    ['attack'],
    ['attack', 'buff'],
  ],
};

const EnemyRat = {
  name: 'Rat',
  title: null,
  health: {
    current: 6,
    maximum: 6,
  },
  intents: {
    attack: {
      hint: '2 Damage',
      action() {
        this.commit('player_take_damage', { value: 2 });
      },
    },
    wait: {
      hint: '...',
      action() {
        console.log('rat does nothing');
      },
    },
  },
  sequence: [
    ['attack', 'wait'],
  ],
};

const EncounterBigRat = {
  description: 'You encounter a large, angry rat.',
  modifiers: [],
  enemies: [
    EnemyBigRat,
  ],
};

const EncounterSmallRatPack = {
  description: 'You run into a small pack of rats.',
  modifiers: [],
  enemies: [
    EnemyRat,
    EnemyRat,
    EnemyRat,
  ],
};

export default [
  EncounterBigRat,
  EncounterSmallRatPack,
];
