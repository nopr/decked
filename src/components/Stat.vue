<template>
  <span class="Stat" v-bind:data-animating="animating">
    <span class="Stat-icon" v-bind:style="{ backgroundColor: self.colour, maskImage: `url(${self.image})` }"></span>
    <span class="Stat-value" v-bind:style="{ color: self.colour }">{{ self.value }}</span>
  </span>
</template>

<script>
  import EventBus from '@/eventbus';

  export default {
    name: 'Stat',
    props: ['self'],
    methods: {
      async animate(setting) {
        this.animating = setting;
        await this.hold(150);
        this.animating = false
      },
      hold(duration) {
        return new Promise((resolve) => {
          setTimeout(() => resolve(), duration || 250);
        });
      },
    },
    data() {
      return {
        animating: false
      }
    },
    computed: {
      value() {
        return this.self.value;
      }
    },
    watch: {
      value(newer, older) {
        if (newer > older) { this.animate('up'); }
        if (newer < older) { this.animate('down'); }
      }
    },
    created() {
      console.log('Stat.created')
    },
    mounted() {
      console.log('Stat.mounted')
    },
    updated() {
      console.log('Stat.updated')
    },
    destroyed() {
      console.log('Stat.destroyed')
    }
  };
</script>

<style lang="scss">

  .Stat {
    transition: all 0.25s;
  }
  
  .Stat[data-animating="up"] {
    transform: translateY(-5px);
    .Stat-icon { background-color: white !important; }
    .Stat-value { color: white !important };
  }
  .Stat[data-animating="down"] {
    transform: translateY(5px);
    .Stat-icon { background-color: #666 !important; }
    .Stat-value { color: #666 !important };
  }
  
</style>
