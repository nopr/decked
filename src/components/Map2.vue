<template>
  <div class="Map2">
    <button v-on:click="createmap(4)">generate Small Map</button>
    <button v-on:click="createmap(6)">generate New Average Map</button>
    <button v-on:click="createmap(8)">generate New Large Map</button>
    <div id="map2">
      <svg id="container" class="container" width="100%" height="100%">
        <line class="line" v-for="(line, linekey) in lines" v-bind:key="'line'+linekey" v-bind:x1="(100 / steps.length) * (line.step + 0.5) + '%'" v-bind:y1="(100 / steps[line.step].length) * (line.point + 0.5) + '%'" v-bind:x2="(100 / steps.length) * (line.step + 1 + 0.5) + '%'" v-bind:y2="(100 / steps[line.step + 1].length) * (line.target + 0.5) + '%'" stroke="#ccc" stroke-width="3" stroke-dasharray="0,6" stroke-linecap="round" v-bind:data-done="journey[line.step + 1] === line.target && journey[line.step] === line.point" v-bind:data-available="active_step === line.step && journey[line.step] === line.point" v-bind:data-ready="line.ready" />
        <svg class="step" v-bind:id="'step_' + stepkey" v-for="(step, stepkey) in steps" v-bind:key="'step'+stepkey" x="-25" y="-25">
          <svg class="point" v-bind:id="'step_'+stepkey+'_point_' + pointkey" v-for="(point, pointkey) in step" v-bind:key="'step'+stepkey+'point'+pointkey" width="50" height="50" v-bind:x="(100 / steps.length) * (stepkey + 0.5) + '%'" v-bind:y="(100 / step.length) * (pointkey + 0.5) + '%'" style="overflow: visible" v-bind:data-done="(journey[stepkey] === pointkey)" v-bind:data-available="(active_step === null && stepkey === 0) || (active_step === stepkey - 1 && steps[active_step][active_point].connects[pointkey] === true)" v-on:click="goto(stepkey, pointkey, (active_step === null && stepkey === 0) || (active_step === stepkey - 1 && steps[active_step][active_point].connects[pointkey] === true))">
            <g class="group" v-bind:data-ready="point.ready">
              <circle r="50%" cx="50%" cy="50%" fill="white"></circle>
              <icon v-if="point.type === 'battle'" name="chess-knight" scale="2" x="14" y="7" />
              <icon v-if="point.type === 'event'" name="question" scale="2" x="13" y="9" />
              <icon v-if="point.type === 'camp'" name="campground" scale="2" x="9" y="11" />
              <icon v-if="point.type === 'shop'" name="store" scale="2" x="9" y="11" />
              <icon v-if="point.type === 'boss'" name="chess-rook" scale="2" x="13" y="8" />
              <g class="status">
                <icon class="done" v-if="(journey[stepkey] === pointkey)" name="check" x="19" y="-10" />
                <icon class="available" v-if="(active_step === null && stepkey === 0) || (active_step === stepkey - 1 && steps[active_step][active_point].connects[pointkey] === true)" name="caret-down" x="20" y="-5" />
              </g>
            </g>
          </svg>
        </svg>
      </svg>
    </div>
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
    name: 'Map2',
    data() {
      return {
        state: null,
        steps: [],
        lines: [],
        active_step: null,
        active_point: null,
        journey: [],
      }
    },
    methods: {
      async createmap(n) {
        this.lines = [];
        this.steps = [];
        this.journey = [];
        this.active_step = null;
        this.active_point = null;
        this.generate(n);
        for (let step in this.steps) {
          for (let point in this.steps[step]) {
            await this.readyItem(step, point);
          }
        }
        for (let line in this.lines) {
          await this.readyLine(line);
        }
      },
      readyItem(step, point) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (this.steps[step][point]) {
              this.steps[step][point].ready = true;
            }
            resolve();
          }, 50);
        });
      },
      readyLine(line) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (this.lines[line]) {
              this.lines[line].ready = true;
            }
            resolve();
          }, 50);
        });
      },
      goto(step, point, available) {
        if (available === false) { return }
        let target = this.steps[step][point];
        let activity = target.type;
        this.journey[step] = point;
        this.active_point = point;
        this.active_step = step;
      },
      connections() {
        let connections = [];
        for (let step = 0; step < this.steps.length; step++) {
          for (let point = 0; point < this.steps[step].length; point++) {
            for (let line = 0; line < this.steps[step][point].connects.length; line++) {
              if (this.steps[step][point].connects[line] === true) {
                connections.push({
                  step: step,
                  point: point,
                  target: line
                });
              }
            }
          }
        }
        return connections
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
          ready: false,
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
        for (let step = 0; step < this.steps.length; step++) {
          for (let point = 0; point < this.steps[step].length; point++) {
            for (let line = 0; line < this.steps[step][point].connects.length; line++) {
              if (this.steps[step][point].connects[line] === true) {
                this.lines.push({
                  step: step,
                  point: point,
                  target: line,
                  ready: false
                });
              }
            }
          }
        }
      },
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

  @keyframes flash {
    from, to {
      opacity: 1;
    }
    10%, 30%, 50%, 70%, 90% {
      opacity: 0.5;
    }
    20%, 40%, 60%, 80% {
      opacity: 1;
    }
  }
  @keyframes bounce {
    from, 20%, 53%, 80%, to {
      animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
      transform: translate3d(0, 0, 0);
    }
    40%, 43% {
      animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
      transform: translate3d(0, -15px, 0);
    }
    70% {
      animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
      transform: translate3d(0, -7px, 0);
    }
    90% {
      transform: translate3d(0, -3px, 0);
    }
  }

  .Map2 {

    margin: 15px;

    #map2 {
      height: 300px;
      width: 100%;
      box-shadow: inset 0 0 0 1px #ccc;
    }

    .point, .step {
      overflow: visible;
    }

    .point circle {
      fill: #eee;
    }
    .point svg {
      fill: #ccc;
    }

    .point .group  {
      transition: transform 0.1s, opacity 0.1s;
      transform: translateY(-20px);
      opacity: 0;
    }
    .point .group[data-ready="true"] {
      transform: translateY(0px);
      opacity: 1;
    }

    .point .status {
      transition: opacity 1s;
      opacity: 0;
    }

    .point[data-available="true"] {
      cursor: pointer;
    }
    .point[data-available="true"] svg {
      fill: #000;
    }
    .point[data-available="true"] .status svg {
      fill: red;
    }
    .point[data-available="true"] .status {
      opacity: 1;
      animation-name: bounce;
      animation-duration: 1s;
      animation-iteration-count: infinite;
    }

    .point[data-done="true"] svg {
      fill: black;
    }
    .point[data-done="true"] .status {
      opacity: 1;
    }
    .point[data-done="true"] .status svg {
      fill: black;
    }

    .line { opacity: 0; }
    .line[data-available="true"] {
      stroke: black;
    }
    .line[data-done="true"] {
      stroke: black;
    }
    .line[data-ready="true"] {
      opacity: 1;
    }

  }
</style>
