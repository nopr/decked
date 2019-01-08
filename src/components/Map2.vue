<template>
  <div class="Map">
    <div class="section">
      <div class="room W4 H2 active">
        <span class="name">Entrance</span>
        <span class="door" data-is="bottom" data-align="center" data-width="L" data-swing="in"></span>
      </div>
    </div>
    <div class="section">
      <div class="section">
        <div class="room W1 H1">
          <span class="name">Storage</span>
          <span class="door" data-is="right" data-align="bottom" data-width="S" data-swing="in"></span>
        </div>
        <div class="room W1 H1">
          <span class="name">Storage</span>
          <span class="door" data-is="bottom" data-align="center" data-width="S" data-swing="in"></span>
        </div>
      </div>
      <div class="room W3 H2">
        <span class="name">Lobby</span>
        <span class="door" data-is="bottom" data-align="center" data-width="L" data-swing="out"></span>
      </div>
    </div>
    <div class="section">
      <div class="room W4 H1">
        <span class="name">Hall</span>
      </div>
    </div>
    <div class="section">
      <div class="room W1 H2">
        <span class="name">Server<br />Room</span>
      </div>
      <div class="room W1 H2">
        <span class="name">Hall</span>
      </div>
      <div class="section">
        <div class="room W2 H1">
          <span class="name">Offices</span>
        </div>
        <div class="room W2 H1">
          <span class="name">Offices</span>
        </div>
      </div>
    </div>
    <!-- <svg id="container" class="container" width="100%" height="100%">
      <line class="line" v-for="(line, linekey) in area.lines" v-bind:key="'line'+linekey" v-bind:y1="(100 / area.steps.length) * (line.step + 0.5) + '%'" v-bind:x1="(100 / area.steps[line.step].length) * (line.point + 0.5) + '%'" v-bind:y2="(100 / area.steps.length) * (line.step + 1 + 0.5) + '%'" v-bind:x2="(100 / area.steps[line.step + 1].length) * (line.target + 0.5) + '%'" stroke="#fff" stroke-width="3" stroke-dasharray="0,6" stroke-linecap="round" v-bind:data-done="area.history[line.step + 1] === line.target && area.history[line.step] === line.point" v-bind:data-available="area.active_step === line.step && area.history[line.step] === line.point" v-bind:data-ready="line.ready" />
      <svg class="step" v-bind:id="'step_' + stepkey" v-for="(step, stepkey) in area.steps" v-bind:key="'step'+stepkey" x="-25" y="-25">
        <svg class="point" v-bind:id="'step_'+stepkey+'_point_' + pointkey" v-for="(point, pointkey) in step" v-bind:key="'step'+stepkey+'point'+pointkey" width="50" height="50" v-bind:y="(100 / area.steps.length) * (stepkey + 0.5) + '%'" v-bind:x="(100 / step.length) * (pointkey + 0.5) + '%'" style="overflow: visible" v-bind:data-done="(area.history[stepkey] === pointkey)" v-bind:data-available="(area.active_step === null && stepkey === 0) || (area.active_step === stepkey - 1 && area.steps[area.active_step][area.active_point] && area.steps[area.active_step][area.active_point].connects[pointkey] === true)" v-on:click="goto(stepkey, pointkey, (area.active_step === null && stepkey === 0) || (area.active_step === stepkey - 1 && area.steps[area.active_step][area.active_point] && area.steps[area.active_step][area.active_point].connects[pointkey] === true))">
          <g class="group" v-bind:data-ready="point.ready">
            <rect x="-25%" y="0" width="150%" height="100%" fill="#222"></rect>
            <icon v-if="point.type === 'battle'" name="chess-knight" scale="2" x="14" y="7" />
            <icon v-if="point.type === 'event'" name="question" scale="2" x="13" y="9" />
            <icon v-if="point.type === 'camp'" name="campground" scale="2" x="9" y="11" />
            <icon v-if="point.type === 'shop'" name="store" scale="2" x="9" y="11" />
            <icon v-if="point.type === 'boss'" name="chess-rook" scale="2" x="13" y="8" />
            <g class="status">
              <icon class="done" v-if="(area.history[stepkey] === pointkey)" scale="1" name="times" x="19" y="19" />
              <icon class="available" v-if="(area.active_step === null && stepkey === 0) || (area.active_step === stepkey - 1 && area.steps[area.active_step][area.active_point] && area.steps[area.active_step][area.active_point].connects[pointkey] === true)" name="caret-down" x="20" y="20" />
            </g>
          </g>
        </svg>
      </svg>
    </svg> -->
  </div>
</template>

<script>

  import VueIcon from 'vue-awesome/components/Icon.vue';

  export default {
    name: 'Map',
    data() {
      return {
        rooms: []
      }
    },
    methods: {
      randomise(min, max, incr) {
        incr = incr || 1;
        return Math.floor(Math.random()*(max-min+1)+min) * incr;
      },
      intersects(created, existing) {
        console.log('creating:', created);
        console.log('existing:', existing);
        let from_x = created.x + created.w;
        let from_y = created.y + created.h;
        let to_x = existing.x + existing.w;
        let to_y = existing.y + existing.h;
        if (from_x >= to_x && from_y >= to_y) { return true }
      },
      room(x, y, w, h, i) {
        let x1, x2, y1, y2;

        x1 = x;
        x2 = x + w;
        y1 = y;
        y2 = y + h;

        return {
          i: i,
          x: x,
          y: y,
          w: w,
          h: h,
          center: {
            x: Math.floor((x1 + x2) / 2),
            y: Math.floor((y1 + y2) / 2)
          }
        }
      },
      create() {

        const rooms = [];

        let amount = this.randomise(4, 6);

        for (let i = 0; i < amount; i++) {

          console.log('Room:', i);

          let x = this.randomise(0, 3, 75);
          let y = this.randomise(0, 8, 75);
          let w = this.randomise(1, 4, 75);
          let h = this.randomise(1, 3, 75);
          if (x + w > 300) {
            if (x > w) { x = x - w; } else { w = w - x; }
            if (x <= 0) { x = 0; }
            if (w <= 0) { w = 75; }
          }
          if (y + h > 600) {
            if (y > h) { y = y - h; } else { h = h - y; }
            if (y <= 0) { y = 0; }
            if (h <= 0) { h = 75; }
          }

          let created = this.room(x, y, w, h, i);
          let failed = false;

          for (let r = 0; r < rooms.length; r++) {
            let existing = rooms[r];
            if (this.intersects(created, existing)) {
              console.log('  Failed');
              failed = true;
              break;
            }
          }
          if (!failed) {
            console.log('  OK!');
            rooms.push(created);
          }
        }

        this.rooms = rooms;
        
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

    width: 300px;
    height: 600px;
    margin: 0 auto;
    background: #111;
    border-radius: 0;
    position: relative;
    overflow: hidden;

    .section {
      display: flex;
      flex-flow: row;
      justify-content: space-around;
    }
    .section .section {
      flex-flow: column;
    }

    .room {

      height: 60px;
      display: flex;
      flex-flow: column;
      background: #444;
      box-sizing: border-box;
      box-shadow: 0 0 0 2px #111, inset 0 0 0 2px #111;
      justify-content: center;
      align-items: center;

      .name {
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: #111;
      }

      .door {
        width: 20px;
        height: 20px;
        background: #444;
        position: absolute;
        z-index: 2;
        &.left { left: -12px; top: 50%; margin-top: -10px; }
        &.right { right: -12px; top: 50%; margin-top: -10px; }
        &.down { left: 50%; bottom: -12px; margin-left: -10px; }
      }

      &.active {
        background: #eee;
        .name { color: #666; }
      }

      &.H4 { height: 200px; }
      &.H3 { height: 150px; }
      &.H2 { height: 100px; }
      &.H1 { height: 50px; }
      &.W4 { width: 300px; }
      &.W3 { width: 225px; }
      &.W2 { width: 150px; }
      &.W1 { width: 75px; }

      &[data-down="open"] {
        .door.down { width: 80px; margin-left: -40px; }
      }
      &[data-left="open"] {
        .door.left { height: 80px; margin-top: -40px; }
      }
      &[data-right="open"] {
        .door.right { height: 80px; margin-top: -40px; }
      }

      &:hover {
        cursor: pointer;
        .name { text-decoration: underline; }
      }

    }

  }
</style>
