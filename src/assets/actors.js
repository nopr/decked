import effects from './effects.js';

class Actor {}

class Player extends Actor {
  constructor(properties) {
    super(properties);
    this.name = properties.name;
    this.title = properties.title;
    this.health = {
      current: properties.health.current,
      maximum: properties.health.maximum,
    };
    this.gender = properties.gender;
    this.appearance = {
      bodytype: properties.appearance.bodytype,
      bodycolour: properties.appearance.bodycolour,
      belttype: properties.appearance.belttype,
      beltcolour: properties.appearance.beltcolour,
      legcolour: properties.appearance.legcolour,
      skincolour: properties.appearance.skincolour,
      haircolour: properties.appearance.haircolour,
      hairstyle: properties.appearance.hairstyle,
      extra: properties.appearance.extra,
    };
    this.effects = [];
    this.attributes = properties.attributes;
    this.cards = properties.cards;
    this.role = properties.role;
    this.gold = properties.gold;
    this.block = properties.block;
    this.energy = properties.energy;
  }
}

class Enemy extends Actor {
  constructor(properties) {
    super(properties);
    this.id = properties.id;
    this.name = properties.name;
    this.title = properties.title;
    this.health = {
      current: properties.health.current,
      maximum: properties.health.maximum,
    };
    this.gender = properties.gender;
    this.appearance = {
      bodytype: properties.appearance.bodytype,
      bodycolour: properties.appearance.bodycolour,
      belttype: properties.appearance.belttype,
      beltcolour: properties.appearance.beltcolour,
      legcolour: properties.appearance.legcolour,
      skincolour: properties.appearance.skincolour,
      haircolour: properties.appearance.haircolour,
      hairstyle: properties.appearance.hairstyle,
      extra: properties.appearance.extra,
    };
    this.effects = [];
    this.attributes = properties.attributes;
    this.gold = properties.gold;
    this.intents = properties.intents;
    this.sequence = properties.sequence;
    this.phase = 0;
  }
}

export default { Player, Enemy };
