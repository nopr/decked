<template>
  <div class="Actor" v-bind:data-animate="animate">
    <div class="name">
      {{ actor.name }}
    </div>
    <div class="description">
      <div class="title">
        {{ actor.title }}
      </div>
      <div class="attributes" v-if="actor.attributes.length && !this.small">
        <span class="attribute" v-for="attribute in actor.attributes" v-bind:key="attribute.name">{{ attribute.name }}</span>
      </div>
    </div>
    <div class="stats">
      <ActorGold v-bind:actor="actor" />
      <ActorBlock v-bind:actor="actor" />
      <ActorHealth v-bind:actor="actor" />
    </div>
  </div>
</template>

<script>
  import EventBus from '@/eventbus';
  import Effect from '@/components/Effect.vue';
  import Stat from '@/components/Stat.vue';
  import ActorHealth from '@/components/ActorHealth.vue';
  import ActorBlock from '@/components/ActorBlock.vue';
  import ActorGold from '@/components/ActorGold.vue';

  export default {
    name: 'Actor',
    props: {
      actor: null,
      small: false
    },
    components: { Effect, Stat, ActorHealth, ActorBlock, ActorGold },
    data() {
      return {
        animate: false
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
      console.log('Actor.created')
    },
    mounted() {
      console.log('Actor.mounted')
    },
    updated() {
      console.log('Actor.updated')
    },
    destroyed() {
      console.log('Actor.destroyed')
    }
  };
</script>

<style lang="scss">

  @keyframes bouncing {
    from, to {
      transform: translateY(0) rotate(-15deg);
      box-shadow: 0 2px 5px rgba(0,0,0,1);
    }
    50% {
      transform: translateY(-5px) rotate(-15deg);
      box-shadow: 0 7px 10px rgba(0,0,0,0.5);
    }
  }

  .Actor {

    width: 100%;
    margin-right: 5px;
    padding: 10px;
    background: #111;
    border-radius: 5px;
    box-sizing: border-box;

    display: flex;
    flex-flow: column;
    align-items: left;
    justify-content: flex-start;
    
    .name {
      color: #fff;
      margin-bottom: 5px;
      text-transform: uppercase;
      letter-spacing: 2px;
      font-weight: 900;
      font-size: 16px;
      line-height: 1;
    }
    
    .description {
      color: #555;
      text-transform: uppercase;
      letter-spacing: 2px;
      font-weight: 600;
      font-size: 10px;
      line-height: 1;
      
      display: flex;
      flex-flow: row;
    }
    
    .attributes {
      margin-left: 5px;
      letter-spacing: 1px;
      &:before { content: '('; }
      &:after { content: ')'; }
      .attribute + .attribute:before {
        content: ', ';
      }
    }
    
    .stats {
      height: 25px;
      margin-top: 5px;
      position: relative;
    }

  }
</style>
