export default {
  block: {
    name: 'Block',
    icon: 'shield-alt',
    colour: '#13A7FF',
    text: 'Damage removes Block instead of Health',
    type: 'interrupt',
    triggers: 'player_take_damage',
    expires: 'end_enemy_turn',
    value: 0,
    action(event) {
      console.log('block trigger');
      const current = this.value;
      const incoming = event.value;
    },
  },
};
