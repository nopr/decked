<template>
  <transition-group class="BattleScreen" v-bind:data-animation="animation" name="animation" tag="div" mode="out-in" appear>
    <div class="screen Loading" v-if="state === 0" key="loading">
      <p class="text">{{ encounter }}</p>
    </div>
    <div class="screen Battle" v-if="state === 1" key="battle">
      <div class="Battle_Enemies">
        <Enemy v-for="(enemy, key) in enemies" v-bind:key="key" v-bind:enemy="enemy" />
      </div>
      <div class="Battle_Player">
        <PlayerArea />
        <Player />
      </div>
    </div>
    <div class="screen GameOver" v-if="state === 2" key="gameover">
      <p>Game Over</p>
    </div>
    <div class="screen Reward" v-if="state === 3" key="reward">
      <p>You win!</p>
    </div>
  </transition-group>
</template>

<script>
  import EventBus from '@/eventbus';

  import Enemy from '@/components/Enemy.vue';
  import PlayerArea from '@/components/PlayerArea.vue';
  import Player from '@/components/Player.vue';

  export default {
    name: 'Battle',
    data() {
      return {
        state: null,
        animation: null
      }
    },
    computed: {
      status() {
        return this.$store.state.battle.status;
      },
      enemies() {
        return this.$store.state.battle.enemies;
      },
      encounter() {
        return this.$store.state.battle.encounter;
      },
    },
    watch: {
      status(newer, older) {
        if (newer === 'loading') { this.go(0, 'down') }
        if (newer === 'ready') { this.go(1, 'down') }
        if (newer === 'lose') { this.go(2, 'up') }
        if (newer === 'win') { this.go(3, 'up') }
      }
    },
    methods: {
      go(state, animation) {
        this.animation = animation;
        this.state = state;
      },
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
          }, 3000);
        });
      },
      battle_start() {
        return new Promise((resolve) => {
          setTimeout(() => {
            this.$store.dispatch('Battle_Start');
            resolve();
          }, 3000);
        });
      },
    },
    components: {
      Enemy, PlayerArea, Player
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
  .BattleScreen {
    height: 100%;
    display: flex;

    .screen {
      width: 100%;
      height: 100%;
      display: flex;
      flex-flow: column;
      box-sizing: border-box;
    }

    .Loading {
      padding: 15px;
      align-items: center;
      justify-content: center;
    }

    .Battle {
      padding: 15px;
      height: 100%;
      align-items: center;
      justify-content: space-between;
      .Battle_Enemies {
        width: 100%;
        display: flex;
        flex-flow: row;
        justify-content: center;
      }
      .Battle_Player {
        width: 100%;
        display: flex;
        flex-flow: column;
      }
    }

    .animation-enter-active {
      transition: opacity 0.5s, transform 0.5s;
      transition-delay: 0.5s;
    }
    .animation-leave-active {
      transition: opacity 0.5s, transform 0.5s;
    }
    .animation-enter, .animation-leave-to {
      position: absolute;
      opacity: 0;
    }
    &[data-animation="down"] {
      & > .animation-enter { transform: translateY(100px); }
      & > .animation-leave-to { transform: translateY(-100px); }
    }
    &[data-animation="up"] {
      & > .animation-enter { transform: translateY(-100px); }
      & > .animation-leave-to { transform: translateY(100px); }
    }

  }
</style>
