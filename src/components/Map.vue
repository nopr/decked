<template>
  <div class="Map" v-bind:style="{ height: area.steps.length * 100 + 'px' }">
    <svg id="container" class="container" width="100%" height="100%">
      <line class="line" v-for="(line, linekey) in area.lines" v-bind:key="'line'+linekey" v-bind:y1="(100 / area.steps.length) * (line.step + 0.5) + '%'" v-bind:x1="(100 / area.steps[line.step].length) * (line.point + 0.5) + '%'" v-bind:y2="(100 / area.steps.length) * (line.step + 1 + 0.5) + '%'" v-bind:x2="(100 / area.steps[line.step + 1].length) * (line.target + 0.5) + '%'" stroke="#fff" stroke-width="3" stroke-dasharray="0,6" stroke-linecap="round" v-bind:data-done="area.history[line.step + 1] === line.target && area.history[line.step] === line.point" v-bind:data-available="area.active_step === line.step && area.history[line.step] === line.point" v-bind:data-ready="line.ready" />
      <svg class="step" v-bind:id="'step_' + stepkey" v-for="(step, stepkey) in area.steps" v-bind:key="'step'+stepkey" x="-25" y="-25">
        <svg class="point" v-bind:id="'step_'+stepkey+'_point_' + pointkey" v-for="(point, pointkey) in step" v-bind:key="'step'+stepkey+'point'+pointkey" width="50" height="50" v-bind:y="(100 / area.steps.length) * (stepkey + 0.5) + '%'" v-bind:x="(100 / step.length) * (pointkey + 0.5) + '%'" style="overflow: visible" v-bind:data-done="(area.history[stepkey] === pointkey)" v-bind:data-available="(area.active_step === null && stepkey === 0) || (area.active_step === stepkey - 1 && area.steps[area.active_step][area.active_point] && area.steps[area.active_step][area.active_point].connects[pointkey] === true)" v-on:click="goto(stepkey, pointkey, (area.active_step === null && stepkey === 0) || (area.active_step === stepkey - 1 && area.steps[area.active_step][area.active_point] && area.steps[area.active_step][area.active_point].connects[pointkey] === true))">
          <g class="group" v-bind:data-ready="point.ready">
            <circle r="50%" cx="50%" cy="50%" fill="white"></circle> 
            <icon v-if="point.type === 'battle'" name="chess-knight" scale="2" x="14" y="7" />
            <icon v-if="point.type === 'event'" name="question" scale="2" x="13" y="9" />
            <icon v-if="point.type === 'camp'" name="campground" scale="2" x="9" y="11" />
            <icon v-if="point.type === 'shop'" name="store" scale="2" x="9" y="11" />
            <icon v-if="point.type === 'boss'" name="chess-rook" scale="2" x="13" y="8" />
            <g class="status">
              <icon class="done" v-if="(area.history[stepkey] === pointkey)" scale="1" name="times" x="19" y="-10" />
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
      }
    },
    methods: {
      goto(step, point, available) {
        if (available === false) { return }
        this.$store.dispatch('Area_Go', { step: step, point: point });
      },
      async animate_map() {
        for (let step in this.area.steps) {
          for (let point in this.area.steps[step]) {
            await this.set_ready(this.area.steps[step][point], 150);
          }
        }
        await this.hold(500);
        for (let line in this.area.lines) {
          await this.set_ready(this.area.lines[line], 50);
        }
      },
      set_ready(obj, duration) {
        return new Promise((resolve) => {
          setTimeout(() => {
            if (obj) { obj.ready = true; }
            resolve();
          }, duration);
        });
      },
      hold(duration) {
        return new Promise((resolve) => {
          setTimeout(() => resolve(), duration);
        });
      },
      async create() {
        if (!this.area.steps.length) {
          await this.$store.dispatch('Area_Create');
        }
        await this.hold(1500);
        await this.animate_map();
      }
    },
    created() {
      console.log('Map.created')
    },
    mounted() {
      console.log('Map.mounted')
      this.create();
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

  @keyframes bounce {
    from {
      animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
      transform: translate3d(0, -50px, 0);
    }
    20%, 53%, 80%, to {
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

    background: #191919;

    #container {
      height: 100%;
      width: 100%;
    }

    .point, .step {
      overflow: visible;
    }

    .point circle {
      fill: #191919;
    }
    .point svg {
      fill: #444;
    }

    .point .group  {
      transition: transform 0.4s, opacity 0.2s;
      opacity: 0;
    }
    .point .group[data-ready="true"] {
      animation-name: bounce;
      animation-duration: 1s;
      animation-iteration-count: 1;
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
      fill: #ddd;
    }
    .point[data-available="true"]:hover svg {
      fill: #fff;
    }
    .point[data-available="true"] .status svg {
      fill: red;
    }
    .point[data-available="true"] .status {
      opacity: 1;
      transform: translateY(-5px);
    }

    .point[data-done="true"] svg {
      fill: #fff;
    }
    .point[data-done="true"] .status {
      opacity: 1;
    }
    .point[data-done="true"] .status svg {
      fill: #fff;
    }

    .line { opacity: 0; }
    .line[data-available="true"] {
      stroke: #444;
    }
    .line[data-done="true"] {
      stroke: #fff;
    }
    .line[data-available="true"][data-ready="true"] {
      stroke: #fff;
    }
    .line[data-ready="true"] {
      opacity: 1;
      stroke: #444;
    }

  }
</style>
