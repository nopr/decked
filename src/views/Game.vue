<template>
  <transition-group class="Game" v-bind:data-animation="animation" name="animation" tag="div" mode="out-in" appear>
    <div class="GameScreen" v-if="state === 'intro'" key="intro">
      <Player />
      <p>I'm the intro screen</p>
      <Inventory />
      <p><button v-on:click="enter_new_area">Enter the dungeon</button></p>
    </div>
    <div class="GameScreen" v-if="state === 'area'" key="area">
      <Player />
      <Map />
    </div>
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
  import Character from '@/components/Character.vue';
  import Player from '@/components/Player.vue';
  import Inventory from '@/components/Inventory.vue';
  import PlayerArea from '@/components/PlayerArea.vue';
  import BattleScreen from '@/screens/BattleScreen.vue';
  import Map from '@/components/Map.vue';

  export default {
    name: 'Game',
    data() {
      return {
        state: 'area',
        animation: 'down'
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
      Character,
      Player,
      Inventory,
      PlayerArea,
      BattleScreen,
      Map,
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
