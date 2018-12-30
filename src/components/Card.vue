<template>
  <div v-bind:class="['Card', { 'small': small }]" v-bind:data-type="card.type">
    <div class="image" v-bind:style="{ maskImage: `url(${card.image})` }"></div>
    <div class="face">
      <div class="name">{{ card.name }}</div>
      <div class="type">{{ card.type }}</div>
      <div class="text" v-html="card.text"></div>
      <div class="cost">{{ card.cost }}</div>
    </div>
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
    border: 5px solid #e9e6d7;
    background: #444;
    border-radius: 10px;
    box-shadow: 0 1px 5px rgba(0,0,0,0.9), inset 0 5px 10px #35b0ab;
    width: 130px;
    height: 190px;
    min-width: 110px;
    transition: all 0.25s ease, top 0.25s;
    position: relative;
    padding: 20px 0 10px;
    cursor: pointer;
    
    &[data-type="attack"] {
      background: linear-gradient(#555, #444);
      box-shadow: 0 1px 5px rgba(0,0,0,0.9), inset 0 5px 10px #444;
    }
    &[data-type="skill"] {
      background: linear-gradient(#555, #444);
      box-shadow: 0 1px 5px rgba(0,0,0,0.9), inset 0 5px 10px #444;
    }

    &.small {
      width: 50px;
      height: 75px;
      min-width: 50px;
      border: 2px solid white;
      background:#333;
      border-radius: 5px;
      box-shadow: 0 1px 1px #aaa;
      .name, .text, .type, .cost, .image { display: none; }
    }
    
    .image {
      width: 50px;
      height: 50px;
      background: black;
      opacity: 0.4;
      mask-size: contain;
      margin: 0 auto;
    }
    .name {
      font-size: 14px;
      font-weight: 900;
      text-shadow: 0px 1px 3px rgba(0,0,0,0.5);
      text-transform: uppercase;
      color: #e9e6d7;
    }
    .type {
      font-size: 8px;
      line-height: 8px;
      letter-spacing: 2px;
      font-weight: 900;
      text-transform: uppercase;
      color: #fff;
      opacity: 0.6;
    }
    .text {
      font-size: 9px;
      line-height: 10px;
      letter-spacing: 1px;
      font-weight: 600;
      text-transform: uppercase;
      padding: 10px 5px 0;
      opacity: 0.8;
    }
    .cost {
      position: absolute;
      top: 0;
      left: 0;
      font-weight: 600;
      font-size: 12px;
      line-height: 12px;
      background: #e9e6d7;
      width: 1em;
      color: #333;
      padding-right: 5px;
      padding-bottom: 5px;
      border-radius: 0 0 10px 0;
    }

  }
</style>
