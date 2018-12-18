<template>
  <div class="EnemyArea" v-bind:data-target="targetable">
    <Enemy v-bind:enemy="enemy" v-on:click.native="target" />
    <div class="intent" v-bind:data-state="enemy.intent.state">
      <span v-if="enemy.intent.hint" class="hint">{{enemy.intent.hint}}</span>
    </div>
  </div>
</template>

<script>
  import EventBus from '@/eventbus';
  import Enemy from '@/components/Enemy.vue';

  export default {
    name: 'EnemyArea',
    props: ['enemy', 'index'],
    components: { Enemy },
    data() {
      return {
        targetable: false,
        active: null,
      }
    },
    methods: {
      target() {
        if (this.targetable) {
          this.active = null;
          this.targetable = false;
          EventBus.$emit('Card:Play', {
            card: this.active.card,
            index: this.active.index,
            target: {
              type: 'enemy',
              index: this.index
            }
          });
        }
      },
    },
    created() {
      console.log('EnemyArea.created')
    },
    mounted() {
      console.log('EnemyArea.mounted')
      EventBus.$on('Card:ChooseTarget', (data) => {
        this.targetable = true;
        this.active = data;
      });
    },
    updated() {
      console.log('EnemyArea.updated')
    },
    destroyed() {
      console.log('EnemyArea.destroyed')
    }
  };
</script>

<style lang="scss">
  .EnemyArea {

    display: flex;
    flex-flow: column;
    align-items: center;

    &[data-target] .Enemy {
      box-shadow: 0 0 0 5px red;
      cursor: pointer;
    }

    .intent {
      line-height: 20px;
      transition: opacity 0.25s, transform 0.25s;
      background: white;
      border-radius: 5px;
      font-size: 12px;
      padding: 5px 10px;
      box-shadow: 0 0 0 1px #ccc, 0 4px 0 #ccc;
      position: relative;
      font-weight: bold;
      &:before {
        content: '';
        position: absolute;
        top: -4px;
        left: 10px;
        background: white;
        width: 8px;
        height: 8px;
        transform: rotate(45deg);
        box-shadow: -1px -1px 0 0 #ccc;
      }
    }
    .intent[data-state="none"] {
      opacity: 0;
      transform: translateY(-20px);
    }
    .intent[data-state="ready"] {
      opacity: 1;
      transform: translateY(10px);
    }

  }
</style>
