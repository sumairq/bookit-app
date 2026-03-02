const fs = require('fs');
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const categories = ['art', 'fitness', 'outdoors', 'food', 'craft', 'tech'];

const guideIds = [
  '5c8a21d02f8fb814b56fa189',
  '5c8a21f22f8fb814b56fa18a',
  '5c8a22c62f8fb814b56fa18b',
  '5c8a201e2f8fb814b56fa186',
  '5c8a1f292f8fb814b56fa184',
  '5c8a1f4e2f8fb814b56fa185',
  '5c8a23412f8fb814b56fa18c',
];

// deterministic helper
const oid = () => new mongoose.Types.ObjectId().toString();

const randomBetween = (min, max) =>
  Math.round((Math.random() * (max - min) + min) * 10) / 10;

const baseCoordinates = {
  art: [2.3522, 48.8566], // Paris
  fitness: [115.1889, -8.4095], // Bali
  outdoors: [-106.4454, 39.1178],
  food: [139.6917, 35.6895], // Tokyo
  craft: [135.768, 35.0116], // Kyoto
  tech: [-122.4194, 37.7749], // SF
};

const createExperience = (category, index) => {
  const [lng, lat] = baseCoordinates[category];

  return {
    _id: oid(),
    startLocation: {
      description: `${category.toUpperCase()} Hub`,
      type: 'Point',
      coordinates: [lng + index * 0.01, lat + index * 0.01],
      address: `${category} central location`,
    },
    ratingsAverage: randomBetween(4.2, 4.9),
    ratingsQuantity: Math.floor(Math.random() * 10) + 5,
    images: [
      `${category}-${index}-1.jpg`,
      `${category}-${index}-2.jpg`,
      `${category}-${index}-3.jpg`,
    ],
    timeSlots: [
      '2024-05-10T09:00:00.000Z',
      '2024-06-15T09:00:00.000Z',
      '2024-07-20T09:00:00.000Z',
    ],
    name: `${category.charAt(0).toUpperCase() + category.slice(1)} Experience ${index}`,
    duration: Math.floor(Math.random() * 10) + 3,
    capacity: Math.floor(Math.random() * 15) + 8,
    category,
    difficulty: ['easy', 'medium', 'difficult'][index % 3],
    guides: guideIds.slice(0, (index % 3) + 1),
    price: Math.floor(Math.random() * 2000) + 300,
    summary: `A curated ${category} experience designed for hands-on learning and exploration.`,
    description:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    imageCover: `${category}-${index}-cover.jpg`,
    locations: [
      {
        _id: oid(),
        description: `${category} location A`,
        type: 'Point',
        coordinates: [lng + index * 0.02, lat + index * 0.02],
        day: 1,
      },
      {
        _id: oid(),
        description: `${category} location B`,
        type: 'Point',
        coordinates: [lng + index * 0.03, lat + index * 0.03],
        day: 3,
      },
    ],
  };
};

const experiences = [];

categories.forEach((category) => {
  for (let i = 1; i <= 9; i++) {
    experiences.push(createExperience(category, i));
  }
});

// write file
fs.writeFileSync(
  `${__dirname}/experiences.generated.json`,
  JSON.stringify(experiences, null, 2),
);

console.log(`✅ Generated ${experiences.length} experiences`);
