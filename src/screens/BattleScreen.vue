<template>
  <div class="Battle" v-bind:data-state="battle.state">
    <div class="BattleIntro">
      <p>{{ battle.encounter }}</p>
    </div>
    <div class="BattleEnemies">
      <EnemyArea v-for="(enemy, key) in battle.enemies" v-bind:key="key" v-bind:index="key" v-bind:enemy="enemy" />
    </div>
    <div class="BattlePlayer">
      <PlayerArea />
      <Player />
    </div>
  </div>
</template>

<script>
  import EventBus from '@/eventbus';

  import EnemyArea from '@/components/EnemyArea.vue';
  import PlayerArea from '@/components/PlayerArea.vue';
  import Player from '@/components/Player.vue';

  export default {
    name: 'Battle',
    computed: {
      battle() {
        return this.$store.state.battle;
      },
      player() {
        return this.$store.state.player;
      },
    },
    methods: {
      async mount() {
        await this.battle_setup();
        await this.battle_ready();
        await this.battle_start();
        EventBus.$emit('Battle_Started');
      },
      battle_setup() {
        return new Promise((resolve) => {
          this.$store.dispatch('Battle_Setup');
          resolve();
        });
      },
      battle_ready() {
        return new Promise((resolve) => {
          setTimeout(() => {
            this.$store.dispatch('Battle_Ready');
            resolve();
          }, 2000);
        });
      },
      battle_start() {
        return new Promise((resolve) => {
          setTimeout(() => {
            this.$store.dispatch('Battle_Start');
            resolve();
          }, 2000);
        });
      },
    },
    components: {
      EnemyArea, PlayerArea, Player
    },
    created() {
      console.log('Battle.created')
    },
    mounted() {
      console.log('Battle.mounted')
      this.mount();
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

    justify-content: space-between;

    .BattleIntro {
      position: absolute;
      transform: translateX(-50%) translateY(-50%);
      transition: opacity 1s;
      left: 50%;
      top: 50%;
    }

    .BattleEnemies {
      margin: 15px 10px;
      display: flex;
      flex-flow: row;
      justify-content: space-around;
    }

    .EnemyArea {
      transition: all .25s;
    }
    .PlayerArea {
      transition: all 0.25s;
    }
    .Player {
      transition: all 0.25s;
    }

    &[data-state="loading"] {
      .BattleIntro { opacity: 1; }
      .EnemyArea { opacity: 0; transform: translateY(-100px); }
      .PlayerArea { opacity: 0; transform: translateX(-100px); }
      .Player { opacity: 0; transform: translateY(100px); }
    }
    &[data-state="ready"] {
      .BattleIntro { opacity: 0; }
      .EnemyArea { opacity: 1; transform: translateY(0px); }
      .EnemyArea:nth-child(1) { transition-delay: 0.5s; }
      .EnemyArea:nth-child(2) { transition-delay: 0.7s; }
      .EnemyArea:nth-child(3) { transition-delay: 0.9s; }
      .PlayerArea { opacity: 1; transform: translateX(0); }
      .Player { opacity: 1; transform: translateY(0); }
    }

  }
</style>
