<template>
  <div class="Battle" v-bind:data-state="battle.state">
    <div class="BattleIntro">
      <p>{{ battle.encounter }}</p>
    </div>
    <div class="DragEnemy" v-for="(enemy, key) in battle.enemies" v-bind:key="key">
      <div>{{enemy.name}}</div>
      <Container class="DragEnemyContainer" group-name="1" v-on:drop="drop_enemy">
        <Draggable class="area"></Draggable>
      </Container>
    </div>
    <Container group-name="1" class="BattleArea" v-on:drop="drop_stack">
      <Draggable v-for="card in player.cards" v-bind:key="card.id" >
        <div class="draggable-item">{{ card.name }}</div>
      </Draggable>
    </Container>
    <div class="BattleEnemies">
      <EnemyArea v-for="(enemy, key) in battle.enemies" v-bind:key="key" v-bind:index="key" v-bind:enemy="enemy" />
    </div>
    <div class="BattlePlayer">
      <PlayerArea />
      <Player />
    </div>
  </div>
</template>

<script>
  import EventBus from '@/eventbus';

  import { Container, Draggable } from 'vue-smooth-dnd';

  import EnemyArea from '@/components/EnemyArea.vue';
  import PlayerArea from '@/components/PlayerArea.vue';
  import Player from '@/components/Player.vue';

  export default {
    name: 'Battle',
    computed: {
      battle() {
        return this.$store.state.battle;
      },
      player() {
        return this.$store.state.player;
      },
    },
    methods: {
      drop_stack(a) {
        console.log('dropped stack');
      },
      drop_enemy(a) {
        console.log('dropped enemy');
      },
      drop_anywhere(a) {
        console.log('dropped anywhere');
      },
      async mount() {
        await this.battle_setup();
        await this.battle_ready();
        await this.battle_start();
        EventBus.$emit('Battle_Started');
      },
      battle_setup() {
        return new Promise((resolve) => {
          this.$store.dispatch('Battle_Setup');
          resolve();
        });
      },
      battle_ready() {
        return new Promise((resolve) => {
          setTimeout(() => {
            this.$store.dispatch('Battle_Ready');
            resolve();
          }, 2000);
        });
      },
      battle_start() {
        return new Promise((resolve) => {
          setTimeout(() => {
            this.$store.dispatch('Battle_Start');
            resolve();
          }, 2000);
        });
      },
    },
    components: {
      EnemyArea, PlayerArea, Player, Container, Draggable
    },
    created() {
      console.log('Battle.created')
    },
    mounted() {
      console.log('Battle.mounted')
      this.mount();
    },
    updated() {
      console.log('Battle.updated')
    },
    destroyed() {
      console.log('Battle.destroyed')
    }
  };
</script>

<style lang="scss">
  .Battle {

    justify-content: space-between;

    .BattleIntro {
      position: absolute;
      transform: translateX(-50%) translateY(-50%);
      transition: opacity 1s;
      opacity: 0;
      left: 50%;
      top: 50%;
    }

    .BattleEnemies {
      margin: 15px 10px;
      display: flex;
      flex-flow: row;
      justify-content: space-around;
    }

    .EnemyArea {
      transition: all .25s;
    }
    .PlayerArea {
      transition: all 0.25s;
    }
    .Player {
      transition: all 0.25s;
    }

    &[data-state="loading"] {
      .BattleIntro { opacity: 1; }
      .EnemyArea { opacity: 0; transform: translateY(-100px); }
      .PlayerArea { opacity: 0; transform: translateX(-100px); }
      .Player { opacity: 0; transform: translateY(100px); }
    }
    &[data-state="ready"] {
      .BattleIntro { opacity: 0; }
      .EnemyArea { opacity: 1; transform: translateY(0px); }
      .EnemyArea:nth-child(1) { transition-delay: 0.5s; }
      .EnemyArea:nth-child(2) { transition-delay: 0.7s; }
      .EnemyArea:nth-child(3) { transition-delay: 0.9s; }
      .PlayerArea { opacity: 1; transform: translateX(0); }
      .Player { opacity: 1; transform: translateY(0); }
    }

  }

  .DragEnemy {
    border: 1px solid black;
    padding: 10px;
    position: relative;
    .DragEnemyContainer {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      & > * {
        opacity: 0;
      }
    }
  }
</style>
