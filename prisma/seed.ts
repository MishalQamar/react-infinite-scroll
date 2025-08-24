import { PrismaClient } from '@/generated/prisma';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

// Array of diverse, safe Unsplash image URLs - no creepy teeth!
const unsplashImages = [
  'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=400&fit=crop',
];

// Function to get a random image with better distribution
const getRandomImage = () => {
  return unsplashImages[
    Math.floor(Math.random() * unsplashImages.length)
  ];
};

const articles = Array.from({ length: 100 }, () => ({
  title: faker.lorem.sentence(),
  teaser: faker.lorem.paragraph(),
  image: getRandomImage(),
  createdAt: faker.date.past({ years: 2 }),
}));

const seed = async () => {
  const t0 = performance.now();

  // Clear existing articles first
  await prisma.article.deleteMany({});

  await prisma.article.createMany({
    data: articles,
  });

  const t1 = performance.now();
  console.log(`DB Seed: Finished (${t1 - t0}ms)`);
  console.log(
    `Created ${articles.length} articles with random images`
  );
};

seed();
