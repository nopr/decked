<template>
  <div class="MapView">
    <button v-on:click="build">New Map</button>
    <div class="mapcontainer">
      <div class="mapleft"></div>
      <div class="mapmiddle">
        <v-stage ref="stage" class="mapcanvas" :config="canvasconfig">
          <v-layer ref="decoration">
            
          </v-layer>
          <v-layer ref="plotted">
            <v-line v-for="border in borders" :key="border.id" :config="border"></v-line>
            <v-line v-for="line in lines" :key="line.id" :config="line"></v-line>
            <v-line v-for="path in paths" :key="path.id" :config="path"></v-line>
          </v-layer>
          <v-layer ref="rooms">
            <v-circle v-for="room in rooms" :key="room.id" :config="room.appearance.point" @mouseenter="room_on" @mouseleave="room_off" @click="room_visit" @tap="room_visit"></v-circle>
            <v-shape v-for="room in rooms" :key="room.id" v-if="room.status === 'visited'" :config="room.appearance.check"></v-shape>
            <icon name="chess-knight" scale="2" x="14" y="7" />
            <icon name="question" scale="2" x="13" y="9" />
            <icon name="campground" scale="2" x="9" y="11" />
            <icon name="store" scale="2" x="9" y="11" />
            <icon name="chess-rook" scale="2" x="13" y="8" />
          </v-layer>
          <v-layer ref="overlay">
            <!-- <v-circle v-for="room in rooms" :key="room.id" :config="shape_overlay(room)" @mouseenter="room_on" @mouseleave="room_off" @click="room_visit" @tap="room_visit"></v-circle> -->
          </v-layer>
          <v-layer ref="markers">
            <v-line v-if="markers.entry" :config="markers.entry"></v-line>
            <v-line v-if="markers.exit" :config="markers.exit"></v-line>
          </v-layer>
        </v-stage>
      </div>
      <div class="mapright"></div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        borders: [],
        rooms: [],
        lines: [],
        paths: [],
        markers: {
          entry: null,
          exit: null
        },
        canvasconfig: {
          width: 400,
          height: 600,
        },
        colour: {
          background: '#E3D2B4',
          foreground: '#F7EFCA',
          foreground_shadow: '#E0D7AD',
          markings: '#B09673',
          highlight: '#FF5F64',
          highlight_lighter: '#ff9397',
        },
        roomtypes: ['fight', 'fight', 'event', 'event', 'camp', 'shop']
      }
    },
    methods: {
      room_on(evt) {
        let stage = this.$refs.stage
        let i = this.utility.findIndex(this.rooms, { 'n': evt.target.attrs.n })
        if (this.rooms[i].status === 'available') {
          evt.target.to({
            fill: this.colour.highlight_lighter,
            duration: 0.1
          })
        }
      },
      room_off(evt) {
        let i = this.utility.findIndex(this.rooms, { 'n': evt.target.attrs.n })
        if (this.rooms[i].status === 'available') {
          evt.target.to({
            fill: this.colour.highlight,
            duration: 0.1
          })
        }
      },
      room_visit(evt) {
        let room = evt.target
        let i = this.utility.findIndex(this.rooms, { 'n': evt.target.attrs.n })
        if (this.rooms[i].status !== 'available') { return false }
        this.rooms[i].status = 'visited'
        this.rooms[i].appearance.point.fill = this.colour.foreground
        for (let p = 0; p < this.paths.length; p++) {
          this.paths[p].stroke = this.colour.markings
          let begins = this.utility.find(this.rooms, { 'n': this.paths[p].begins })
          let finishes = this.utility.find(this.rooms, { 'n': this.paths[p].finishes })
          if (begins && begins.status === 'visited' && finishes && finishes.status === 'visited') {
            this.paths[p].stroke = this.colour.highlight
          }
          if (p === 0) {
            this.paths[p].stroke = this.colour.highlight
          }
        }
        for (let r = 0; r < this.rooms.length; r++) {
          if (this.rooms[r].status === 'available') {
            this.rooms[r].status = 'default'
            this.rooms[r].appearance.point.fill = this.colour.markings
          }
        }
        for (let p = 0; p < this.paths.length; p++) {
          if (this.paths[p].begins === evt.target.attrs.n) {
            this.paths[p].stroke = this.colour.highlight
            let finish = this.utility.findIndex(this.rooms, { 'n': this.paths[p].finishes })
            this.rooms[finish].status = 'available'
            this.rooms[finish].appearance.point.fill = this.colour.highlight
          }
        }
      },
      makepoint(room) {
        return {
          x: room.x,
          y: room.y,
          n: room.n,
          radius: 10,
          fill: this.colour.markings,
          stroke: this.colour.foreground,
          strokeWidth: 5
        }
      },
      makecheck(room) {
        return {
          x: room.x,
          y: room.y,
          n: room.n,
          stroke: this.colour.foreground,
          fill: this.colour.highlight,
          rotation: -45,
          strokeWidth: 1,
          lineCap: 'round',
          lineJoin: 'round',
          sceneFunc(context, shape) {
            context.beginPath()
            context.moveTo(0, -9)
            context.lineTo(-3, -8)
            context.lineTo(-3, -3)
            context.lineTo(-8, -3)
            context.lineTo(-9, 0)
            context.lineTo(-8, 3)
            context.lineTo(-3, 3)
            context.lineTo(-3, 8)
            context.lineTo(0, 9)
            context.lineTo(3, 8)
            context.lineTo(3, 3)
            context.lineTo(8, 3)
            context.lineTo(9, 0)
            context.lineTo(8, -3)
            context.lineTo(3, -3)
            context.lineTo(3, -8)
            context.closePath()
            context.fillStrokeShape(shape)
          }
        }
      },
      createroom(rooms, n, f, a) {
        let creating = {
          f: f,
          n: n,
          y: f * 100 + 50,
          x: a * 100 - 50,
          a: a,
          isfirst: false,
          islast: false,
          status: 'default',
          siblings: rooms - 1,
          map_start: (f === 0),
          map_finish: (f === 5),
          roomtype: this.utility.sample(this.roomtypes),
          entrances: [],
          exits: [],
          appearance: {
            point: {},
            check: {},
            icon: {}
          },
          radius: 10,
          fill: this.colour.foreground,
          stroke: this.colour.markings,
          strokeWidth: 3
        }
        if (f === 0) { creating.roomtype = 'fight'; creating.status = 'available'; }
        if (f === 5) { creating.roomtype = 'boss' }
        return creating
      },
      random(min, max) {
        return Math.floor(Math.random()*(max-min+1)+min);
      },
      joinrooms_upward(from, to) {
        let index = this.utility.findIndex(this.rooms, { 'n': to.n })
        if (this.rooms[from].entrances.indexOf(to.n) === -1) {
          this.rooms[from].entrances.push(to.n)
          this.rooms[index].exits.push(this.rooms[from].n)
        }
      },
      joinrooms(from, to) {
        let index = this.utility.findIndex(this.rooms, { 'n': to.n })

        let index_of_source = from
        let index_of_target = this.utility.findIndex(this.rooms, { 'n': to.n })

        let name_of_source = this.rooms[index_of_source].n
        let name_of_target = this.rooms[index_of_target].n

        let x_of_source = this.rooms[index_of_source].x
        let x_of_target = this.rooms[index_of_target].x
        
        // Are we connecting to the left or right?
        let direction = 'down'
        if (x_of_target < x_of_source) { direction = 'left' }
        if (x_of_target > x_of_source) { direction = 'right' }

        // If left
        if (direction === 'left') {
          // Does this room have a sibling to the left?
          if (!this.rooms[index_of_source].isfirst) {
            // Find the exits that room has
            let exits = this.rooms[index_of_source - 1].exits
            // Does our target have a sibling to the right?
            if (!this.rooms[index_of_target].islast) {
              // Does our sibling connect to the target's sibling?
              if (exits.indexOf(this.rooms[index_of_target + 1].n) !== -1) {
                // Yep, so we can't connect
                return
              }
            }
          }
        }
        if (direction === 'right') {
          // Does this room have a sibling to the right?
          if (!this.rooms[index_of_source].islast) {
            // Find the exits that room has
            let exits = this.rooms[index_of_source + 1].exits
            // Does our target have a sibling to the left?
            if (!this.rooms[index_of_target].isfirst) {
              // Does our sibling connect to the target's sibling?
              if (exits.indexOf(this.rooms[index_of_target - 1].n) !== -1) {
                // Yep, so we can't connect
                return
              }
            }
          }
        }

        // Now make a connection if it doesn't already exist!
        if (this.rooms[from].exits.indexOf(to.n) === -1) {
          this.rooms[from].exits.push(to.n)
          this.rooms[index].entrances.push(this.rooms[from].n)
        }
      },
      build() {

        this.rivers = []
        this.borders = []
        this.caves = []
        this.rooms = []
        this.lines = []
        this.paths = []

        let FIRST_FLOOR = 0
        let LAST_FLOOR = 5
        let MAX_WIDTH = 4
        let room_number = 0

        // Create the series of rooms
        for (let f = FIRST_FLOOR; f < LAST_FLOOR + 1; f++) {
          let rooms = this.random(2, MAX_WIDTH)
          if (f === FIRST_FLOOR) { rooms = 1 }
          if (f === LAST_FLOOR) { rooms = 1 }
          let created = []
          let areas = this.utility.shuffle([1, 2, 3, 4])
          for (let r = 0; r < rooms; r++) {
            let a = this.utility.pullAt(areas, 0)[0]
            let n = room_number++
            created.push(this.createroom(rooms, n, f, a))
          }
          let sorted = this.utility.sortBy(created, ['x'])
          sorted[0].isfirst = true
          sorted[sorted.length-1].islast = true
          this.rooms.push(...sorted)
        }

        // Created the exits and entrances for each room
        for (let r = 0; r < this.rooms.length; r++) {
          let room = this.rooms[r]

          // Stop on last floor
          if (room.f === LAST_FLOOR) { break; }

          // Available rooms on the next floor
          let prev_rooms = this.utility.filter(this.rooms, { 'f': room.f - 1 })
          let next_rooms = this.utility.filter(this.rooms, { 'f': room.f + 1 })
          let next_first = this.utility.find(next_rooms, { 'isfirst': true })
          let next_last = this.utility.find(next_rooms, { 'islast': true })

          // Is this is the only room on this floor?
          if (room.siblings === 0) {
            for (let t = 0; t < next_rooms.length; t++) {
              this.joinrooms(r, next_rooms[t])
            }
          }
          // Is there only one room on the next floor?
          if (next_rooms.length === 1) { this.joinrooms(r, next_rooms[0]) }
          // Is this the first room on this floor?
          if (room.isfirst) { this.joinrooms(r, next_first) }
          // Is this the last room on this floor?
          if (room.islast) { this.joinrooms(r, next_last) }

          // rooms that are not first and not last
          if (!room.isfirst && !room.islast) {
            // try to join straight down (x)
            if (next_rooms.length) {
              let below = this.utility.filter(next_rooms, { 'x': room.x })
              if (below.length) { this.joinrooms(r, below[0]) }
            }
            // try to join straight up (x)
            if (prev_rooms.length) {
              let above = this.utility.filter(prev_rooms, { 'x': room.x })
              if (above.length) { this.joinrooms_upward(r, above[0]) }
            }
          }

          // If room is first in the row
          if (room.isfirst) {
            // 1/4 chance of connecting rightwards
            if (this.random(1, 4) === 1) {
              let target = this.utility.filter(next_rooms, { 'x': room.x + 100 })
              if (target.length) {
                this.joinrooms(r, target[0])
              }
            }
          }
          // If room is last in the row
          if (room.islast) {
            // 1/4 chance of connecting leftwards
            if (this.random(1, 4) === 1) {
              let target = this.utility.filter(next_rooms, { 'x': room.x - 100 })
              if (target.length) {
                this.joinrooms(r, target[0])
              }
            }
          }
          // If room is not first or last
          if (!room.isfirst && !room.islast) {
            // 1/4 chance of connecting leftwards
            if (this.random(1, 4) === 1) {
              let target = this.utility.filter(next_rooms, { 'x': room.x - 100 })
              if (target.length) {
                this.joinrooms(r, target[0])
              }
            }
            // 1/4 chance of connecting rightwards
            if (this.random(1, 4) === 1) {
              let target = this.utility.filter(next_rooms, { 'x': room.x + 100 })
              if (target.length) {
                this.joinrooms(r, target[0])
              }
            }
          }

        }

        // Repair any broken connections
        for (let r = 0; r < this.rooms.length; r++) {
          let room = this.rooms[r]

          // Start room and Finish room are already connected
          if (room.map_start || room.map_finish) { continue; }

          let rooms_above = this.utility.filter(this.rooms, { 'f': room.f - 1 })
          let rooms_below = this.utility.filter(this.rooms, { 'f': room.f + 1 })

          // Does not have an exit
          if (room.exits.length === 0) {
            // Find a room below without an entrance
            let found = this.utility.filter(rooms_below, (finding) => {
              return finding.entrances.length === 0
            })
            // Connect if it exists
            if (found.length) { this.joinrooms(r, found[0]) }
            // If there wasn't a "spare" unconnected room
            if (found.length === 0) {
              // Find rooms below that are slightly to the left/right
              let targets = this.utility.filter(rooms_below, (finding) => {
                return finding.x === room.x - 100 || finding.x === room.x + 100
              })
              // If there are any
              if (targets.length) {
                // Pick one at random and connect to it
                let pick = this.utility.sample(targets)
                this.joinrooms(r, pick)
              }
            }
          }

          // Does not have an entrance
          if (room.entrances.length === 0) {
            // Find a room above without an exit
            let found = this.utility.filter(rooms_above, (finding) => {
              return finding.exits.length === 0
            })
            // Connect if it exists
            if (found.length) { this.joinrooms_upward(r, found[0]) }
            // If there wasn't a "spare" unconnected room
            if (found.length === 0) {
              // Find rooms below that are slightly to the left/right
              let targets = this.utility.filter(rooms_above, (finding) => {
                return finding.x === room.x - 100 || finding.x === room.x + 100
              })
              // If there are any
              if (targets.length) {
                // Pick one at random and connect to it
                let pick = this.utility.sample(targets)
                this.joinrooms_upward(r, pick)
              }
            }
          }

        }

        // Scramble the room positions a little
        for (let r = 0; r < this.rooms.length; r++) {
          let room = this.rooms[r]
          // Rooms that aren't on first or last floors
          if (room.f > FIRST_FLOOR && room.f < LAST_FLOOR) {
            this.rooms[r].y = this.random(room.y - 20, room.y + 20)
            if (room.isfirst) {
              this.rooms[r].x = this.random(room.x, room.x + 20)
            }
            if (room.islast) {
              this.rooms[r].x = this.random(room.x - 20, room.x)
            }
            if (!room.isfirst && !room.isfirst) {
              this.rooms[r].x = this.random(room.x -20, room.x + 20)
            }
          }
          if (room.f === FIRST_FLOOR) {
            room.x = 2.5 * 100 - 50
            this.rooms[r].y = this.random(room.y + 30, room.y + 30)
            this.rooms[r].x = this.random(room.x - 30, room.x + 30)
          }
          if (room.f === LAST_FLOOR) {
            room.x = 2.5 * 100 - 50
            this.rooms[r].y = this.random(room.y - 30, room.y - 30)
            this.rooms[r].x = this.random(room.x - 30, room.x + 30)
          }
        }

        // Add visuals for the rooms
        for (let r = 0; r < this.rooms.length; r++) {
          // Add the base point shape
          this.rooms[r].appearance.point = this.makepoint(this.rooms[r])
          // Add the base check shape
          this.rooms[r].appearance.check = this.makecheck(this.rooms[r])
          // For the first room
          if (this.rooms[r].f === FIRST_FLOOR) {
            this.rooms[r].appearance.point.fill = this.colour.highlight
          }
        }

        // Add entrance line
        if (this.rooms[0]) {
          let room = this.rooms[0]
          this.borders.push({
            x: 0,
            y: 0,
            points: [
              room.x, room.y,
              room.x - 30, room.y - 30,
              room.x - 40, room.y - 35
            ],
            stroke: this.colour.markings,
            bezier: true,
            tension: 0.02,
            strokeWidth: 30,
            lineCap: 'round'
          })
          this.lines.push({
            x: 0,
            y: 0,
            points: [
              room.x, room.y,
              room.x - 30, room.y - 30,
              room.x - 40, room.y - 35
            ],
            stroke: this.colour.foreground,
            bezier: true,
            tension: 0.02,
            strokeWidth: 25,
            lineCap: 'round'
          })
          this.paths.push({
            x: 0,
            y: 0,
            points: [
              room.x, room.y,
              room.x - 30, room.y - 30,
              // room.x - 40, room.y - 35
            ],
            finishes: room.n,
            stroke: this.colour.highlight,
            dash: [0, 5],
            strokeWidth: 3,
            lineCap: 'round'
          })
        }

        // Add exit line
        if (this.rooms[this.rooms.length - 1]) {
          let room = this.rooms[this.rooms.length - 1]
          this.borders.push({
            x: 0,
            y: 0,
            points: [
              room.x, room.y,
              room.x + 30, room.y + 30,
              room.x + 40, room.y + 35,
            ],
            stroke: this.colour.markings,
            bezier: true,
            tension: 0.02,
            strokeWidth: 30,
            lineCap: 'round'
          })
          this.lines.push({
            x: 0,
            y: 0,
            points: [
              room.x, room.y,
              room.x + 30, room.y + 30,
              room.x + 40, room.y + 35,
            ],
            stroke: this.colour.foreground,
            bezier: true,
            tension: 0.02,
            strokeWidth: 25,
            lineCap: 'round'
          })
          this.paths.push({
            x: 0,
            y: 0,
            points: [
              room.x, room.y,
              room.x + 30, room.y + 30,
              // room.x + 40, room.y + 35,
            ],
            finishes: room.n,
            stroke: this.colour.markings,
            dash: [0, 5],
            strokeWidth: 3,
            lineCap: 'round'
          })
        }

        // Draw the lines
        for (let r = 0; r < this.rooms.length; r++) {
          let room = this.rooms[r]
          for (let c = 0; c < room.exits.length; c++) {
            let target = this.utility.find(this.rooms, { 'f': room.f + 1, 'n': room.exits[c] })
            
            let start = { x: room.x, y: room.y + 0 }
            let finish = { x: target.x, y: target.y - 0 }
            let half = {
              x: ((start.x + finish.x) / 2), 
              y: ((start.y + finish.y) / 2)
            }
            let mod1 = {
              x: ((start.x + half.x) / 2), 
              y: ((start.y + half.y) / 2)
            }
            let mod2 = {
              x: ((half.x + finish.x) / 2), 
              y: ((half.y + finish.y) / 2)
            }

            mod1.x = this.random(mod1.x - 15, mod1.x + 15)
            mod1.y = this.random(mod1.y - 15, mod1.y + 15)
            mod2.x = this.random(mod2.x - 15, mod2.x + 15)
            mod2.y = this.random(mod2.y - 15, mod2.y + 15)

            this.borders.push({
              x: 0,
              y: 0,
              points: [
                start.x, start.y,
                mod1.x, mod1.y,
                half.x, half.y,
                mod2.x, mod2.y,
                finish.x, finish.y
              ],
              stroke: this.colour.markings,
              bezier: true,
              tension: 0.02,
              strokeWidth: 40,
              lineCap: 'round'
            })
            this.lines.push({
              x: 0,
              y: 0,
              points: [
                start.x, start.y,
                mod1.x, mod1.y,
                half.x, half.y,
                mod2.x, mod2.y,
                finish.x, finish.y
              ],
              stroke: this.colour.foreground,
              bezier: true,
              tension: 0.02,
              strokeWidth: 35,
              lineCap: 'round'
            })
            this.paths.push({
              x: 0,
              y: 0,
              points: [
                start.x, start.y,
                mod1.x, mod1.y,
                half.x, half.y,
                mod2.x, mod2.y,
                finish.x, finish.y
              ],
              begins: room.n,
              finishes: target.n,
              stroke: this.colour.markings,
              bezier: true,
              tension: 0.5,
              dash: [0, 5],
              strokeWidth: 3,
              lineCap: 'round'
            })
          }
        }

        // Add entry marker
        var entry = {
          x: this.rooms[0].x - 40,
          y: this.rooms[0].y - 35,
          points: [
            0, -7,
            -3, -7,
            -3, 0,
            -7, 0,
            0, 8,
            7, 0,
            3, 0,
            3, -7
          ],
          rotation: -55,
          fill: this.colour.highlight,
          closed: true
        }
        this.markers.entry = entry

        // Add exit marker
        var exit = {
          x: this.rooms[this.rooms.length - 1].x + 40,
          y: this.rooms[this.rooms.length - 1].y + 35,
          points: [
            0, -7,
            -3, -7,
            -3, 0,
            -7, 0,
            0, 8,
            7, 0,
            3, 0,
            3, -7
          ],
          rotation: -55,
          fill: this.colour.highlight,
          closed: true
        }
        this.markers.exit = exit

      }
    },
    created() {
      console.log('mapview.created')
    },
    mounted() {
      console.log('mapview.mounted')
      this.build();
    }
  }
</script>

<style lang="scss">

  .mapcontainer {
    width: 400px;
    height: 600px;
    margin: 50px auto 0;
    position: relative;
  }
  .mapmiddle {
    width: 400px;
    position: relative;
    z-index: 2;
    background: #E3D2B4;
    box-sizing: border-box;
    box-shadow: inset 0 -15px 0 0 #F8F1EA, inset 0 15px 0 0 #F8F1EA, 0 10px 10px 0 rgba(0,0,0,0.25);
    border-radius: 3px 3px 0 0;
  }
  .mapleft, .mapright {
    background: #E3D2B4;
    box-sizing: border-box;
    box-shadow: inset 0 -15px 0 0 #F8F1EA, inset 0 15px 0 0 #F8F1EA;
    width: 150px;
    height: 600px;
    position: absolute;
    top: -29px;
  }
  .mapleft {
    left: 0;
    top: 21px;
    transform: skewY(15deg);
    box-shadow: inset 0 -10px 0 0 #c4bdb6, inset 0 10px 0 0 #c4bdb6, inset -10px 0 0 0 #c4bdb6;
    background: #a5977d;
    border-radius: 5px 0 5px 0;
    z-index: 1;
  }
  .mapright {
    right: 0;
    top: 21px;
    transform: skewY(-15deg);
    box-shadow: inset 0 -10px 0 0 #c4bdb6, inset 0 10px 0 0 #c4bdb6, inset 10px 0 0 0 #c4bdb6;
    background: #a5977d;
    border-radius: 0 5px 0 5px;
    z-index: 1;
  }

</style>
