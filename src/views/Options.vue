<template>
  <div class="Options">
    <h1>options</h1>
  </div>
</template>

<script>
  export default {
    name: 'Options',
    computed: {},
    components: {},
    methods: {},
    created() {
      console.log('Options.created')
    },
    mounted() {
      console.log('Options.mounted')
    },
    updated() {
      console.log('Options.updated')
    },
    destroyed() {
      console.log('Options.destroyed')
    }
  };
</script>

<style lang="scss">

  .Options {
    
    margin: 10px;
    
    .Battlefield {
      display: flex;
      flex-flow: row;
      justify-content: space-between;
    }
    
    .Actor {
      
      box-sizing: border-box;
      position: relative;
      background: #333;
      border-radius: 5px;
      padding: 10px;
      width: 200px;
      display: flex;
      flex-flow: column;
      justify-content: space-between;
      
      .about {
        margin-bottom: 1em;
        display: flex;
        flex-flow: column;
        align-items: center;
      }
      .about .name {
        font-weight: 600;
        color: white;
      }
      .about .title {
        color: #999;
        font-size: 14px;
      }
      
      .stats {
        display: flex;
        flex-flow: row;
        justify-content: space-between;
        flex-direction: row-reverse;
      }
      
      .health, .effect {
        display: flex;
        line-height: 16px;
        align-items: center;
        font-size: 15px;
        font-weight: 600;
      }
      .health .icon, .effect .icon {
        margin-right: 3px;
      }
      
      .health {
        color: red;
      }
      .effect {
        color: lime;
      }
      
      .intent {
        position: absolute;
      }
      
    }
    
  }

</style>
