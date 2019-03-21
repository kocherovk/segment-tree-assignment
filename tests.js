let allElves = ['Амариэ', 'Амдир', 'Амрас', 'Амрод', 'Амрот', 'Анайрэ', 'Ангрод', 'Аргон', 'Аредэль', 'Арвен', 'Аэгнор', 'Белег', 'Воронвэ', 'Галадон', 'Галадриэль', 'Галатиль', 'Галдор из Гаваней', 'Галдор из Гондолина', 'Галион', 'Гвиндор', 'Гилдор Инглорион', 'Гил-Галад (Эрейнион)', 'Гимли', 'Глорфиндел', 'Даэрон', 'Дэнетор', 'Дуилин', 'Идриль', 'Имин', 'Иминиэ', 'Ингвион', 'Ингвэ', 'Инглор', 'Индис', 'Иримэ', 'Карантир', 'Квеннар и-Онотимо', 'Келеборн', 'Келебриан', 'Келебримбор', 'Келегорм', 'Кирдан', 'Куруфин', 'Леголас из Гондолина', 'Леголас из Лихолесья', 'Линдир', 'Лютиэн Тинувиэль', 'Маблунг', 'Маглор', 'Махтан', 'Маэглин', 'Маэдрос', 'Мириэль Сериндэ', 'Митреллас', 'Неллас', 'Нерданэль', 'Нимлот', 'Нимродэль', 'Ольвэ', 'Ородрет', 'Орофер', 'Орофин', 'Пенголод', 'Пенлод', 'Рог', 'Румил из Лориэна', 'Румил из Тириона', 'Салгант', 'Саэрос', 'Тата', 'Татиэ', 'Тингол', 'Трандуил', 'Тургон', 'Феанор', 'Финарфин', 'Финвэ', 'Финдис', 'Финдуилас', 'Финголфин', 'Фингон', 'Финрод Фелагунд', 'Халдир', 'Эарвен', 'Эгалмот', 'Эктелион', 'Элеммакил', 'Эленвэ', 'Элу Тингол (Эльвэ)', 'Эльмо', 'Энелиэ', 'Энель', 'Энердил', 'Элладан и Элрохир', 'Элронд', 'Эльдалотэ', 'Эол', 'Эрестор'];
let allGems = ['Алмаз', 'Хризолит', 'Эвклаз', 'Корунд', 'Рубин', 'Сапфир', 'Тааффеит', 'Берилл', 'Аквамарин', 'Изумруд', 'Гелиодор', 'Морганит', 'Хризоберилл', 'Александрит', 'Шпинель', 'Гранаты', 'Демантоид', 'Цаворит', 'Спессартин', 'Пироп', 'Родолит', 'Альмандин', 'Кварц', 'Аметист', 'Цитрин', 'Горный хрусталь', 'Дымчатый кварц', 'Празиолит', 'Аметрин', 'Розовый кварц', 'Турмалин', 'Верделит', 'Индиголит', 'Параиба', 'Опал благородный', 'Опал огненный', 'Топаз', 'Танзанит', 'Циркон', 'Гиацинт', 'Андалузит'];

function randomState(elves, gems, weeks, maxGems) {
  let worldState = newState(elves, gems);
  for (let week = 0; week < weeks; week++) {
    let stash = getRandomGems(gems, maxGems);
    let assignment = assignGemsRandom(elves, stash);
    worldState = nextState(worldState, assignment, elves, gems);
  }

  return worldState;
}

function getRandomElfWishes(elves, gems) {
  return elves.map(elf => {
    let elfWishes = gems.map(_ => Math.random());
    let sum = elfWishes.reduce((a, b) => a + b, 0);
    return elfWishes.map(wish => wish / sum);
  });
}

function getRandomGems(gems, count) {
  let stash = {};

  for (let i = 0; i < count; i++) {
    let gem = gems[random(gems.length - 1)];
    stash[gem] = stash[gem] || 0;
    stash[gem]++;
  }

  return stash;
}

function getRandomStashes(gems, count, maxGems) {
  let stash = [];

  for (let i = 0; i < count; i++) {
    stash.push(getRandomGems(gems, maxGems));
  }

  return stash;
}

function assignGemsRandom(elves, gems) {
  let assignment = {};

  for (gem in gems) {
    let randomElf = elves[random(elves.length - 1)];
    assignment[randomElf] = assignment[randomElf] || {};
    assignment[randomElf][gem] = gems[gem];
  }

  return assignment;
}

function newState(elves, gems) {
  return elves.map(elf => gems.map(gem => []));
}

function countElvesWithGems(elves, assignment) {
  return elves.reduce((carry, elf) => {
    if (elf in assignment && Object.values(assignment[elf]).reduce(sum, 0) > 0)
      return carry + 1;
    return carry;
  }, 0);
}

function runExperiment(elves, gems, wishes, stashes, assignmentFn) {
  let weeks = 0;
  let state = newState(elves, gems);
  let tree = getElfTree(state)

  stashes.forEach(stash => {
    tree = getElfTree(state);

    let assignment = assignmentFn(tree, wishes, stash, elves, gems, weeks);
    state = nextState(state, assignment, elves, gems);
    weeks++;
  });

  return state;
}

describe("Функция segmentTree", function () {
  it("должна построить дерево отрезков", function () {
    let array = [1, 2, 3];
    expect(segmentTree(array, sum, 0)).toBeTruthy();
  });

  it("Дерево отрезков по сумме должно возвращать правильные значения", function () {
    let array = [1, 2, 3];
    let tree = segmentTree(array, sum, 0);

    expect(tree(0, 1)).toBe(1);
    expect(tree(1, 2)).toBe(2);
    expect(tree(2, 3)).toBe(3);

    expect(tree(0, 3)).toBe(6);
    expect(tree(1, 3)).toBe(5);
  });

  it("Дерево отрезков по произведению должно возвращать правильные значения", function () {
    let array = [4, 3, 0];
    let tree = segmentTree(array, mul, 1);

    expect(tree(0, 1)).toBe(4);
    expect(tree(1, 2)).toBe(3);
    expect(tree(2, 3)).toBe(0);

    expect(tree(0, 3)).toBe(0);
    expect(tree(0, 2)).toBe(12);
  });

  it("Дерево отрезков по конкатинации должно возвращать правильные значения", function () {
    let array = ["x", "y", "z"];
    let tree = segmentTree(array, sum, "");

    expect(tree(0, 1)).toBe("x");
    expect(tree(1, 2)).toBe("y");
    expect(tree(2, 3)).toBe("z");

    expect(tree(0, 3)).toBe("xyz");
    expect(tree(0, 2)).toBe("xy");
  });

  it("Дерево отрезков по пустому массиву", function () {
    let array = [];
    expect(segmentTree(array, sum, 0)).toBeTruthy();
  });

  it("Запрос на элементы вне границ массива должен бросать ошибку", function () {
    let tree = segmentTree([0, 1, 2, 3, 4], sum, 0);
    expect(function () { tree(0, 10) }).toThrowError(Error);
    expect(function () { tree(-10, 2) }).toThrowError(Error);
  });

  it("Запрос где правый индекс меньше левого должен бросать ошибку", function () {
    let tree = segmentTree([0, 1, 2, 3, 4], sum, 0);
    expect(function () { tree(4, 2) }).toThrowError(Error);
  });

  it("Запрос где правый индекс совпадает с левым должен возвращать нейтральный элемент", function () {
    segmentTree([0, 1, 2, 3, 4], sum, 0)(0, 0);
    expect(segmentTree([0, 1, 2, 3, 4], sum, 0)(0, 0)).toBe(0);
    expect(segmentTree([0, 1, 2, 3, 4], sum, "s")(3, 3)).toBe("s");
  });
});


describe("Функция recursiveSegmentTree", function () {
  it("должна построить одномерное дерево отрезков", function () {
    let array = [1, 2, 3];
    let tree = recursiveSegmentTree(array, sum, 0);
    expect(tree).toBeTruthy();

    expect(tree(0, 1)).toBe(1);
    expect(tree(1, 2)).toBe(2);
    expect(tree(2, 3)).toBe(3);

    expect(tree(0, 3)).toBe(6);
    expect(tree(1, 3)).toBe(5);
  });

  it("должна построить двумерное дерево отрезков", function () {
    let array = [
      [1, 0, 1, 1],
      [0, 1, 0, 0],
      [0, 0, 0, 1],
      [1, 1, 1, 1]
    ];

    let tree = recursiveSegmentTree(array, sum, 0);

    expect(tree(0, 1)(0, 1)).toBe(1);
    expect(tree(0, 1)(1, 2)).toBe(0);
    expect(tree(3, 4)(3, 4)).toBe(1);
    expect(tree(2, 3)(2, 3)).toBe(0);

    expect(tree(0, 4)(0, 1)).toBe(2);
    expect(tree(0, 4)(3, 4)).toBe(3);
    expect(tree(1, 2)(0, 4)).toBe(1);
    expect(tree(3, 4)(0, 4)).toBe(4);

    expect(tree(0, 4)(0, 4)).toBe(9);
  });

  it("должна построить трехмерное дерево отрезков", function () {
    let array = [
      [[0, 1], [0, 0], [1, 1], [0, 0]],
      [[0, 0], [1, 0], [1, 0], [0, 1]],
      [[0, 0], [1, 0], [0, 1], [1, 0]],
      [[1, 0], [0, 0], [0, 0], [0, 0]],
    ];

    let tree = recursiveSegmentTree(array, sum, 0);

    expect(tree(0, 1)(0, 1)(0, 1)).toBe(0);
    expect(tree(3, 4)(0, 1)(0, 1)).toBe(1);
    expect(tree(1, 2)(3, 4)(1, 2)).toBe(1);

    expect(tree(2, 3)(0, 4)(0, 2)).toBe(3);
    expect(tree(2, 3)(1, 4)(0, 2)).toBe(3);
    expect(tree(0, 4)(2, 3)(0, 2)).toBe(4);

    expect(tree(0, 4)(0, 4)(0, 2)).toBe(10);
  });
});

describe("Функция getElfTree" , function () {
  it("должна вернуть что-то вменяемое", function () {
    let state = randomState(allElves.slice(0, 10), allGems.slice(10), 20, 20);
    expect(getElfTree(state)).toBeTruthy();
  });
});

describe("Функция assignEqually" , function () {
  it("должна должна равномерно распределить драгоценности эльфам когда ни у одного эльфа их нет", function () {
    let elves = allElves.slice(0, 3);
    let gems = allGems.slice(0, 3);

    let state = [
      [[0], [0], [0]],
      [[0], [0], [0]],
      [[0], [0], [0]]
    ];

    let stash = getRandomGems(gems, 9);
    let tree = getElfTree(state);
    let wishes = getRandomElfWishes(elves, gems);
    let assignment = assignEqually(tree, wishes, stash, elves, gems, 0);

    expect(Object.values(assignment[elves[0]]).reduce(sum, 0)).toBe(3);
    expect(Object.values(assignment[elves[1]]).reduce(sum, 0)).toBe(3);
    expect(Object.values(assignment[elves[2]]).reduce(sum, 0)).toBe(3);
  });

  it("должна равномерно распределить драгоценности трем эльфам", function () {
    let elves = allElves.slice(0, 3);
    let gems = allGems.slice(0, 3);

    let state = [
      [[0, 0], [0, 1], [2, 0]],
      [[0, 1], [0, 0], [0, 0]],
      [[1, 0], [0, 0], [1, 0]]
    ];

    let stash = getRandomGems(gems, 3);
    let tree = getElfTree(state);
    let wishes = getRandomElfWishes(elves, gems);
    let assignment = assignEqually(tree, wishes, stash, elves, gems, 2);

    expect(Object.values(assignment[elves[1]]).reduce(sum, 0)).toBe(2);
    expect(Object.values(assignment[elves[2]]).reduce(sum, 0)).toBe(1);
  });

  it("должна равномерно распределить драгоценности двум эльфам", function () {
    let elves = allElves.slice(0, 2);
    let gems = allGems.slice(0, 1);

    let state = [
      [[1, 1, 1, 1, 1, 1]],
      [[0, 0, 0, 0, 0, 0]],
    ];

    let stash = getRandomGems(gems, 20);
    let tree = getElfTree(state);
    let wishes = getRandomElfWishes(elves, gems);
    let assignment = assignEqually(tree, wishes, stash, elves, gems, 6);

    expect(Object.values(assignment[elves[0]]).reduce(sum, 0)).toBe(7);
    expect(Object.values(assignment[elves[1]]).reduce(sum, 0)).toBe(13);
  });
});

describe("Функция assignAtLeastOne" , function () {
  it("должна распределить каждому эльфу хотябы по одной драгоценности, если их хватает", function () {
    let elves = allElves.slice(0, 3);
    let gems = allGems.slice(0, 3);

    let state = newState(elves, gems);
    let tree = getElfTree(state);
    let wishes = getRandomElfWishes(elves, gems);

    let assignment = assignAtLeastOne(tree, wishes, getRandomGems(gems, 3), elves, gems, 0);
    expect(countElvesWithGems(elves, assignment)).toBe(3);

    assignment = assignAtLeastOne(tree, wishes, getRandomGems(gems, 10), elves, gems, 0);
    expect(countElvesWithGems(elves, assignment)).toBe(3);
  });

  it("должна распределить по одной драгоценности кому может, если их не хватает", function () {
    let elves = allElves.slice(0, 20);
    let gems = allGems.slice(0, 3);

    let state = newState(elves, gems);
    let tree = getElfTree(state);
    let wishes = getRandomElfWishes(elves, gems);

    let assignment = assignAtLeastOne(tree, wishes, getRandomGems(gems, 17), elves, gems, 0);
    expect(countElvesWithGems(elves, assignment)).toBe(17);

    assignment = assignAtLeastOne(tree, wishes, getRandomGems(gems, 4), elves, gems, 0);
    expect(countElvesWithGems(elves, assignment)).toBe(4);

    assignment = assignAtLeastOne(tree, wishes, getRandomGems(gems, 0), elves, gems, 0);
    expect(countElvesWithGems(elves, assignment)).toBe(0);
  });
});

describe("Функция assignPreferredGems" , function () {
  it("должна распределить драгоценности эльфам, котороым они больше всех нравятся", function () {
    let elves = allElves.slice(0, 4);
    let gems = allGems.slice(0, 4);

    let state = newState(elves, gems);
    let tree = getElfTree(state);

    let wishes = [
      [0,  1,  0,   0],
      [0, .5, .5,   0],
      [1,  0,  0,   0],
      [0,  0,  .7, .3],
    ];

    let stash = {};
    stash[gems[0]] = 1;
    stash[gems[1]] = 2;
    stash[gems[2]] = 3;
    stash[gems[3]] = 4;

    let assignment = assignPreferredGems(tree, wishes, stash, elves, gems, 0);
    expect(assignment[elves[0]][gems[1]]).toBe(2);
    expect(assignment[elves[2]][gems[0]]).toBe(1);
    expect(assignment[elves[3]][gems[2]]).toBe(3);
    expect(assignment[elves[3]][gems[3]]).toBe(4);
  });
});

describe("Функция nextState" , function () {
  it("должна добавлять одну неделю к мировому состоянию", function () {
    let elves = allElves.slice(0, 5);
    let gems = allGems.slice(0, 5);
    let state = newState(elves, gems);

    nextState(state, assignGemsRandom(elves, getRandomGems(gems, 20)), elves, gems);
    expect(state[0][0].length).toBe(1);

    nextState(state, assignGemsRandom(elves, getRandomGems(gems, 20)), elves, gems);
    expect(state[1][1].length).toBe(2);

    nextState(state, assignGemsRandom(elves, getRandomGems(gems, 20)), elves, gems);
    expect(state[2][3].length).toBe(3);
  });
});

describe("Тестируем распределение много недель" , function () {
  it("с функцией assignEqually", function () {
    let elves = allElves.slice(0, 30);
    let gems = allGems.slice(0, 20);
    let wishes = getRandomElfWishes(elves, gems);
    let stashes = getRandomStashes(gems, 100, 15);
    let state = runExperiment(elves, gems, wishes, stashes, assignEqually);
    let elvesGems = state.map(elfGems => elfGems.reduce((carry, week) => carry + week.reduce(sum, 0), 0));

    elvesGems.forEach((gemsCount) => {
      expect(gemsCount).toBe(50);
    });
  });

  it("с функцией assignAtLeastOne", function () {
    let elves = allElves.slice(0, 30);
    let gems = allGems.slice(0, 20);
    let wishes = getRandomElfWishes(elves, gems);
    let stashes = getRandomStashes(gems, 20, 40);
    let state = runExperiment(elves, gems, wishes, stashes, assignAtLeastOne);

    for (let week = 0; week < 20; week++) {
      for (let elf = 0; elf < elves.length; elf++) {
        let gemsCountThisWeek = 0;

        for (let gem = 0; gem < gems.length; gem++) {
          gemsCountThisWeek += state[elf][gem][week];
        }

        expect(gemsCountThisWeek).toBeGreaterThan(0);
      }
    }
  });

  it("с функцией assignPreferredGems", function () {
    let elves = allElves.slice(0, 5);
    let gems = allGems.slice(0, 3);

    let wishes = [
      [.9, .1,  0],
      [.4, .1, .5],
      [.4, .1, .2],
      [.8, .1, .1],
      [.1, .5, .4],
    ];

    let stash = {};
    stash[gems[0]] = 1;
    stash[gems[1]] = 2;
    stash[gems[2]] = 3;

    let stashes = [];
    for (let i = 0; i < 30; i++) {
      stashes.push(stash);
    }

    let state = runExperiment(elves, gems, wishes, stashes, assignPreferredGems);
    let elvesGems = state.map(elfGems => elfGems.reduce((carry, week) => carry + week.reduce(sum, 0), 0));

    expect(elvesGems[0]).toBe(30);
    expect(elvesGems[1]).toBe(90);
    expect(elvesGems[2]).toBe(0);
    expect(elvesGems[3]).toBe(0);
    expect(elvesGems[4]).toBe(60);
  });
});
