<template>
  <div class="ActorGold" v-bind:data-animating="animating">
    <span class="ActorGold-icon"></span>
    <span class="ActorGold-value">&yen;{{ gold }}</span>
  </div>
</template>

<script>
  import EventBus from '@/eventbus';

  export default {
    name: 'ActorGold',
    props: ['actor'],
    methods: {
      async animate(setting) {
        this.animating = setting;
        await this.hold(250);
        this.animating = false
      },
      async tweenvalue(prop, newer) {
        const existing = this[prop];
        const diff = Math.abs(newer - existing);
        const incr = (newer > existing);
        const speed = 250 / diff;
        for (let i = 0; i < diff; i++) {
          this[prop] += (incr) ? 1 : -1;
          await this.hold(speed); 
        }
      },
      hold(duration) {
        return new Promise((resolve) => {
          setTimeout(() => resolve(), duration || 250);
        });
      },
    },
    data() {
      return {
        animating: false,
        gold: this.actor.gold,
      }
    },
    computed: {
      value() {
        return this.actor.gold;
      }
    },
    watch: {
      value(newer, older) {
        if (newer > older) { this.animate('up'); }
        if (newer < older) { this.animate('down'); }
        this.tweenvalue('gold', newer);
      }
    },
    created() {
      console.log('Stat.created')
    },
    mounted() {
      console.log('Stat.mounted')
    },
    updated() {
      // console.log('Stat.updated')
    },
    destroyed() {
      console.log('Stat.destroyed')
    }
  };
</script>

<style lang="scss">

  .ActorGold {
    position: absolute;
    height: 100%;
    width: 100%;
    .ActorGold-value {
      position: absolute;
      right: 0;
      top: 0;
      font-size: 16px;
      font-weight: 400;
      line-height: 15px;
      transition: color 0.5s;
      color: goldenrod;
      &:after {
        position: absolute;
        transform: translateX(1px);
        left: 100%;
        top: -1px;
        font-weight: bold;
      }
    }
    &[data-animating="up"] {
      .ActorGold-value { color: white };
      .ActorGold-value:after { content: '+' };
    }
    &[data-animating="down"] {
      .ActorGold-value { color: white };
      .ActorGold-value:after { content: '-' };
    }
  }
  
</style>
