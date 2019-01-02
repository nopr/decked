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
    image: '/images/cards/half-heart.svg',
    colour: 'skyblue',
    text: 'When this person attacks, deal 25% less damage.',
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
    text: 'When this person is attacked, take 25% more damage.',
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
    text: 'When this person defends, gain 25% less shield.',
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
    name: 'Poisoned',
    image: '/images/cards/heart-drop.svg',
    colour: 'yellowgreen',
    text: 'When the turn ends, take this much damage.',
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
