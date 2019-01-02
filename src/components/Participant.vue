<template>
  <div class="Participant" v-if="self" v-bind:data-vertical="vertical" v-bind:data-battle="battle" v-bind:data-flipped="enemy">
    <Avatar v-bind:actor="self" />
    <Actor v-bind:actor="self" />
    <transition-group class="Effects" name="effect" tag="div">
      <Effect v-for="(effect, key) in self.effects" v-bind:key="effect.name" v-bind:effect="effect" />
    </transition-group>
  </div>
</template>

<script>
  import EventBus from '@/eventbus';
  import Avatar from './Avatar.vue';
  import Actor from './Actor.vue';
  import Effect from './Effect.vue';

  export default {
    name: 'Participant',
    props: {
      vertical: false,
      battle: false,
      enemy: false,
      self: null,
    },
    components: { Avatar, Actor, Effect },
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
    
    .Effects {
      position: absolute;
      height: 150px;
      left: 0;
      top: 0;
      display: flex;
      flex-flow: column;
      align-items: flex-start;
      justify-content: flex-end;
      .effect { flex-flow: row; }
    }
    
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
    
    &[data-flipped] {
      .Avatar { transform: scaleX(-1); }
      .Effects { left: auto; right: 0; align-items: flex-end; }
      .Effects .effect { flex-flow: row-reverse; }
      .Effects .effect-text { margin-left: 0; margin-right: 15px; left: auto; right: 100%; }
    }

  }
</style>
