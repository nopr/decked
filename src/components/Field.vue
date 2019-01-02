<template>
  <div class="Field">
    <div class="energy button is-light">
      {{ energy }} Energy
    </div>
    <div class="deck" v-bind:data-state="deck.state">
      <div class="label">Deck</div>
      <div class="value">{{ deck.cards.length }}</div>
      <transition-group class="list" name="deck-card" v-bind:duration="250" tag="div">
        <Card v-for="card in deck.cards" v-bind:key="'deck'+card.id" v-bind:data-key="card.id" v-bind:card="card" small="true" />
      </transition-group>
    </div>
    <div class="hand">
      <transition-group class="list" name="hand-card" tag="div" v-bind:duration="250">
        <Card v-for="(card, index) in hand.cards" v-on:click.native="play(card, index)" v-bind:key="card.id" v-bind:data-staged="staged === index" v-bind:data-key="card.id" v-bind:card="card" />
      </transition-group>
    </div>
    <div class="pile" v-bind:data-state="pile.state">
      <div class="label">Pile</div>
      <div class="value">{{ pile.cards.length }}</div>
      <transition-group class="list" name="pile-card" v-bind:duration="250" tag="div">
        <Card v-for="card in pile.cards" v-bind:key="card.id" v-bind:data-key="card.id" v-bind:card="card" small="true" />
      </transition-group>
    </div>
    <button class="endturn" v-on:click="endturn">End</button>
  </div>
</template>

<script>
  import EventBus from '@/eventbus';
  import Card from './Card.vue';

  export default {
    name: 'Field',
    components: { Card },
    data() {
      return {
        staged: null,
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
      energy() {
        return this.$store.state.player.energy;
      },
      player() {
        return this.$store.state.player;
      }
    },
    methods: {
      async fill(cards) {
        for (let card in cards) {
          await this.gain(cards[card]);
        }
        await this.hold();
        await this.shuffle();
        await this.hold();
        await this.draw();
        await this.draw();
        await this.draw();
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
      async play(card, index) {
        if (this.staged !== null) { return }
        this.staged = index;
        await this.hold(250);
        this.$store.dispatch('Battle_Action_Player', card).then(async () => {
          await this.hold(250);
          this.discard(card, this.staged);
          this.staged = null;
          await this.hold(250);
          await this.draw();
        });
      },
      async unstage(card) {
        this.discard(card, this.staged);
        this.staged = null;
      },
      async endturn() {
        
      },
      hold(duration) {
        return new Promise((resolve) => {
          setTimeout(() => resolve(), duration || 250);
        });
      },
    },
    created() {
      console.log('Field.created')
    },
    mounted() {
      console.log('Field.mounted')
      EventBus.$on('Battle_Started', async () => {
        await this.hold();
        this.fill(this.player.cards);
      });
      EventBus.$on('Battle:Actions:Done', this.draw);
    },
    updated() {
      console.log('Field.updated')
    },
    destroyed() {
      console.log('Field.destroyed')
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

  .Field {

    position: relative;
    box-sizing: border-box;
    height: 300px;
    
    .energy, .endturn {
      padding-left: 0;
      padding-right: 0;
      width: 8em;
    }
    
    .energy {
      position: absolute;
      bottom: 15px;
      right: calc(50% + 65px);
    }
    
    .endturn {
      position: absolute;
      bottom: 15px;
      left: calc(50% + 65px);
    }

    .deck, .pile {
      width: 50px;
      height: 75px;
      border-radius: 5px;
      position: absolute;
      transition: transform .25s;
      background: #111;
      &[data-state="animating"] .list {
        animation-name: shake;
        animation-duration: .25s;
        animation-iteration-count: 1;
        animation-delay: .25s;
      }
      .list {
        transition: transform .25s;
        position: absolute;
        z-index: 2;
        bottom: 0;
        left: 0;
      }
      .label {
        position: absolute;
      }
      .Card {
        box-shadow: 0 0 1px rgba(0, 0, 0, 0.7);
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
      left: 50%;
      margin-left: -55px;
      .Card { background: #333; border-color: #888; }
    }
    .pile {
      bottom: 0;
      right: 50%;
      margin-right: -55px;
      .Card { background: #111; border-color: #222; }
    }

    .deck {
      .deck-card-enter {
        opacity: 1;
        transform: translateY(-10px);
      }
      .deck-card-leave {
        opacity: 1;
        transform: translateY(-20px) translateX(-10px) rotate(-22.5deg);
      }
      .deck-card-leave-to {
        opacity: 1;
        transform: translateY(-20px) translateX(-10px) rotate(-22.5deg);
      }
    }
    .pile {
      .pile-card-enter {
        opacity: 1;
        transform: translateY(-20px);
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
      height: 160px;
      right: 0;
      left: 0;
      top: 0;
      .list {
        text-align: center;
      }
      .Card {
        transition: all 0.25s ease;
        margin: 0 3px;
      }
      .Card:hover {
        transform: translateY(-10px);
      }
      .Card[data-staged] {
        z-index: 30;
        transform: translateY(-30px) rotate(15deg);
        box-shadow: 3px 3px 10px rgba(0,0,0,0.5);
      }
      .hand-card-enter {
        opacity: 0;
        transform: translateY(80px);
      }
      .hand-card-leave {
        z-index: 30;
        opacity: 1;
        position: absolute;
        transform: translateY(-30px) rotate(15deg);
        box-shadow: 3px 3px 10px rgba(0,0,0,0.5);
      }
      .hand-card-leave-to {
        z-index: 30;
        opacity: 0;
        position: absolute;
        transform: translateY(-10px) rotate(15deg);
        box-shadow: 3px 3px 10px rgba(0,0,0,0.5);
      }
      .hand-card-leave-active {
        z-index: 30;
        opacity: 0;
        position: absolute;
        transform: translateY(-10px) rotate(15deg);
        box-shadow: 3px 3px 10px rgba(0,0,0,0.5);
      }

    }

  }

</style>
