<template>
  <div class="Battle" v-bind:data-state="state">
    <div class="BattleEnemy">
      <Enemy />
      <div v-if="enemy.intent">
        {{ enemy.name }} is going to {{ enemy.intent.text }}...
      </div>
    </div>
    <div class="BattlePlayer">
      <Deck />
      <Hand />
      <Pile />
      <div class="BattlePlayerInfo">
        <div class="turn">Turn {{ battle.turn }}</div>
        <div class="energy">
          <icon class="icon" name="bolt" /> {{ battle.energy }}/{{ player.energy }}
        </div>
        <button class="drawcard" v-on:click="draw">Draw Card</button>
        <button class="endturn" v-on:click="end">End Turn</button>
      </div>
    </div>
  </div>
</template>

<script>
  import Enemy from '@/components/Enemy.vue';
  import Deck from '@/components/Deck.vue';
  import Hand from '@/components/Hand.vue';
  import Pile from '@/components/Pile.vue';
  export default {
    name: 'Battle',
    data() {
      return {
        state: 'none'
      }
    },
    computed: {
      battle() {
        return this.$store.state.battle;
      },
      player() {
        return this.$store.state.player;
      },
      enemy() {
        return this.$store.state.field.enemy;
      }
    },
    methods: {
      draw() {
        this.$store.dispatch('draw_cards', 1);
      },
      end() {
        this.$store.dispatch('end_player_turn');
      }
    },
    components: {
      Enemy, Deck, Hand, Pile
    },
    created() {
      console.log('Battle.created')
    },
    mounted() {
      console.log('Battle.mounted')
      setTimeout(() => {
        this.state = 'ready';
      }, 500);
    },
    updated() {
      console.log('Battle.updated')
    },
    destroyed() {
      console.log('Battle.destroyed')
    }
  };
</script>

<style lang="scss">
  .Battle {

    height: 100%;
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    overflow: hidden;

    .BattleEnemy {
      position: relative;
    }

    .BattlePlayerInfo {
      display: flex;
      flex-flow: row;
      position: relative;
      justify-content: space-between;
      margin: 0 15px;
      padding: 15px;
      background: #444;
      border-radius: 5px;
      color: white;

      .turn {
        font-weight: 600;
        line-height: 20px;
        text-transform: uppercase;
      }
      .energy {
        font-weight: 600;
        line-height: 20px;
        .icon { height: 20px; vertical-align: middle; }
      }
    }

    .BattleEnemy, .BattlePlayer {
      transition: transform 0.5s, opacity 0.5s;
    }

    &[data-state="none"] {
      .BattleEnemy { transform: translateY(-100%); opacity: 0; }
      .BattlePlayer { transform: translateY(100%); opacity: 0; }
    }
    &[data-state="ready"] {
      .BattleEnemy { transform: translateY(0%); opacity: 1; }
      .BattlePlayer { transform: translateY(0%); opacity: 1; }
    }

  }
</style>
