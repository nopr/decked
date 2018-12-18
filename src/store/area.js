const Randomise = max => Math.floor(Math.random() * Math.floor(max));

const Booleanise = (str) => {
  const numb = Randomise(2);
  return (numb === 0) ? str || true : false;
};

const GetType = () => {
  const types = ['battle', 'event'];
  return types[Randomise(2)];
};

const MakeNewPoint = (data) => {
  const mydata = data || {};
  return {
    type: mydata.type || GetType(),
    ready: false,
    status: mydata.status || null,
    connects: [],
  };
};

const GenerateArea = (difficulty) => {
  // Set difficulty
  const array = [];
  const connections = [];

  const steps = difficulty - 1;

  for (let step = 0; step < steps; step += 1) {
    const points = [];
    const amount = Randomise(3) + 1;
    for (let item = 0; item < amount; item += 1) {
      if (step !== 2) {
        if (step === 0) {
          points.push(MakeNewPoint({ type: 'battle', status: 'available' }));
        } else {
          points.push(MakeNewPoint());
        }
      }
    }
    if (step === 1 && array[0].length === 3 && points.length === 1) {
      points.push(MakeNewPoint());
    }
    if (step === 2) {
      points.push(MakeNewPoint({ type: 'shop' }));
      points.push(MakeNewPoint({ type: 'camp' }));
    }
    array.push(points);
  }
  array.push([MakeNewPoint({ type: 'boss' })]);

  for (let step = 0; step < array.length; step += 1) {
    const next = step + 1;
    const pointsInStep = array[step].length;
    let pointsInNext = null;
    if (array[next]) {
      pointsInNext = array[next].length;
    }
    if (pointsInStep === 1) {
      if (pointsInNext === 1) {
        array[step][0].connects.push(true);
      }
      if (pointsInNext === 2) {
        array[step][0].connects.push(true);
        array[step][0].connects.push(true);
      }
      if (pointsInNext === 3) {
        array[step][0].connects.push(true);
        array[step][0].connects.push(true);
        array[step][0].connects.push(true);
      }
    }
    if (pointsInStep === 2) {
      if (pointsInNext === 1) {
        array[step][0].connects.push(true);
        array[step][1].connects.push(true);
      }
      if (pointsInNext === 2) {
        array[step][0].connects.push(true);
        array[step][0].connects.push(Booleanise());
        array[step][1].connects.push(Booleanise());
        array[step][1].connects.push(true);
        // Repairing
        if (
          array[step][0].connects[1] === false
          && array[step][1].connects[0] === false
        ) {
          if (Booleanise()) {
            array[step][0].connects[1] = true;
          } else {
            array[step][1].connects[0] = true;
          }
        }
        // Destroying
        if (
          array[step][0].connects[1] === true
          && array[step][1].connects[0] === true
        ) {
          if (Booleanise()) {
            array[step][0].connects[1] = false;
          } else {
            array[step][1].connects[0] = false;
          }
        }
      }
      if (pointsInNext === 3) {
        array[step][0].connects.push(true);
        array[step][0].connects.push(Booleanise());
        array[step][0].connects.push(false);
        array[step][1].connects.push(false);
        array[step][1].connects.push(Booleanise());
        array[step][1].connects.push(true);
        // Repairing
        if (
          array[step][0].connects[1] === false
          && array[step][1].connects[1] === false
        ) {
          if (Booleanise()) {
            array[step][0].connects[1] = true;
          } else {
            array[step][1].connects[1] = true;
          }
        }
        // Destroying
        if (
          array[step][0].connects[1] === true
          && array[step][1].connects[0] === true
        ) {
          if (Booleanise()) {
            array[step][0].connects[1] = true;
          } else {
            array[step][1].connects[0] = false;
          }
        }
      }
    }
    if (pointsInStep === 3) {
      if (pointsInNext === 1) {
        array[step][0].connects.push(true);
        array[step][1].connects.push(true);
        array[step][2].connects.push(true);
      }
      if (pointsInNext === 2) {
        array[step][0].connects.push(true);
        array[step][0].connects.push(false);
        array[step][1].connects.push(Booleanise());
        array[step][1].connects.push(Booleanise());
        array[step][2].connects.push(false);
        array[step][2].connects.push(true);
        // Repairing
        if (
          array[step][1].connects[0] === false
          && array[step][1].connects[1] === false
        ) {
          if (Booleanise()) {
            array[step][1].connects[0] = true;
          } else {
            array[step][1].connects[1] = true;
          }
        }
        // Destroying
        if (
          array[step][1].connects[0] === true
          && array[step][1].connects[1] === true
        ) {
          if (Booleanise()) {
            array[step][1].connects[0] = false;
          } else {
            array[step][1].connects[1] = false;
          }
        }
      }
      if (pointsInNext === 3) {
        array[step][0].connects.push(true);
        array[step][0].connects.push(Booleanise());
        array[step][0].connects.push(false);
        array[step][1].connects.push(Booleanise());
        array[step][1].connects.push(Booleanise());
        array[step][1].connects.push(Booleanise());
        array[step][2].connects.push(false);
        array[step][2].connects.push(Booleanise());
        array[step][2].connects.push(true);
        // Destroying
        if (
          array[step][1].connects[0] === true
          && array[step][1].connects[1] === true
          && array[step][1].connects[2] === true
        ) {
          array[step][1].connects[0] = false;
          array[step][1].connects[2] = false;
        }
        if (
          array[step][0].connects[1] === true
          && array[step][1].connects[0] === true
        ) {
          if (Booleanise()) {
            array[step][0].connects[1] = false;
          } else {
            array[step][1].connects[0] = false;
          }
        }
        if (
          array[step][2].connects[1] === true
          && array[step][1].connects[2] === true
        ) {
          if (Booleanise()) {
            array[step][2].connects[1] = false;
          } else {
            array[step][1].connects[2] = false;
          }
        }
        // Repairing
        if (
          array[step][1].connects[0] === false
          && array[step][1].connects[1] === false
          && array[step][1].connects[2] === false
        ) {
          array[step][1].connects[1] = true;
        }
        if (
          array[step][0].connects[1] === false
          && array[step][1].connects[1] === false
          && array[step][2].connects[1] === false
        ) {
          array[step][1].connects[1] = true;
        }
      }
    }
  }
  for (let step = 0; step < array.length; step += 1) {
    for (let point = 0; point < array[step].length; point += 1) {
      for (let line = 0; line < array[step][point].connects.length; line += 1) {
        if (array[step][point].connects[line] === true) {
          connections.push({
            step,
            point,
            target: line,
            ready: false,
          });
        }
      }
    }
  }

  return { steps: array, lines: connections };
};

export default GenerateArea;
