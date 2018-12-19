class Actor {
  addDamage(amount) {
    this.health.current = this.health.current - amount;
  }

  addBlock(amount) {
    if (this.effects.block) {
      this.effects.block = this.effects.block + amount;
    } else {
      this.effects.block = amount;
    }
  }
}

class Player extends Actor {
  constructor(properties) {
    super(properties);
    this.name = properties.name;
    this.health = {
      current: properties.health.current,
      maximum: properties.health.maximum,
    };
    this.appearance = {
      skincolour: properties.appearance.skincolour,
      haircolour: properties.appearance.haircolour,
      hairstyle: properties.appearance.hairstyle,
      extra: properties.appearance.extra,
    };
    this.effects = properties.effects || {};
    this.attributes = properties.attributes;
    this.cards = properties.cards;
    this.role = properties.role;
    this.gender = properties.gender;
    this.energy = properties.energy;
  }
}

class Enemy extends Actor {
  constructor(properties) {
    super(properties);
    this.id = properties.id;
    this.name = properties.name;
    this.health = {
      current: properties.health.current,
      maximum: properties.health.maximum,
    };
    this.effects = properties.effects || {};
    this.title = properties.title;
    this.intents = properties.intents;
    this.sequence = properties.sequence;
    this.intent = {
      phase: 0,
      state: 'none',
      name: null,
      hint: null,
    };
  }
}

export default { Player, Enemy };
