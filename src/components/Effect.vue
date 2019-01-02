<template>
  <span class="effect" v-bind:data-animating="animating">
    <span class="effect-icon" v-bind:style="{ backgroundColor: effect.colour, maskImage: `url(${effect.image})` }"></span>
    <span class="effect-value" v-bind:style="{ color: effect.colour }">{{ effect.value }}</span>
    <span class="effect-text"><b>{{ effect.name }}:</b> {{ effect.text }}</span>
  </span>
</template>

<script>
  import EventBus from '@/eventbus';

  export default {
    name: 'Effect',
    props: ['effect'],
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
        return this.effect.value;
      }
    },
    watch: {
      value(newer, older) {
        if (newer > older) { this.animate('up'); }
        if (newer < older) { this.animate('down'); }
      }
    },
    created() {
      console.log('Effect.created')
    },
    mounted() {
      console.log('Effect.mounted')
    },
    updated() {
      console.log('Effect.updated')
    },
    destroyed() {
      console.log('Effect.destroyed')
    }
  };
</script>

<style lang="scss">

  .effect {
    display: flex;
    flex-flow: row;
    justify-content: flex-start;
    align-items: flex-start;
    z-index: 2;
    position: relative;
    line-height: 20px;
    height: 20px;
    margin: 4px 0;
    cursor: pointer;
  }
  .effect-icon {
    mask-repeat: no-repeat;
    mask-size: contain;
    background: grey;
    height: 20px;
    width: 20px;
  }
  .effect-value {
    font-size: 12px;
    font-weight: 600;
    line-height: 10px;
    text-shadow: 2px 2px rgba(0, 0, 0, 0.5), 1px 1px #000, 1px -1px #000, -1px -1px #000, -1px 1px #000;
    position: absolute;
    text-align: right;
    padding: 0;
    color: white !important;
    width: 20px;
    bottom: 0;
    right: 0;
  }
  .effect-text {
    display: none;
    color: white;
    width: 10em;
    padding: 2px 5px;
    font-size: 13px;
    background: rgba(0,0,0,0.6);
    border-radius: 3px;
    box-shadow: 0 0 0 4px rgba(0,0,0,0.6);
    text-shadow: 0 0 2px #000, 0 0 2px #000;
    position: absolute;
    margin-left: 15px;
    left: 100%;
    bottom: 0;
  }
  
  .effect, .effect-icon, .effect-value {
    transition: all 0.25s ease;
  }
  .effect-enter {
    opacity: 0;
    transform: translateY(10px);
  }
  .effect-enter-active {
    transform: translateY(-5px);
    .effect-icon { background-color: white !important; }
    .effect-value { color: white !important; }
  }
  .effect-leave-to, .effect-leave-active {
    opacity: 0;
    transform: translateY(10px);
    position: absolute;
  }
  
  .effect[data-animating="up"] {
    transform: translateY(-5px);
    .effect-icon { background-color: white !important; }
    .effect-value { color: white !important };
  }
  .effect[data-animating="down"] {
    transform: translateY(5px);
    .effect-icon { background-color: black !important; }
    .effect-value { color: black !important };
  }
  
  .effect:hover {
    background: rgba(0,0,0,0.6);
    border-radius: 3px;
    box-shadow: 0 0 0 4px rgba(0,0,0,0.6);
    .effect-text { display: block; }
  }
  
</style>
