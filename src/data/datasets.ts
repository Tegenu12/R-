export interface Dataset {
  id: string;
  name: string;
  source: string;
  description: string;
  columns: string[];
  columnTypes: Record<string, 'numeric' | 'categorical'>;
  data: Record<string, string | number>[];
}

export const DATASETS: Record<string, Dataset> = {
  stat_score: {
    id: 'stat_score',
    name: 'Stat Score (Study & Exam)',
    source: 'Stat Sore excell data.xlsx (Uploaded Study)',
    description: 'Actual researcher survey data measuring studying hours, exam performance, gender (0=Female, 1=Male), and student age.',
    columns: ['Studyingtime', 'Examscore', 'Gender', 'Age'],
    columnTypes: {
      Studyingtime: 'numeric',
      Examscore: 'numeric',
      Gender: 'categorical',
      Age: 'numeric'
    },
    data: [
      { Studyingtime: 65, Examscore: 8, Gender: 'Female (0)', Age: 19 },
      { Studyingtime: 44, Examscore: 5, Gender: 'Female (0)', Age: 18 },
      { Studyingtime: 79, Examscore: 11, Gender: 'Male (1)', Age: 22 },
      { Studyingtime: 72, Examscore: 13, Gender: 'Male (1)', Age: 24 },
      { Studyingtime: 70, Examscore: 10, Gender: 'Female (0)', Age: 21 },
      { Studyingtime: 54, Examscore: 6, Gender: 'Female (0)', Age: 20 },
      { Studyingtime: 90, Examscore: 18, Gender: 'Male (1)', Age: 22 },
      { Studyingtime: 85, Examscore: 58, Gender: 'Male (1)', Age: 19 },
      { Studyingtime: 33, Examscore: 12, Gender: 'Male (1)', Age: 24 },
      { Studyingtime: 56, Examscore: 9, Gender: 'Male (1)', Age: 25 },
    ]
  },

  mtcars: {
    id: 'mtcars',
    name: 'mtcars (Motor Trend Cars)',
    source: 'R datasets package',
    description: 'Classic 1974 Motor Trend US magazine fuel consumption and 10 automobile design aspects for 32 automobiles.',
    columns: ['mpg', 'cyl', 'disp', 'hp', 'drat', 'wt', 'qsec', 'vs', 'am', 'gear', 'carb'],
    columnTypes: {
      mpg: 'numeric',
      cyl: 'categorical',
      disp: 'numeric',
      hp: 'numeric',
      drat: 'numeric',
      wt: 'numeric',
      qsec: 'numeric',
      vs: 'categorical',
      am: 'categorical',
      gear: 'categorical',
      carb: 'numeric'
    },
    data: [
      { car: 'Mazda RX4', mpg: 21.0, cyl: 6, disp: 160.0, hp: 110, drat: 3.90, wt: 2.620, qsec: 16.46, vs: 'V-shaped', am: 'Manual', gear: 4, carb: 4 },
      { car: 'Mazda RX4 Wag', mpg: 21.0, cyl: 6, disp: 160.0, hp: 110, drat: 3.90, wt: 2.875, qsec: 17.02, vs: 'V-shaped', am: 'Manual', gear: 4, carb: 4 },
      { car: 'Datsun 710', mpg: 22.8, cyl: 4, disp: 108.0, hp: 93, drat: 3.85, wt: 2.320, qsec: 18.61, vs: 'Straight', am: 'Manual', gear: 4, carb: 1 },
      { car: 'Hornet 4 Drive', mpg: 21.4, cyl: 6, disp: 258.0, hp: 110, drat: 3.08, wt: 3.215, qsec: 19.44, vs: 'Straight', am: 'Automatic', gear: 3, carb: 1 },
      { car: 'Hornet Sportabout', mpg: 18.7, cyl: 8, disp: 360.0, hp: 175, drat: 3.15, wt: 3.440, qsec: 17.02, vs: 'V-shaped', am: 'Automatic', gear: 3, carb: 2 },
      { car: 'Valiant', mpg: 18.1, cyl: 6, disp: 225.0, hp: 105, drat: 2.76, wt: 3.460, qsec: 20.22, vs: 'Straight', am: 'Automatic', gear: 3, carb: 1 },
      { car: 'Duster 360', mpg: 14.3, cyl: 8, disp: 360.0, hp: 245, drat: 3.21, wt: 3.570, qsec: 15.84, vs: 'V-shaped', am: 'Automatic', gear: 3, carb: 4 },
      { car: 'Merc 240D', mpg: 24.4, cyl: 4, disp: 146.7, hp: 62, drat: 3.69, wt: 3.190, qsec: 20.00, vs: 'Straight', am: 'Automatic', gear: 4, carb: 2 },
      { car: 'Merc 230', mpg: 22.8, cyl: 4, disp: 140.8, hp: 95, drat: 3.92, wt: 3.150, qsec: 22.90, vs: 'Straight', am: 'Automatic', gear: 4, carb: 2 },
      { car: 'Merc 280', mpg: 19.2, cyl: 6, disp: 167.6, hp: 123, drat: 3.92, wt: 3.440, qsec: 18.30, vs: 'Straight', am: 'Automatic', gear: 4, carb: 4 },
      { car: 'Merc 280C', mpg: 17.8, cyl: 6, disp: 167.6, hp: 123, drat: 3.92, wt: 3.440, qsec: 18.90, vs: 'Straight', am: 'Automatic', gear: 4, carb: 4 },
      { car: 'Merc 450SE', mpg: 16.4, cyl: 8, disp: 275.8, hp: 180, drat: 3.07, wt: 4.070, qsec: 17.40, vs: 'V-shaped', am: 'Automatic', gear: 3, carb: 3 },
      { car: 'Merc 450SL', mpg: 17.3, cyl: 8, disp: 275.8, hp: 180, drat: 3.07, wt: 3.730, qsec: 17.60, vs: 'V-shaped', am: 'Automatic', gear: 3, carb: 3 },
      { car: 'Merc 450SLC', mpg: 15.2, cyl: 8, disp: 275.8, hp: 180, drat: 3.07, wt: 3.780, qsec: 18.00, vs: 'V-shaped', am: 'Automatic', gear: 3, carb: 3 },
      { car: 'Cadillac Fleetwood', mpg: 10.4, cyl: 8, disp: 472.0, hp: 205, drat: 2.93, wt: 5.250, qsec: 17.98, vs: 'V-shaped', am: 'Automatic', gear: 3, carb: 4 },
      { car: 'Lincoln Continental', mpg: 10.4, cyl: 8, disp: 460.0, hp: 215, drat: 3.00, wt: 5.424, qsec: 17.82, vs: 'V-shaped', am: 'Automatic', gear: 3, carb: 4 },
      { car: 'Chrysler Imperial', mpg: 14.7, cyl: 8, disp: 440.0, hp: 230, drat: 3.23, wt: 5.345, qsec: 17.42, vs: 'V-shaped', am: 'Automatic', gear: 3, carb: 4 },
      { car: 'Fiat 128', mpg: 32.4, cyl: 4, disp: 78.7, hp: 66, drat: 4.08, wt: 2.200, qsec: 19.47, vs: 'Straight', am: 'Manual', gear: 4, carb: 1 },
      { car: 'Honda Civic', mpg: 30.4, cyl: 4, disp: 75.7, hp: 52, drat: 4.93, wt: 1.615, qsec: 18.52, vs: 'Straight', am: 'Manual', gear: 4, carb: 2 },
      { car: 'Toyota Corolla', mpg: 33.9, cyl: 4, disp: 71.1, hp: 65, drat: 4.22, wt: 1.835, qsec: 19.90, vs: 'Straight', am: 'Manual', gear: 4, carb: 1 },
      { car: 'Toyota Corona', mpg: 21.5, cyl: 4, disp: 120.1, hp: 97, drat: 3.70, wt: 2.465, qsec: 20.01, vs: 'Straight', am: 'Automatic', gear: 3, carb: 1 },
      { car: 'Dodge Challenger', mpg: 15.5, cyl: 8, disp: 318.0, hp: 150, drat: 2.76, wt: 3.520, qsec: 16.87, vs: 'V-shaped', am: 'Automatic', gear: 3, carb: 2 },
      { car: 'AMC Javelin', mpg: 15.2, cyl: 8, disp: 304.0, hp: 150, drat: 3.15, wt: 3.435, qsec: 17.30, vs: 'V-shaped', am: 'Automatic', gear: 3, carb: 2 },
      { car: 'Camaro Z28', mpg: 13.3, cyl: 8, disp: 350.0, hp: 245, drat: 3.73, wt: 3.840, qsec: 15.41, vs: 'V-shaped', am: 'Automatic', gear: 3, carb: 4 },
      { car: 'Pontiac Firebird', mpg: 19.2, cyl: 8, disp: 400.0, hp: 175, drat: 3.08, wt: 3.845, qsec: 17.05, vs: 'V-shaped', am: 'Automatic', gear: 3, carb: 2 },
      { car: 'Fiat X1-9', mpg: 27.3, cyl: 4, disp: 79.0, hp: 66, drat: 4.08, wt: 1.935, qsec: 18.90, vs: 'Straight', am: 'Manual', gear: 4, carb: 1 },
      { car: 'Porsche 914-2', mpg: 26.0, cyl: 4, disp: 120.3, hp: 91, drat: 4.43, wt: 2.140, qsec: 16.70, vs: 'V-shaped', am: 'Manual', gear: 5, carb: 2 },
      { car: 'Lotus Europa', mpg: 30.4, cyl: 4, disp: 95.1, hp: 113, drat: 3.77, wt: 1.513, qsec: 16.90, vs: 'Straight', am: 'Manual', gear: 5, carb: 2 },
      { car: 'Ford Pantera L', mpg: 15.8, cyl: 8, disp: 351.0, hp: 264, drat: 4.22, wt: 3.170, qsec: 14.50, vs: 'V-shaped', am: 'Manual', gear: 5, carb: 4 },
      { car: 'Ferrari Dino', mpg: 19.7, cyl: 6, disp: 145.0, hp: 175, drat: 3.62, wt: 2.770, qsec: 15.50, vs: 'V-shaped', am: 'Manual', gear: 5, carb: 6 },
      { car: 'Maserati Bora', mpg: 15.0, cyl: 8, disp: 301.0, hp: 335, drat: 3.54, wt: 3.570, qsec: 14.60, vs: 'V-shaped', am: 'Manual', gear: 5, carb: 8 },
      { car: 'Volvo 142E', mpg: 21.4, cyl: 4, disp: 121.0, hp: 109, drat: 4.11, wt: 2.780, qsec: 18.60, vs: 'Straight', am: 'Manual', gear: 4, carb: 2 },
    ]
  },

  cars: {
    id: 'cars',
    name: 'cars (Speed and Stopping Distances)',
    source: 'R datasets (Ezekiel 1930)',
    description: 'Speed of cars and the distances taken to stop recorded in the 1920s.',
    columns: ['speed', 'dist'],
    columnTypes: { speed: 'numeric', dist: 'numeric' },
    data: [
      { speed: 4, dist: 2 }, { speed: 4, dist: 10 }, { speed: 7, dist: 4 }, { speed: 7, dist: 22 },
      { speed: 8, dist: 16 }, { speed: 9, dist: 10 }, { speed: 10, dist: 18 }, { speed: 10, dist: 26 },
      { speed: 10, dist: 34 }, { speed: 11, dist: 17 }, { speed: 11, dist: 28 }, { speed: 12, dist: 14 },
      { speed: 12, dist: 20 }, { speed: 12, dist: 24 }, { speed: 12, dist: 28 }, { speed: 13, dist: 26 },
      { speed: 13, dist: 34 }, { speed: 13, dist: 34 }, { speed: 13, dist: 46 }, { speed: 14, dist: 26 },
      { speed: 14, dist: 36 }, { speed: 14, dist: 60 }, { speed: 14, dist: 80 }, { speed: 15, dist: 20 },
      { speed: 15, dist: 26 }, { speed: 15, dist: 54 }, { speed: 16, dist: 32 }, { speed: 16, dist: 40 },
      { speed: 17, dist: 32 }, { speed: 17, dist: 40 }, { speed: 17, dist: 50 }, { speed: 18, dist: 42 },
      { speed: 18, dist: 56 }, { speed: 18, dist: 76 }, { speed: 18, dist: 84 }, { speed: 19, dist: 36 },
      { speed: 19, dist: 46 }, { speed: 19, dist: 68 }, { speed: 20, dist: 32 }, { speed: 20, dist: 48 },
      { speed: 20, dist: 52 }, { speed: 20, dist: 56 }, { speed: 20, dist: 64 }, { speed: 22, dist: 66 },
      { speed: 23, dist: 54 }, { speed: 24, dist: 70 }, { speed: 24, dist: 92 }, { speed: 24, dist: 93 },
      { speed: 24, dist: 120 }, { speed: 25, dist: 85 }
    ]
  },

  iris: {
    id: 'iris',
    name: 'iris (Fisher’s Iris Flower Dataset)',
    source: 'R datasets (Fisher 1936)',
    description: 'Measurements in centimeters of sepal length/width and petal length/width for 50 flowers from each of 3 species of iris.',
    columns: ['Sepal.Length', 'Sepal.Width', 'Petal.Length', 'Petal.Width', 'Species'],
    columnTypes: {
      'Sepal.Length': 'numeric',
      'Sepal.Width': 'numeric',
      'Petal.Length': 'numeric',
      'Petal.Width': 'numeric',
      'Species': 'categorical'
    },
    data: [
      { 'Sepal.Length': 5.1, 'Sepal.Width': 3.5, 'Petal.Length': 1.4, 'Petal.Width': 0.2, Species: 'setosa' },
      { 'Sepal.Length': 4.9, 'Sepal.Width': 3.0, 'Petal.Length': 1.4, 'Petal.Width': 0.2, Species: 'setosa' },
      { 'Sepal.Length': 4.7, 'Sepal.Width': 3.2, 'Petal.Length': 1.3, 'Petal.Width': 0.2, Species: 'setosa' },
      { 'Sepal.Length': 4.6, 'Sepal.Width': 3.1, 'Petal.Length': 1.5, 'Petal.Width': 0.2, Species: 'setosa' },
      { 'Sepal.Length': 5.0, 'Sepal.Width': 3.6, 'Petal.Length': 1.4, 'Petal.Width': 0.2, Species: 'setosa' },
      { 'Sepal.Length': 5.4, 'Sepal.Width': 3.9, 'Petal.Length': 1.7, 'Petal.Width': 0.4, Species: 'setosa' },
      { 'Sepal.Length': 7.0, 'Sepal.Width': 3.2, 'Petal.Length': 4.7, 'Petal.Width': 1.4, Species: 'versicolor' },
      { 'Sepal.Length': 6.4, 'Sepal.Width': 3.2, 'Petal.Length': 4.5, 'Petal.Width': 1.5, Species: 'versicolor' },
      { 'Sepal.Length': 6.9, 'Sepal.Width': 3.1, 'Petal.Length': 4.9, 'Petal.Width': 1.5, Species: 'versicolor' },
      { 'Sepal.Length': 5.5, 'Sepal.Width': 2.3, 'Petal.Length': 4.0, 'Petal.Width': 1.3, Species: 'versicolor' },
      { 'Sepal.Length': 6.5, 'Sepal.Width': 2.8, 'Petal.Length': 4.6, 'Petal.Width': 1.5, Species: 'versicolor' },
      { 'Sepal.Length': 5.7, 'Sepal.Width': 2.8, 'Petal.Length': 4.5, 'Petal.Width': 1.3, Species: 'versicolor' },
      { 'Sepal.Length': 6.3, 'Sepal.Width': 3.3, 'Petal.Length': 6.0, 'Petal.Width': 2.5, Species: 'virginica' },
      { 'Sepal.Length': 5.8, 'Sepal.Width': 2.7, 'Petal.Length': 5.1, 'Petal.Width': 1.9, Species: 'virginica' },
      { 'Sepal.Length': 7.1, 'Sepal.Width': 3.0, 'Petal.Length': 5.9, 'Petal.Width': 2.1, Species: 'virginica' },
      { 'Sepal.Length': 6.3, 'Sepal.Width': 2.9, 'Petal.Length': 5.6, 'Petal.Width': 1.8, Species: 'virginica' },
      { 'Sepal.Length': 6.5, 'Sepal.Width': 3.0, 'Petal.Length': 5.8, 'Petal.Width': 2.2, Species: 'virginica' },
      { 'Sepal.Length': 7.6, 'Sepal.Width': 3.0, 'Petal.Length': 6.6, 'Petal.Width': 2.1, Species: 'virginica' }
    ]
  },

  InsectSprays: {
    id: 'InsectSprays',
    name: 'InsectSprays (Agricultural Spray ANOVA)',
    source: 'R datasets (Beall 1942)',
    description: 'Counts of insects in agricultural experimental units treated with different insecticides (Sprays A, B, C, D, E, F).',
    columns: ['count', 'spray'],
    columnTypes: { count: 'numeric', spray: 'categorical' },
    data: [
      { count: 10, spray: 'A' }, { count: 7, spray: 'A' }, { count: 20, spray: 'A' }, { count: 14, spray: 'A' }, { count: 14, spray: 'A' }, { count: 12, spray: 'A' },
      { count: 11, spray: 'B' }, { count: 17, spray: 'B' }, { count: 21, spray: 'B' }, { count: 11, spray: 'B' }, { count: 16, spray: 'B' }, { count: 14, spray: 'B' },
      { count: 0, spray: 'C' }, { count: 1, spray: 'C' }, { count: 7, spray: 'C' }, { count: 2, spray: 'C' }, { count: 3, spray: 'C' }, { count: 1, spray: 'C' },
      { count: 3, spray: 'D' }, { count: 5, spray: 'D' }, { count: 12, spray: 'D' }, { count: 6, spray: 'D' }, { count: 4, spray: 'D' }, { count: 3, spray: 'D' },
      { count: 3, spray: 'E' }, { count: 5, spray: 'E' }, { count: 3, spray: 'E' }, { count: 5, spray: 'E' }, { count: 3, spray: 'E' }, { count: 6, spray: 'E' },
      { count: 11, spray: 'F' }, { count: 9, spray: 'F' }, { count: 15, spray: 'F' }, { count: 22, spray: 'F' }, { count: 15, spray: 'F' }, { count: 16, spray: 'F' },
    ]
  },

  anorexia: {
    id: 'anorexia',
    name: 'anorexia (Paired Treatment Weights)',
    source: 'MASS package (Hand et al. 1993)',
    description: 'Weights of young female anorexia patients before and after family therapy or cognitive behavioral therapy.',
    columns: ['Prewt', 'Postwt', 'Treat'],
    columnTypes: { Prewt: 'numeric', Postwt: 'numeric', Treat: 'categorical' },
    data: [
      { Prewt: 80.7, Postwt: 80.2, Treat: 'Cont' },
      { Prewt: 89.4, Postwt: 80.1, Treat: 'Cont' },
      { Prewt: 91.8, Postwt: 86.4, Treat: 'Cont' },
      { Prewt: 74.0, Postwt: 86.3, Treat: 'CBT' },
      { Prewt: 77.1, Postwt: 76.0, Treat: 'CBT' },
      { Prewt: 73.8, Postwt: 74.1, Treat: 'CBT' },
      { Prewt: 78.2, Postwt: 85.5, Treat: 'CBT' },
      { Prewt: 83.8, Postwt: 95.2, Treat: 'FT' },
      { Prewt: 83.3, Postwt: 94.3, Treat: 'FT' },
      { Prewt: 86.0, Postwt: 91.5, Treat: 'FT' },
      { Prewt: 82.5, Postwt: 91.9, Treat: 'FT' },
      { Prewt: 86.7, Postwt: 100.3, Treat: 'FT' },
    ]
  },

  StudentSurvey: {
    id: 'StudentSurvey',
    name: 'StudentSurvey (Lock5Data)',
    source: 'Lock5Data R package',
    description: 'Data from a survey of 362 students including study hours, GPA, pulse, smoking, and desired award.',
    columns: ['Exercise', 'TV', 'Height', 'Weight', 'GPA', 'Pulse', 'Smoke', 'Sex', 'Award'],
    columnTypes: {
      Exercise: 'numeric',
      TV: 'numeric',
      Height: 'numeric',
      Weight: 'numeric',
      GPA: 'numeric',
      Pulse: 'numeric',
      Smoke: 'categorical',
      Sex: 'categorical',
      Award: 'categorical'
    },
    data: [
      { Exercise: 10, TV: 1, Height: 64, Weight: 120, GPA: 3.40, Pulse: 68, Smoke: 'No', Sex: 'F', Award: 'Nobel' },
      { Exercise: 4, TV: 5, Height: 69, Weight: 160, GPA: 3.10, Pulse: 72, Smoke: 'No', Sex: 'M', Award: 'Olympic' },
      { Exercise: 14, TV: 1, Height: 66, Weight: 135, GPA: 3.65, Pulse: 60, Smoke: 'No', Sex: 'F', Award: 'Academy' },
      { Exercise: 3, TV: 10, Height: 71, Weight: 180, GPA: 2.80, Pulse: 80, Smoke: 'Yes', Sex: 'M', Award: 'Olympic' },
      { Exercise: 8, TV: 3, Height: 68, Weight: 150, GPA: 3.52, Pulse: 64, Smoke: 'No', Sex: 'M', Award: 'Nobel' },
      { Exercise: 5, TV: 4, Height: 62, Weight: 110, GPA: 3.75, Pulse: 76, Smoke: 'No', Sex: 'F', Award: 'Nobel' },
      { Exercise: 12, TV: 2, Height: 74, Weight: 200, GPA: 3.20, Pulse: 58, Smoke: 'Yes', Sex: 'M', Award: 'Olympic' },
      { Exercise: 2, TV: 8, Height: 65, Weight: 140, GPA: 2.95, Pulse: 84, Smoke: 'No', Sex: 'F', Award: 'Academy' },
      { Exercise: 6, TV: 2, Height: 70, Weight: 175, GPA: 3.35, Pulse: 70, Smoke: 'No', Sex: 'M', Award: 'Nobel' },
      { Exercise: 9, TV: 0, Height: 63, Weight: 125, GPA: 3.90, Pulse: 62, Smoke: 'No', Sex: 'F', Award: 'Nobel' },
      { Exercise: 15, TV: 3, Height: 72, Weight: 185, GPA: 3.15, Pulse: 66, Smoke: 'Yes', Sex: 'M', Award: 'Olympic' },
      { Exercise: 7, TV: 6, Height: 67, Weight: 145, GPA: 3.42, Pulse: 74, Smoke: 'No', Sex: 'F', Award: 'Academy' },
    ]
  },

  AirPassengers: {
    id: 'AirPassengers',
    name: 'AirPassengers (Monthly Airline Totals)',
    source: 'Box & Jenkins (1976)',
    description: 'Monthly totals of international airline passengers, 1949 to 1960 (in thousands).',
    columns: ['Year', 'Month', 'Passengers'],
    columnTypes: {
      Year: 'numeric',
      Month: 'categorical',
      Passengers: 'numeric'
    },
    data: [
      { Year: 1949, Month: 'Jan', Passengers: 112 }, { Year: 1949, Month: 'Feb', Passengers: 118 }, { Year: 1949, Month: 'Mar', Passengers: 132 }, { Year: 1949, Month: 'Apr', Passengers: 129 },
      { Year: 1949, Month: 'May', Passengers: 121 }, { Year: 1949, Month: 'Jun', Passengers: 135 }, { Year: 1949, Month: 'Jul', Passengers: 148 }, { Year: 1949, Month: 'Aug', Passengers: 148 },
      { Year: 1949, Month: 'Sep', Passengers: 136 }, { Year: 1949, Month: 'Oct', Passengers: 119 }, { Year: 1949, Month: 'Nov', Passengers: 104 }, { Year: 1949, Month: 'Dec', Passengers: 118 },
      { Year: 1950, Month: 'Jan', Passengers: 115 }, { Year: 1950, Month: 'Feb', Passengers: 126 }, { Year: 1950, Month: 'Mar', Passengers: 141 }, { Year: 1950, Month: 'Apr', Passengers: 135 },
      { Year: 1950, Month: 'May', Passengers: 125 }, { Year: 1950, Month: 'Jun', Passengers: 149 }, { Year: 1950, Month: 'Jul', Passengers: 170 }, { Year: 1950, Month: 'Aug', Passengers: 170 },
      { Year: 1950, Month: 'Sep', Passengers: 158 }, { Year: 1950, Month: 'Oct', Passengers: 133 }, { Year: 1950, Month: 'Nov', Passengers: 114 }, { Year: 1950, Month: 'Dec', Passengers: 140 },
      { Year: 1951, Month: 'Jan', Passengers: 145 }, { Year: 1951, Month: 'Feb', Passengers: 150 }, { Year: 1951, Month: 'Mar', Passengers: 178 }, { Year: 1951, Month: 'Apr', Passengers: 163 },
      { Year: 1951, Month: 'May', Passengers: 172 }, { Year: 1951, Month: 'Jun', Passengers: 178 }, { Year: 1951, Month: 'Jul', Passengers: 199 }, { Year: 1951, Month: 'Aug', Passengers: 199 },
      { Year: 1951, Month: 'Sep', Passengers: 184 }, { Year: 1951, Month: 'Oct', Passengers: 162 }, { Year: 1951, Month: 'Nov', Passengers: 146 }, { Year: 1951, Month: 'Dec', Passengers: 166 },
      { Year: 1952, Month: 'Jan', Passengers: 171 }, { Year: 1952, Month: 'Feb', Passengers: 180 }, { Year: 1952, Month: 'Mar', Passengers: 193 }, { Year: 1952, Month: 'Apr', Passengers: 181 },
      { Year: 1952, Month: 'May', Passengers: 183 }, { Year: 1952, Month: 'Jun', Passengers: 218 }, { Year: 1952, Month: 'Jul', Passengers: 230 }, { Year: 1952, Month: 'Aug', Passengers: 242 },
      { Year: 1952, Month: 'Sep', Passengers: 209 }, { Year: 1952, Month: 'Oct', Passengers: 191 }, { Year: 1952, Month: 'Nov', Passengers: 172 }, { Year: 1952, Month: 'Dec', Passengers: 194 },
    ]
  }
};
