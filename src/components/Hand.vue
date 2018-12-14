<template>
  <div class="Hand" v-bind:data-size="hand.length">
    <Card v-for="(card, key) in hand" v-bind:data-playing="(playing === key)" v-on:click.native="play(card, key)" v-bind:key="key" v-bind:card="card" />
  </div>
</template>

<script>
  import Card from './Card.vue';

  export default {
    name: 'Hand',
    components: { Card },
    computed: {
      hand() {
        return this.$store.state.field.hand;
      },
      battle() {
        return this.$store.state.battle;
      },
    },
    data() {
      return {
        playing: null,
      }
    },
    methods: {
      play(card, key) {
        //if (card.cost > this.battle.energy) {
          //alert('Not enough energy!');
        //} else {
          this.$store.dispatch('play_card', {
            card: card,
            key: key
          });
        //}
      }
    },
    created() {
      console.log('Hand.created')
    },
    mounted() {
      console.log('Hand.mounted')
    },
    updated() {
      console.log('Hand.updated')
    },
    destroyed() {
      console.log('Hand.destroyed')
    }
  };
</script>

<style lang="scss">
  .Hand {

   background: black;

    margin: 0 100px;
    height: 200px;
    position: relative;

    .Card {
      position: absolute;
      margin-left: -70px;
      left: 50%;
      top: 10px;
    }

    .Card:hover {
      top: -20px;
    }

    &[data-size="1"] {
      .Card:nth-child(1) {
        transform: translateX(0);
      }
    }
    &[data-size="2"] {
      .Card:nth-child(1) {
        transform: translateX(-50px);
      }
      .Card:nth-child(2) {
        transform: translateX(50px);
      }
    }
    &[data-size="3"] {
      .Card:nth-child(1) {
        transform: translateX(-100px);
      }
      .Card:nth-child(2) {
        transform: translateX(0);
      }
      .Card:nth-child(3) {
        transform: translateX(100px);
      }
    }
    &[data-size="4"] {
      .Card:nth-child(1) {
        transform: translateX(-150px);
      }
      .Card:nth-child(2) {
        transform: translateX(-50px);
      }
      .Card:nth-child(3) {
        transform: translateX(50px);
      }
      .Card:nth-child(4) {
        transform: translateX(150px);
      }
    }
    &[data-size="5"] {
      .Card:nth-child(1) {
        transform: translateX(-200px);
      }
      .Card:nth-child(2) {
        transform: translateX(-100px);
      }
      .Card:nth-child(3) {
        transform: translateX(0);
      }
      .Card:nth-child(4) {
        transform: translateX(100px);
      }
      .Card:nth-child(5) {
        transform: translateX(200px);
      }
    }

  }
</style>
