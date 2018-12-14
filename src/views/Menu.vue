<template>
  <div class="Menu">
    <router-link to="/game">Start</router-link>
    <router-link to="/options">Options</router-link>
    <hr style="margin-bottom: 300px;" />
    <button v-on:click="gainmany">Gain cards</button>
    <button v-on:click="draw">Draw Card</button>
    <button v-on:click="end">End</button>
    <div class="stuff">
      <div class="energy" v-bind:data-state="state.energy">
        <div class="value">{{ energy }}</div>
        <div class="symbol"></div>
      </div>
      <div class="deck" v-bind:data-state="state.deck">
        <div class="label">{{ deck.length }} Cards</div>
        <transition-group class="list" name="deck-card" v-bind:duration="250" tag="div">
          <div class="card" v-for="card in deck" v-bind:key="card.id" v-bind:data-key="card.id">
            &nbsp;
          </div>
        </transition-group>
      </div>
      <div class="hand">
        <transition-group class="list" name="hand-card" tag="div" v-bind:duration="250">
          <div class="card" v-for="(card, index) in hand" v-on:click="play(card, index)" v-bind:key="card.id" v-bind:data-key="card.id">
            {{ card.value }}
          </div>
        </transition-group>
      </div>
      <div class="pile" v-bind:data-state="state.pile">
        <div class="label">{{ pile.length }} Cards</div>
        <transition-group class="list" name="pile-card" v-bind:duration="250" tag="div">
          <div class="card" v-for="card in pile" v-bind:key="card.id" v-bind:data-key="card.id">
            &nbsp;
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Menu',
    computed: {},
    components: {},
    methods: {
      gain() {
        return new Promise((resolve, reject) => {
          const gaining = this.current++;
          this.deck.push({
            id: gaining,
            value: gaining,
            playable: false,
          });
          setTimeout(() => {
            resolve();
          }, 100);
        });
      },
      async gainmany() {
        await this.gain();
        await this.gain();
        await this.gain();
        await this.gain();
        await this.gain();
        await this.gain();
        this.state.deck = 'animating';
        await this.shuffle();
        this.state.deck = null;
      },
      drag(card) {
        return new Promise((resolve, reject) => {
          card.playable = true;
          this.hand.unshift(card);
          setTimeout(() => {
            resolve();
          }, 250);
        });
      },
      async draw() {
        if (this.deck.length === 0) {
          this.utility.each(this.pile, async (card) => {
            const popped = this.pile.pop();
            this.deck.push(popped);
          });
          this.state.deck = 'animating';
          await this.shuffle(this.deck);
          this.state.deck = null;
        }
        if (this.deck.length > 0) {
          const drawing = this.deck.pop();
          await this.drag(drawing);
        }
      },
      shuffle() {
        return new Promise((resolve, reject) => {
          const shuffled = this.utility.shuffle(this.deck);
          this.deck = shuffled;
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
          this.hand.splice(index, 1);
          card.playable = false;
          setTimeout(() => {
            this.pile.push(card);
            resolve();
          }, 250);
        });
      },
      drop() {
        return new Promise((resolve, reject) => {
          const dropping = this.hand.pop();
          dropping.playable = true;
          this.pile.push(dropping);
          setTimeout(() => {
            resolve();
          }, 100);
        });
      },
      async play(card, index) {
        // if (this.energy === 0) {
        //   return await this.no_energy();
        // }
        // if (this.energy < card.cost) { return }
        if (card.playable === false) { return }
        this.energise(this.energy - 1);
        this.discard(card, index);
      },
      async end() {
        let n = this.hand.length;
        while (n--) {
          await this.drop();
        }
        await this.energise(4);
        await this.draw();
        await this.draw();
        await this.draw();
      },
    },
    data() {
      return {
        energy: 4,
        current: 0,
        state: {
          deck: null,
          pile: null,
          energy: null
        },
        deck: [],
        hand: [],
        pile: []
      }
    },
    created() {
      console.log('Menu.created')
    },
    mounted() {
      console.log('Menu.mounted')
    },
    updated() {
      console.log('Menu.updated')
    },
    destroyed() {
      console.log('Menu.destroyed')
    }
  };
</script>

<style lang="scss">
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

  .stuff {
    position: relative;
    height: 150px;
    border: 1px solid #ccc;
    margin: 15px;
    border-radius: 10px;

    .energy {
      display: none;
      position: absolute;
      top: 5px;
      left: 5px;
      width: 50px;
      overflow: hidden;
      text-align: center;
      line-height: 20px;
      font-weight: 400;
      vertical-align: middle;
      transition: all 0.25s ease;
      border-radius: 5px;
    }
    .energy .value {
      position: absolute;
      text-align: center;
      line-height: 25px;
      font-weight: bold;
      color: white;
      text-shadow: 0px 1px 1px rgba(0,0,0,0.5);
      font-size: 14px;
      z-index: 2;
      width: 100%;
      left: 0;
      top: 0;
    }
    .energy .symbol {
      width: 25px;
      height: 25px;
      position: relative;
      margin: 0 auto;
      background: rgb(0,212,255);
      background: radial-gradient(circle, rgba(0,212,255,1) 0%, rgba(8,94,185,0.8) 80%);
      background-position: bottom center;
      background-size: 35px 35px;
      border-radius: 25px;
      box-shadow: inset 0 1.5px 0 rgba(0,0,0,0.2), inset 0 -1.5px 0 rgba(255,255,255,1);
      &:before {
        content: '';
        position: absolute;
        background: white;
        border-radius: 100%;
        transform: rotate(45deg);
        box-shadow: 0 0 3px white;
        opacity: 0.4;
        width: 3px;
        height: 4px;
        left: 8px;
        top: 5px;
      }
      &:after {
        content: '';
        position: absolute;
        border-radius: 100%;
        transform: rotate(45deg);
        box-shadow: inset -1px 0 0px white;
        opacity: 0.4;
        width: 17px;
        height: 17px;
        left: 5px;
        top: 4px;
      }
    }
    .energy[data-state="shaking"] {
      animation-name: shake;
      animation-duration: .25s;
      animation-iteration-count: 2;
      animation-delay: .25s;
    }

    .card {
      width: 50px;
      height: 75px;
      box-sizing: border-box;
      text-align: center;
      line-height: 75px;
      border: 2px solid white;
      background: #eee;
      border-radius: 5px;
      box-shadow: 0 1px 1px rgba(0,0,0,0.4);
    }

    .label {
      position: absolute;
      width: 100%;
      bottom: -27px;
      left: 0;
      font-size: 8px;
      letter-spacing: 1px;
      text-transform: uppercase;
      text-align: center;
    }

    .deck {
      background: transparent;
      width: 50px;
      height: 75px;
      border-radius: 5px;
      position: absolute;
      left: 5px;
      bottom: 5px;
      transition: transform .25s;
      box-shadow: inset 0 0 0 1px #ccc;
      .list {
        transition: transform .25s;
        position: absolute;
        bottom: 0;
        left: 0;
      }
      &[data-state="animating"] .list {
        animation-name: shake;
        animation-duration: .25s;
        animation-iteration-count: 1;
        animation-delay: .25s;
      }
      .card {
        background:#333;
        box-shadow: 0 1px 1px #aaa;
        transition: all 0.25s ease;
        position: absolute;
        bottom: 0;
        left: 0;
      }
      .deck-card-enter {
        opacity: 1;
        transform: translateY(-20px);
      }
      .deck-card-leave {
        opacity: 1;
        transform: translateX(10px);
      }
      .deck-card-leave-to {
        opacity: 0;
        transform: translateX(10px);
      }
      .card:nth-of-type(1) { bottom: 1px; }
      .card:nth-of-type(2) { bottom: 2px; }
      .card:nth-of-type(3) { bottom: 3px; }
      .card:nth-of-type(4) { bottom: 4px; }
      .card:nth-of-type(5) { bottom: 5px; }
      .card:nth-of-type(6) { bottom: 6px; }
      .card:nth-of-type(7) { bottom: 7px; }
      .card:nth-of-type(8) { bottom: 8px; }
      .card:nth-of-type(9) { bottom: 9px; }
      .card:nth-of-type(10) { bottom: 10px; }
      .card:nth-of-type(11) { bottom: 11px; }
      .card:nth-of-type(12) { bottom: 12px; }
      .card:nth-of-type(13) { bottom: 13px; }
      .card:nth-of-type(14) { bottom: 14px; }
      .card:nth-of-type(15) { bottom: 15px; }
      .card:nth-of-type(16) { bottom: 16px; }
      .card:nth-of-type(17) { bottom: 17px; }
      .card:nth-of-type(18) { bottom: 18px; }
      .card:nth-of-type(19) { bottom: 19px; }
      .card:nth-of-type(20) { bottom: 20px; }
    }

    .hand {
      position: absolute;
      height: 100%;
      right: 100px;
      left: 100px;
      top: 0;

      .list {
        text-align: center;
      }

      .card {
        width: 110px;
        height: 160px;
        line-height: 160px;
        border-width: 5px;
        transition: all 0.25s ease, top 0.25s;
        display: inline-block;
        position: relative;
        margin-right: 5px;
        cursor: pointer;
      }
      .hand-card-enter {
        opacity: 0;
        transform: translateX(-40px) translateY(40px) rotate(-22.5deg);
      }
      .hand-card-leave {
        opacity: 1;
      }
      .hand-card-leave-to {
        opacity: 0;
        transform: translateX(40px) translateY(40px) rotate(22.5deg);
      }
      .hand-card-leave-active {
        position: absolute;
      }

    }

    .pile {
      background: transparent;
      width: 50px;
      height: 75px;
      border-radius: 5px;
      position: absolute;
      right: 5px;
      bottom: 5px;
      box-shadow: inset 0 0 0 1px #ccc;
      .list {
        transition: transform .25s;
        position: absolute;
        bottom: 0;
        left: 0;
      }
      &[data-state="animating"] .list {
        animation-name: shake;
        animation-duration: .25s;
        animation-iteration-count: 1;
        animation-delay: .25s;
      }
      .card {
        background:#bbb;
        box-shadow: 0 1px 1px #aaa;
        transition: all 0.25s ease;
        position: absolute;
        bottom: 0;
        left: 0;
      }
      .pile-card-enter {
        opacity: 1;
        transform: translateY(-20px);
      }
      .pile-card-leave {
        opacity: 1;
        transform: translateX(-10px);
      }
      .pile-card-leave-to {
        opacity: 0;
        transform: translateX(-10px);
      }
      .card:nth-of-type(1) { bottom: 1px; }
      .card:nth-of-type(2) { bottom: 2px; }
      .card:nth-of-type(3) { bottom: 3px; }
      .card:nth-of-type(4) { bottom: 4px; }
      .card:nth-of-type(5) { bottom: 5px; }
      .card:nth-of-type(6) { bottom: 6px; }
      .card:nth-of-type(7) { bottom: 7px; }
      .card:nth-of-type(8) { bottom: 8px; }
      .card:nth-of-type(9) { bottom: 9px; }
      .card:nth-of-type(10) { bottom: 10px; }
      .card:nth-of-type(11) { bottom: 11px; }
      .card:nth-of-type(12) { bottom: 12px; }
      .card:nth-of-type(13) { bottom: 13px; }
      .card:nth-of-type(14) { bottom: 14px; }
      .card:nth-of-type(15) { bottom: 15px; }
      .card:nth-of-type(16) { bottom: 16px; }
      .card:nth-of-type(17) { bottom: 17px; }
      .card:nth-of-type(18) { bottom: 18px; }
      .card:nth-of-type(19) { bottom: 19px; }
      .card:nth-of-type(20) { bottom: 20px; }
    }

  }
</style>
