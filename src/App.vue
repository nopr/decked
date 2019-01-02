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

  @import "./asset/fonts";

  html, body {
    height: 100%;
    background: #191919;
  }
  body {
    -webkit-font-smoothing: antialiased;
    font-family: 'GameRegular';
    font-size: 16px;
    line-height: 20px;
    margin: 0;
    padding: 0;
  }
  #app {

    height: 100%;
    width: 100%;
    overflow: hidden;
    background: #191919;

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
  
  h1 {
    font-size: 30px;
    font-family: 'GameRegular';
    font-weight: 600;
    line-height: 30px;
    margin: 0 0 15px;
  }
  h2 {
    font-size: 20px;
    font-family: 'GameRegular';
    font-weight: 600;
    line-height: 20px;
    margin: 0 0 15px;
  }
  
  button, .button {
    -webkit-appearance: none;
    -webkit-font-smoothing: antialiased;
    cursor: pointer;
    border: 0;
    display: block;
    text-decoration: none;
    text-align: center;
    text-transform: uppercase;
    font-family: inherit;
    border: 0;
    border-radius: 5px;
    background: linear-gradient(to top, #242424, #303030);
    box-shadow: inset 0 1px 0 0 #444, inset 0 -2px 0 0 #222, 0 1px 3px 0 rgba(0,0,0,0.7);
    color: #111;
    line-height: 40px;
    padding: 0 30px;
    transition: color 0.2s, text-shadow 0.2s;
    font-size: 14px;
    font-weight: 900;
    text-shadow: 1px 1px #333;
    outline: 0;
  }
  button:hover, .button:hover {
    text-shadow: 1px 1px #3f3f3f;
    background: linear-gradient(to top, #292929, #383838);
    box-shadow: inset 0 1px 0 0 #444, inset 0 -1px 0 0 #222, 0 1px 3px 0 rgba(0,0,0,0.7);
  }
  .button.is-light, button.is-light {
    color: #333;
    text-shadow: 1px 1px #aaa;
    background: linear-gradient(to top, #777, #aaa);
    box-shadow: inset 0 1px 0 0 #bcbcbc, inset 0 -1px 0 0 #555, 0 1px 3px 0 rgba(0,0,0,0.7);
  }
  .button.is-light:hover, button.is-light:hover {
    color: #333;
    text-shadow: 1px 1px #bbb;
    background: linear-gradient(to top, #888, #bbb);
    box-shadow: inset 0 1px 0 0 #ccc, inset 0 -1px 0 0 #666, 0 1px 3px 0 rgba(0,0,0,0.7);
  }

  .button-group {
    border-radius: 10px;
    background: #111;
    padding: 5px;
    display: flex;
    flex-flow: column;
    & > * { padding-left: 10px; padding-right: 10px; }
    & > * + * { margin-top: 5px; }
    &.is-row { flex-flow: row; }
    &.is-row > * + * { margin-top: 0; margin-left: 5px; }
  }

</style>
