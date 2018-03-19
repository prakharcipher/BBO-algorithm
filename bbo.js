function rouletteWheelSelection(A) {
  var r = Math.random();
  var C = cumsum(A);
  var j = findIndex(C);
  return j;
}

function cumsum(A) {
  var n_A = [];
  A.reduce(function(a, b, i) {
    return (n_A[i] = a + b);
  }, 0);
  return n_A;
}

function findIndex(A) {
  for (var i = 0; i < A.length; i++) {
    if (A[i] !== 0) return i;
  }
}

function sphere(A) {
  return A.reduce(function(total, num) {
    return total + num * num;
  });
}

function linspace(a, b, n) {
  if (typeof n === 'undefined') n = Math.max(Math.round(b - a) + 1, 1);
  if (n < 2) {
    return n === 1 ? [a] : [];
  }
  var i,
    ret = Array(n);
  n--;
  for (i = n; i >= 0; i--) {
    ret[i] = (i * b + (n - i) * a) / n;
  }
  return ret;
}

function unifrnd(mi, mx, size) {
  var arr = [];
  for (var i = 1; i <= size; i++) {
    arr.push(Math.random() * (mx - mi + 1) + mi);
  }
  return arr;
}

function compareSort(a, b) {
  if (a.Cost < b.Cost) return -1;
  if (a.Cost > b.Cost) return 1;
  return 0;
}

function sum(A) {
  return A.reduce(function(total, num) {
    return total + num;
  });
}

function randn_bm() {
  var u = 0,
    v = 0;
  while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function maxNum(A, val) {
  var arr = [];
  for (var i = 0; i < A.length; i++) {
    if (val > A[i]) {
      arr.push(val);
    } else {
      arr.push(A[i]);
    }
  }
  return arr;
}

function minNum(A, val) {
  var arr = [];
  for (var i = 0; i < A.length; i++) {
    if (val < A[i]) {
      arr.push(val);
    } else {
      arr.push(A[i]);
    }
  }
  return arr;
}

function driver() {
  var nDecision = 5;
  var decisionSize = [1, nDecision];

  var min = -10;
  var max = 10;

  var iterations = 1000;
  var popSize = 50;

  var keepRate = 0.2;
  var keptHabitats = Math.round(keepRate * popSize);

  var newHabitats = popSize - keptHabitats;

  var mew = linspace(1, 0, popSize);
  var lambda = mew.map(function(a) {
    return 1 - a;
  });

  var alpha = 0.9;
  var pMutation = 0.1;

  var sigma = 0.02 * (max - min);

  //Creating empty habitats

  var habitat = new Object();
  habitat.Position = [];
  habitat.Cost = [];

  var populations = [];

  for (var i = 1; i <= popSize; i++) {
    populations.push(habitat);
  }

  //initialising empty habitats
  var newPop = [];
  for (var i = 0; i < populations.length; i++) {
    var posValue = unifrnd(min + 1, max - 1, nDecision);
    var pass = posValue.slice();
    var costValue = sphere(pass);
    newPop.push({ Position: posValue, Cost: costValue });
    //populations[i].Position = unifrnd(min + 1, max - 1, nDecision);
    //populations[i].Cost = sphere(populations[i].Position);
  }
  populations = newPop;

  populations = populations.sort(compareSort);

  var bestSol = populations[0];

  var bestCost = Array.apply(null, Array(iterations)).map(
    Number.prototype.valueOf,
    0
  );

  for (var it = 1; it <= iterations; it++) {
    var newPop = populations.slice();
    for (var i = 0; i < popSize; i++) {
      for (var k = 0; k < nDecision; k++) {
        if (Math.random() <= lambda[i]) {
          var Ep = mew.slice();
          Ep[i] = 0;
          Ep = Ep.map(function(a) {
            return a / sum(Ep);
          });
          var pass = Ep.slice();
          var j = rouletteWheelSelection(pass);
          newPop[i].Position[k] =
            populations[i].Position[k] +
            alpha * (populations[j].Position[k] - populations[i].Position[k]);
        }
        if (Math.random() <= pMutation)
          newPop[i].Position[k] = newPop[i].Position[k] + sigma * randn_bm();
      }
      var copy = newPop.slice();
      newPop[i].Position = maxNum(copy[i].Position, min);
      var copy1 = newPop.slice();
      newPop[i].Position = minNum(copy1[i].Position, max);
      var cpy = newPop.slice();
      newPop[i].Cost = sphere(cpy[i].Position);
    }
    newPop = newPop.sort(compareSort);

    // populations = Array.concat(
    //   populations.slice(0, keptHabitats),
    //   newPop.slice(0, newHabitats)
    // );
    var c1 = populations.slice();
    var c2 = newPop.slice();
    var c3 = c1.slice(0, keptHabitats).concat(c2.slice(0, newHabitats));
    populations = c3;
    // populations = populations
    //   .slice(0, keptHabitats)
    //   .concat(newPop.slice(0, newHabitats));
    populations = populations.sort(compareSort);
    bestSol = populations[0];
    bestCost[it - 1] = bestSol.Cost;
  }
  return bestCost;
}
