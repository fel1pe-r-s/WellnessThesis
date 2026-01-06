import prisma from '../lib/prisma';

async function main() {
  const author = await prisma.user.findFirst();
  if (!author) {
    console.error('No author found');
    return;
  }

  const post = await prisma.post.create({
    data: {
      title: 'Advanced Recovery: Beyond Stretching',
      slug: 'advanced-recovery-techniques',
      content: '<p>Recovery is just as important as the workout itself. In this guide, we explore advanced techniques like contrast baths, compression therapy, and active recovery flows that professional athletes use to stay at the top of their game.</p>',
      category: 'Fitness',
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200',
      published: true,
      authorId: author.id,
    },
  });

  console.log('Test post created:', post.title);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
