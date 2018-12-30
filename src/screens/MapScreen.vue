<template>
  <transition-group class="MapScreen" v-bind:data-animation="animation" name="animation" tag="div" mode="out-in" appear>
    <div class="screen" v-if="state === 0" key="map">
      <div class="MapLeft">
        <Player vertical="true" />
      </div>
      <div class="MapRight">
        <Map />
      </div>
    </div>
  </transition-group>
</template>

<script>
  import EventBus from '@/eventbus';
  import Player from '@/components/Player.vue';
  import Map from '@/components/Map.vue';

  export default {
    name: 'MapScreen',
    data() {
      return {
        state: null,
        animation: null
      }
    },
    computed: {
      level() {
        return this.$store.state.level
      },
      player() {
        return this.$store.state.player
      },
    },
    methods: {
      go(state, animation) {
        this.animation = animation;
        this.state = state;
      },
      enter() {
        this.$store.dispatch('GameState', 'area');
      },
      hold(duration) {
        return new Promise((resolve) => {
          setTimeout(() => resolve(), duration || 250);
        });
      },
      async mounted() {
        await this.go(0, 'up');
      }
    },
    components: {
      Player,
      Map
    },
    created() {
      console.log('MapScreen.created')
    },
    mounted() {
      console.log('MapScreen.mounted')
      this.mounted();
    },
    updated() {
      console.log('MapScreen.updated')
    },
    destroyed() {
      console.log('MapScreen.destroyed')
    }
  };
</script>

<style lang="scss">
  .MapScreen {
    height: 100%;
    display: flex;
    background: #191919;
    position: relative;
    
    &:before, &:after {
      z-index: 2;
      content: '';
      position: absolute;
      height: 30px;
      width: 100%;
    }
    &:before { top: 0; background: linear-gradient(#191919, transparent); }
    &:after { bottom: 0; background: linear-gradient(transparent, #191919); }

    .screen {
      width: 100%;
      height: 100%;
      display: flex;
      flex-flow: row;
      box-sizing: border-box;
      align-items: top;
      justify-content: center;
    }
    
    .MapLeft {
      padding: 15px 0;
      position: relative;
      z-index: 3;
    }
    .MapRight {
      padding: 15px 0;
      overflow: auto;
      position: relative;
      z-index: 1;
    }

    .animation-enter-active {
      transition: opacity 0.5s, transform 0.5s;
      transition-delay: 0.5s;
    }
    .animation-leave-active {
      transition: opacity 0.5s, transform 0.5s;
    }
    .animation-enter, .animation-leave-to {
      position: absolute;
      opacity: 0;
    }
    &[data-animation="down"] {
      & > .animation-enter { transform: translateY(100px); }
      & > .animation-leave-to { transform: translateY(-100px); }
    }
    &[data-animation="up"] {
      & > .animation-enter { transform: translateY(-100px); }
      & > .animation-leave-to { transform: translateY(100px); }
    }

  }
</style>
