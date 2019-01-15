<template>
  <div class="UI">
    <div style="display:flex;justify-content:center;flex-flow:row;padding: 10px 0;">
      <button class="is-light" @click="drawcard">Draw</button>
    </div>
    <v-stage ref="stage" class="area" :config="area" @dragstart="ondragstart" @dragmove="ondragmove" @dragend="ondragend">
      <v-layer>
        <v-rect ref="dropzone" :config="dropzone"></v-rect>
      </v-layer>
      <v-layer ref="cards">
        <v-group v-for="(card, index) in cards" :key="card.ident" :config="config('group', card, index)" @mouseenter="onmouseenter" @mouseleave="onmouseleave">
          <v-rect :config="config('bg', card)"></v-rect>
          <v-rect :config="config('card', card)"></v-rect>
          <v-text :config="config('name', card)"></v-text>
          <v-text :config="config('cost', card)"></v-text>
          <v-text :config="config('text', card)"></v-text>
        </v-group>
      </v-layer>
      <v-layer ref="discarded">
      </v-layer>
      <v-layer ref="holding">
      </v-layer>
      <v-layer ref="dragging">
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
  import card_pickaxe from "@/asset/images/cards/pickaxe.png"
  import card_rock from "@/asset/images/cards/rock.png"

  const card_images = {
    'pickaxe': makeimage(card_pickaxe),
    'rock': makeimage(card_rock),
  }

  function makeimage(base64) {
    let img = new Image()
    img.src = base64
    return img
  }

  const deck = {
    x: 55, y: 415
  }
  const discard = {
    x: 165, y: 415
  }
  const available_hand = {
    a: { x: 5, y: 235 },
    b: { x: 110, y: 235 },
    c: { x: 215, y: 235 }
  }

  let vm = {}
  export default {
    name: 'Interface',
    data() {
      return {
        area: {
          width: 320,
          height: 560,
        },
        dropzone: {
          x: 7,
          y: 7,
          width: 306,
          height: 216,
          cornerRadius: 5,
          stroke: '#444',
          strokeWidth: 1,
          dash: [2, 2]
        },
        cards: []
      }
    },
    methods: {
      ondragstart(evt) {
        let group = evt.target
        let dragging = vm.$refs.dragging.getNode()
        let stage = vm.$refs.stage.getNode()

        group.moveTo(dragging)
        stage.draw()
        group.to({
          duration: 0.1,
          easing: Konva.Easings.EaseIn,
          scaleX: 1.5,
          scaleY: 1.5,
          offsetX: 18.75,
          offsetY: 28.125
        })
      },
      ondragmove(evt) {
        let dropzone = vm.$refs.dropzone.getNode()
        if (evt.target.attrs.y < 100) {
          dropzone.to({
            duration: 0,
            stroke: '#fff'
          })
        } else {
          dropzone.to({
            duration: 0,
            stroke: '#444'
          })
        }
      },
      ondragend(evt) {
        let group = evt.target
        let holding = vm.$refs.holding.getNode()
        let stage = vm.$refs.stage.getNode()
        let dropzone = vm.$refs.dropzone.getNode()
        let discarded = vm.$refs.discarded.getNode()
        
        dropzone.to({
          duration: 0,
          stroke: '#444'
        })

        if (evt.target.attrs.y < 100) {
          group.moveTo(discarded)
          stage.draw()
          group.setAttrs({
            draggable: false,
            data: {
              held: null
            }
          })
          group.to({
            duration: 0.5,
            easing: Konva.Easings.ElasticEaseOut,
            rotation: 0,
            x: discard.x,
            y: discard.y - (discarded.children.length * 3),
            scaleX: 1,
            scaleY: 1,
            offsetX: 0,
            offsetY: 0
          })
          vm.sorthand()
        } else {
          group.moveTo(holding)
          stage.draw()
          group.to({
            duration: 0.5,
            easing: Konva.Easings.ElasticEaseOut,
            rotation: 0,
            x: group.attrs.data.held.x,
            y: group.attrs.data.held.y,
            scaleX: 1,
            scaleY: 1,
            offsetX: 0,
            offsetY: 0
          })
        }
      },
      onmouseenter(evt) {
        if (!evt.target.parent.attrs.draggable) {
          return false
        }
        evt.target.parent.to({
          duration: 0.2,
          easing: Konva.Easings.ElasticOut,
          y: evt.target.parent.attrs.data.held.y - 5
        })
      },
      onmouseleave(evt) {
        if (!evt.target.parent.attrs.draggable) {
          return false
        }
        evt.target.parent.to({
          duration: 0.2,
          easing: Konva.Easings.ElasticIn,
          y: evt.target.parent.attrs.data.held.y
        })
      },
      config(type, card, index) {
        if (type === 'group') {
          let x = deck.x
          let y = deck.y - 50
          return {
            x: x,
            y: y,
            draggable: false,
            width: 100,
            height: 140,
            opacity: 0,
            data: {
              card: card,
              held: null
            }
          }
        }
        if (type === 'bg') {
          return {
            x: 0,
            y: 0,
            width: 100,
            height: 140,
            cornerRadius: 10,
            fill: '#fff',
            shadow: '#000',
            shadowBlur: 5,
            shadowOffsetY: 1,
            shadowOpacity: 0.2
          }
        }
        if (type === 'card') {
          return {
            x: 0,
            y: 0,
            width: 100,
            height: 140,
            cornerRadius: 10,
            fillPatternImage: card_images[card.image],
            fillPatternRepeat: 'no-repeat',
            fillPatternScale: {
              x: 0.25,
              y: 0.25
            }
          }
        }
        if (type === 'name') {
          return {
            x: 5,
            y: 85,
            width: 90,
            text: card.name + ' (' + card.ident + ')', 
            fill: '#222',
            fontFamily: 'GameRegular',
            fontSize: 12,
            fontStyle: 'normal',
            align: 'center',
          }
        }
        if (type === 'cost') {
          return {
            x: 10,
            y: 10,
            text: card.cost.toString(),
            fill: '#222',
            fontFamily: 'GameRegular',
            fontSize: 14,
            fontStyle: 'normal'
          }
        }
        if (type === 'text') {
          return {
            x: 5,
            y: 100,
            width: 90,
            text: card.text,
            align: 'center',
            fill: '#666',
            fontFamily: 'GameRegular',
            fontSize: 8,
            lineHeight: 1.2
          }
        }
      },
      async addcard(card) {
        vm.cards.push(card)
        let cards = vm.$refs.cards.getNode()
        await vm.hold(100)
        let added = cards.children[cards.children.length - 1]
        added.to({
          duration: 0.1,
          easing: Konva.Easings.ElasticIn,
          opacity: 1,
          y: deck.y - (cards.children.length * 3)
        })
      },
      playcard(group) {

      },
      sorthand() {
        let holding = vm.$refs.holding.getNode()
        if (holding.children.length === 1) {
          holding.children[0].to({
            duration: 0.5,
            easing: Konva.Easings.ElasticEaseInOut,
            x: 110
          })
          holding.children[0].attrs.data.held.x = 110
        }
        if (holding.children.length === 2) {
          holding.children[1].to({
            duration: 0.5,
            easing: Konva.Easings.ElasticEaseInOut,
            x: 57.5
          })
          holding.children[1].attrs.data.held.x = 57.5
          holding.children[0].to({
            duration: 0.5,
            easing: Konva.Easings.ElasticEaseInOut,
            x: 162.5
          })
          holding.children[0].attrs.data.held.x = 162.5
        }
        if (holding.children.length === 3) {
          holding.children[2].to({
            duration: 0.5,
            easing: Konva.Easings.ElasticEaseInOut,
            x: 5
          })
          holding.children[2].attrs.data.held.x = 5
          holding.children[1].to({
            duration: 0.5,
            easing: Konva.Easings.ElasticEaseInOut,
            x: 110
          })
          holding.children[1].attrs.data.held.x = 110
          holding.children[0].to({
            duration: 0.5,
            easing: Konva.Easings.ElasticEaseInOut,
            x: 215
          })
          holding.children[0].attrs.data.held.x = 215
        }
      },
      async drawcard() {
        let stage = vm.$refs.stage.getNode()
        let cards = vm.$refs.cards.getNode()
        let holding = vm.$refs.holding.getNode()
        let discarded = vm.$refs.discarded.getNode()
        let group = cards.children[cards.children.length - 1]

        let held = holding.children.length
        let available = null

        if (held === 3) { return false }

        if (cards.children.length === 0) {
          let amount = discarded.children.length;
          for (let i = 0; i < amount; i++) {
            let card = discarded.children[i]
            card.to({
              duration: 0.2,
              easing: Konva.Easings.EaseInOut,
              x: vm.utility.random(discard.x + 10, discard.x + 50),
              y: vm.utility.random(discard.y - 10, discard.y - 50)
            })
          }
          await vm.hold(500)
          while (discarded.children.length > 0) {
            let card = vm.utility.sample(discarded.children)
            if (Number.isInteger(card)) { continue; }
            card.moveTo(cards)
            stage.draw()
            card.to({
              duration: 0.1,
              easing: Konva.Easings.EaseOut,
              x: deck.x,
              y: deck.y - (cards.children.length * 3)
            })
            await vm.hold(100)
          }
          group = cards.children[cards.children.length - 1]
          await vm.hold(250)
        }
        group.moveTo(holding)
        stage.draw()
        if (held === 0) { available = available_hand.a }
        if (held === 1) { available = available_hand.b }
        if (held === 2) { available = available_hand.c }
        group.to({
          duration: 0.2,
          easing: Konva.Easings.EaseOut,
          x: available.x,
          y: available.y
        })
        group.setAttrs({
          draggable: true,
          data: {
            held: {
              x: available.x,
              y: available.y
            }
          }
        })
        vm.sorthand()
      },
      hold(n) {
        return new Promise((resolve) => {
          setTimeout(() => resolve(), n)
        })
      },

    },
    async mounted() {
      vm = this
      for (let n = 1; n < 5; n++) {
        await vm.addcard({
          "ident": n,
          "name": "Slash",
          "type": "attack",
          "cost": 1,
          "text": "Deal 8 Damage",
          "target": "enemy",
          "image": "pickaxe"
        })
      }
      for (let n = 5; n < 9; n++) {
        await vm.addcard({
          "ident": n,
          "name": "Defend",
          "type": "attack",
          "cost": 1,
          "text": "Gain 6 Block",
          "target": "enemy",
          "image": "rock"
        })
      }
      // await vm.shuffle()
      // await vm.draw(3)
    }
  };
</script>

<style lang="scss">
  .UI {
    height: 100%;
    overflow: auto;
  }
  pre {
    color: white;
    overflow: auto;
  }
  .UI , .UI canvas {
    font-family: 'GameRegular';
  }
  .area {
    width: 320px;
    height: 560px;
    margin: 0 auto;
    border: 1px solid white;
  }
</style>
