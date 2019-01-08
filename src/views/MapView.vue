<template>
  <div class="MapView">
    <v-stage class="map" :config="{ width: 400, height: 600 }">
      <v-layer ref="stage">
        <v-image v-for="background in backgrounds" :key="background.id" :config="background"></v-image>
        <v-circle v-for="room in rooms" :key="room.id" :config="room"></v-circle>
        <v-line v-for="line in lines" :key="line.id" :config="line"></v-line>
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        backgrounds: [],
        rooms: [],
        lines: []
      }
    },
    methods: {
      random(min, max) {
        return Math.floor(Math.random()*(max-min+1)+min);
      },
      joinrooms(from, to) {
        let index = this.utility.findIndex(this.rooms, { 'n': to.n })
        if (this.rooms[from].exits.indexOf(to.n) === -1) {
          this.rooms[from].exits.push(to.n)
          this.rooms[index].entrances.push(this.rooms[from].n)
        }
      },
      build() {

        let FIRST_FLOOR = 0
        let LAST_FLOOR = 5
        let MAX_WIDTH = 4
        let room_number = 0

        // Create the series of rooms
        for (let f = FIRST_FLOOR; f < LAST_FLOOR + 1; f++) {
          let rooms = this.random(1, MAX_WIDTH)
          if (f === FIRST_FLOOR) { rooms = 1 }
          if (f === LAST_FLOOR) { rooms = 1 }
          let created = []
          let areas = this.utility.shuffle([1, 2, 3, 4])
          for (let r = 0; r < rooms; r++) {
            let area = this.utility.pullAt(areas, 0)
            let creating = {
              f: f,
              n: room_number++,
              y: f * 100 + 50,
              x: area[0] * 100 - 50,
              radius: 20,
              fill: 'white',
              isfirst: false,
              islast: false,
              siblings: rooms - 1,
              map_start: (r === 0),
              map_finish: (f === LAST_FLOOR),
              entrances: [],
              exits: []
            }
            // if (creating.siblings === 0) {
            //   if (f === FIRST_FLOOR) { creating.x = 2.5 * 100 - 50 }
            //   if (f === LAST_FLOOR) { creating.x = 2.5 * 100 - 50 }
            // }
            // creating.x = this.random(creating.x - 20, creating.x + 20)
            // creating.y = this.random(creating.y - 20, creating.y + 20)
            created.push(creating)
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

        }

        // Shuffle the rooms, so we can select at random
        this.rooms = this.utility.shuffle(this.rooms)
        for (let r = 0; r < this.rooms.length; r++) {
          let room = this.rooms[r]

          // Start room and Finish room are already connected
          if (room.map_start || room.map_finish) { continue; }

          let rooms_above = this.utility.filter(this.rooms, { 'f': room.f - 1 })
          let rooms_below = this.utility.filter(this.rooms, { 'f': room.f + 1 })

          // Does not have an exit
          if (room.exits.length === 0) {
            // Find out what rooms are nearby below
            let below_down = this.utility.filter(rooms_below, { 'x': room.x })[0]
            let below_left = this.utility.filter(rooms_below, { 'x': room.x - 100 })[0]
            let below_right = this.utility.filter(rooms_below, { 'x': room.x + 100 })[0]
          }

          // Does not have an entrance
          if (room.entrances.length === 0) {
            // Find out what rooms are nearby above
            let below_down = this.utility.filter(rooms_above, { 'x': room.x })[0]
            let below_left = this.utility.filter(rooms_above, { 'x': room.x - 100 })[0]
            let below_right = this.utility.filter(rooms_above, { 'x': room.x + 100 })[0]
          }

        }

        // Draw the lines
        for (let r = 0; r < this.rooms.length; r++) {
          let room = this.rooms[r]
          for (let c = 0; c < room.exits.length; c++) {
            let target = this.utility.find(this.rooms, { 'f': room.f + 1, 'n': room.exits[c] })
            
            let start = { x: room.x, y: room.y + 0 }
            // let startmod = { x: room.x, y: room.y + 50 }
            // let finishmod = { x: target.x, y: target.y - 50 }
            let finish = { x: target.x, y: target.y - 0 }

            this.lines.push({
              x: 0,//this.random(-10, 10),
              y: 0,//this.random(-10, 10),
              points: [
                start.x, start.y,
                // startmod.x, startmod.y,
                // finishmod.x, finishmod.y,
                finish.x, finish.y
              ],
              stroke: 'red',
              // bezier: true,
              // dash: [0, 9],
              // strokeWidth: 4,
              lineCap: 'round'
            })
          }
        }

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

  .map {
    width: 400px;
    height: 600px;
    margin: 20px auto;
    background: #333;
  }  

</style>
