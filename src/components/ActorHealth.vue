<template>
  <div class="ActorHealth" v-bind:data-animating="animating" v-bind:data-blocking="actor.block > 0 ? actor.block.toString().length : false">
    <span class="ActorHealth-value">{{ actor.health.current }}/{{ actor.health.maximum }}</span>
    <span class="ActorHealth-bar" v-bind:style="{ width: actor.health.current / actor.health.maximum * 100 + '%' }"></span>
  </div>
</template>Actor-

<script>
  import EventBus from '@/eventbus';

  export default {
    name: 'ActorHealth',
    props: ['actor'],
    methods: {
      async animate(setting) {
        this.animating = setting;
        await this.hold(250);
        this.animating = false
      },
      hold(duration) {
        return new Promise((resolve) => {
          setTimeout(() => resolve(), duration || 250);
        });
      },
    },
    data() {
      return {
        animating: false
      }
    },
    computed: {
      value() {
        return this.actor.health.current;
      }
    },
    watch: {
      value(newer, older) {
        if (newer > older) { this.animate('up'); }
        if (newer < older) { this.animate('down'); }
      }
    },
    created() {
      console.log('Stat.created')
    },
    mounted() {
      console.log('Stat.mounted')
    },
    updated() {
      console.log('Stat.updated')
    },
    destroyed() {
      console.log('Stat.destroyed')
    }
  };
</script>

<style lang="scss">

  .ActorHealth {
    position: absolute;
    height: 100%;
    width: 100%;
    .ActorHealth-value {
      position: absolute;
      left: 0;
      top: 0;
      font-size: 16px;
      font-weight: 400;
      line-height: 15px;
      transition: left 0.25s, color 0.25s;
      color: tomato;
    }
    .ActorHealth-bar {
      position: absolute;
      left: 0;
      bottom: 0;
      transition: width 0.25s;
      border-radius: 1px;
      background: tomato;
      height: 5px;
    }
    &[data-blocking="1"] {
      .ActorHealth-value { left: 20px; }
    }
    &[data-blocking="2"] {
      .ActorHealth-value { left: 27px; }
    }
    &[data-blocking="3"] {
      .ActorHealth-value { left: 33px; }
    }
    &[data-animating="up"] {
      .ActorHealth-value { color: white };
      .ActorHealth-bar { background: white; }
    }
    &[data-animating="down"] {
      .ActorHealth-value { color: white };
      .ActorHealth-bar { background: white; }
    }
  }
  
</style>
