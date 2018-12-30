export default {
  strength: {
    name: 'Strength',
    image: '/images/cards/biceps.svg',
    colour: 'orange',
    text: 'Damage increased by this amount',
    type: 'interrupt',
    triggers: 'player_take_damage',
    expires: 'end_enemy_turn',
    value: 0,
    action(event) {
      console.log('strength trigger');
      const current = this.value;
      const incoming = event.value;
    },
  },
  weaken: {
    name: 'Weakened',
    image: '/images/cards/stigmata.svg',
    colour: 'skyblue',
    text: 'Damage you deal decreased by 25%.',
    type: 'interrupt',
    triggers: 'player_take_damage',
    expires: 'end_enemy_turn',
    value: 0,
    action(event) {
      console.log('strength trigger');
      const current = this.value;
      const incoming = event.value;
    },
  },
  vulnerable: {
    name: 'Vulnerable',
    image: '/images/cards/broken-heart.svg',
    colour: 'salmon',
    text: 'Damage you take increased by 25%.',
    type: 'interrupt',
    triggers: 'player_take_damage',
    expires: 'end_enemy_turn',
    value: 0,
    action(event) {
      console.log('strength trigger');
      const current = this.value;
      const incoming = event.value;
    },
  },
  frail: {
    name: 'Frail',
    image: '/images/cards/broken-shield.svg',
    colour: 'mediumpurple',
    text: 'Block you gain decreased by 25%.',
    type: 'interrupt',
    triggers: 'player_take_damage',
    expires: 'end_enemy_turn',
    value: 0,
    action(event) {
      console.log('strength trigger');
      const current = this.value;
      const incoming = event.value;
    },
  },
  poison: {
    name: 'Poison',
    image: '/images/cards/heart-drop.svg',
    colour: 'yellowgreen',
    text: 'Enemy gains <b>Poisoned (5)</b>.',
    type: 'interrupt',
    triggers: 'player_take_damage',
    expires: 'end_enemy_turn',
    value: 0,
    action(event) {
      console.log('strength trigger');
      const current = this.value;
      const incoming = event.value;
    },
  },
};
