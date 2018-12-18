<template>
  <div class="Map">
    <svg id="container" class="container" width="100%" height="100%">
      <line class="line" v-for="(line, linekey) in area.lines" v-bind:key="'line'+linekey" v-bind:x1="(100 / area.steps.length) * (line.step + 0.5) + '%'" v-bind:y1="(100 / area.steps[line.step].length) * (line.point + 0.5) + '%'" v-bind:x2="(100 / area.steps.length) * (line.step + 1 + 0.5) + '%'" v-bind:y2="(100 / area.steps[line.step + 1].length) * (line.target + 0.5) + '%'" stroke="#ccc" stroke-width="3" stroke-dasharray="0,6" stroke-linecap="round" v-bind:data-done="area.history[line.step + 1] === line.target && area.history[line.step] === line.point" v-bind:data-available="area.active_step === line.step && area.history[line.step] === line.point" v-bind:data-ready="line.ready" />
      <svg class="step" v-bind:id="'step_' + stepkey" v-for="(step, stepkey) in area.steps" v-bind:key="'step'+stepkey" x="-25" y="-25">
        <svg class="point" v-bind:id="'step_'+stepkey+'_point_' + pointkey" v-for="(point, pointkey) in step" v-bind:key="'step'+stepkey+'point'+pointkey" width="50" height="50" v-bind:x="(100 / area.steps.length) * (stepkey + 0.5) + '%'" v-bind:y="(100 / step.length) * (pointkey + 0.5) + '%'" style="overflow: visible" v-bind:data-done="(area.history[stepkey] === pointkey)" v-bind:data-available="(area.active_step === null && stepkey === 0) || (area.active_step === stepkey - 1 && area.steps[area.active_step][area.active_point] && area.steps[area.active_step][area.active_point].connects[pointkey] === true)" v-on:click="goto(stepkey, pointkey, (area.active_step === null && stepkey === 0) || (area.active_step === stepkey - 1 && area.steps[area.active_step][area.active_point] && area.steps[area.active_step][area.active_point].connects[pointkey] === true))">
          <g class="group" v-bind:data-ready="point.ready">
            <circle r="50%" cx="50%" cy="50%" fill="white"></circle>
            <icon v-if="point.type === 'battle'" name="chess-knight" scale="2" x="14" y="7" />
            <icon v-if="point.type === 'event'" name="question" scale="2" x="13" y="9" />
            <icon v-if="point.type === 'camp'" name="campground" scale="2" x="9" y="11" />
            <icon v-if="point.type === 'shop'" name="store" scale="2" x="9" y="11" />
            <icon v-if="point.type === 'boss'" name="chess-rook" scale="2" x="13" y="8" />
            <g class="status">
              <icon class="done" v-if="(area.history[stepkey] === pointkey)" name="check" x="19" y="-10" />
              <icon class="available" v-if="(area.active_step === null && stepkey === 0) || (area.active_step === stepkey - 1 && area.steps[area.active_step][area.active_point] && area.steps[area.active_step][area.active_point].connects[pointkey] === true)" name="caret-down" x="20" y="-5" />
            </g>
          </g>
        </svg>
      </svg>
    </svg>
  </div>
</template>

<script>

  import VueIcon from 'vue-awesome/components/Icon.vue';

  export default {
    name: 'Map',
    computed: {
      area() {
        return this.$store.state.area
      },
    },
    methods: {
      goto(step, point, available) {
        if (available === false) { return }
        this.$store.dispatch('Area_Go', { step: step, point: point });
      },
      async animate_map() {
        for (let step in this.area.steps) {
          for (let point in this.area.steps[step]) {
            await this.set_ready(this.area.steps[step][point]);
          }
        }
        for (let line in this.area.lines) {
          await this.set_ready(this.area.lines[line]);
        }
      },
      set_ready(obj) {
        return new Promise((resolve) => {
          setTimeout(() => {
            if (obj) { obj.ready = true; }
            resolve();
          }, 50);
        });
      },
    },
    created() {
      console.log('Map.created')
      if (!this.area.steps.length) {
        this.$store.dispatch('Area_Create');
      }
    },
    mounted() {
      console.log('Map.mounted')
      this.animate_map();
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

  .Map {

    margin: 15px;
    background: #eee;

    #container {
      height: 300px;
      width: 100%;
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
