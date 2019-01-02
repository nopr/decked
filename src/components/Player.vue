<template>
  <div class="Player" v-if="player" v-bind:data-vertical="vertical" v-bind:data-battle="battle">
    <Avatar v-bind:actor="player" />
    <Actor v-bind:actor="player" />
  </div>
</template>

<script>
  import Avatar from './Avatar.vue';
  import Actor from './Actor.vue';

  export default {
    name: 'Player',
    props: {
      vertical: false,
      battle: false,
    },
    components: { Avatar, Actor },
    computed: {
      player() {
        return this.$store.state.player
      }
    },
    created() {
      console.log('Player.created')
    },
    mounted() {
      console.log('Player.mounted')
    },
    updated() {
      console.log('Player.updated')
    },
    destroyed() {
      console.log('Player.destroyed')
    }
  };
</script>

<style lang="scss">
  .Player {
    
    display: flex;
    flex-flow: row-reverse;
    
    &[data-vertical] {
      flex-flow: column;
      .Actor { margin: 5px 0 0; position: relative; }
      .Actor .attributes { display: none; }
      .Actor .block { display: none; }
      .Actor .stats { margin-top: 5px; }
    }
    
    &[data-battle] {
      flex-flow: column;
      .Avatar { background: transparent; justify-content: flex-end; }
      .Actor { margin: 5px 0 0; position: relative; }
    }

  }
</style>
