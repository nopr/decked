<template>
  <div v-bind:class="['Card', { 'small': small }]">
    <div class="cost">{{ card.cost }}</div>
    <div class="face">
      <div class="name">{{ card.name }}</div>
      <div class="text" v-html="card.text"></div>
    </div>
    <div class="type">{{ card.type }}</div>
  </div>
</template>

<script>
  export default {
    name: 'Card',
    props: {
      card: null,
      index: null,
      small: false,
    },
    created() {
      console.log('Card.created')
    },
    mounted() {
      console.log('Card.mounted')
    },
    updated() {
      console.log('Card.updated')
    },
    destroyed() {
      console.log('Card.destroyed')
    }
  };
</script>

<style lang="scss">
  .Card {

    display: inline-flex;
    flex-flow: column;
    justify-content: space-between;
    align-content: center;

    box-sizing: border-box;
    text-align: center;
    border: 5px solid white;
    background: #eee;
    border-radius: 10px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.3);
    width: 110px;
    height: 160px;
    min-width: 110px;
    transition: all 0.25s ease, top 0.25s;
    position: relative;
    cursor: pointer;

    &.small {
      width: 50px;
      height: 75px;
      min-width: 50px;
      border: 2px solid white;
      background:#333;
      border-radius: 5px;
      box-shadow: 0 1px 1px #aaa;
      .name, .text, .type, .cost { display: none; }
    }

    .name {
      font-size: 13px;
      font-weight: 600;
      text-shadow: 1px 1px 0 white;
      color: #333;
    }
    .text {
      font-size: 11px;
      text-align: center;
      font-style: italic;
      line-height: 15px;
      padding: 0 5px;
    }
    .type {
      font-size: 8px;
      line-height: 8px;
      letter-spacing: 1px;
      font-weight: bold;
      text-transform: uppercase;
      padding-bottom: 10px;
      color: #aaa;
    }
    .cost {
      font-weight: 900;
      font-size: 12px;
      line-height: 12px;
      background: white;
      width: 1em;
      color: #333;
      padding-right: 5px;
      padding-bottom: 5px;
      border-radius: 0 0 10px 0;
    }

  }
</style>
