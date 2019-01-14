<template>
  <div class="UI">
    <v-stage ref="stage" class="area" :config="area" @dragstart="ondragstart" @dragmove="ondragmove" @dragend="ondragend">
      <v-layer ref="cards">
        <v-group v-for="(card, index) in cards" :key="card.id" :config="config('group', card, index)" @mouseenter="onmouseenter" @mouseleave="onmouseleave">
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
          height: 300,
        },
        cards: []
      }
    },
    methods: {
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
      ondragend(evt) {
        console.log('dragend')
        let group = evt.target
        let cards = vm.$refs.cards.getNode()
        let stage = vm.$refs.stage.getNode()

        group.moveTo(cards)
        stage.draw()
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
          return {
            x: 5 + (100 * index) + (5 * index),
            y: 145,
            from_x: 5 + (100 * index) + (5 * index),
            from_y: 145,
            draggable: true,
            width: 100,
            height: 140
          }
        }
        if (type === 'card') {
          console.log(card_images['pickaxe'])
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
    },
    mounted() {
      vm = this
      // this.$store.dispatch('create_player');
      setTimeout(() => {
        vm.cards.push({
          "name": "Boast",
          "type": "skill",
          "cost": 0,
          "text": "-5 Health\nDraw a card",
          "target": "enemy",
          "image": "pickaxe.png"
        })
        vm.cards.push({
          "name": "Uppercut",
          "type": "attack",
          "cost": 2,
          "text": "8 damage, Stun (2)",
          "target": "enemy",
          "image": "pickaxe.png"
        })
        vm.cards.push({
          "name": "Wild Slash",
          "type": "attack",
          "cost": 1,
          "text": "12 Damage\n-3 Health",
          "target": "enemy",
          "image": "pickaxe.png"
        })
      }, 1000)
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
    height: 300px;
    border: 1px solid white;
    margin: 20px;
  }
</style>
