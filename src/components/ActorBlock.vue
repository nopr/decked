<template>
  <div class="ActorBlock" v-bind:data-animating="animating" v-bind:data-blocking="actor.block > 0">
    <span class="ActorBlock-value">({{ actor.block }})</span>
    <span class="ActorBlock-bar" v-bind:style="{ width: actor.health.current / actor.health.maximum * 100 + '%' }"></span>
  </div>
</template>

<script>
  import EventBus from '@/eventbus';

  export default {
    name: 'ActorBlock',
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
        return this.actor.block;
      }
    },
    watch: {
      value(newer, older) {
        if (newer > older) { this.animate('up'); }
        if (newer < older) { this.animate('down'); }
      }
    },
    created() {
      console.log('ActorBlock.created')
    },
    mounted() {
      console.log('ActorBlock.mounted')
    },
    updated() {
      console.log('ActorBlock.updated')
    },
    destroyed() {
      console.log('ActorBlock.destroyed')
    }
  };
</script>

<style lang="scss">

  .ActorBlock {
    z-index: 2;
    position: absolute;
    height: 100%;
    width: 100%;
    .ActorBlock-value {
      position: absolute;
      z-index: 4;
      left: 0;
      top: 0;
      color: #ccc;
      font-size: 16px;
      font-weight: 400;
      line-height: 15px;
      transition: color 0.25s, transform 0.25s, opacity 0.25s;
      transform: translateX(-10px);
      opacity: 0;
    }
    .ActorBlock-bar {
      position: absolute;
      left: 0;
      bottom: 0;
      border-radius: 1px;
      background: #ccc;
      transition: background-color 0.25s, width 0.25s, opacity 0.25s;
      height: 5px;
      opacity: 0;
    }
    &[data-blocking="true"] {
      .ActorBlock-bar { opacity: 1; }
      .ActorBlock-value { transform: translateX(0); opacity: 1; }
    }
    &[data-animating="up"] {
      .ActorBlock-value { color: white };
      .ActorBlock-bar { border-color: white; }
      .ActorBlock-icon { background: white; }
    }
    &[data-animating="down"] {
      .ActorBlock-value { color: white };
      .ActorBlock-bar { border-color: white; }
      .ActorBlock-icon { background: white; }
    }
  }
  
</style>
