<template>
  <div id="app">
    <transition name="fade" mode="out-in" v-bind:duration="250" >
      <router-view />
    </transition>
  </div>
</template>

<script>
  export default {}
</script>

<style lang="scss">
  html, body {
    height: 100%;
  }
  body {
    font-family: 'Avenir';
    font-size: 16px;
    line-height: 20px;
    margin: 0;
    padding: 0;
  }
  #app {

    height: 100%;
    width: 100%;
    overflow: hidden;
    background: #eee;

  }
  .fade-enter-active {
    transition: all .25s ease;
  }
  .fade-leave-active {
    transition: all .25s ease;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

</style>
