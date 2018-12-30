<template>
  <div class="Avatar">
    <div class="image" v-bind:data-gender="actor.gender" v-bind:data-body="actor.appearance.bodytype" v-bind:data-belt="actor.appearance.belttype" v-bind:data-extra="actor.appearance.extra" v-bind:data-hair="actor.appearance.hairstyle">
      <div class="head">
        <div class="extra" v-bind:style="{ backgroundColor: actor.appearance.haircolour.value }"><span></span></div>
        <div class="hair" v-bind:style="{ backgroundColor: actor.appearance.haircolour.value }"><span></span></div>
      </div>
      <div class="belt" v-bind:style="{ backgroundColor: actor.appearance.beltcolour.value }"><span></span></div>
      <div class="arms" v-bind:style="{ backgroundColor: actor.appearance.bodycolour.value }"><span></span></div>
      <div class="body" v-bind:style="{ backgroundColor: actor.appearance.bodycolour.value }"><span></span></div>
      <div class="face" v-bind:style="{ backgroundColor: actor.appearance.skincolour.value }"><span></span></div>
      <div class="hands" v-bind:style="{ backgroundColor: actor.appearance.skincolour.value }"><span></span></div>
      <div class="feet" v-bind:style="{ backgroundColor: actor.appearance.legcolour.value }"><span></span></div>
      <div class="legs" v-bind:style="{ backgroundColor: actor.appearance.legcolour.value }"><span></span></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Avatar',
    props: ['actor'],
    created() {
      console.log('Avatar.created')
    },
    mounted() {
      console.log('Avatar.mounted')
    },
    updated() {
      console.log('Avatar.updated')
    },
    destroyed() {
      console.log('Avatar.destroyed')
    }
  };
</script>

<style lang="scss">
  @keyframes updown {
    from, to {
      transform: translateY(0px);
    }
    30% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(2px);
    }
    70% {
      transform: translateY(0);
    }
  }
  
  @keyframes reachup {
    from, to { transform: scaleX(1); }
    25% { transform: scaleX(-1) translateX(-9px); }
    35% { transform: scaleX(1); }
  }
  
  @keyframes fliphorizontal {
    from, to { transform: scaleX(1); }
    45% { transform: scaleX(-1) translateX(-9px); }
    55% { transform: scaleX(1); }
  }
  
  @keyframes hair-fringe-mask {
    0% { mask-image: url('../images/player/hair-fringe-1.png'); }
    25% { mask-image: url('../images/player/hair-fringe-2.png'); }
    50% { mask-image: url('../images/player/hair-fringe-3.png'); }
    75% { mask-image: url('../images/player/hair-fringe-4.png'); }
    100% { mask-image: url('../images/player/hair-fringe-1.png'); }
  }
  @keyframes hair-fringe-image {
    0% { background-image: url('../images/player/hair-fringe-1.png'); }
    25% { background-image: url('../images/player/hair-fringe-2.png'); }
    50% { background-image: url('../images/player/hair-fringe-3.png'); }
    75% { background-image: url('../images/player/hair-fringe-4.png'); }
    100% { background-image: url('../images/player/hair-fringe-1.png'); }
  }
  @keyframes hair-long-mask {
    0% { mask-image: url('../images/player/hair-long-1.png'); }
    25% { mask-image: url('../images/player/hair-long-2.png'); }
    50% { mask-image: url('../images/player/hair-long-3.png'); }
    75% { mask-image: url('../images/player/hair-long-4.png'); }
    100% { mask-image: url('../images/player/hair-long-1.png'); }
  }
  @keyframes hair-long-image {
    0% { background-image: url('../images/player/hair-long-1.png'); }
    25% { background-image: url('../images/player/hair-long-2.png'); }
    50% { background-image: url('../images/player/hair-long-3.png'); }
    75% { background-image: url('../images/player/hair-long-4.png'); }
    100% { background-image: url('../images/player/hair-long-1.png'); }
  }
  @keyframes hair-short-mask {
    0% { mask-image: url('../images/player/hair-short-1.png'); }
    25% { mask-image: url('../images/player/hair-short-2.png'); }
    50% { mask-image: url('../images/player/hair-short-3.png'); }
    75% { mask-image: url('../images/player/hair-short-4.png'); }
    100% { mask-image: url('../images/player/hair-short-1.png'); }
  }
  @keyframes hair-short-image {
    0% { background-image: url('../images/player/hair-short-1.png'); }
    25% { background-image: url('../images/player/hair-short-2.png'); }
    50% { background-image: url('../images/player/hair-short-3.png'); }
    75% { background-image: url('../images/player/hair-short-4.png'); }
    100% { background-image: url('../images/player/hair-short-1.png'); }
  }
  @keyframes hair-pony-mask {
    0% { mask-image: url('../images/player/hair-pony-1.png'); }
    25% { mask-image: url('../images/player/hair-pony-2.png'); }
    50% { mask-image: url('../images/player/hair-pony-3.png'); }
    75% { mask-image: url('../images/player/hair-pony-4.png'); }
    100% { mask-image: url('../images/player/hair-pony-1.png'); }
  }
  @keyframes hair-pony-image {
    0% { background-image: url('../images/player/hair-pony-1.png'); }
    25% { background-image: url('../images/player/hair-pony-2.png'); }
    50% { background-image: url('../images/player/hair-pony-3.png'); }
    75% { background-image: url('../images/player/hair-pony-4.png'); }
    100% { background-image: url('../images/player/hair-pony-1.png'); }
  }
  
  .Avatar {
    
    min-width: 80px;
    min-height: 150px;
    border-radius: 5px;
    background: #111;
    
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    
    .image {
      width: 60px;
      height: 120px;
      position: relative;
      image-rendering: pixelated;
      div {
        mask-size: cover;
        position: absolute;
        height: 120px;
        width: 60px;
        left: 0;
        top: 0;
      }
      div span {
        opacity: 0.25;
        background-size: cover;
        position: absolute;
        height: 120px;
        width: 60px;
        left: 0;
        top: 0;
      }
      div.arms { z-index: 9; }
      div.head { z-index: 7}
        div.hair { z-index: 1; }
        div.extra { z-index: 2; }
      div.belt { z-index: 6; }
      div.body { z-index: 5; }
      div.face { z-index: 4; }
      div.hands { z-index: 3; }
      div.feet { z-index: 2; }
      div.legs { z-index: 1; }
    }
    
    [data-extra="beard-none"] .extra { mask-image: url('../images/player/beard-none.png'); }
    [data-extra="beard-none"] .extra span { background-image: url('../images/player/beard-none.png'); }
    [data-extra="beard-stubble"] .extra { mask-image: url('../images/player/beard-heavy.png'); }
    [data-extra="beard-stubble"] .extra span { background-image: url('../images/player/beard-heavy.png'); }
    [data-extra="beard-light"] .extra { mask-image: url('../images/player/beard-light.png'); }
    [data-extra="beard-light"] .extra span { background-image: url('../images/player/beard-light.png'); }
    [data-extra="beard-heavy"] .extra { mask-image: url('../images/player/beard-heavy.png'); }
    [data-extra="beard-heavy"] .extra span { background-image: url('../images/player/beard-heavy.png'); }
      
    .head {
      animation: fliphorizontal 5s steps(1, end) infinite; 
    }
      
    [data-hair="hair-buzz"] .hair { mask-image: url('../images/player/hair-buzz-1.png'); }
    [data-hair="hair-buzz"] .hair span { background-image: url('../images/player/hair-buzz-1.png'); }
    [data-hair="hair-fringe"] .hair { animation: hair-fringe-mask 1s steps(1, end) infinite; }
    [data-hair="hair-fringe"] .hair span { animation: hair-fringe-image 1s steps(1, end) infinite; }
    [data-hair="hair-long"] .hair { animation: hair-long-mask 1s steps(1, end) infinite; }
    [data-hair="hair-long"] .hair span { animation: hair-long-image 1s steps(1, end) infinite; }
    [data-hair="hair-short"] .hair { animation: hair-short-mask 1s steps(1, end) infinite; }
    [data-hair="hair-short"] .hair span { animation: hair-short-image 1s steps(1, end) infinite; }
    [data-hair="hair-pony"] .hair { animation: hair-pony-mask 1s steps(1, end) infinite; }
    [data-hair="hair-pony"] .hair span { animation: hair-pony-image 1s steps(1, end) infinite; }
      
    [data-body="large"][data-belt="chunky"] .belt { mask-image: url('../images/player/belt-large-chunky.png'); }
    [data-body="large"][data-belt="chunky"] .belt span { background-image: url('../images/player/belt-large-chunky.png'); }
    [data-body="large"][data-belt="normal"] .belt { mask-image: url('../images/player/belt-large-normal.png'); }
    [data-body="large"][data-belt="normal"] .belt span { background-image: url('../images/player/belt-large-normal.png'); }
    [data-body="large"][data-belt="light"] .belt { mask-image: url('../images/player/belt-large-light.png'); }
    [data-body="large"][data-belt="light"] .belt span { background-image: url('../images/player/belt-large-light.png'); }
    
    [data-body="medium"][data-belt="chunky"] .belt { mask-image: url('../images/player/belt-medium-chunky.png'); }
    [data-body="medium"][data-belt="chunky"] .belt span { background-image: url('../images/player/belt-medium-chunky.png'); }
    [data-body="medium"][data-belt="normal"] .belt { mask-image: url('../images/player/belt-medium-normal.png'); }
    [data-body="medium"][data-belt="normal"] .belt span { background-image: url('../images/player/belt-medium-normal.png'); }
    [data-body="medium"][data-belt="light"] .belt { mask-image: url('../images/player/belt-medium-light.png'); }
    [data-body="medium"][data-belt="light"] .belt span { background-image: url('../images/player/belt-medium-light.png'); }
    
    [data-body="small"][data-belt="chunky"] .belt { mask-image: url('../images/player/belt-small-chunky.png'); }
    [data-body="small"][data-belt="chunky"] .belt span { background-image: url('../images/player/belt-small-chunky.png'); }
    [data-body="small"][data-belt="normal"] .belt { mask-image: url('../images/player/belt-small-normal.png'); }
    [data-body="small"][data-belt="normal"] .belt span { background-image: url('../images/player/belt-small-normal.png'); }
    [data-body="small"][data-belt="light"] .belt { mask-image: url('../images/player/belt-small-light.png'); }
    [data-body="small"][data-belt="light"] .belt span { background-image: url('../images/player/belt-small-light.png'); }
    
    .body {
      animation-name: updown;
      animation-duration: 1s;
      animation-iteration-count: infinite;
    }
    [data-body="large"][data-gender="male"] .body { mask-image: url('../images/player/body-large-male.png'); }
    [data-body="large"][data-gender="male"] .body span { background-image: url('../images/player/body-large-male.png'); }
    [data-body="large"][data-gender="female"] .body { mask-image: url('../images/player/body-large-female.png'); }
    [data-body="large"][data-gender="female"] .body span { background-image: url('../images/player/body-large-female.png'); }
    [data-body="medium"][data-gender="male"] .body { mask-image: url('../images/player/body-medium-male.png'); }
    [data-body="medium"][data-gender="male"] .body span { background-image: url('../images/player/body-medium-male.png'); }
    [data-body="medium"][data-gender="female"] .body { mask-image: url('../images/player/body-medium-female.png'); }
    [data-body="medium"][data-gender="female"] .body span { background-image: url('../images/player/body-medium-female.png'); }
    [data-body="small"][data-gender="male"] .body { mask-image: url('../images/player/body-small-male.png'); }
    [data-body="small"][data-gender="male"] .body span { background-image: url('../images/player/body-small-male.png'); }
    [data-body="small"][data-gender="female"] .body { mask-image: url('../images/player/body-small-female.png'); }
    [data-body="small"][data-gender="female"] .body span { background-image: url('../images/player/body-small-female.png'); }

    [data-body="large"] .arms { mask-image: url('../images/player/arms-large.png'); }
    [data-body="large"] .arms span { background-image: url('../images/player/arms-large.png'); }
    [data-body="medium"] .arms { mask-image: url('../images/player/arms-medium.png'); }
    [data-body="medium"] .arms span { background-image: url('../images/player/arms-medium.png'); }
    [data-body="small"] .arms { mask-image: url('../images/player/arms-small.png'); }
    [data-body="small"] .arms span { background-image: url('../images/player/arms-small.png'); }
    
    .face {
      animation: fliphorizontal 5s steps(1, end) infinite; 
    }
    .face { mask-image: url('../images/player/head.png'); }
    .face span { background-image: url('../images/player/head.png'); }
    .hands { mask-image: url('../images/player/hands.png'); }
    .hands span { background-image: url('../images/player/hands.png'); }
        
    [data-body="large"] .legs { mask-image: url('../images/player/legs-large.png'); }
    [data-body="large"] .legs span { background-image: url('../images/player/legs-large.png'); }
    [data-body="medium"] .legs { mask-image: url('../images/player/legs-medium.png'); }
    [data-body="medium"] .legs span { background-image: url('../images/player/legs-medium.png'); }
    [data-body="small"] .legs { mask-image: url('../images/player/legs-small.png'); }
    [data-body="small"] .legs span { background-image: url('../images/player/legs-small.png'); }
    
    [data-body="large"] .feet { mask-image: url('../images/player/feet-large.png'); }
    [data-body="large"] .feet span { background-image: url('../images/player/feet-large.png'); }
    [data-body="medium"] .feet { mask-image: url('../images/player/feet-medium.png'); }
    [data-body="medium"] .feet span { background-image: url('../images/player/feet-medium.png'); }
    [data-body="small"] .feet { mask-image: url('../images/player/feet-small.png'); }
    [data-body="small"] .feet span { background-image: url('../images/player/feet-small.png'); }
    
  }
</style>
