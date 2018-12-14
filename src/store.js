import Vue from 'vue';
import Vuex from 'vuex';
import VueLodash from 'vue-lodash';

import Actors from './assets/actors';
import Effects from './assets/effects';
import {
  names,
  genders,
  skincolours,
  haircolours,
  hairstyles,
  extras,
} from './assets/flavour';

import EnemiesWeak from '@/assets/enemies/weak';
import warrior from '@/assets/roles/warrior';


const classes = [];
classes.push(warrior);

Vue.use(Vuex);
Vue.use(VueLodash, { name: 'utility' });

export default new Vuex.Store({
  state: {
    role: null,
    event: 'map',
    battle: {
      turn: 0,
      energy: 0,
    },
    field: {
      deck: [],
      hand: [],
      pile: [],
      enemy: null,
    },
    player: null,
  },
  mutations: {
    add_card(state, card) {
      if (state.player.cards) {
        state.player.cards.push(card);
      }
    },
    remove_card(state, card) {
      const index = Vue.utility.findIndex(state.player.cards, { name: card.name });
      Vue.utility.pullAt(state.player.cards, index);
    },
    set_role(state, role) {
      Vue.set(state, 'role', role);
    },
    set_name(state, name) {
      Vue.set(state.player, 'name', name);
    },
    set_gender(state, gender) {
      Vue.set(state.player, 'gender', gender);
    },
    add_attribute(state, attribute) {
      state.player.attributes.push(attribute);
    },
    set_health_current(state, health) {
      Vue.set(state.player.health, 'current', health);
    },
    set_health_maximum(state, health) {
      Vue.set(state.player.health, 'maximum', health);
    },
    field_add_to_deck(state, card) {
      state.field.deck.push(card);
    },
    field_add_to_pile(state, card) {
      state.field.pile.push(card);
    },
    field_add_to_hand(state, card) {
      state.field.hand.push(card);
    },
    field_draw_card(state) {
      if (state.field.deck.length === 0) {
        Vue.utility.each(state.field.pile, () => {
          state.field.deck.push(state.field.pile.shift());
        });
        Vue.utility.shuffle(state.field.deck);
      }
      state.field.hand.push(state.field.deck.shift());
    },
    field_shuffle_deck(state) {
      const shuffled = Vue.utility.shuffle(state.field.deck);
      Vue.set(state.field, 'deck', shuffled);
    },
    field_play_card(state, key) {
      const choice = state.field.hand[key];
      state.field.hand.splice(key, 1);
      state.field.pile.push(choice);
    },
    field_set_energy(state, amount) {
      Vue.set(state.battle, 'energy', amount);
    },
    field_energy_up(state, amount) {
      Vue.set(state.battle, 'energy', state.battle.energy + amount);
    },
    field_energy_down(state, amount) {
      Vue.set(state.battle, 'energy', state.battle.energy - amount);
    },
    field_get_enemy(state) {
      const enemy = Vue.utility.sample(EnemiesWeak);
      Vue.set(state.field, 'enemy', enemy);
    },
    check_for_effects(state) {
      return true;
    },
    player_take_damage(state, amount) {
      // Do stuff
      const modified = state.player.health.current - amount;
      Vue.set(state.player.health, 'current', modified);
    },
    player_gain_effect(state, effect) {
      if (!state.player.effects[effect.name]) {
        Vue.set(state.player.effects, effect.name, Effects[effect.name]);
      }
      const gaining = state.player.effects[effect.name].value + effect.value;
      Vue.set(state.player.effects[effect.name], 'value', gaining);
    },
    enemy_take_damage(state, amount) {
      const modified = state.field.enemy.health.current - amount;
      Vue.set(state.field.enemy.health, 'current', modified);
    },
    enemy_gain_effect(state, effect) {
      if (!state.field.enemy.effects[effect.name]) {
        Vue.set(state.field.enemy.effects, effect.name, Effects[effect.name]);
      }
      const gaining = state.field.enemy.effects[effect.name].value + effect.value;
      Vue.set(state.field.enemy.effects[effect.name], 'value', gaining);
    },
  },
  actions: {
    create_player(context) {
      const role = Vue.utility.sample(classes);
      const gender = Vue.utility.sample(genders);
      const name = Vue.utility.sample(names[gender]);
      const deck = Vue.utility.each(role.deck, card => card);
      const attributes = Vue.utility.sampleSize(role.attributes, 2);

      context.commit('set_role', role);

      const Player = new Actors.Player({
        name,
        role,
        gender,
        appearance: {
          skincolour: Vue.utility.sample(skincolours),
          haircolour: Vue.utility.sample(haircolours),
          hairstyle: Vue.utility.sample(hairstyles[gender]),
          extra: Vue.utility.sample(extras[gender]),
        },
        health: {
          current: role.health.default,
          maximum: role.health.default,
        },
        attributes,
        energy: 3,
        cards: [],
      });

      Vue.set(context.state, 'player', Player);

      Vue.utility.each(deck, (card) => {
        context.commit('add_card', context.state.role.cards[card]);
      });
      Vue.utility.each(attributes, (attribute) => {
        Vue.utility.each(attribute.effects, (effect) => {
          context.dispatch(effect.name, effect.value);
        });
      });
    },
    player_add_card(context, card) {
      context.commit('add_card', context.state.role.cards[card]);
    },
    player_remove_card(context, card) {
      context.commit('remove_card', context.state.role.cards[card]);
    },
    player_increase_health(context, amount) {
      const { maximum } = context.state.player.health;
      const adjusted = maximum + amount;
      context.commit('set_health_maximum', adjusted);
    },
    player_heal(context, amount) {
      const { current, maximum } = context.state.player.health;
      const modified = current + amount;
      const final = (modified > maximum) ? maximum : modified;
      context.commit('set_health_current', final);
    },
    discard_hand(context) {
      Vue.utility.each(context.state.field.hand, () => {
        context.state.field.pile.push(context.state.field.hand.pop());
      });
    },
    draw_cards(context, amount) {
      for (let n = 0; n < amount; n += 1) {
        context.commit('field_draw_card');
      }
    },
    async battle_event(context, event) {
      const { name } = event;

    },
    async play_card(context, choice) {
      await context.commit('field_energy_down', choice.card.cost);
      await context.commit('field_play_card', choice.key);
      await choice.card.action.call(context);
      if (context.state.field.enemy.health.current < 1) {
        console.log('you win');
        context.dispatch('win_battle');
      }
      if (context.state.player.health.current < 1) {
        console.log('you lose');
        context.dispatch('lose_battle');
      }
    },
    async start_battle(context) {
      const { cards } = context.state.player;

      context.commit('field_get_enemy');

      Vue.set(context.state.field.deck, []);
      Vue.set(context.state.field.hand, []);
      Vue.set(context.state.field.pile, []);
      Vue.utility.each(cards, (card) => {
        context.commit('field_add_to_deck', card);
      });

      context.commit('field_shuffle_deck');
      context.commit('field_set_energy', 3);
      context.dispatch('draw_cards', 5);

      Vue.set(context.state, 'event', 'battle');

      // Set the correct amount of energy
      Vue.set(context.state.battle, 'energy', context.state.player.energy);
      
      // Get an enemy sequence intent
      const intent = Vue.utility.sample(context.state.field.enemy.sequence);
      Vue.set(context.state.field.enemy, 'intent', intent);
    },
    async end_player_turn(context) {
      // Discard hand
      await context.dispatch('discard_hand');
      // Choose enemy sequence to execute
      await context.state.field.enemy.intent.action.call(context);
      // Stop effects
      // Reset Energy
      Vue.set(context.state.battle, 'energy', context.state.player.energy);
      // Draw cards
      await context.dispatch('draw_cards', 5);
      // Update turn
      Vue.set(context.state.battle, 'turn', context.state.battle.turn + 1);
      // Get an enemy sequence intent
      const intent = Vue.utility.sample(context.state.field.enemy.sequence);
      Vue.set(context.state.field.enemy, 'intent', intent);
    },
  },
});