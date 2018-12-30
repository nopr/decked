const Percentage = () => Math.floor(Math.random() * 101);

export default {
  name: 'Soldier',
  health: {
    default: 30,
    increments: 5,
  },
  energy: 5,
  gold: 30,
  deck: [
    'basic:vulnerable',
    'basic:weaken',
    'basic:frail',
    'basic:poison',
    'basic:strike',
    'basic:takecover',
    'basic:steal'
  ],
  inventory: [],
  attributes: [
    {
      name: 'Charming',
      description: 'You are tough.',
      effects: [
        // { name: 'player_increase_health', value: 10 },
        // { name: 'player_heal', value: 10 },
      ],
    },
    {
      name: 'Witty',
      description: 'You are bulky.',
      effects: [
        // { name: 'player_add_card', value: 'strike' },
        // { name: 'player_remove_card', value: 'defend' },
      ],
    },
    {
      name: 'Brave',
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
    {
      name: 'Focused',
      description: 'You are strong.',
      effects: [
        // { name: 'player_add_card', value: 'quickstrike' },
        // { name: 'player_remove_card', value: 'strike' },
      ],
    },
    {
      name: 'Quick',
      description: 'You are strong.',
      effects: [
        // { name: 'player_add_card', value: 'quickstrike' },
        // { name: 'player_remove_card', value: 'strike' },
      ],
    },
  ],
  cards: {
    basic: {
      strike: {
        name: 'Strike',
        type: 'attack',
        cost: 0,
        text: 'Deal <b>8</b> damage.',
        target: 'enemy',
        image: '/images/cards/revolt.svg',
        async action(card) {
          await this.dispatch('enemy_take_damage', { value: 8 });
        },
      },
      takecover: {
        name: 'Take Cover',
        type: 'skill',
        cost: 0,
        text: 'Gain <b>6</b> block.',
        target: 'player',
        image: '/images/cards/acrobatic.svg',
        async action(card) {
          await this.dispatch('player_gain_block', { value: 6 });
        },
      },
      weaken: {
        name: 'Weaken',
        type: 'skill',
        cost: 0,
        text: 'Enemy gains <b>Weaken (1)</b>.',
        target: 'enemy',
        image: '/images/cards/catch.svg',
        async action(card) {
          await this.dispatch('enemy_gain_effect', { name: 'weaken', value: 1 });
        },
      },
      vulnerable: {
        name: 'Vulnerable',
        type: 'skill',
        cost: 0,
        text: 'Enemy gains <b>Vulnerable (1)</b>.',
        target: 'enemy',
        image: '/images/cards/severed-hand.svg',
        async action(card) {
          await this.dispatch('enemy_gain_effect', { name: 'vulnerable', value: 1 });
        },
      },
      frail: {
        name: 'Frail',
        type: 'skill',
        cost: 1,
        text: 'Enemy gains <b>Frail (1)</b>.',
        target: 'enemy',
        image: '/images/cards/armor-downgrade.svg',
        async action(card) {
          await this.dispatch('enemy_gain_effect', { name: 'frail', value: 1 });
        },
      },
      poison: {
        name: 'Poison',
        type: 'skill',
        cost: 1,
        text: 'Enemy gains <b>Poisoned (5)</b>.',
        target: 'enemy',
        image: '/images/cards/mushrooms.svg',
        async action(card) {
          await this.dispatch('enemy_gain_effect', { name: 'poison', value: 5 });
        },
      },
      steal: {
        name: 'Steal',
        type: 'attack',
        cost: 1,
        text: 'Deal <b>4</b> damage.<br />Steal <b>4</b> gold.',
        target: 'enemy',
        image: '/images/cards/robber.svg',
        async action(card) {
          await this.dispatch('enemy_take_damage', { value: 4 });
          await this.dispatch('enemy_lose_gold', { value: 4 });
          await this.dispatch('player_gain_gold', { value: 4 });
        },
      },
    },
    common: {
      tackle: {
        name: 'Tackle',
        type: 'attack',
        cost: 0,
        text: 'Deal damage equal to your block.',
        target: 'enemy',
        async action(card) {
          let value = 0;
          if (this.state.player.effects.block) {
            value = this.state.player.effects.block.value;
          }
          await this.dispatch('enemy_take_damage', { value: value });
        },
      },
      headbutt: {
        name: 'Headbutt',
        type: 'attack',
        cost: 1,
        text: 'Deal <b>15</b> damage.<br />25% chance to <b>Stun</b>.',
        target: 'enemy',
        async action(card) {
          const chance = Percentage();
          await this.dispatch('enemy_take_damage', { value: 10 });
          if (chance < 25) {
            await this.dispatch('enemy_gain_effect', { name: 'stun', value: 1 });
          }
        },
      },
      shieldbash: {
        name: 'Shield Bash',
        type: 'attack',
        cost: 1,
        text: 'Deal <b>10</b> damage. Gain <b>6</b> block.',
        target: 'enemy',
        async action(card) {
          await this.dispatch('enemy_take_damage', { value: 10 });
          await this.dispatch('player_gain_block', { value: 6 });
        },
      },
      guard: {
        name: 'Guard',
        type: 'skill',
        cost: 2,
        text: 'Gain <b>15</b> block.',
        target: 'self',
        async action(card) {
          await this.dispatch('player_gain_block', { value: 15 });
        },
      },
    }
  }
};
