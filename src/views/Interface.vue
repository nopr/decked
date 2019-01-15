<template>
  <div class="UI">
    <button class="is-light" @click="drawcard">Draw</button>
    <v-stage ref="stage" class="area" :config="area" @dragstart="ondragstart" @dragmove="ondragmove" @dragend="ondragend">
      <v-layer ref="cards">
        <v-group v-for="(card, index) in hand" :key="card.id" :config="config('group', card, index)" @mouseenter="onmouseenter" @mouseleave="onmouseleave">
          <v-rect :config="config('card', card)"></v-rect>
          <v-text :config="config('name', card)"></v-text>
          <v-text :config="config('cost', card)"></v-text>
          <v-text :config="config('text', card)"></v-text>
        </v-group>
      </v-layer>
      <v-layer ref="dragging">
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
  import card_pickaxe from "@/asset/images/cards/pickaxe.png"

  const card_images = {
    'pickaxe': makeimage(card_pickaxe)
  }

  function makeimage(base64) {
    let img = new Image()
    img.src = base64
    return img
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
        hand: [],
        cards: []
      }
    },
    methods: {
      drawcard() {
        console.log('draw card')
        const drawing = vm.cards.pop();
        this.hand.unshift(drawing);
      },
      playcard(attrs) {
        let cards = vm.$refs.cards.getNode()
        console.log('playcard', attrs)
        let card = attrs.c
        let index = attrs.index
        vm.hand[index] = null
        console.log(index, cards)
        if (index === 0) {
          cards.children[1].to({
            x: 50,
            duration: 0.1,
            easing: Konva.Easings.EaseIn,
          })
          cards.children[2].to({
            x: 150,
            duration: 0.1,
            easing: Konva.Easings.EaseIn,
          })
        }
      },
      ondragstart(evt) {
        console.log('dragstart')
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
        let group = evt.target
      },
      async ondragend(evt) {
        console.log('dragend')
        let group = evt.target
        let cards = vm.$refs.cards.getNode()
        let stage = vm.$refs.stage.getNode()

        group.moveTo(cards)
        stage.draw()

        if (group.attrs.y < 260) {
          group.to({
            duration: 0.25,
            easing: Konva.Easings.EaseOut,
            opacity: 0
          })
          await vm.hold(250)
          vm.playcard(group.attrs)
        } else {
          group.to({
            duration: 0.5,
            easing: Konva.Easings.ElasticEaseOut,
            rotation: 0,
            x: group.attrs.from_x,
            y: group.attrs.from_y,
            scaleX: 1,
            scaleY: 1,
            offsetX: 0,
            offsetY: 0
          })
        }
      },
      onmouseenter(evt) {
        console.log('onmouseenter')
        let group = evt.target.parent
        group.to({
          duration: 0.5,
          easing: Konva.Easings.ElasticEaseOut,
          y: group.attrs.from_y - 10
        })
      },
      onmouseleave(evt) {
        console.log('onmouseleave')
        let group = evt.target.parent
        group.to({
          duration: 0.5,
          easing: Konva.Easings.ElasticEaseOut,
          y: group.attrs.from_y
        })
      },
      config(type, card, index) {
        if (type === 'group') {
          let x = -100 
          let y = 340
          return {
            x: x,
            y: y,
            c: card,
            i: index,
            from_x: x,
            from_y: y,
            draggable: true,
            width: 100,
            height: 140
          }
        }
        if (type === 'card') {
          return {
            x: 0,
            y: 0,
            width: 100,
            height: 140,
            cornerRadius: 10,
            fillPatternImage: card_images['pickaxe'],
            fillPatternRepeat: 'no-repeat',
            fillPatternScale: {
              x: 0.25,
              y: 0.25
            },
            shadow: '#000',
            shadowBlur: 15,
            shadowOffsetY: 20,
            shadowOpacity: 0.2
          }
        }
        if (type === 'name') {
          return {
            x: 5,
            y: 85,
            width: 90,
            text: card.name,
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
      async fancards() {
        let cards = vm.$refs.cards.getNode()
        // 5 + (100 * index) + (5 * index)
        console.log(cards.children.length)
        console.log(cards.children[0])
        await vm.hold(1000)
        console.log(cards.children[0])
        cards.children[0].to({
          duration: 1.5,
          easing: Konva.Easings.ElasticEaseOut,
          rotation: -15,
          offsetY: -10,
          x: 85,
          from_x: 90,
        })
        await vm.hold(100)
        cards.children[1].to({
          duration: 1.5,
          easing: Konva.Easings.ElasticEaseOut,
          rotation: 0,
          x: 110,
          from_x: 110,
        })
        await vm.hold(100)
        cards.children[2].to({
          duration: 1.5,
          easing: Konva.Easings.ElasticEaseOut,
          rotation: 15,
          offsetY: 10,
          x: 135,
          from_x: 130,
        })
        await vm.hold(1500)
        cards.children[0].to({
          duration: 1,
          easing: Konva.Easings.ElasticEaseOut,
          rotation: 0,
          offsetY: 0,
          x: 5,
          from_x: 5,
        })
        cards.children[2].to({
          duration: 1,
          easing: Konva.Easings.ElasticEaseOut,
          rotation: 0,
          offsetY: 0,
          x: 215,
          from_x: 215,
        })
      },
      showcards() {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve()
          }, 1000)
        })
      },
      hold(n) {
        return new Promise((resolve) => {
          setTimeout(() => resolve(), n)
        })
      },
    },
    async mounted() {
      vm = this
      vm.hand.push({
        "name": "Boast",
        "type": "skill",
        "cost": 0,
        "text": "-5 Health\nDraw a card",
        "target": "enemy",
        "image": "pickaxe.png"
      })
      vm.hand.push({
        "name": "Uppercut",
        "type": "attack",
        "cost": 2,
        "text": "8 damage, Stun (2)",
        "target": "enemy",
        "image": "pickaxe.png"
      })
      vm.hand.push({
        "name": "Wild Slash",
        "type": "attack",
        "cost": 1,
        "text": "12 Damage\n-3 Health",
        "target": "enemy",
        "image": "pickaxe.png"
      })
      await vm.fancards()
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
    border: 1px solid white;
    margin: 20px auto;
  }
</style>
