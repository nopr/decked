<template>
  <transition-group class="Create" v-bind:data-animation="animation" name="animation" tag="div">
    <div class="screen" v-if="state === 0" v-bind:key="0">
      <p>Welcome</p>
      <button v-on:click="go(1, 'forwards')">Continue</button>
    </div>
    <div class="screen" v-if="state === 1" v-bind:key="1">
      <p><button v-on:click="create">Create a new character</button></p>
      <div class="about-you" v-if="player">
        <Avatar v-bind:actor="player" />
        <div class="Description">
          You are <b>{{ player.name }}</b>, a {{ player.gender }} <b>{{ player.title }}</b> with a <b>{{ player.appearance.bodytype }} frame</b>.
          Your skin is <b>{{ player.appearance.skincolour.name }}</b> and your hair is <b>{{ player.appearance.haircolour.name }}</b>.<br /><br />
          You are <b>{{ player.attributes[0].name.toLowerCase() }}</b> and <b>{{ player.attributes[1].name.toLowerCase() }}</b>.
        </div>
      </div>
      <div class="button-group is-row">
        <button class="button" v-on:click="go(0, 'backwards')">Back</button>
        <button class="button" v-bind:disabled="!player" v-on:click="go(2, 'forwards')">Next</button>
      </div>
    </div>
    <div class="screen" v-if="state === 2" v-bind:key="2">
      <p>Are you ready?</p>
      <div class="button-group is-row">
        <button v-on:click="go(1, 'backwards')">Back</button>
        <router-link to="/game" class="button is-light">Yes</router-link>
      </div>
    </div>
  </transition-group>
</template>

<script>
  import Player from '@/components/Player.vue';
  import Avatar from '@/components/Avatar.vue';

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
      Avatar,
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
      color: #ccc;
    }
    .screen b {
      color: white;
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
    
    .about-you {
      display: flex;
      flex-flow: row;
      width: 350px;
      margin: 0 auto;
      align-items: center;
    }
    .about-you .Avatar {
      margin-right: 10px;
    }
    .about-you .Description {
      font-size: 14px;
    }

  }

</style>
