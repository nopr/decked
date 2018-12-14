<template>
  <div class="Player" v-if="player">
    <Character />
    <div class="about">
      <div class="name">{{ player.name }} the {{ player.role.name }}</div>
      <div class="attributes">
        <span class="attribute" v-for="attribute in player.attributes" v-bind:key="attribute.name">{{ attribute.name }}</span>
      </div>
    </div>
    <div class="effects">
      <span class="effect" v-for="(effect, key) in player.effects" v-bind:key="key" v-bind:style="{ color: effect.colour }">
        <icon class="effect-icon" v-bind:name="effect.icon" />
        <span class="effect-name">{{ effect.name }}</span>
        <span class="effect-value">{{ effect.value }}</span>
      </span>
    </div>
    <div class="health">
      <icon class="health-icon" name="heart" />
      <span class="health-current">{{ player.health.current }}</span>
      <span class="health-maximum">{{ player.health.maximum }}</span>
    </div>
  </div>
</template>

<script>
  import Character from './Character.vue';

  export default {
    name: 'Player',
    components: { Character },
    computed: {
      player() {
        return this.$store.state.player
      }
    },
    created() {
      console.log('Player.created')
    },
    mounted() {
      console.log('Player.mounted')
    },
    updated() {
      console.log('Player.updated')
    },
    destroyed() {
      console.log('Player.destroyed')
    }
  };
</script>

<style lang="scss">
  .Player {

    background: #222;
    border-radius: 4px;
    position: relative;
    padding: 0;
    margin: 15px;

    display: flex;
    align-items: center;
    justify-content: start;

    color: #eee;
    
    & > div {
      padding: 15px;
    }

    .Character {
      padding: 0;
      width: 50px;
      height: 50px;
      margin-left: 10px;
      background: #444;
      svg {
        width: 50px !important;
        height: 50px !important;
      }
    }

    .about {
      display: flex;
      flex-flow: column;
      flex-grow: 1;
      .name {
        font-weight: 900;
        text-transform: uppercase;
      }
      .attributes {
        opacity: 0.5;
        font-weight: 200;
        font-style: italic;
      }
      .attribute:before { content: ', '; }
      .attribute:first-child:before { content: ''; }
      .attribute:last-child:before { content: ' and '; }
    }

    .effects {
      display: flex;
      flex-flow: row;
      align-items: center;
      .effect {
        display: flex;
        flex-flow: row;
        align-items: center;
      }
      .effect + .effect {
        padding-left: 15px;
      }
      .effect-icon {
        margin-right: 5px;
      }
      .effect-name {
        display: none;
      }
      .effect-value {
        font-weight: 600;
      }
    }

    .health {
      color: red;
      display: flex;
      flex-flow: row;
      align-items: center;
      .health-icon {
        margin-right: 5px;
      }
      .health-current {
        font-weight: 600;
      }
      .health-current:after {
        content: '/';
      }
      .health-maximum {
        font-weight: 600;
      }
    }

  }
</style>
