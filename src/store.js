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

import EncountersLevel1 from '@/assets/encounters/level1';

import warrior from '@/assets/roles/warrior';

import GenerateArea from '@/store/area';

const encounters = {
  1: EncountersLevel1,
};

const classes = [];
classes.push(warrior);

Vue.use(Vuex);
Vue.use(VueLodash, { name: 'utility' });

export default new Vuex.Store({
  state: {
    gamestate: 'intro',
    progress: {
      step: null,
      point: null,
    },
    level: 1,
    role: null,
    area: {
      steps: [],
      lines: [],
      history: [],
      active_step: null,
      active_point: null,
    },
    battle: {
      turn: 0,
      status: null,
      energy: 0,
      encounter: null,
      enemies: [],
    },
    player: null,
  },
  mutations: {
    //
    player_take_damage(state, data) {
      const modified = state.player.health.current - data.value;
      Vue.set(state.player.health, 'current', modified);
    },
    player_gain_effect(state, data) {
      if (!state.player.effects[data.name]) {
        Vue.set(state.player.effects, data.name, Effects[data.name]);
      }
      const gaining = state.player.effects[data.name].value + data.value;
      Vue.set(state.player.effects[data.name], 'value', gaining);
    },
    enemy_take_damage(state, data) {
      let modified = state.battle.enemies[data.target].health.current - data.value;
      if (modified < 0) { modified = 0; }
      Vue.set(state.battle.enemies[data.target].health, 'current', modified);
    },
    enemy_gain_effect(state, enemy, effect) {
      if (!state.battle.enemies[enemy].effects[effect.name]) {
        Vue.set(state.battle.enemies[enemy].effects, effect.name, Effects[effect.name]);
      }
      const gaining = state.battle.enemies[enemy].effects[effect.name].value + effect.value;
      Vue.set(state.battle.enemies[enemy].effects[effect.name], 'value', gaining);
    },
    //
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
  },
  actions: {

    GameState(context, value) {
      Vue.set(context.state, 'gamestate', value);
    },

    Area_Create(context) {
      const area = GenerateArea(4 + context.state.level);

      Vue.set(context.state.area, 'history', []);
      Vue.set(context.state.area, 'active_step', null);
      Vue.set(context.state.area, 'active_point', null);
      Vue.set(context.state.area, 'steps', area.steps);
      Vue.set(context.state.area, 'lines', area.lines);
    },

    Area_Go(context, data) {
      Vue.set(context.state.progress, 'step', data.step);
      Vue.set(context.state.progress, 'point', data.point);

      const point = context.state.area.steps[data.step][data.point];

      Vue.set(context.state, 'gamestate', point.type);
    },

    Battle_Setup(context) {
      const encounter = Vue.utility.sample(encounters[context.state.level]);

      Vue.set(context.state.battle, 'turn', 0);
      Vue.set(context.state.battle, 'enemies', []);
      Vue.set(context.state.battle, 'encounter', null);
      Vue.set(context.state.battle, 'status', 'loading');

      Vue.utility.each(encounter.enemies, (enemy, index) => {
        const single = Object.assign({ id: index }, enemy);
        const encountered = new Actors.Enemy(single);
        context.state.battle.enemies.push(encountered);
      });
      Vue.set(context.state.battle, 'encounter', encounter.description);
    },

    Battle_Ready(context) {
      Vue.set(context.state.battle, 'status', 'ready');
    },

    Battle_Start(context) {
      // Set the correct amount of energy
      Vue.set(context.state.battle, 'energy', context.state.player.energy);

      // For each enemy in the battle
      Vue.utility.each(context.state.battle.enemies, (enemy) => {
        const name = Vue.utility.sample(enemy.sequence[0]);
        const intent = enemy.intents[name];
        Vue.set(enemy.intent, 'phase', 0);
        Vue.set(enemy.intent, 'state', 'ready');
        Vue.set(enemy.intent, 'name', name);
        Vue.set(enemy.intent, 'hint', intent.hint);
      });

      Vue.set(context.state.battle, 'turn', 1);
      Vue.set(context.state.battle, 'status', 'ready');
    },

    Battle_Check(context) {
      let win = true;
      let lose = true;
      // Cannot win if there are enemies remaining
      Vue.utility.each(context.state.battle.enemies, (enemy) => {
        if (enemy.health.current > 0) { win = false; }
      });
      // Cannot lose if there is player health remaining
      if (context.state.player.health.current > 0) { lose = false; }
      // Set the battle status accordingly
      if (win) {
        Vue.set(context.state.battle, 'status', 'win');
      } else if (lose) {
        Vue.set(context.state.battle, 'status', 'lose');
      }
    },

    async Card_Play(context, card) {
      console.log('Card_Play', card);

      await card.action.call(context, card);
      await this.dispatch('Battle_Check');
    },

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
        const source = Object.assign({}, context.state.role.cards[card]);
        context.state.player.cards.push(source);
      });

      for (let n = 0; n < context.state.player.cards.length; n += 1) {
        Vue.set(context.state.player.cards[n], 'id', n);
      }
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
