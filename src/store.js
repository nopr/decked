import Vue from 'vue';
import Vuex from 'vuex';
import VueLodash from 'vue-lodash';

import EventBus from '@/eventbus';

import Actors from './assets/actors';
import Effects from './assets/effects';
import {
  names,
  genders,
  bodytypes,
  bodycolours,
  belttypes,
  beltcolours,
  legcolours,
  skincolours,
  haircolours,
  hairstyles,
  extras,
} from './assets/flavour';

import EncountersLevel1 from '@/assets/encounters/level1';

import Soldier from '@/assets/players/soldier';

import GenerateArea from '@/store/area';

const encounters = {
  1: EncountersLevel1,
};
const players = [Soldier];

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
      enemy: null,
      rewards: [],
    },
    player: null,
    effects: Effects,
  },
  mutations: {
    //
    player_animation_add(state, data) {
      EventBus.$emit('player_animation_add', data);
    },
    enemy_animation_add(state, data) {
      EventBus.$emit('enemy_animation_add', data);
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
      
      context.state.area.history.push(data.point);
      Vue.set(context.state.area, 'active_step', data.step);
      Vue.set(context.state.area, 'active_point', data.point);
    },

    Battle_Setup(context) {
      const encounter = Vue.utility.sample(encounters[context.state.level]);

      Vue.set(context.state.battle, 'turn', 0);
      Vue.set(context.state.battle, 'enemy', null);
      Vue.set(context.state.battle, 'encounter', null);
      Vue.set(context.state.battle, 'status', 'loading');

      const gender = Vue.utility.sample(genders);
      const name = Vue.utility.sample(names[gender]);
      
      let single = Object.assign({
        id: 0,
        gender,
        appearance: {
          bodytype: Vue.utility.sample(bodytypes),
          bodycolour: Vue.utility.sample(bodycolours),
          belttype: Vue.utility.sample(belttypes),
          beltcolour: Vue.utility.sample(beltcolours),
          legcolour: Vue.utility.sample(legcolours),
          skincolour: Vue.utility.sample(skincolours),
          haircolour: Vue.utility.sample(haircolours),
          hairstyle: Vue.utility.sample(hairstyles[gender]),
          extra: Vue.utility.sample(extras[gender]),
        }
      }, encounter);
      single.name = Vue.utility.sample(names[gender]);
      const enemy = new Actors.Enemy(single);
      Vue.set(context.state.battle, 'enemy', enemy);
      // Vue.utility.each(encounter.enemies, (enemy, index) => {
      //   const single = Object.assign({ id: index }, enemy);
      //   const encountered = new Actors.Enemy(single);
      //   context.state.battle.enemy.push(encountered);
      // });
      Vue.set(context.state.battle, 'encounter', single.description);
    },

    Battle_Ready(context) {
      Vue.set(context.state.battle, 'status', 'ready');
    },
    
    Battle_Action_Player(context, card) {
      return new Promise(async (resolve) => {
        await card.action.call(context, card);
        await this.dispatch('Battle_Check');
        resolve();
      });
    },
    
    Battle_Action_Enemy(context) {
      const enemy = context.state.battle.enemy;
      const intent = Vue.utility.sample(enemy.sequence[enemy.phase]);
      const perform = enemy.intents[intent];
      Vue.set(enemy, 'phase', enemy.phase + 1);
      if (enemy.phase === enemy.sequence.length) {
        Vue.set(enemy, 'phase', 0);
      }
      return new Promise(async (resolve) => {
        await perform.action.call(context);
        await this.dispatch('Battle_Check');
        resolve();
      });
    },

    Battle_End_Turn(context) {
      return new Promise((resolve) => {
        Vue.set(context.state.player, 'energy', 0);
        resolve();
      });
    },

    Battle_Start_Turn(context) {
      return new Promise((resolve) => {
        Vue.set(context.state.player, 'energy', 3);
        resolve();
      });
    },

    Battle_Check(context) {
      let win = true;
      let lose = true;
      // Cannot win if there are enemies remaining
      if (context.state.battle.enemy.health.current > 0) { win = false; }
      // Cannot lose if there is player health remaining
      if (context.state.player.health.current > 0) { lose = false; }
      // Set the battle status accordingly
      if (win) { context.dispatch('Battle_Win'); }
      if (lose) { context.dispatch('Battle_Lose'); }
      if (win && lose) { context.dispatch('Battle_Lose'); }
    },
    
    Battle_Win(context) {
      Vue.set(context.state.battle, 'status', 'win');
      
    },
    
    Battle_Lose(context) {
      Vue.set(context.state.battle, 'status', 'lose');
      
    },

    async Card_Play(context, card) {
      Vue.set(context.state.player, 'energy', context.state.player.energy - card.cost);
      await card.action.call(context, card);
      await this.dispatch('Battle_Check');
    },

    create_player(context) {
      const role = Vue.utility.sample(players);
      const gender = Vue.utility.sample(genders);
      const name = Vue.utility.sample(names[gender]);
      const deck = Vue.utility.each(role.deck, card => card);
      const attributes = Vue.utility.sampleSize(role.attributes, 2);

      const Player = new Actors.Player({
        name,
        role,
        gender,
        title: role.name,
        appearance: {
          bodytype: Vue.utility.sample(bodytypes),
          bodycolour: Vue.utility.sample(bodycolours),
          belttype: Vue.utility.sample(belttypes),
          beltcolour: Vue.utility.sample(beltcolours),
          legcolour: Vue.utility.sample(legcolours),
          skincolour: Vue.utility.sample(skincolours),
          haircolour: Vue.utility.sample(haircolours),
          hairstyle: Vue.utility.sample(hairstyles[gender]),
          extra: Vue.utility.sample(extras[gender]),
        },
        health: {
          current: role.health.default,
          maximum: role.health.default,
        },
        block: 0,
        gold: role.gold,
        attributes,
        energy: 3,
        cards: [],
      });

      Vue.set(context.state, 'player', Player);

      Vue.utility.each(deck, (card) => {
        const rarity = card.split(':')[0];
        const name = card.split(':')[1];
        const source = Object.assign({}, role.cards[rarity][name]);
        context.state.player.cards.push(source);
      });

      for (let n = 0; n < context.state.player.cards.length; n += 1) {
        Vue.set(context.state.player.cards[n], 'id', n);
      }
    },
    
    player_take_damage(context, data) {
      console.log('player_take_damage', data);
      let modified = context.state.player.health.current - data.value;
      if (modified < 0) { modified = 0; }
      Vue.set(context.state.player.health, 'current', modified);
      context.commit('enemy_animation_add', {
        image: null,
        colour: 'tomato',
        value: '-' + data.value,
      });
    },
    player_gain_health(context, data) {
      console.log('player_gain_health', data);
      let gaining = context.state.player.health.current + data.value;
      if (gaining > context.state.player.health.maximum) { gaining = context.state.player.health.maximum; }
      Vue.set(context.state.player, 'health', gaining);
      context.commit('player_animation_add', {
        image: null,
        colour: 'tomato',
        value: '+' + data.value,
      });
    },
    player_lose_health(context, data) {
      console.log('player_lose_health', data);
      let modified = context.state.player.health.current - data.value;
      if (modified < 0) { modified = 0; }
      Vue.set(context.state.player.health, 'current', modified);
      context.commit('player_animation_add', {
        image: null,
        colour: 'tomato',
        value: '-' + data.value,
      });
    },
    player_gain_gold(context, data) {
      console.log('player_gain_gold', data);
      const gaining = context.state.player.gold + data.value;
      Vue.set(context.state.player, 'gold', gaining);
      context.commit('player_animation_add', {
        image: '/images/cards/receive-money.svg',
        colour: 'gold',
        value: '+' + data.value,
      });
    },
    player_lose_gold(context, data) {
      console.log('player_lose_gold', data);
      let modified = context.state.player.gold - data.value;
      if (modified < 0) { modified = 0; }
      Vue.set(context.state.player, 'gold', modified);
      context.commit('player_animation_add', {
        image: '/images/cards/pay-money.svg',
        colour: 'gold',
        value: '+' + data.value,
      });
    },
    player_gain_block(context, data) {
      console.log('player_gain_block', data);
      const gaining = context.state.player.block + data.value;
      Vue.set(context.state.player, 'block', gaining);
      context.commit('player_animation_add', {
        image: '/images/cards/armor-upgrade.svg',
        colour: 'paleturquoise',
        value: '+' + data.value,
      });
    },
    player_lose_block(context, data) {
      console.log('player_lose_block', data);
      let modified = context.state.player.block - data.value;
      if (modified < 0) { modified = 0; }
      Vue.set(context.state.player, 'block', modified);
      context.commit('player_animation_add', {
        image: '/images/cards/armor-downgrade.svg',
        colour: 'paleturquoise',
        value: '-' + data.value,
      });
    },
    player_gain_effect(context, data) {
      console.log('player_gain_effect', data);
      const gaining = Object.assign({ value: effect.value }, Effects[effect.name]);
      const existing = Vue.utility.findIndex(context.state.player.effects, { name: gaining.name });
      if (existing !== -1) {
        Vue.set(context.state.player.effects[existing], 'value', context.state.player.effects[existing] + effect.value);
      }
      if (existing === -1) {
        context.state.player.effects.push(gaining);
      }
      context.commit('player_animation_add', {
        image: context.state.effects[data.name].image,
        colour: context.state.effects[data.name].colour,
        value: '+' + data.value,
      });
    },
    enemy_take_damage(context, data) {
      console.log('enemy_take_damage', data);
      let modified = context.state.battle.enemy.health.current - data.value;
      if (modified < 0) { modified = 0; }
      Vue.set(context.state.battle.enemy.health, 'current', modified);
      context.commit('enemy_animation_add', {
        image: null,
        colour: 'tomato',
        value: '-' + data.value,
      });
    },
    enemy_gain_gold(context, data) {
      console.log('enemy_gain_gold', data);
      const gaining = context.state.battle.enemy.gold + data.value;
      Vue.set(context.state.battle.enemy, 'gold', gaining);
      context.commit('enemy_animation_add', {
        image: '/images/cards/receive-money.svg',
        colour: 'gold',
        value: '+' + data.value,
      });
    },
    enemy_lose_gold(context, data) {
      console.log('enemy_lose_gold', data);
      let modified = context.state.battle.enemy.gold - data.value;
      if (modified < 0) { modified = 0; }
      Vue.set(context.state.battle.enemy, 'gold', modified);
      context.commit('enemy_animation_add', {
        image: '/images/cards/pay-money.svg',
        colour: 'gold',
        value: '-' + data.value,
      });
    },
    enemy_gain_block(context, data) {
      console.log('enemy_gain_block', data);
      const gaining = context.state.battle.enemy.block + data.value;
      Vue.set(context.state.battle.enemy, 'block', gaining);
      context.commit('enemy_animation_add', {
        image: '/images/cards/armor-upgrade.svg',
        colour: 'paleturquoise',
        value: '+' + data.value,
      });
    },
    enemy_lose_block(context, data) {
      console.log('enemy_lose_block', data);
      let modified = context.state.battle.enemy.block - data.value;
      if (modified < 0) { modified = 0; }
      Vue.set(context.state.battle.enemy, 'block', modified);
      context.commit('enemy_animation_add', {
        image: '/images/cards/armor-downgrade.svg',
        colour: 'paleturquoise',
        value: '-' + data.value,
      });
    },
    enemy_gain_effect(context, effect) {
      console.log('enemy_gain_effect', effect);
      const gaining = Object.assign({}, Effects[effect.name]);
      Vue.set(gaining, 'value', effect.value);
      const existing = Vue.utility.findIndex(context.state.battle.enemy.effects, { name: gaining.name });
      if (existing === -1) {
        context.state.battle.enemy.effects.push(gaining);
      }
      if (existing !== -1) {
        Vue.set(context.state.battle.enemy.effects[existing], 'value', context.state.battle.enemy.effects[existing].value + effect.value);
      }
      context.commit('enemy_animation_add', {
        image: context.state.effects[effect.name].image,
        colour: context.state.effects[effect.name].colour,
        value: '+' + effect.value,
      });
    },
    
    
    ///
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
