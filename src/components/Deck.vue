<template>
  <div class="Deck">
    <div class="value">{{ deck.length }}</div>
    <div class="cards">
      <Card v-for="(card, key) in deck" v-bind:key="key" v-bind:card="card" />
    </div>
  </div>
</template>

<script>
  import Card from './Card.vue';

  export default {
    name: 'Deck',
    components: { Card },
    computed: {
      deck() {
        return this.$store.state.field.deck;
      },
    },
    created() {
      console.log('Deck.created')
    },
    mounted() {
      console.log('Deck.mounted')
    },
    updated() {
      console.log('Deck.updated')
    },
    destroyed() {
      console.log('Deck.destroyed')
    }
  };
</script>

<style lang="scss">
  .Deck {

    display: flex;
    align-content: space-between;
    border-radius: 5px;
    border: 2px solid red;
    padding: 5px;
    margin: 5px 15px;

    .cards { display: none; }

  }
</style>
