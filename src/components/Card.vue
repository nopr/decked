<template>
  <div class="Card" v-bind:data-type="card.type">
    <div class="cost">
      <span>{{ card.cost }}</span>
      <icon name="bolt" />
    </div>
    <div class="face">
      <div class="about">
        <div class="name">{{ card.name }}</div>
        <div class="text" v-html="card.text" />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Card',
    props: ['card', 'index'],
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

    cursor: pointer;

    box-sizing: border-box;
    transition: all 0.25s;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-flow: column;
    overflow: hidden;
    justify-content: center;

    width: 140px;
    height: 180px;
    min-width: 0;
    max-width: 140px;

    .face {
      margin: 5px;
      height: 100%;
      display: flex;
      flex-flow: column;
      justify-content: center;
      padding: 5px;
      border: 5px solid white;
      background: #ccc;
      border-radius: 15px;
      box-shadow: 0 1px 2px 1px rgba(0,0,0,0.15);
    }
    .name {
      font-size: 16px;
      font-weight: 600;
      text-align: center;
      color: white;
      text-shadow: 1px 1px rgba(0,0,0,0.25);
    }
    .text {
      font-size: 12px;
      text-align: center;
      font-style: italic;
    }
    .cost {
      position: absolute;
      top: 20px;
      left: 20px;
      display: flex;
      flex-flow: column;
      font-weight: 600;
      opacity: 0.5;
      font-size: 14px;
      line-height: 14px;
    }

  }
</style>
