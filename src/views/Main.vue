<template>
  <div class="Main">
    <div class="logo">
      Game
    </div>
    <div class="button-group">
      <router-link to="/create" class="button">Start</router-link>
      <router-link to="/options" class="button">Options</router-link>
    </div>
    <div class="about">Made by me</div>
  </div>
</template>

<script>
  export default {
    name: 'Main',
    computed: {},
    components: {},
    methods: {},
    created() {
      console.log('Main.created')
    },
    mounted() {
      console.log('Main.mounted')
    },
    updated() {
      console.log('Main.updated')
    },
    destroyed() {
      console.log('Main.destroyed')
    }
  };
</script>

<style lang="scss">
  @import '../asset/styles.scss';

  .Main {
    
    height: 100%;
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: space-between;

    .logo {
      margin-top: 30px;
      text-transform: uppercase;
      font-weight: 100;
      font-size: 30px;
      line-height: 1;
      color: #ccc;
    }
    .about {
      margin-bottom: 30px;
      @include text('label');
    }

  }
</style>
