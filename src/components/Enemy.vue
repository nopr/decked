<template>
  <div class="Enemy">
    <div class="about">
      <span class="name">{{enemy.name}}</span>
      <span class="title">{{enemy.title}}</span>
    </div>
    <div class="health">
      <span class="current">{{enemy.health.current}}</span>
      <span class="maximum">{{enemy.health.maximum}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Enemy',
    props: ['enemy'],
    created() {
      console.log('Enemy.created')
    },
    mounted() {
      console.log('Enemy.mounted')
    },
    updated() {
      console.log('Enemy.updated')
    },
    destroyed() {
      console.log('Enemy.destroyed')
    }
  };
</script>

<style lang="scss">
  .Enemy {

    background: #ccc;
    border-radius: 5px;
    position: relative;
    margin: 5px;

    display: flex;
    align-items: center;
    justify-content: space-between;
    
    & > div {
      padding: 15px;
    }

    .about {
      display: flex;
      flex-flow: column;
      flex-grow: 1;
      .name {
        font-weight: 900;
        text-transform: uppercase;
      }
      .title {
        opacity: 0.5;
        font-weight: 200;
        font-style: italic;
      }
    }
    .health {
      color: firebrick;
      display: flex;
      flex-flow: row;
      .current:before {
        content: '\2665';
        padding-right: 5px;
      }
      .current:after {
        content: '/';
        padding: 0 2px;
      }
    }

  }
</style>
