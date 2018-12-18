<template>
  <div class="PlayerArea">
    <div class="deck" v-bind:data-state="deck.state" v-on:click="draw">
      <div class="label">Deck</div>
      <transition-group class="list" name="deck-card" v-bind:duration="250" tag="div">
        <Card v-for="card in deck.cards" v-bind:key="'deck'+card.id" v-bind:data-key="card.id" v-bind:card="card" small="true" />
      </transition-group>
    </div>
    <div class="hand">
      <transition-group class="list" name="hand-card" tag="div" v-bind:duration="250">
        <Card v-for="(card, index) in hand.cards" v-on:click.native="attempt(card, index)" v-bind:data-playing="playing === index" v-bind:key="card.id" v-bind:data-key="card.id" v-bind:card="card" />
      </transition-group>
    </div>
    <div class="pile" v-bind:data-state="pile.state">
      <div class="label">Pile</div>
      <transition-group class="list" name="pile-card" v-bind:duration="250" tag="div">
        <Card v-for="card in pile.cards" v-bind:key="card.id" v-bind:data-key="card.id" v-bind:card="card" small="true" />
      </transition-group>
    </div>
    <button class="draw" v-on:click="draw">Draw</button>
    <button class="end">End</button>
  </div>
</template>

<script>
  import EventBus from '@/eventbus';
  import Card from './Card.vue';

  export default {
    name: 'PlayerArea',
    components: { Card },
    data() {
      return {
        energy: 0,
        playing: null,
        deck: {
          state: null,
          cards: [],
        },
        hand: {
          state: null,
          cards: [],
        },
        pile: {
          state: null,
          cards: [],
        },
      }
    },
    computed: {
      player() {
        return this.$store.state.player;
      }
    },
    methods: {
      async fill(cards) {
        for (let card in cards) {
          await this.gain(cards[card]);
        }
        await this.shuffle();
      },
      gain(card) {
        return new Promise((resolve, reject) => {
          this.deck.cards.push(card);
          setTimeout(() => {
            resolve();
          }, 100);
        });
      },
      drag(card) {
        return new Promise((resolve, reject) => {
          card.playable = true;
          this.hand.cards.unshift(card);
          setTimeout(() => {
            resolve();
          }, 250);
        });
      },
      async draw() {
        if (this.deck.cards.length === 0) {
          this.utility.each(this.pile.cards, async (card) => {
            const popped = this.pile.cards.pop();
            this.deck.cards.push(popped);
          });
          this.deck.state = 'animating';
          await this.shuffle(this.deck.cards);
          this.deck.state = null;
        }
        if (this.deck.cards.length > 0) {
          const drawing = this.deck.cards.pop();
          await this.drag(drawing);
        }
      },
      shuffle() {
        return new Promise((resolve, reject) => {
          const shuffled = this.utility.shuffle(this.deck.cards);
          this.deck.cards = shuffled;
          setTimeout(() => {
            resolve();
          }, 500);
        });
      },
      no_energy() {
        return new Promise((resolve, reject) => {
          this.state.energy = 'shaking';
          setTimeout(() => {
            this.state.energy = null;
            resolve();
          }, 500);
        });
      },
      energise(value) {
        return new Promise((resolve, reject) => {
          if (value > this.energy) {
            this.state.energy = 'adding';
          }
          if (value < this.energy) {
            this.state.energy = 'reducing';
          }
          setTimeout(() => {
            this.energy = value;
            this.state.energy = null;
            resolve();
          }, 250);
        });
      },
      discard(card, index) {
        return new Promise((resolve, reject) => {
          this.hand.cards.splice(index, 1);
          setTimeout(() => {
            this.pile.cards.push(card);
            resolve();
          }, 250);
        });
      },
      drop() {
        return new Promise((resolve, reject) => {
          const dropping = this.hand.cards.pop();
          this.pile.cards.push(dropping);
          setTimeout(() => {
            resolve();
          }, 100);
        });
      },
      async attempt(card, index) {
        console.log('playing', card, index)
        if (this.playing !== null) { return }
        // if (this.energy === 0) {
        //   return await this.no_energy();
        // }
        // if (this.energy < card.cost) { return }
        // this.energise(this.energy - 1);

        this.playing = index;

        if (card.type === 'skill') {
          EventBus.$emit('Card:Play', {
            card: card,
            index: index,
            target: {
              type: 'player'
            }
          });
        }
        if (card.type === 'attack') {
          EventBus.$emit('Card:ChooseTarget', {
            card: card,
            index: index 
          });
        }
        // this.discard(card, index);
      },
      play(card, index) {
        this.playing = null;
        this.discard(card, index);
      },
      async end() {
        let n = this.hand.cards.length;
        while (n--) {
          await this.drop();
        }
        await this.energise(4);
        await this.draw();
        await this.draw();
        await this.draw();
      },
    },
    created() {
      console.log('PlayerArea.created')
    },
    mounted() {
      console.log('PlayerArea.mounted')
      // EventBus.$on('Battle_Started', () => {
        this.fill(this.player.cards);
      // });
      EventBus.$on('Card:Play', (data) => {
        console.log("card play", data)
        this.$store.dispatch('Battle_Play_Card', data);
        this.play(data.card, data.index);
      });
    },
    updated() {
      console.log('PlayerArea.updated')
    },
    destroyed() {
      console.log('PlayerArea.destroyed')
    }
  };
</script>

<style lang="scss">

  @import '@/asset/styles.scss';

  @keyframes shake {
    from, to {
      transform: translate3d(0, 0, 0);
    }
    10%, 30%, 50%, 70%, 90% {
      transform: translate3d(-3px, 0, 0);
    }
    20%, 40%, 60%, 80% {
      transform: translate3d(3px, 0, 0);
    }
  }

  .PlayerArea {

    position: relative;
    box-sizing: border-box;
    background: #eee;
    height: 160px;
    margin: 15px;

    .deck, .pile {
      width: 50px;
      height: 75px;
      border-radius: 5px;
      position: absolute;
      transition: transform .25s;
      box-shadow: inset 0 0 0 1px #ccc;
      &[data-state="animating"] .list {
        animation-name: shake;
        animation-duration: .25s;
        animation-iteration-count: 1;
        animation-delay: .25s;
      }
      .label {
        @include text('label');
        line-height: 10px;
        position: absolute;
        text-align: center;
        color: #999;
        transform: translateY(-5px);
        width: 100%;
        left: 0;
        top: 50%;
      }
      .list {
        transition: transform .25s;
        position: absolute;
        z-index: 2;
        bottom: 0;
        left: 0;
      }
      .Card {
        box-shadow: 0 0 1px #777;
        transition: all 0.25s ease;
        position: absolute;
        margin: 0;
        bottom: 0;
        left: 0;
      }
      .Card:nth-of-type(1) { bottom: 1px; }
      .Card:nth-of-type(2) { bottom: 2px; }
      .Card:nth-of-type(3) { bottom: 3px; }
      .Card:nth-of-type(4) { bottom: 4px; }
      .Card:nth-of-type(5) { bottom: 5px; }
      .Card:nth-of-type(6) { bottom: 6px; }
      .Card:nth-of-type(7) { bottom: 7px; }
      .Card:nth-of-type(8) { bottom: 8px; }
      .Card:nth-of-type(9) { bottom: 9px; }
      .Card:nth-of-type(10) { bottom: 10px; }
      .Card:nth-of-type(11) { bottom: 11px; }
      .Card:nth-of-type(12) { bottom: 12px; }
      .Card:nth-of-type(13) { bottom: 13px; }
      .Card:nth-of-type(14) { bottom: 14px; }
      .Card:nth-of-type(15) { bottom: 15px; }
      .Card:nth-of-type(16) { bottom: 16px; }
      .Card:nth-of-type(17) { bottom: 17px; }
      .Card:nth-of-type(18) { bottom: 18px; }
      .Card:nth-of-type(19) { bottom: 19px; }
      .Card:nth-of-type(20) { bottom: 20px; }
    }

    .deck {
      bottom: 0;
      left: 0;
      cursor: pointer;
    }
    .pile {
      bottom: 0;
      right: 0;
      .Card { background: #ccc; cursor: default; }
    }

    .deck {
      .deck-card-enter {
        opacity: 1;
        transform: translateY(-20px);
      }
      .deck-card-leave {
        opacity: 1;
        transform: translateX(20px);
      }
      .deck-card-leave-to {
        opacity: 0;
        transform: translateX(20px);
      }
    }
    .pile {
      .pile-card-enter {
        opacity: 0;
        transform: translateY(-20px) translateX(10px) rotate(22.5deg);
      }
      .pile-card-leave {
        opacity: 1;
        transform: translateX(0px);
      }
      .pile-card-leave-to {
        opacity: 0;
        transform: translateY(-20px);
      }
    }

    .hand {
      position: absolute;
      height: 100%;
      right: 75px;
      left: 75px;
      top: 0;
      .list {
        text-align: center;
      }
      .Card {
        transition: all 0.25s ease, top 0.25s;
        margin: 0 3px;
      }
      .Card[data-playing] {
        transform: translateY(-100px);
      }
      .hand-card-enter {
        opacity: 0;
        transform: translateX(-80px) translateY(0px) rotate(22.5deg);
      }
      .hand-card-leave {
        opacity: 1;
      }
      .hand-card-leave-to {
        opacity: 0;
        transform: translateX(-80px) translateY(80px) rotate(-22.5deg);
      }
      .hand-card-leave-active {
        position: absolute;
      }

    }

  }

</style>
