<template>
  <transition-group class="MapScreen" v-bind:data-animation="animation" name="animation" tag="div" mode="out-in" appear>
    <div class="screen" v-if="state === 0" key="map">
      <div class="MapLeft">
        <Avatar v-bind:actor="player" />
        <Actor v-bind:actor="player" small="true" />
        <div class="button-group">
          <button>Inventory</button>
          <button>Settings</button>
        </div>
      </div>
      <div class="MapRight">
        <Map />
      </div>
    </div>
  </transition-group>
</template>

<script>
  import EventBus from '@/eventbus';
  import Avatar from '@/components/Avatar.vue';
  import Actor from '@/components/Actor.vue';
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
      Actor,
      Avatar,
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
      margin-right: 15px;
      width: 120px;
      z-index: 3;
      .Avatar { margin-bottom: 5px; }
      .Actor { margin-bottom: 5px; }
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
