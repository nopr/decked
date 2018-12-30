<template>
  <div class="Participant" v-if="self" v-bind:data-vertical="vertical" v-bind:data-battle="battle" v-bind:data-flipped="enemy">
    <Avatar v-bind:actor="self" />
    <Actor v-bind:actor="self" />
  </div>
</template>

<script>
  import EventBus from '@/eventbus';
  import Avatar from './Avatar.vue';
  import Actor from './Actor.vue';

  export default {
    name: 'Participant',
    props: {
      vertical: false,
      battle: false,
      enemy: false,
      self: null,
    },
    components: { Avatar, Actor },
    data() {
      return {
        animations: []
      }
    },
    methods: {
      hold(duration) {
        return new Promise((resolve) => {
          setTimeout(() => resolve(), duration || 250);
        });
      },
    },
    created() {
      console.log('Participant.created')
    },
    mounted() {
      console.log('Participant.mounted')
    },
    updated() {
      console.log('Participant.updated')
    },
    destroyed() {
      console.log('Participant.destroyed')
    }
  };
</script>

<style lang="scss">
  .Participant {
    
    display: flex;
    flex-flow: row-reverse;
    position: relative;
    
    .Actor, .Avatar {
      z-index: 1;
    }
    
    &[data-vertical] {
      flex-flow: column;
      .Actor { margin: 5px 0 0; position: relative; }
      .Actor .effects { display: none; }
      .Actor .attributes { display: none; }
      .Actor .block { display: none; }
      .Actor .stats { margin-top: 5px; }
    }
    
    &[data-battle] {
      flex-flow: column;
      .Avatar { background: transparent; justify-content: flex-end; }
      .Actor { margin: 5px 0 0; position: relative; }
    }
    
    &[data-flipped] {
      .Avatar { transform: scaleX(-1); }
    }

  }
</style>
