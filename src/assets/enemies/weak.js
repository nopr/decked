import Actors from '../actors';

const Goblin = new Actors.Enemy({
  name: 'Goblin',
  title: 'Weak and pathetic',
  health: {
    current: 15,
    maximum: 15,
  },
  effects: {},
  sequence: [
    {
      name: 'Stab',
      hint: 'perform a rubbish attack',
      text: '(2 dmg) The goblin cautiously stabs you with his rusty knife.',
      action() {
        this.commit('player_take_damage', 2);
      },
    },
    {
      name: 'Frenzied Stab',
      hint: 'perform several pitiful attacks',
      text: '(1x3 dmg) The goblin hurriedly stabs you in a frenzy.',
      action() {
        this.commit('player_take_damage', 1);
        this.commit('player_take_damage', 1);
        this.commit('player_take_damage', 1);
      },
    },
    {
      name: 'Panic!',
      hint: 'defend',
      text: '(Gain 5 Block) The goblin runs around frantically.',
      action() {
        this.commit('enemy_gain_effect', {
          name: 'block',
          value: 5,
        });
      },
    },
  ],
});

const WoundedOrc = new Actors.Enemy({
  name: 'Wounded Orc',
  title: 'Tough but hesitant',
  health: {
    current: 20,
    maximum: 35,
  },
  effects: {
    block: 10,
  },
  sequence: [
    {
      name: 'Hunker Down',
      hint: 'defend',
      text: '(Gain 15 Block) The orc braces himself for your attack.',
      action() {
        this.commit('enemy_gain_effect', {
          name: 'block',
          value: 15,
        });
      },
    },
    {
      name: 'Punch',
      hint: 'perform an average attack',
      text: '(5 dmg) The orc swings his meaty fist towards you.',
      action() {
        this.commit('player_take_damage', 9);
      },
    },
  ],
});

export default [
  // Goblin,
  WoundedOrc,
];
