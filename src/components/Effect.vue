<template>
  <span class="effect" v-bind:data-animating="animating">
    <span class="effect-icon" v-bind:style="{ backgroundColor: effect.colour, maskImage: `url(${effect.image})` }"></span>
    <span class="effect-value" v-bind:style="{ color: effect.colour }">{{ effect.value }}</span>
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
        await this.hold(150);
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

  .effect {
    display: flex;
    flex-flow: row;
    line-height: 20px;
    height: 20px;
  }
  .effect + .effect { 
    margin-left: 5px;
  }
  .effect-icon {
    mask-repeat: no-repeat;
    mask-size: contain;
    background: black;
    margin: 2px;
    height: 16px;
    width: 16px;
  }
  .effect-value {
    font-size: 13px;
    font-weight: 900;
    padding-right: 5px;
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
  
</style>
