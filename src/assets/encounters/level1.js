const EnemyBigRat = {
  name: 'Big Rat',
  title: null,
  health: {
    current: 15,
    maximum: 15,
  },
  intents: {
    attack: {
      hint: 'Bite for 5 Damage',
      async action(objects) {
        await objects.player.takeDamage(5);
      },
    },
    buff: {
      hint: 'Buffing',
      action() {
        console.log('rat buffs itself');
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
      hint: 'Scratch for 2 Damage',
      action() {
        console.log('rat does 2 damage');
      },
    },
    wait: {
      hint: 'Waiting',
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
  description: 'You encounter one large, angry rat!',
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
