import { PrismaClient } from '@/generated/prisma';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const articles = Array.from({ length: 100 }, () => ({
  title: faker.lorem.sentence(),
  teaser: faker.lorem.paragraph(),
  createdAt: faker.date.past({ years: 2 }),
}));

const seed = async () => {
  const t0 = performance.now();
  await prisma.article.createMany({
    data: articles,
  });

  const t1 = performance.now();
  console.log(`DB Seed: Finished (${t1 - t0}ms)`);
};

seed();
