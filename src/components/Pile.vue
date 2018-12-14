<template>
  <div class="Pile">
    <div class="value">{{ pile.length }}</div>
    <div class="cards">
      <Card v-for="(card, key) in pile" v-bind:key="key" v-bind:card="card" />
    </div>
  </div>
</template>

<script>
  import Card from './Card.vue';

  export default {
    name: 'Pile',
    components: { Card },
    computed: {
      pile() {
        return this.$store.state.field.pile;
      },
    },
    created() {
      console.log('Pile.created')
    },
    mounted() {
      console.log('Pile.mounted')
    },
    updated() {
      console.log('Pile.updated')
    },
    destroyed() {
      console.log('Pile.destroyed')
    }
  };
</script>

<style lang="scss">
  .Pile {

    display: flex;
    align-content: space-between;
    border-radius: 5px;
    border: 2px solid black;
    padding: 5px;
    margin: 5px 15px;
    opacity: 0.3;
    
    .cards { display: none; }

  }
</style>
