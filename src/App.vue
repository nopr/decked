<template>
  <div id="app" v-bind:data-state-event="event">
    <router-view/>
  </div>
</template>

<script>
  export default {
    computed: {
      event() {
        return this.$store.state.event
      }
    },
  }
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
    background: white;

    transition: background 0.5s;

    &[data-state-event="map"] {
      background: #eee;
    }
    &[data-state-event="battle"] {
      background: #999;
    }
    &[data-state-event="quest"] {
      background: #999;
    }

  }

  .textcontent {
    text-align: center;
    padding: 2em;
  }
  .textcontent .actions {
    margin-top: 40px;
    display: flex;
    justify-content: space-between;
  }

  .textcontent dl {
    dt, dd { margin: 0; padding: 0; }
    margin: 0 auto 30px;
    display: flex;
    flex-flow: column;
    dd + dt { margin-top: 15px; }
    dt, dd { text-align: left; }
    dt { font-weight: 600; }
  }

  .textcontent button {
    -webkit-appearance: none;
    display: inline-block;
    font-size: 14px;
    font-weight: 600;
    line-height: 60px;
    border: 0;
    border-radius: 5px;
    padding: 0 25px;
    cursor: pointer;
    font-weight: 600;
    &:active, &:focus {
      outline: 0;
    }
    &.is-primary {
      background: #555;
      color: #fff;
      &:hover { background: #444; }
    }
    &.is-secondary {
      color: #555;
      background: transparent;
      box-shadow: inset 0 0 0 3px #555;
      &:hover {
        color: #444;
        box-shadow: inset 0 0 0 3px #444;
      }
    }
  }

</style>
