<template>
  <transition-group class="IntroScreen" v-bind:data-animation="animation" name="animation" tag="div" mode="out-in" appear>
    <div class="screen IntroLevel" v-if="state === 0" key="level">
      <div class="content">Level {{ level }}</div>
    </div>
    <div class="screen IntroEntry" v-if="state === 1" key="enter">
      <div class="content">
        <Player />
        <button v-on:click="enter">Enter</button>
      </div>
    </div>
  </transition-group>
</template>

<script>
  import EventBus from '@/eventbus';
  import Player from '@/components/Player.vue';

  export default {
    name: 'IntroScreen',
    data() {
      return {
        state: null,
        animation: null
      }
    },
    computed: {
      level() {
        return this.$store.state.level
      },
      player() {
        return this.$store.state.player
      },
    },
    methods: {
      go(state, animation) {
        this.animation = animation;
        this.state = state;
      },
      enter() {
        this.$store.dispatch('GameState', 'area');
      },
      hold(duration) {
        return new Promise((resolve) => {
          setTimeout(() => resolve(), duration || 250);
        });
      },
      async mounted() {
        await this.go(0, 'up');
        await this.hold(3000);
        await this.go(1, 'down');
      }
    },
    components: {
      Player
    },
    created() {
      console.log('IntroScreen.created')
    },
    mounted() {
      console.log('IntroScreen.mounted')
      this.mounted();
    },
    updated() {
      console.log('IntroScreen.updated')
    },
    destroyed() {
      console.log('IntroScreen.destroyed')
    }
  };
</script>

<style lang="scss">
  .IntroScreen {
    height: 100%;
    display: flex;
    background: #191919;

    .screen {
      width: 100%;
      height: 100%;
      display: flex;
      flex-flow: column;
      box-sizing: border-box;
      align-items: center;
      justify-content: center;
    }
    
    .IntroLevel .content {
      font-size: 18px;
      font-weight: 200;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #999;
    }
    
    .IntroEntry button {
      margin: 15px auto 0;
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
