export default levels = [
  {
    "level": 1,
    "minutes": 0,
    "name": "Zen Rookie"
  },
  {
    "level": 2,
    "minutes": 60,
    "name": "Wise Owl"
  },
  {
    "level": 3,
    "minutes": 132,
    "name": "Focus Fox"
  },
  {
    "level": 4,
    "minutes": 216,
    "name": "Rafiki"
  },
  {
    "level": 5,
    "minutes": 312,
    "name": "Zen Apprentice"
  },
  {
    "level": 6,
    "minutes": 420,
    "name": "Tiger"
  },
  {
    "level": 7,
    "minutes": 540,
    "name": "Mr. Myogi"
  },
  {
    "level": 8,
    "minutes": 672,
    "name": "Monk"
  },
  {
    "level": 9,
    "minutes": 816,
    "name": "Wizard"
  },
  {
    "level": 10,
    "minutes": 972,
    "name": "Jedi"
  },
  {
    "level": 11,
    "minutes": 1140,
    "name": "Elon Musk"
  },
  {
    "level": 12,
    "minutes": 1320,
    "name": "Zen Master"
  },
  {
    "level": 13,
    "minutes": 1512,
    "name": "Professor X"
  },
  {
    "level": 14,
    "minutes": 1716,
    "name": "Einstein"
  },
  {
    "level": 15,
    "minutes": 1932,
    "name": "Yoda"
  },
  {
    "level": 16,
    "minutes": 2160,
    "name": "Buddha"
  },
  {
    "level": 17,
    "minutes": 2400,
    "name": "Black Hole"
  },
  {
    "level": 18,
    "minutes": 2652,
    "name": "Three Eyed Raven"
  },
  {
    "level": 19,
    "minutes": 2916,
    "name": "Eye of Providence"
  },
  {
    "level": 20,
    "minutes": 3192,
    "name": "Rick Sanchez"
  },
  {
    "level": 21,
    "minutes": 3480,
    "name": "The Universe"
  },
  {
    "level": 22,
    "minutes": 3780,
    "name": "The Multi-Verse"
  },
  {
    "level": 23,
    "minutes": 4200,
    "name": "You"
  }
]
/*
[
  '{{repeat(22)}}',
  {
    level: '{{index()+1}}',
    minutes: '{{Math.round(((index()*60) * (1+((index()-1)*0.1))))}}',
    name: function (tags, index) {
      var names = [
        'Zen Rookie',
        'Wise Owl',
        'Focus Fox',
        'Rafiki',
        'Zen Apprentice',
        'Tiger',
        'Mr. Myogi',
        'Monk',
        'Wizard',
        'Jedi',
        'Elon Musk',
        'Zen Master',
        'Professor X',
        'Einstein',
        'Yoda',
        'Buddha',
        'Black Hole', 
        'Three Eyed Raven',
        'Eye of Providence', 
        'Rick Sanchez',
        'The Universe',
        'The Multi-Verse',
        'You'
      ];
      return names[index];
    }
  }
]
https://www.json-generator.com/
*/