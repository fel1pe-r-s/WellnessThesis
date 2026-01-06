import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  // 1. Get or Create Author
  let author = await prisma.user.findFirst();
  if (!author) {
    const hashedFirstPassword = await bcrypt.hash('password123', 10);
    author = await prisma.user.create({
      data: {
        email: 'admin@wellnessthesis.com',
        name: 'Admin',
        password: hashedFirstPassword,
      }
    });
  }

  // 2. Create Mitolyn Product
  const mitolyn = await prisma.product.upsert({
    where: { id: 'mitolyn-prod-id' }, // Fictitious but stable ID for seeding
    update: {
      affiliateLink: 'https://697b7osljan8ytc6jnyf1abxbm.hop.clickbank.net',
    },
    create: {
      id: 'mitolyn-prod-id',
      name: 'Mitolyn',
      description: 'Advanced mitochondrial support for metabolism and energy.',
      imageUrl: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=400',
      affiliateLink: 'https://697b7osljan8ytc6jnyf1abxbm.hop.clickbank.net',
      category: 'Metabolism',
    },
  });

  // 3. Create Fictitious Products for Carousel
  const products = [
    { name: 'GlowRadio', category: 'Beauty', image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=400' },
    { name: 'GutRestore', category: 'Health', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400' },
    { name: 'KetoMatcha', category: 'Fitness', image: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=400' },
  ];

  for (const p of products) {
    await prisma.product.create({
      data: {
        name: p.name,
        category: p.category,
        imageUrl: p.image,
        affiliateLink: '#',
        description: `High quality ${p.name} for your wellness.`,
      }
    });
  }

  // 4. Create Posts from "posts ideias"
  const postsIdeias = [
    {
      title: "Why Your Metabolism Stalls After 35 (And the Science to Fix It)",
      slug: "why-metabolism-stalls-after-35",
      category: "Metabolism",
      content: "<p>Explica como as mitocôndrias perdem eficiência com a idade. O post serve como uma ponte (bridge) perfeita para o seu review do Mitolyn.</p>",
      imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061",
      productId: mitolyn.id,
      published: true,
      authorId: author.id,
    },
    {
      title: "3 Anti-Inflammatory Breakfast Smoothies to Beat Morning Bloating",
      slug: "3-anti-inflammatory-smoothies-bloating",
      category: "Nutrition",
      content: "<p>Oferece 3 receitas rápidas usando ingredientes como gengibre, cúrcuma e berries. O foco é resolver a dor do inchaço abdominal imediato.</p>",
      imageUrl: "https://images.unsplash.com/photo-1556761223-4c4282c73f77",
      published: true,
      authorId: author.id,
    },
    {
      title: "The Secret Connection Between Your Gut Health and Glowing Skin",
      slug: "gut-health-glowing-skin-connection",
      category: "Beauty",
      content: "<p>Discute como a inflamação interna e a má digestão se manifestam no rosto (acne, rugas precoces). Defende a tese de que beleza não é apenas sobre cremes, mas sobre o que acontece dentro das células.</p>",
      imageUrl: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c",
      published: true,
      authorId: author.id,
    },
    {
      title: "Walking vs. HIIT: Which One is Better for Mitochondrial Activation?",
      slug: "walking-vs-hiit-mitochondrial-activation",
      category: "Fitness",
      content: "<p>Compara exercícios de alta intensidade com caminhadas de baixo impacto sob a ótica da ciência metabólica. Explica qual deles queima gordura de forma mais eficiente sem elevar o cortisol.</p>",
      imageUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8",
      productId: mitolyn.id,
      published: true,
      authorId: author.id,
    },
  ];

  for (const postData of postsIdeias) {
    await prisma.post.upsert({
      where: { slug: postData.slug },
      update: postData,
      create: postData,
    });
  }

  console.log('Seeding completed: Mitolyn, Fictitious Products, and 4 Strategic Posts.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
