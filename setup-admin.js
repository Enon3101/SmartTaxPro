// Simple script to create an admin user for testing
const { db } = require('./server/db');
const { users } = require('./shared/schema');
const { eq } = require('drizzle-orm');

async function createAdminUser() {
  try {
    // Check if admin already exists
    const [existingAdmin] = await db.select().from(users).where(eq(users.role, 'admin'));
    
    if (existingAdmin) {
      console.log('Admin user already exists:', {
        id: existingAdmin.id,
        username: existingAdmin.username,
        phone: existingAdmin.phone
      });
      return;
    }
    
    // Create admin user
    const [admin] = await db.insert(users).values({
      username: 'admin',
      password: 'admin123', // Note: In production, this should be hashed
      phone: '9876543210',
      role: 'admin'
    }).returning();
    
    console.log('Admin user created successfully:', {
      id: admin.id,
      username: admin.username,
      phone: admin.phone
    });
    
    console.log('\nYou can now log in with:');
    console.log('Phone: 9876543210');
    console.log('NOTE: When prompted for OTP, check the server console logs');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    process.exit(0);
  }
}

createAdminUser();