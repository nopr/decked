<template>
  <transition-group class="Create" v-bind:data-animation="animation" name="animation" tag="div">
    <div class="screen" v-if="state === 0" v-bind:key="0">
      <p>Welcome</p>
      <button v-on:click="go(1, 'forwards')">Continue</button>
    </div>
    <div class="screen" v-if="state === 1" v-bind:key="1">
      <p><button v-on:click="create">Create a new character</button></p>
      <Player v-if="player" />
      <p>
        <button v-on:click="go(0, 'backwards')">Back</button>
        <button v-bind:disabled="!player" v-on:click="go(2, 'forwards')">Next</button>
      </p>
    </div>
    <div class="screen" v-if="state === 2" v-bind:key="2">
      <p>Are you ready?</p>
      <p>
        <button v-on:click="go(1, 'backwards')">Back</button>
        <router-link to="/game">I'm ready</router-link>
      </p>
    </div>
  </transition-group>
</template>

<script>
  import Player from '@/components/Player.vue';

  export default {
    name: 'Create',
    computed: {
      player() {
        return this.$store.state.player
      },
    },
    data() {
      return {
        state: null,
        animation: null,
      }
    },
    components: {
      Player,
    },
    methods: {
      create() {
        this.$store.dispatch('create_player');
      },
      go(state, animation) {
        this.animation = animation;
        this.state = state;
      },
    },
    created() {
      console.log('Create.created')
    },
    mounted() {
      console.log('Create.mounted')
      this.state = 0;
    },
    updated() {
      console.log('Create.updated')
    },
    destroyed() {
      console.log('Create.destroyed')
    }
  };
</script>

<style lang="scss">

  .Create {
    height: 100%;
    display: flex;

    .screen {
      width: 100%;
      height: 100%;
      display: flex;
      flex-flow: column;
      align-items: center;
      justify-content: center;
    }

    .animation-enter-active {
      transition: all 0.25s ease-out;
      transition-delay: 0.25s;
    }
    .animation-leave-active {
      transition: all 0.25s ease-in;
    }
    .animation-enter, .animation-leave-to {
      position: absolute;
      opacity: 0;
    }
    &[data-animation="forwards"] {
      .animation-enter { transform: translateX(100px); }
      .animation-leave-to { transform: translateX(-100px); }
    }
    &[data-animation="backwards"] {
      .animation-enter { transform: translateX(-100px); }
      .animation-leave-to { transform: translateX(100px); }
    }

  }

</style>
