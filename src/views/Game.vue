<template>
  <div class="Game" v-bind:data-state-game="state.game">
    <div class="GameScreen">
      <div class="Intro" v-bind:data-state-intro="state.intro">
        <div class="IntroScreen">
          <div class="textcontent">
            <div class="actions">
              <button class="is-secondary" v-on:click="create_player">Who are you?</button>
            </div>
          </div>
        </div>
        <div class="IntroScreen">
          <div class="textcontent" v-if="!!player">
            <Character />
            <p>You are <b>{{ player.name }}</b>, a <b>{{ player.role.name }}</b> who is <b>{{ player.attributes[0].name }}</b> and <b>{{ player.attributes[1].name }}</b>.</p>
            <div class="actions">
              <button class="is-secondary" v-on:click="create_player">I'm somebody else</button> 
              <button class="is-primary" v-on:click="confirm_player">Let's go</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="GameScreen" v-bind:data-state-event="event">
      <div class="Main" v-bind:data-state-event="event">
        <div class="MainScreen EventScreen">
          <Battle v-if="event === 'battle'" />
        </div>
        <div class="MainScreen MapScreen">
          <Player />
          <!-- <button v-bind:disabled="event !== 'map'" v-on:click="fight">Do something!</button> -->
          <Map2 />
          <hr />
          <Map />
        </div>
        <div class="MainScreen QuestScreen">
          <p>Quest shit?</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Character from '@/components/Character.vue';
  import Player from '@/components/Player.vue';
  import Battle from '@/components/Battle.vue';
  import Map2 from '@/components/Map2.vue';
  import Map from '@/components/Map.vue';

  export default {
    name: 'Game',
    computed: {
      player() {
        return this.$store.state.player
      },
      event() {
        return this.$store.state.event
      }
    },
    data() {
      return {
        state: {
          game: 1,
          intro: 1
        }
      }
    },
    components: {
      Character,
      Player,
      Battle,
      Map2,
      Map,
    },
    methods: {
      create_player() {
        this.$store.dispatch('create_player');
        this.state.intro = 2; 
      },
      confirm_player() {
        this.state.game = 2;
      },
      fight() {
        this.$store.dispatch('start_battle');
      }
    },
    created() {
      console.log('Game.created')
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
  .GameScreen,
  .IntroScreen {

    width: 100%;
    min-width: 100%;

  }
  
  .Game {

    height: 100%;
    display: flex;
    flex-wrap: nowrap;
    transition: transform 0.5s;

    &[data-state-game="1"] {
      transform: translateX(0);
    }
    &[data-state-game="2"] {
      transform: translateX(-100%);
    }

  }
  .Intro {

    height: 100%;
    display: flex;
    flex-wrap: nowrap;
    transition: transform 0.5s;

    &[data-state-intro="1"] {
      transform: translateX(0);
    }
    &[data-state-intro="2"] {
      transform: translateX(-100%);
    }

    .IntroScreen {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .Character {
      margin: 0 auto;
    }

  }

  .Main {
    height: 100%;
    display: flex;
    flex-wrap: nowrap;
    flex-flow: column;
    transition: transform 0.5s;

    .MainScreen {
      height: 100%;
      min-height: 100%;
      box-sizing: border-box;
      align-items: space-between;
      justify-content: space-between;
    }
    .EventScreen {
      padding-bottom: 100px;
    }

    .Player {
      transition: transform 0.5s;
    }

    &[data-state-event="map"] {
      transform: translateY(-100%);
    }
    &[data-state-event="battle"] {
      transform: translateY(0%);
      .Player { transform: translateY(calc(-100% - 30px)); }
    }
    &[data-state-event="quest"] {
      transform: translateY(100%);
      .Player { transform: translateY(calc(100% + 30px)); }
    }

  }

</style>
