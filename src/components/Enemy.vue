<template>
  <div class="Enemy" v-if="enemy" v-bind:data-vertical="vertical" v-bind:data-battle="battle">
    <Avatar v-bind:actor="enemy" flipped />
    <Actor v-bind:actor="enemy" />
  </div>
</template>

<script>
  import EventBus from '@/eventbus';
  import Actor from '@/components/Actor.vue';
  import Avatar from '@/components/Avatar.vue';

  export default {
    name: 'Enemy',
    props: {
      vertical: false,
      battle: false,
    },
    components: { Avatar, Actor },
    computed: {
      enemy() {
        return this.$store.state.battle.enemy;
      },
    },
    created() {
      console.log('Enemy.created')
    },
    mounted() {
      console.log('Enemy.mounted')
    },
    updated() {
      console.log('Enemy.updated')
    },
    destroyed() {
      console.log('Enemy.destroyed')
    }
  };
</script>

<style lang="scss">
  .Enemy {
    
    display: flex;
    flex-flow: row-reverse;
    
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
      .Avatar { transform: scaleX(-1); background: transparent; justify-content: flex-end; }
      .Actor { margin: 5px 0 0; position: relative; }
    }

  }
</style>
