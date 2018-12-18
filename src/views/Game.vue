<template>
  <div class="Game">
    <transition-group class="GameScreens" name="animate" tag="div">
      <div class="GameScreen" v-if="gamestate === 'intro'" v-bind:key="'intro'">
        <Player />
        <p>I'm the intro screen</p>
        <Inventory />
        <p><button v-on:click="enter_new_area">Enter the dungeon</button></p>
      </div>
      <div class="GameScreen" v-if="gamestate === 'area'" v-bind:key="'area'">
        <Player />
        <Map />
      </div>
      <BattleScreen class="GameScreen" v-if="gamestate === 'battle'" v-bind:key="'battle'" />
      <div class="GameScreen" v-if="gamestate === 'event'" v-bind:key="'event'">
        <Player />
        <div>Event!</div>
      </div>
      <div class="GameScreen" v-if="gamestate === 'shop'" v-bind:key="'shop'">
        <Player />
        <div>Shop!</div>
      </div>
      <div class="GameScreen" v-if="gamestate === 'camp'" v-bind:key="'camp'">
        <Player />
        <div>Camp!</div>
      </div>
    </transition-group>
  </div>
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
        state: 'area'
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

    .GameScreens { height: 100%; }
    .GameScreen {
      height: 100%;
      display: flex;
      flex-flow: column;
      overflow: hidden;
    }

  }

</style>
