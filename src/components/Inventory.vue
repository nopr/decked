<template>
  <div class="Inventory">
    Inventory:
    <div class="cards">
      <Card v-for="(card, key) in player.cards" v-bind:key="key" v-bind:card="card" />
    </div>
  </div>
</template>

<script>
  import Card from './Card.vue';

  export default {
    name: 'Inventory',
    components: { Card },
    computed: {
      player() {
        return this.$store.state.player;
      },
    },
    created() {
      console.log('Inventory.created')
    },
    mounted() {
      console.log('Inventory.mounted')
    },
    updated() {
      console.log('Inventory.updated')
    },
    destroyed() {
      console.log('Inventory.destroyed')
    }
  };
</script>

<style lang="scss">
  .Inventory {

    .cards {
      display: flex;
      flex-flow: row;
      flex-wrap: wrap;
    }
    .cards .Card {
      margin: 3px;
    }

  }
</style>
