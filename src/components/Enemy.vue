<template>
  <div class="Enemy" v-bind:data-target="is_target" v-bind:data-dead="is_dead" v-bind:data-animated="is_animated" v-on:click="attack">
    <div class="about">
      <span class="name">{{enemy.name}} ({{enemy.id}})</span>
      <span class="title">{{enemy.title}}</span>
    </div>
    <div class="health">
      <icon class="health-icon" name="heart" />
      <span class="health-value">{{ health }}</span>
    </div>
    <div class="intent" v-bind:data-state="enemy.intent.state">
      <span v-if="enemy.intent.hint" class="hint">{{enemy.intent.hint}}</span>
    </div>
  </div>
</template>

<script>
  import EventBus from '@/eventbus';

  export default {
    name: 'Enemy',
    props: ['enemy'],
    computed: {
      health() {
        return this.enemy.health.current;
      }
    },
    data() {
      return {
        card: null,
        is_dead: false,
        is_target: false,
        is_animated: false
      }
    },
    methods: {
      stage(card) {
        if (this.is_dead) { return }
        if (this.is_target) { return }
        if (card.target === 'single') {
          this.is_target = true;
          this.card = card;
        }
      },
      async attack() {
        if (this.is_dead) { return }
        this.card.target_id = this.enemy.id;
        await this.$store.dispatch('Card_Play', this.card);
        await EventBus.$emit('Card:Done', this.card);
        console.log('attack() is done')
      },
      done(card) {
        console.log('card is done')
        this.is_target = false;
        this.card = null;
      },
      set_animated(animation) {
        console.log('set_animated:', animation)
        return new Promise((resolve) => {
          this.is_animated = animation;
          setTimeout(() => {
            console.log('set_animated done');
            this.is_animated = false;
            resolve();
          }, 250);
        })
      }
    },
    watch: {
      async health(newer, older) {
        console.log(`Rat ${this.enemy.id} from ${older} to ${newer}.`);
        console.log('start animation')
        await this.set_animated('damage');
        console.log('animation completed')
        if (newer < 1) {
          this.is_dead = true;
          console.log('is dead');
        }
      }
    },
    created() {
      console.log('Enemy.created')
    },
    mounted() {
      console.log('Enemy.mounted')
      EventBus.$on('Card:Stage', this.stage);
      EventBus.$on('Card:Done', this.done);
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

  @keyframes bouncing {
    from, to {
      transform: translateX(-50%) translateY(0);
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }
    50% {
      transform: translateX(-50%) translateY(-5px);
      box-shadow: 0 7px 10px rgba(0,0,0,0.1);
    }
  }
  @keyframes flashing-target {
    from, to {
      box-shadow: 0 0 0 5px rgba(255, 127, 80, 1);
    }
    50% {
      box-shadow: 0 0 0 5px rgba(255, 127, 80, 0.5);
    }
  }

  .Enemy {

    background: #222;
    border-radius: 5px;
    position: relative;
    margin: 0 10px;

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
        color: white;
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
      color: red;
      display: flex;
      flex-flow: row;
      align-items: center;
      .health-icon {
        margin-right: 5px;
      }
      .health-value {
        font-weight: 600;
      }
    }

    .intent {
      position: absolute;
      border-radius: 3px;
      transform: translateX(-50%);
      transition: transform 1s ease-out, opacity 0.25s ease-in, bottom 0.25s ease-in;
      opacity: 0;
      bottom: -50px;
      left: 50%;
      background: white;
      padding: 0 5px;
      font-size: 12px;
      font-weight: 600;
      animation-name: bouncing;
      animation-duration: 1s;
      animation-iteration-count: infinite;
      animation-timing-function: ease-in-out;
      &[data-state="ready"] {
        opacity: 1;
        bottom: -30px;
      }
    }

    &[data-target] {
      box-shadow: 0 0 0 5px coral;
      cursor: pointer;
      box-shadow: 0 0 0 5px red;
    }

    &[data-animated="damage"] {
      background: red;
    }
    &[data-dead] {
      opacity: 0.2;
      .intent {
        opacity: 0 !important;
      }
    }

  }
</style>
