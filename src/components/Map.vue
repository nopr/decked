<template>
  <div class="Map">
    <button v-on:click="createmap(4)">generate Small Map</button>
    <button v-on:click="createmap(6)">generate New Average Map</button>
    <button v-on:click="createmap(8)">generate New Large Map</button>
    <div id="map"></div>
    <p>
      <b>Key:</b><br /><br />
      <icon name="chess-rook" /> Boss Monster<br />
      <icon name="chess-knight" /> Monster<br />
      <icon name="question" /> Event<br />
      <icon name="store" /> Shop<br />
      <icon name="campground" /> Camp
    </p>
  </div>
</template>

<script>
  import VueIcon from 'vue-awesome/components/Icon.vue';

  export default {
    name: 'Map',
    data() {
      return {
        steps: [],
      }
    },
    methods: {
      createmap(n) {
        let map = document.getElementById('map');
        if (map.childNodes && map.childNodes.length) {
          let svg = map.childNodes[0];
          map.removeChild(svg)
          this.steps = [];
        }
        setTimeout(() => {
          this.generate(n);
          this.draw();
        }, 100);
      },
      random(max) {
        return Math.floor(Math.random() * Math.floor(max));
      },
      bool(str) {
        const numb = this.random(2);
        return (numb === 0) ? str || true : false;
      },
      var_points() {
        const points = [1, 2, 3];
        return points[this.random(3)];
      },
      var_distance() {
        const distances = ['5px', '-5px', '10px', '-10px', '15px', '-15px'];
        return distances[this.random(6)];
      },
      var_type() {
        const types = ['battle', 'event'];
        return types[this.random(2)];
      },
      new_point(data) {
        data = data || {}
        return {
          type: data.type || this.var_type(),
          status: data.status || null,
          connects: []
        }
      },
      generate(n) {
        let steps = n - 1;
        for (let step = 0; step < steps; step++) {
          let points = [];
          let amount = this.var_points();
          for (let item = 0; item < amount; item++) {
            if (step === 0) {
              points.push(this.new_point({
                type: 'battle', 
                status: 'available',
              }));
            } else if (step === 2) {

            } else {
              points.push(this.new_point());
            }
          }
          if (step === 1 && this.steps[0].length === 3 && points.length === 1) {
            points.push(this.new_point());
          }
          if (step === 2) {
            points.push(this.new_point({ type: 'shop' }))
            points.push(this.new_point({ type: 'camp' }))
          }
          this.steps.push(points);
        }
        this.steps.push([this.new_point({ type: 'boss' })])

        for(let step = 0; step < this.steps.length; step++) {
          let next = step + 1;
          let points_in_step = this.steps[step].length;
          let points_in_next = null;
          if (this.steps[next]) {
            points_in_next = this.steps[next].length; 
          }
          if (points_in_step === 1) {
            if (points_in_next === 1) {
              this.steps[step][0].connects.push(true);
            }
            if (points_in_next === 2) {
              this.steps[step][0].connects.push(true);
              this.steps[step][0].connects.push(true);
            }
            if (points_in_next === 3) {
              this.steps[step][0].connects.push(true);
              this.steps[step][0].connects.push(true);
              this.steps[step][0].connects.push(true);
            }
          }
          if (points_in_step === 2) {
            if (points_in_next === 1) {
              this.steps[step][0].connects.push(true);
              this.steps[step][1].connects.push(true);
            }
            if (points_in_next === 2) {
              this.steps[step][0].connects.push(true);
              this.steps[step][0].connects.push(this.bool());
              this.steps[step][1].connects.push(this.bool());
              this.steps[step][1].connects.push(true);
              // Repairing
              if (
                this.steps[step][0].connects[1] === false &&
                this.steps[step][1].connects[0] === false
              ) {
                if (this.bool()) {
                  this.steps[step][0].connects[1] = true;
                } else {
                  this.steps[step][1].connects[0] = true;
                }
              }
              // Destroying
              if (
                this.steps[step][0].connects[1] === true &&
                this.steps[step][1].connects[0] === true
              ) {
                if (this.bool()) {
                  this.steps[step][0].connects[1] = false;
                } else {
                  this.steps[step][1].connects[0] = false;
                }
              }
            }
            if (points_in_next === 3) {
              this.steps[step][0].connects.push(true);
              this.steps[step][0].connects.push(this.bool());
              this.steps[step][0].connects.push(false);
              this.steps[step][1].connects.push(false);
              this.steps[step][1].connects.push(this.bool());
              this.steps[step][1].connects.push(true);
              // Repairing
              if (
                this.steps[step][0].connects[1] === false &&
                this.steps[step][1].connects[1] === false
              ) {
                if (this.bool()) {
                  this.steps[step][0].connects[1] = true;
                } else {
                  this.steps[step][1].connects[1] = true;
                }
              }
              // Destroying
              if (
                this.steps[step][0].connects[1] === true &&
                this.steps[step][1].connects[0] === true
              ) {
                if (this.bool()) {
                  this.steps[step][0].connects[1] = true;
                } else {
                  this.steps[step][1].connects[0] = false;
                }
              }
            }
          }
          if (points_in_step === 3) {
            if (points_in_next === 1) {
              this.steps[step][0].connects.push(true);
              this.steps[step][1].connects.push(true);
              this.steps[step][2].connects.push(true);
            }
            if (points_in_next === 2) {
              this.steps[step][0].connects.push(true);
              this.steps[step][0].connects.push(false);
              this.steps[step][1].connects.push(this.bool());
              this.steps[step][1].connects.push(this.bool());
              this.steps[step][2].connects.push(false);
              this.steps[step][2].connects.push(true);
              // Repairing
              if (
                this.steps[step][1].connects[0] === false &&
                this.steps[step][1].connects[1] === false
              ) {
                if (this.bool()) {
                  this.steps[step][1].connects[0] = true;
                } else {
                  this.steps[step][1].connects[1] = true;
                }
              }
              // Destroying
              if (
                this.steps[step][1].connects[0] === true &&
                this.steps[step][1].connects[1] === true
              ) {
                if (this.bool()) {
                  this.steps[step][1].connects[0] = false;
                } else {
                  this.steps[step][1].connects[1] = false;
                }
              }
            }
            if (points_in_next === 3) {
              this.steps[step][0].connects.push(true);
              this.steps[step][0].connects.push(this.bool());
              this.steps[step][0].connects.push(false);
              this.steps[step][1].connects.push(this.bool());
              this.steps[step][1].connects.push(this.bool());
              this.steps[step][1].connects.push(this.bool());
              this.steps[step][2].connects.push(false);
              this.steps[step][2].connects.push(this.bool());
              this.steps[step][2].connects.push(true);
              // Destroying
              if (
                this.steps[step][1].connects[0] === true &&
                this.steps[step][1].connects[1] === true &&
                this.steps[step][1].connects[2] === true
              ) {
                this.steps[step][1].connects[0] = false
                this.steps[step][1].connects[2] = false
              }
              if (
                this.steps[step][0].connects[1] === true &&
                this.steps[step][1].connects[0] === true 
              ) {
                if (this.bool()) {
                  this.steps[step][0].connects[1] = false;
                } else {
                  this.steps[step][1].connects[0] = false;
                }
              }
              if (
                this.steps[step][2].connects[1] === true &&
                this.steps[step][1].connects[2] === true 
              ) {
                if (this.bool()) {
                  this.steps[step][2].connects[1] = false;
                } else {
                  this.steps[step][1].connects[2] = false;
                }
              }
              // Repairing
              if (
                this.steps[step][1].connects[0] === false &&
                this.steps[step][1].connects[1] === false &&
                this.steps[step][1].connects[2] === false
              ) {
                this.steps[step][1].connects[1] = true
              }
              if (
                this.steps[step][0].connects[1] === false &&
                this.steps[step][1].connects[1] === false &&
                this.steps[step][2].connects[1] === false
              ) {
                this.steps[step][1].connects[1] = true
              }
            }
          }
        }
      },
      async draw() {
        var areas = [];
        var draw = this.$svg('map').size('100%', '100%');
        for (let step = 0; step < this.steps.length; step++) {
          let points_in_step = this.steps[step].length;
          areas[step] = [];
          for (let point = 0; point < this.steps[step].length; point++) {
            areas[step][point] = draw.circle(30, 30).attr({
              fill: 'blue',
              opacity: 0,
              cx: ((100 / this.steps.length) * (step + 0.5)) + '%',
              cy: (100 / points_in_step) * (point + 0.5) + '%'
            });
            let glyph = null;
            if (this.steps[step][point].type === 'battle') {
              glyph = 'chess-knight'
            }
            if (this.steps[step][point].type === 'event') {
              glyph = 'question'
            }
            if (this.steps[step][point].type === 'camp') {
              glyph = 'campground'
            }
            if (this.steps[step][point].type === 'shop') {
              glyph = 'store'
            }
            if (this.steps[step][point].type === 'boss') {
              glyph = 'chess-rook'
            }
            let nested = draw.nested().addClass('point');
            let thiscircle = nested.circle('150%', '150%').attr({
              fill: '#eee',
              cx: '50%',
              cy: '50%',
            });
            thiscircle.transform({ x: -15, y: -15 });
            let subnested = nested.nested();
            let thispath = subnested.path(VueIcon.icons[glyph].paths[0].d);
            nested.size(30, 30);
            subnested.viewbox(0,0,VueIcon.icons[glyph].width,VueIcon.icons[glyph].height);
            subnested.attr({
              opacity: 0,
              x: -15,
              y: -45
            });
            if (this.steps[step][point].status === null) {
              subnested.fill('#aaa');
            }
            nested.attr({
              x: ((100 / this.steps.length) * (step + 0.5)) + '%', 
              y: (100 / points_in_step) * (point + 0.5) + '%'
            });
            await this.drop_thing(subnested);
          }
        }
        for (let step = 0; step < this.steps.length; step++) {
          let points_in_step = this.steps[step].length;
          for (let point = 0; point < this.steps[step].length; point++) {
            let connections = this.steps[step][point].connects;
            for (let line = 0; line < connections.length; line++) {
              if (connections[line] === true) {
                let start = areas[step][point];
                let finish = areas[step + 1][line];
                let lined = draw.line(start.node.cx.baseVal.valueAsString, start.node.cy.baseVal.valueAsString, finish.node.cx.baseVal.valueAsString, finish.node.cy.baseVal.valueAsString);
                lined.back().opacity(0).stroke({ width: 3, color: '#ccc', linecap: 'round', dasharray: '0,6' });
                await this.fade_thing(lined);
              }
            }
          }
        }
      },
      fade_thing(thing) {
        return new Promise((resolve, reject) => {
          thing.animate(100, '>').opacity(1);
          setTimeout(() => {
            resolve()
          }, 100);
        })
      },
      drop_thing(thing) {
        return new Promise((resolve, reject) => {
          thing.animate(150, '<').attr({
            opacity: 1,
            x: -15,
            y: 0
          });
          thing.animate(150, '>').attr({
            x: -15,
            y: -25
          });
          thing.animate(100, '<').attr({
            x: -15,
            y: -10
          });
          thing.animate(50, '>').attr({
            x: -15,
            y: -15
          });
          setTimeout(() => {
            resolve()
          }, 100);
        })
      }
    },
    created() {
      console.log('Map.created')
    },
    mounted() {
      console.log('Map.mounted')
    },
    updated() {
      console.log('Map.updated')
    },
    destroyed() {
      console.log('Map.destroyed')
    }
  };
</script>

<style lang="scss">
  .Map {

    margin: 15px;

    #map {
      height: 300px;
      width: 100%;
      box-shadow: inset 0 0 0 1px #ccc;
    }

    #map .point {
      &:hover {
        background: white;
      }
    }

  }
</style>
