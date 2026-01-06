import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('Starting seed...');

    const email = process.env.ADMIN_EMAIL || 'admin@wellnessthesis.com';
    const password = process.env.ADMIN_PASSWORD || 'adminpassword123';
    const name = process.env.ADMIN_NAME || 'Admin User';

    // 1. Seed Admin User
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        password: hashedPassword,
        name,
      },
    });
    console.log(`User created/found: ${user.email}`);

    // 2. Seed Categories (Implicitly used in posts/products, but we can ensure consistency)
    const categories = ['Fitness', 'Beauty', 'Health', 'Well-being'];
    // In our simple schema, Category is just a string field, so we don't strictly "create" them, 
    // but specific logical entities like a Category table could be added if needed. 
    // For now we just use these strings.

    // 3. Seed Products
    const mitolynProduct = await prisma.product.create({
      data: {
        name: 'Mitolyn',
        description: 'Mitochondrial support supplement for enhanced metabolism.',
        imageUrl: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=600&auto=format&fit=crop', // Generic bottle
        affiliateLink: 'https://mitolyn.com/affiliate/123',
        category: 'Health',
      },
    });

    const skinCareProduct = await prisma.product.create({
        data: {
          name: 'GlowRadio Skin Complex',
          description: 'Natural ingredients for radiant skin from within.',
          imageUrl: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=600&auto=format&fit=crop', // Serum bottle
          affiliateLink: 'https://glowradio.com/affiliate/123',
          category: 'Beauty',
        },
      });

    console.log('Products created');

    // 4. Seed Posts
    // Post 1: The Metabolic Wall
    await prisma.post.upsert({
      where: { slug: 'metabolic-wall-after-35' },
      update: {},
      create: {
        title: 'The "Metabolic Wall" Most People Hit After Age 35',
        slug: 'metabolic-wall-after-35',
        imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80',
        content: `
          <p class="lead text-xl text-gray-600 mb-8">For years, you've heard the same advice: "Eat less, move more." But if you're over 35, you've likely noticed something frustrating. The rules have changed.</p>
          
          <h2 class="text-2xl font-bold font-serif mb-4 mt-8">The Science of Mitochondrial Decline</h2>
          <p class="mb-4">Recent studies in metabolic performance show that calorie counting is only half the battle. The real culprit? <strong>Mitochondrial efficiency.</strong> As we age, our "cellular power plants" lose their ability to convert stored fat into energy efficiently.</p>
          
          <blockquote class="border-l-4 border-[#4D7C0F] pl-4 italic text-gray-700 my-8 py-2 bg-gray-50 pr-4 rounded-r-lg">
            "It's not about how much you eat, it's about how your cells handle the energy."
          </blockquote>
          
          <h2 class="text-2xl font-bold font-serif mb-4 mt-8">The Fat Loss Plateau</h2>
          <p class="mb-4">When your mitochondria are sluggish, your body enters a conservative state. Instead of burning fat for fuel, it begins to store it more aggressively. This leads to the dreaded "plateau". This is why you can be in a calorie deficit and still not see results on the scale.</p>
          
          <h2 class="text-2xl font-bold font-serif mb-4 mt-8">How to Re-Engage Your Metabolism</h2>
          <p class="mb-6">To break through the wall, you need to focus on mitochondrial health. This involves specific nutritional protocols and supporting your body's natural efficiency. Emerging research suggests that targeted supplementation can help "re-ignite" these dormant cellular engines.</p>
        `,
        category: 'Health',
        authorId: user.id,
        published: true,
        ctaLink: mitolynProduct.affiliateLink,
        adSlots: {
            sidebar: 'dynamic', // To be replaced by generic ads component logic
            top: 'generic'
        }
      },
    });

    // Post 2: The Mitochondrial Efficiency
    await prisma.post.upsert({
        where: { slug: 'mitochondrial-efficiency-explained' },
        update: {},
        create: {
          title: 'The Mitochondrial Efficiency: Why It Matters More Than Calories',
          slug: 'mitochondrial-efficiency-explained',
          imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1200&q=80',
          content: `
            <p>We often talk about metabolism as a fixed number, but it's actually driven by billions of microscopic power plants in your cells: the mitochondria.</p>
            
            <h2>Efficiency vs. Volume</h2>
            <p>You can eat clean and exercise, but if your mitochondrial efficiency is low, you're driving a car with the parking brake on. Improving this efficiency is the key to vitality and sustained energy levels.</p>
            
            <h2>Natural Activators</h2>
            <p>Certain compounds and lifestyle changes can signal your body to create new mitochondria (biogenesis) and repair old ones (mitophagy).</p>
            
            <h3>1. Cold Exposure</h3>
            <p>Short bursts of cold can stimulate mitochondrial activity.</p>
            
            <h3>2. Fasted Cardio</h3>
            <p>Exercising in a fasted state can force adaptation.</p>
          `,
          category: 'Fitness',
          authorId: user.id,
          published: true,
          ctaLink: mitolynProduct.affiliateLink,
          adSlots: {
              sidebar: 'dynamic',
              top: 'generic'
          }
        },
      });

    console.log('Posts created');

  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
