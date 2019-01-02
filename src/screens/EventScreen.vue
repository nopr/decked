<template>
  <transition-group class="EventScreen" v-bind:data-animation="animation" name="animation" tag="div" mode="out-in" appear>
    <div class="screen EventPrimary" v-if="state === 0" key="level">
      <div class="image"></div>
      <div class="content">
        <h1>Lights out!</h1>
        <p>You step into a long hallway. The lights are out. <i>"What's down there?"</i>, you wonder. You can't quite see down the corridor.</p>
        <div class="button-group">
          <button class="button is-event is-light" v-on:click="go(1, 'down')">Turn the lights on</button>
          <button class="button is-event is-light" v-on:click="go(1, 'down')">Poke your head in</button>
          <button class="button is-event" v-on:click="leave">Keep moving</button>
        </div>
      </div>
    </div>
    <div class="screen EventSecondary" v-if="state === 1" key="enter">
      <div class="content">
        <button v-on:click="leave">Leave</button>
      </div>
    </div>
  </transition-group>
</template>

<script>
  import EventBus from '@/eventbus';
  import Player from '@/components/Player.vue';

  export default {
    name: 'EventScreen',
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
      leave() {
        this.$store.dispatch('GameState', 'area');
      },
      hold(duration) {
        return new Promise((resolve) => {
          setTimeout(() => resolve(), duration || 250);
        });
      },
    },
    components: {
      Player
    },
    created() {
      console.log('EventScreen.created')
    },
    mounted() {
      console.log('EventScreen.mounted')
      this.go(0, 'up');
    },
    updated() {
      console.log('EventScreen.updated')
    },
    destroyed() {
      console.log('EventScreen.destroyed')
    }
  };
</script>

<style lang="scss">
  .EventScreen {
    height: 100%;
    display: flex;
    align-items: center;

    .screen {
      width: 100%;
      height: 100%;
      max-width: 480px;
      display: flex;
      flex-flow: column;
      box-sizing: border-box;
      align-items: center;
      justify-content: center;
      padding: 15px;
    }
    
    .content {
      p, h1, h2, ul, ol {
        text-shadow: 1px 1px rgba(0,0,0,0.5);
      }
      font-size: 16px;
      border-radius: 5px;
      background: #111;
      padding: 15px;
      color: #ccc;
      .button-group { padding: 0; }
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
