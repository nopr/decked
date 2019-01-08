<template>
  <div class="UI">

    <div class="logo">
      <span class="upper-text">Cavern</span>
      <span class="lower-text">&middot; Crawl &middot;</span>
    </div>

    <button class="button">Button (Default)</button>
    <button class="button is-bright">Button (Bright)</button>
    <button class="button is-light">Button (Light)</button>

    <div class="PlayCard">
      <div class="meta">
        <div class="name">Flash</div>
        <div class="type">Skill</div>
      </div>
      <div class="cost">0</div>
      <div class="text">
        <p><i>Flashlight</i></p>
        <p>Choose one enemy.<br />Apply <b>Blinded (1)</b>.</p>
      </div>
    </div>
    <div class="PlayCard">
      <div class="meta">
        <div class="name">Shoot</div>
        <div class="type">Attack</div>
      </div>
      <div class="cost">1</div>
      <div class="text">
        <p><i>Pistol (9mm)</i></p>
        <p>Choose one enemy.<br />Deal <b>12 damage</b>.</p>
      </div>
    </div>
    <div class="PlayCard">
      <div class="meta">
        <div class="name">Defend</div>
        <div class="type">Skill</div>
      </div>
      <div class="cost">1</div>
      <div class="text">
        <p>Gain <b>5 block</b>.</p>
      </div>
    </div>
  </div>
</template>

<script>
</script>

<style lang="scss">

  .UI {
    height: 100%;
  }

  .button.is-bright {
    text-shadow: 0 0 2px #a5e6ff;
    text-shadow: none;
    color: #a5e6ff;
    &:hover {
      text-shadow: 0 0 2px #a5e6ff;
      color: #c8e7fb;
    }
  }

  .logo {
    margin: 50px auto;
    position: relative;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    .upper-text {
      font-size: 21px;
      font-weight: 600;
      font-family: 'GameDisplay';
      letter-spacing: 5px;
      text-transform: lowercase;
      text-shadow: 0 0 2px rgba(255,255,255,0.3), 0 0 4px rgba(255,255,255,0.3),;
      color: white;
    }
    .middle-text {
      font-size: 14px;
      font-weight: 600;
      font-family: 'GameDisplay';
      letter-spacing: 1px;
      text-transform: lowercase;
      margin: 5px 0 7px;
      color: #666;
    }
    .lower-text {
      font-size: 25px;
      font-weight: 600;
      margin-top: 10px;
      text-transform: uppercase;
      // transform: rotate(10deg) translateY(2px) translateX(30px);
      text-shadow: 0 0 2px #a5e6ff;
      color: #a5e6ff;
    }
  }

  .PlayCard {

    -webkit-appearance: none;
    -webkit-font-smoothing: antialiased;
    cursor: pointer;
    border: 0;
    display: inline-flex;
    flex-flow: column;
    justify-content: space-between;
    align-items: center;
    text-decoration: none;
    text-align: center;
    font-family: inherit;
    border: 0;
    border-radius: 5px;
    font-size: 14px;
    font-weight: 900;
    outline: 0;
    margin: 5px;
    width: 150px;
    height: 200px;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;

    color: #333;
    text-shadow: 1px 1px #aaa;
    background: linear-gradient(to top, #e9e6d7, #f7f5ee);

    .meta {
      padding: 20px 10px 0;
    }
    .meta .name {
      font-size: 18px;
      font-weight: 600;
      font-family: 'GameDisplay';
      text-transform: lowercase;
      color: #333;
      text-shadow: none;
    }
    .meta .type {
      letter-spacing: 2px;
      text-transform: uppercase;
      text-shadow: none;
      font-size: 10px;
      opacity: 0.5;
    }
    .cost {
      position: absolute;
      left: 10px;
      top: 10px;
    }
    .text {
      padding: 0 10px 20px;
      color: #333;
      font-size: 14px;
      font-weight: 400;
      text-shadow: none;
      line-height: 15px;
      p { margin: 0; }
      p + p { margin-top: 5px; }
      i {
        font-style: normal;
        opacity: 0.5;
      }
    }

  }

</style>
