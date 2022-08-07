const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function getPosts() {
  return [
    {
      title: 'JavaScript Performance Tips',
      body: `We will look at 10 simple tips and tricks to increase the speed of your code when writing JS`
    },
    {
      title: 'Tailwind vs. Bootstrap',
      body: `Both Tailwind and Bootstrap are very popular CSS frameworks. In this article, we will compare them`
    },
    {
      title: 'Writing Great Unit Tests',
      body: `We will look at 10 simple tips and tricks on writing unit tests in JavaScript`
    },
    {
      title: 'What Is New In PHP 8?',
      body: `In this article we will look at some of the new features offered in version 8 of PHP`
    }
  ];
}

/**
 * Function that inits the database with some data.
 * getPosts() return a list of objects with title and body
 */
async function seed() {
  const mockJohn = await prisma.user.create({
    data: {
      username: 'john',
      // password decrypted = twixrox
      passwordHash: '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u'
    }
  });

  await Promise.all(
    getPosts().map(post => {
      // adding john as the owner of this posts
      const data = { userId: mockJohn.id, ...post };
      // prisma.post because our table name is post.
      return prisma.post.create({ data });
    })
  );
}

seed();
