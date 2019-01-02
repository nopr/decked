<template>
  <transition-group class="BattleScreen" v-bind:data-animation="animation" name="animation" tag="div" mode="out-in" appear>
    <div class="screen Loading" v-if="state === 0" key="loading">
      <p class="text">{{ encounter }}</p>
    </div>
    <div class="screen Battle" v-if="state === 1" key="battle">
      <div class="Battle_Actors">
        <Participant v-bind:self="player" battle="true" />
        <Participant v-bind:self="enemy" battle="true" enemy="true" />
      </div>
      <div class="Battle_Player">
        <Field />
      </div>
    </div>
    <div class="screen GameOver" v-if="state === 2" key="gameover">
      <p>Game Over</p>
    </div>
    <div class="screen Reward" v-if="state === 3" key="reward">
      <p>You win!</p>
      <div class="button-group">
        <button class="is-light">Rewards</button>
        <button v-on:click="battle_end">Skip</button>
      </div>
    </div>
  </transition-group>
</template>

<script>
  import EventBus from '@/eventbus';

  import Field from '@/components/Field.vue';
  import Participant from '@/components/Participant';

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
      encounter() {
        return this.$store.state.battle.encounter;
      },
      enemy() {
        return this.$store.state.battle.enemy;
      },
      player() {
        return this.$store.state.player;
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
        await this.$store.dispatch('Battle_Setup');
        await this.$store.dispatch('Battle_Ready');
        EventBus.$emit('Battle_Started');
      },
      async enemy_action() {
        await this.hold(500);
        this.$store.dispatch('Battle_Action_Enemy').then(() => {
          EventBus.$emit('Battle:Enemy:Done');
          this.actions_done();
        });
      },
      async actions_done() {
        await this.hold(500);
        EventBus.$emit('Battle:Actions:Done');
      },
      battle_end() {
        this.$store.dispatch('GameState', 'area');
      },
      hold(duration) {
        return new Promise((resolve) => {
          setTimeout(() => resolve(), duration || 250);
        });
      },
    },
    components: {
      Field, Participant
    },
    created() {
      console.log('Battle.created')
    },
    mounted() {
      console.log('Battle.mounted')
      this.mount();
      
      EventBus.$on('Battle:Action:Player', this.player_action);
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
    background: #191919;

    .screen {
      width: 100%;
      height: 100%;
      display: flex;
      flex-flow: column;
      box-sizing: border-box;
    }

    .Loading, .Reward, .GameOver {
      padding: 15px;
      align-items: center;
      justify-content: center;
      color: #ccc;
    }

    .Battle {
      height: 100%;
      align-items: center;
      justify-content: space-between;
      .Battle_Actors {
        width: 100%;
        box-sizing: border-box;
        max-width: 480px;
        background: #222;
        display: flex;
        flex-flow: row;
        justify-content: space-between;
        .Participant {
          width: calc(50% - 15px);
        }
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
