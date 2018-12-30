<template>
  <transition-group class="Game" v-bind:data-animation="animation" name="animation" tag="div" mode="out-in" appear>
    <IntroScreen class="GameScreen" v-if="state === 'intro'" key="intro" />
    <MapScreen class="GameScreen" v-if="state === 'area'" key="area" />
    <BattleScreen class="GameScreen" v-if="state === 'battle'" key="battle" />
    <div class="GameScreen" v-if="state === 'event'" key="event">
      <Player />
      <div>Event!</div>
    </div>
    <div class="GameScreen" v-if="state === 'shop'" key="shop">
      <Player />
      <div>Shop!</div>
    </div>
    <div class="GameScreen" v-if="state === 'camp'" key="camp">
      <Player />
      <div>Camp!</div>
    </div>
  </transition-group>
</template>

<script>
  import Player from '@/components/Player.vue';
  import Inventory from '@/components/Inventory.vue';
  import IntroScreen from '@/screens/IntroScreen.vue';
  import BattleScreen from '@/screens/BattleScreen.vue';
  import MapScreen from '@/screens/MapScreen.vue';

  export default {
    name: 'Game',
    data() {
      return {
        state: 'intro',
        animation: 'fade'
      }
    },
    computed: {
      player() {
        return this.$store.state.player
      },
      gamestate() {
        return this.$store.state.gamestate
      }
    },
    watch: {
      gamestate(newer, older) {
        if (newer === 'intro') { this.animation = 'down' }
        if (newer === 'area') { this.animation = 'down' }
        if (newer === 'event') { this.animation = 'down' }
        if (newer === 'battle') { this.animation = 'up' }
        if (newer === 'shop') { this.animation = 'down' }
        if (newer === 'camp') { this.animation = 'down' }
        this.state = newer;
      }
    },
    components: {
      Player,
      Inventory,
      IntroScreen,
      BattleScreen,
      MapScreen,
    },
    methods: {
      enter_new_area() {
        this.$store.dispatch('GameState', 'area');
      }
    },
    created() {
      console.log('Game.created')
      if (!this.player) {
        this.$store.dispatch('create_player');
      }
    },
    mounted() {
      console.log('Game.mounted')
    },
    updated() {
      console.log('Game.updated')
    },
    destroyed() {
      console.log('Game.destroyed')
    }
  };
</script>

<style lang="scss">

  .Game {

    height: 100%;

    .GameScreen {
      height: 100%;
      width: 100%;
      display: flex;
      flex-flow: column;
      overflow: hidden;
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

    &[data-animation="fade"] {
      & > .animation-enter { opacity: 1; }
      & > .animation-leave-to { opacity: 0; }
    }
    &[data-animation="down"] {
      & > .animation-enter { transform: translateY(300px); }
      & > .animation-leave-to { transform: translateY(-300px); }
    }
    &[data-animation="up"] {
      & > .animation-enter { transform: translateY(-300px); }
      & > .animation-leave-to { transform: translateY(300px); }
    }

  }

</style>
