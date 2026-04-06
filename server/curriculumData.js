const curriculum = {
  Math_4: [
    {
      title: 'Understanding Place Value',
      subtitle: 'Learn the power of digits based on their position!',
      difficulty: 'easy',
      mcq: { q: 'In the number 456, what is the value of the digit 5?', a: '5', b: '50', c: '500', d: '5,000', correct: 'B' },
      fill_blank: { q: 'The value of the digit in the hundreds place of 789 is ____', correct: '700' },
      true_false: { q: 'In the number 1,234, the digit 1 is in the thousands place.', correct: 'True' }
    },
    {
      title: 'Addition with Regrouping',
      subtitle: 'Carry over numbers to solve bigger addition problems!',
      difficulty: 'easy',
      mcq: { q: 'What is 47 + 35?', a: '72', b: '82', c: '92', d: '812', correct: 'B' },
      fill_blank: { q: 'When adding 9 + 5, we regroup 10 and have ____ left over in the ones place.', correct: '4' },
      true_false: { q: 'Regrouping is also called "carrying" in addition.', correct: 'True' }
    },
    {
       title: 'Subtraction with Borrowing',
       subtitle: 'Learn how to take away when the top digit is smaller!',
       difficulty: 'easy',
       mcq: { q: 'What is 52 - 18?', a: '44', b: '34', c: '46', d: '36', correct: 'B' },
       fill_blank: { q: 'In 52 - 18, we borrow from the ____ place to help the ones place.', correct: 'tens' },
       true_false: { q: 'You can subtract 8 from 2 without borrowing if 2 is in the ones place.', correct: 'False' }
    },
    {
       title: 'Multiplication Tables (2-5)',
       subtitle: 'Master the basic building blocks of math!',
       difficulty: 'medium',
       mcq: { q: 'What is 4 × 3?', a: '7', b: '10', c: '12', d: '14', correct: 'C' },
       fill_blank: { q: '5 × 5 = ____', correct: '25' },
       true_false: { q: '3 × 4 gives the same answer as 4 × 3', correct: 'True' }
    },
    {
       title: 'Multiplication Tables (6-9)',
       subtitle: 'Tackle the bigger numbers with confidence!',
       difficulty: 'medium',
       mcq: { q: 'What is 7 × 8?', a: '54', b: '56', c: '63', d: '64', correct: 'B' },
       fill_blank: { q: '9 × 9 = ____', correct: '81' },
       true_false: { q: '6 × 7 is 42.', correct: 'True' }
    },
    {
       title: 'Introduction to Division',
       subtitle: 'Learn how to share things equally!',
       difficulty: 'medium',
       mcq: { q: 'What is 20 ÷ 4?', a: '4', b: '5', c: '6', d: '16', correct: 'B' },
       fill_blank: { q: 'If you shared 15 cookies among 3 friends, each would get ____ cookies.', correct: '5' },
       true_false: { q: 'Division is the opposite of addition.', correct: 'False' }
    },
    {
       title: 'Fractions: Part of a Whole',
       subtitle: 'Slicing up numbers into equal pieces!',
       difficulty: 'medium',
       mcq: { q: 'In the fraction 3/4, what is the number 4 called?', a: 'Numerator', b: 'Denominator', c: 'Whole', d: 'Quarter', correct: 'B' },
       fill_blank: { q: 'If a pizza is cut into 8 equal slices and you eat 1, you ate 1/____ of the pizza.', correct: '8' },
       true_false: { q: 'The numerator tells us how many parts we have.', correct: 'True' }
    },
    {
       title: 'Comparing and Ordering Fractions',
       subtitle: 'Which slice is bigger? Find out here!',
       difficulty: 'hard',
       mcq: { q: 'Which fraction is greater?', a: '1/2', b: '1/4', c: 'Both are same', d: 'Zero', correct: 'A' },
       fill_blank: { q: 'The fraction 2/4 is the same meaning as 1/____', correct: '2' },
       true_false: { q: 'A fraction with a larger denominator (of the same numerator) is always larger.', correct: 'False' }
    },
    {
       title: 'Geometry: Shapes and Angles',
       subtitle: 'Explore the world of lines, corners, and figures!',
       difficulty: 'hard',
       mcq: { q: 'How many sides does a pentagon have?', a: '4', b: '5', c: '6', d: '8', correct: 'B' },
       fill_blank: { q: 'A 90-degree angle is also called a ____ angle.', correct: 'right' },
       true_false: { q: 'An obtuse angle is smaller than 90 degrees.', correct: 'False' }
    },
    {
       title: 'Word Problems: Mixed Operations',
       subtitle: 'Apply everything you know to real-life stories!',
       difficulty: 'hard',
       mcq: { q: 'Sam has 3 boxes of 10 pencils each. He gives away 5 pencils. How many does he have left?', a: '25', b: '30', c: '35', d: '15', correct: 'A' },
       fill_blank: { q: 'If a bus has 40 seats and 12 are empty, there are ____ people on the bus.', correct: '28' },
       true_false: { q: 'The word "total" usually means you should subtract.', correct: 'False' }
    }
  ],
  Sci_4: [
    {
      title: 'Living and Non-Living Things',
      subtitle: 'What makes something "alive"? Let\'s find out!',
      difficulty: 'easy',
      mcq: { q: 'Which of these is a living thing?', a: 'Rock', b: 'Car', c: 'Tree', d: 'Phone', correct: 'C' },
      fill_blank: { q: 'Living things need food, water, and ____ to stay alive.', correct: 'air' },
      true_false: { q: 'Non-living things can grow and reproduce.', correct: 'False' }
    },
    {
      title: 'Parts of a Plant',
      subtitle: 'Discover the amazing structures of our green friends!',
      difficulty: 'easy',
      mcq: { q: 'Which part of the plant grows underground and absorbs water?', a: 'Leaves', b: 'Stem', c: 'Roots', d: 'Flowers', correct: 'C' },
      fill_blank: { q: 'The ____ is the part of the plant that makes food using sunlight.', correct: 'leaf' },
      true_false: { q: 'The stem holds the plant upright.', correct: 'True' }
    },
    {
       title: 'How Plants Make Food (Photosynthesis)',
       subtitle: 'The secret kitchen hidden in every leaf!',
       difficulty: 'easy',
       mcq: { q: 'What do plants use to make food?', a: 'Sugar and Soil', b: 'Sunlight, Water, and Carbon Dioxide', c: 'Oxygen and Dust', d: 'Only Water', correct: 'B' },
       fill_blank: { q: 'Plants release ____ into the air while making food.', correct: 'oxygen' },
       true_false: { q: 'Photosynthesis happens in the roots of the plant.', correct: 'False' }
    },
    {
       title: 'Types of Animals',
       subtitle: 'From mammals to insects, meet the animal kingdom!',
       difficulty: 'medium',
       mcq: { q: 'Which of these animals is a mammal?', a: 'Shark', b: 'Frog', c: 'Whale', d: 'Snake', correct: 'C' },
       fill_blank: { q: 'Animals with backbones are called ____.', correct: 'vertebrates' },
       true_false: { q: 'Reptiles are warm-blooded animals.', correct: 'False' }
    },
    {
       title: 'Animal Habitats',
       subtitle: 'Where animals call home around the world.',
       difficulty: 'medium',
       mcq: { q: 'Which habitat is very cold and covered in ice?', a: 'Desert', b: 'Rainforest', c: 'Arctic', d: 'Ocean', correct: 'C' },
       fill_blank: { q: 'A desert is a habitat that receives very little ____.', correct: 'rain' },
       true_false: { q: 'A camel is well-adapted for the rainforest.', correct: 'False' }
    },
    {
       title: 'The Water Cycle',
       subtitle: 'The never-ending journey of a water drop!',
       difficulty: 'medium',
       mcq: { q: 'When water turns into vapor and rises into the air, it is called:', a: 'Condensation', b: 'Evaporation', c: 'Precipitation', d: 'Collection', correct: 'B' },
       fill_blank: { q: 'Clouds are formed through the process of ____.', correct: 'condensation' },
       true_false: { q: 'Rain, snow, and hail are all forms of precipitation.', correct: 'True' }
    },
    {
       title: 'Weather and Seasons',
       subtitle: 'Why the world changes throughout the year.',
       difficulty: 'medium',
       mcq: { q: 'In which season do many trees lose their leaves?', a: 'Spring', b: 'Summer', c: 'Autumn (Fall)', d: 'Winter', correct: 'C' },
       fill_blank: { q: 'A ____ is used to measure the temperature of the air.', correct: 'thermometer' },
       true_false: { q: 'Summer is usually the coldest season of the year.', correct: 'False' }
    },
    {
       title: 'The Solar System',
       subtitle: 'Our cosmic neighborhood in space!',
       difficulty: 'hard',
       mcq: { q: 'Which is the largest planet in our solar system?', a: 'Mars', b: 'Jupiter', c: 'Saturn', d: 'Earth', correct: 'B' },
       fill_blank: { q: 'The Earth takes 365 days to orbit the ____.', correct: 'sun' },
       true_false: { q: 'The Moon produces its own light.', correct: 'False' }
    },
    {
       title: 'Forces: Push and Pull',
       subtitle: 'Making things move with force!',
       difficulty: 'hard',
       mcq: { q: 'Which force pulls objects toward the center of the Earth?', a: 'Magnetism', b: 'Friction', c: 'Gravity', d: 'Pushing', correct: 'C' },
       fill_blank: { q: 'The force that resists motion when two surfaces rub together is ____.', correct: 'friction' },
       true_false: { q: 'A magnet can pull objects made of iron.', correct: 'True' }
    },
    {
       title: 'Simple Machines',
       subtitle: 'Clever tools that make work easier.',
       difficulty: 'hard',
       mcq: { q: 'Which simple machine is a ramp?', a: 'Lever', b: 'Pulley', c: 'Inclined Plane', d: 'Screw', correct: 'C' },
       fill_blank: { q: 'A seesaw is an example of a ____.', correct: 'lever' },
       true_false: { q: 'A wheel and axle help things to roll and move easily.', correct: 'True' }
    }
  ],
  Math_5: [
    {
      title: 'Large Numbers and Number Patterns',
      subtitle: 'Dive deep into the world of big numbers!',
      difficulty: 'easy',
      mcq: { q: 'What is the sum of the digits of the number 12,345?', a: '10', b: '15', c: '20', d: '25', correct: 'B' },
      fill_blank: { q: 'The next number in the pattern 2, 4, 8, 16 is ____', correct: '32' },
      true_false: { q: 'A million is 1,000,000.', correct: 'True' }
    },
    {
      title: 'Factors and Multiples',
      subtitle: 'The hidden partners in every multiplication.',
      difficulty: 'easy',
      mcq: { q: 'Which is a common factor of 12 and 18?', a: '2', b: '3', c: '6', d: 'All of these', correct: 'D' },
      fill_blank: { q: 'The first five multiples of 3 are 3, 6, 9, 12, and ____', correct: '15' },
      true_false: { q: 'A multiple is a number that is divided by another number.', correct: 'False' }
    },
    {
       title: 'Prime and Composite Numbers',
       subtitle: 'Unlocking the building blocks of arithmetic!',
       difficulty: 'easy',
       mcq: { q: 'Which of these is a prime number?', a: '4', b: '7', c: '9', d: '10', correct: 'B' },
       fill_blank: { q: 'A ____ number has only two factors: 1 and itself.', correct: 'prime' },
       true_false: { q: '1 is a prime number.', correct: 'False' }
    },
    {
       title: 'Operations with Decimals',
       subtitle: 'Math with the little dots that mean a lot!',
       difficulty: 'medium',
       mcq: { q: 'What is 0.5 + 0.25?', a: '0.3', b: '0.7', c: '0.75', d: '0.8', correct: 'C' },
       fill_blank: { q: '1.2 × 2 = ____', correct: '2.4' },
       true_false: { q: '0.1 is larger than 0.09.', correct: 'True' }
    },
    {
       title: 'Fractions: Addition and Subtraction',
       subtitle: 'When slices have different sizes!',
       difficulty: 'medium',
       mcq: { q: 'What is 1/4 + 1/4?', a: '1/8', b: '2/4 (which is 1/2)', c: '1/2', d: 'Both B and C', correct: 'D' },
       fill_blank: { q: 'To add 1/2 and 1/3, you first find a common ____', correct: 'denominator' },
       true_false: { q: 'You can subtract 1/3 from 2/3 and get 1/3.', correct: 'True' }
    },
    {
       title: 'Fractions: Multiplication',
       subtitle: 'Multiplying parts of parts.',
       difficulty: 'medium',
       mcq: { q: 'What is 1/2 of 1/2?', a: '1/1', b: '1/4', c: '2/4', d: '1/2', correct: 'B' },
       fill_blank: { q: 'When multiplying fractions, we multiply numerators and ____.', correct: 'denominators' },
       true_false: { q: 'Multiplying a whole number by a fraction usually makes it smaller.', correct: 'True' }
    },
    {
       title: 'Introduction to Percentages',
       subtitle: 'Exploring the power of "per hundred"!',
       difficulty: 'medium',
       mcq: { q: 'What is 50% written as a fraction?', a: '1/2', b: '1/5', c: '1/10', d: '5/100', correct: 'A' },
       fill_blank: { q: 'Percent means "per ____"', correct: 'hundred' },
       true_false: { q: '100% of a number is the whole thing.', correct: 'True' }
    },
    {
       title: 'Area and Perimeter',
       subtitle: 'Measuring the edges and the space inside.',
       difficulty: 'hard',
       mcq: { q: 'A rectangle has a length of 5m and a width of 4m. What is its area?', a: '9m', b: '20sq m', c: '18m', d: '40sq m', correct: 'B' },
       fill_blank: { q: 'The distance around the outside of a shape is called its ____.', correct: 'perimeter' },
       true_false: { q: 'To find the area of a square, you multiply its side by itself.', correct: 'True' }
    },
    {
       title: 'Data Handling and Graphs',
       subtitle: 'Turning numbers into amazing pictures!',
       difficulty: 'hard',
       mcq: { q: 'Which type of graph uses bars to show information?', a: 'Line Graph', b: 'Pie Chart', c: 'Bar Graph', d: 'Point Chart', correct: 'C' },
       fill_blank: { q: 'The average of a set of numbers is also called the ____.', correct: 'mean' },
       true_false: { q: 'A pie chart shows parts of a whole circle.', correct: 'True' }
    },
    {
       title: 'Ratio and Proportion',
       subtitle: 'How things compare in size or amount!',
       difficulty: 'hard',
       mcq: { q: 'If there are 2 apples for every 3 oranges, the ratio is:', a: '2:3', b: '3:2', c: '5:2', d: '2:5', correct: 'A' },
       fill_blank: { q: 'If 1 pen costs $2, then 5 pens cost $____.', correct: '10' },
       true_false: { q: 'Proportions show that two ratios are equal.', correct: 'True' }
    }
  ],
  Sci_5: [
    {
      title: 'Cell: The Basic Unit of Life',
      subtitle: 'The tiny engines that run every living thing!',
      difficulty: 'easy',
      mcq: { q: 'The control center of a cell is its:', a: 'Cytoplasm', b: 'Nucleus', c: 'Cell Wall', d: 'Membrane', correct: 'B' },
      fill_blank: { q: 'Both plants and animals are made of tiny blocks called ____.', correct: 'cells' },
      true_false: { q: 'Only plants have a cell wall around their cells.', correct: 'True' }
    },
    {
      title: 'Human Body Systems Overview',
      subtitle: 'The amazing machine that is "You"!',
      difficulty: 'easy',
      mcq: { q: 'Which system is responsible for moving blood around your body?', a: 'Digestive', b: 'Respiratory', c: 'Circulatory', d: 'Skeletal', correct: 'C' },
      fill_blank: { q: 'The ____ system helps you breathe by taking in oxygen.', correct: 'respiratory' },
      true_false: { q: 'The skeletal system provides support and protects organs.', correct: 'True' }
    },
    {
       title: 'The Digestive System',
       subtitle: 'Turning lunch into energy for your body!',
       difficulty: 'easy',
       mcq: { q: 'Digestion begins here:', a: 'Stomach', b: 'Small Intestine', c: 'Mouth', d: 'Esophagus', correct: 'C' },
       fill_blank: { q: 'The long tube that carries food from the mouth to the stomach is the ____.', correct: 'esophagus' },
       true_false: { q: 'The stomach churns food and mixes it with acid.', correct: 'True' }
    },
    {
       title: 'The Respiratory System',
       subtitle: 'How your body takes in life-giving air!',
       difficulty: 'medium',
       mcq: { q: 'The large muscle below your lungs help you breathe:', a: 'Bicep', b: 'Heart', c: 'Diaphragm', d: 'Trachea', correct: 'C' },
       fill_blank: { q: 'The air tubes in your lungs are called ____.', correct: 'bronchi' },
       true_false: { q: 'Oxygen is absorbed into the blood through the lungs.', correct: 'True' }
    },
    {
       title: 'The Circulatory System',
       subtitle: 'The non-stop transport system of your body!',
       difficulty: 'medium',
       mcq: { q: 'Which organ is the pump for your blood?', a: 'Lungs', b: 'Brain', c: 'Heart', d: 'Kidneys', correct: 'C' },
       fill_blank: { q: 'Tiny blood vessels where gases are exchanged are ____.', correct: 'capillaries' },
       true_false: { q: 'Arteries carry blood away from the heart.', correct: 'True' }
    },
    {
       title: 'Food Chains and Food Webs',
       subtitle: 'Who eats whom? The flow of energy!',
       difficulty: 'medium',
       mcq: { q: 'A plant is always this in a food chain:', a: 'Consumer', b: 'Decomposer', c: 'Producer', d: 'Predator', correct: 'C' },
       fill_blank: { q: 'A consumer that only eats plants is called a ____.', correct: 'herbivore' },
       true_false: { q: 'Food webs show how multiple food chains are connected.', correct: 'True' }
    },
    {
       title: 'Adaptation in Animals',
       subtitle: 'The special traits that help animals survive!',
       difficulty: 'medium',
       mcq: { q: 'Which trait helps an owl hunt at night?', a: 'Good smell', b: 'Silent flight and night vision', c: 'Running fast', d: 'Bright feathers', correct: 'B' },
       fill_blank: { q: 'The ability of an animal to blend into its environment is ____.', correct: 'camouflage' },
       true_false: { q: 'Hibernation is an adaptation for surviving winter.', correct: 'True' }
    },
    {
       title: 'Matter: Solids, Liquids, Gases',
       subtitle: 'The stuff everything in the universe is made of!',
       difficulty: 'hard',
       mcq: { q: 'Which state of matter takes the shape of its container?', a: 'Solid', b: 'Liquid', c: 'Gas', d: 'Both B and C', correct: 'D' },
       fill_blank: { q: 'When a solid turns into a liquid, it is ____.', correct: 'melting' },
       true_false: { q: 'Gas particles are packed tightly together.', correct: 'False' }
    },
    {
       title: 'Light and Shadow',
       subtitle: 'The world of reflection and rays!',
       difficulty: 'hard',
       mcq: { q: 'Which object allows light to pass through it clearly?', a: 'Opaque', b: 'Translucent', c: 'Transparent', d: 'Solid', correct: 'C' },
       fill_blank: { q: 'A shadow is formed when an object ____ light.', correct: 'blocks' },
       true_false: { q: 'Light travels in straight lines.', correct: 'True' }
    },
    {
       title: 'Electricity and Circuits',
       subtitle: 'The invisible power that lights up our world!',
       difficulty: 'hard',
       mcq: { q: 'A complete path for electricity is called a:', a: 'Wired Line', b: 'Power Station', c: 'Circuit', d: 'Battery', correct: 'C' },
       fill_blank: { q: 'A material that allows electricity to flow is a ____.', correct: 'conductor' },
       true_false: { q: 'A switch can open or close a circuit.', correct: 'True' }
    }
  ]
};

module.exports = curriculum;

