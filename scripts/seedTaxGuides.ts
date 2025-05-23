import { db } from '../server/db'; // Adjust path if your db instance is elsewhere
import { blogPosts, users, InsertBlogPost } from '../shared/schema'; // Adjust path if your schema is elsewhere
import { UserRole } from '../server/auth'; // Corrected import for UserRole
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w-]+/g, '')       // Remove all non-word chars
    .replace(/--+/g, '-');          // Replace multiple - with single -
}

async function seedTaxGuides() {
  console.log('Starting to seed Tax Guides...');

  if (!db) {
    console.error('Database connection (db) is not available. Ensure db.ts exports a connected Drizzle instance.');
    process.exit(1);
  }

  let authorId: number | undefined;

  try {
    const adminUser = await db.select({ id: users.id }).from(users).where(eq(users.role, UserRole.ADMIN)).limit(1);
    if (adminUser && adminUser.length > 0 && adminUser[0].id) {
      authorId = adminUser[0].id;
      console.log(`Found admin user with ID: ${authorId} to use as author.`);
    } else {
      console.error('No admin user found to assign as author. Please create an admin user first or specify an authorId.');
      // As a fallback, try to find any user
      const anyUser = await db.select({ id: users.id }).from(users).limit(1);
      if (anyUser && anyUser.length > 0 && anyUser[0].id) {
        authorId = anyUser[0].id;
        console.warn(`Using first available user (ID: ${authorId}) as author due to no admin found.`);
      } else {
        console.error('No users found in the database. Cannot assign an author. Exiting.');
        process.exit(1);
      }
    }
  } catch (error) {
    console.error('Error fetching author:', error);
    process.exit(1);
  }

  const placeholderPosts: Omit<InsertBlogPost, 'authorId'>[] = [];
  const category = "Tax Guides";

  for (let i = 1; i <= 20; i++) {
    const title = `Tax Guide ${i}: Understanding Your Tax Obligations ${nanoid(4)}`;
    placeholderPosts.push({
      title: title,
      slug: slugify(title),
      summary: `A comprehensive guide to understanding various aspects of tax obligations. Placeholder summary for Tax Guide ${i}.`,
      content: `## ${title}\n\nThis is placeholder content for ${title}. Replace this with your actual well-researched and formatted tax guide. \n\n### Key Topics Covered (Example)\n- Topic A\n- Topic B\n- Topic C\n\nMore details will be added soon.`,
      category: category,
      tags: ["tax guide", "taxation", "placeholder"],
      readTime: 5, // Estimated read time in minutes
      published: true,
      // publishedAt will be set by DB default or app logic if needed for placeholders
      // authorId will be added before insert
    });
  }

  try {
    console.log(`Attempting to insert ${placeholderPosts.length} placeholder blog posts with author ID: ${authorId}...`);
    
    const postsToInsert: InsertBlogPost[] = placeholderPosts.map(post => ({
      ...post,
      authorId: authorId!, // Assert authorId is defined due to checks above
    }));

    if (postsToInsert.length > 0) {
      await db.insert(blogPosts).values(postsToInsert).onConflictDoNothing(); // Avoid error if a slug somehow conflicts, though nanoid should prevent this.
      console.log(`${postsToInsert.length} placeholder Tax Guides seeded successfully!`);
    } else {
      console.log('No posts were prepared for seeding.');
    }
  } catch (error) {
    console.error('Error seeding Tax Guides:', error);
    process.exit(1);
  }

  console.log('Tax Guides seeding process finished.');
  // Drizzle doesn't require explicit connection closing for serverless drivers typically.
  // If using a traditional pool, you might close it here.
}

seedTaxGuides().catch((error) => {
  console.error('Unhandled error in seeding script:', error);
  process.exit(1);
});