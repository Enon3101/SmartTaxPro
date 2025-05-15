import { OAuth2Client } from 'google-auth-library';
import { storage } from './storage';
import { generateToken } from './auth';
import { UserRole } from './auth';

// Create a Google OAuth client instance with the client ID
const googleClient = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
});

/**
 * Verify Google ID token and get user information
 * @param idToken Google ID token received from client
 * @returns User information if verification successful
 */
export async function verifyGoogleToken(idToken: string) {
  try {
    // Verify the token
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    // Get the payload from the ticket
    const payload = ticket.getPayload();
    
    if (!payload) {
      throw new Error('Invalid Google token payload');
    }

    // Extract user information from the payload
    const { sub, email, given_name, family_name, picture } = payload;

    return {
      googleId: sub,
      email: email,
      firstName: given_name,
      lastName: family_name,
      profileImageUrl: picture,
    };
  } catch (error) {
    console.error('Error verifying Google token:', error);
    throw new Error('Failed to verify Google token');
  }
}

/**
 * Process Google login by either finding an existing user with the Google ID
 * or creating a new user with the Google information
 * @param googleUserInfo Google user information
 * @returns Authentication tokens and user information
 */
export async function processGoogleLogin(googleUserInfo: {
  googleId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
}) {
  try {
    // Try to find an existing user with this Google ID
    let user = await storage.getUserByGoogleId(googleUserInfo.googleId);

    // If no user found, try to find by email
    if (!user && googleUserInfo.email) {
      user = await storage.getUserByEmail(googleUserInfo.email);
    }

    // If still no user found, create a new user
    if (!user) {
      // Generate a username from the email
      const username = googleUserInfo.email.split('@')[0] + Math.floor(Math.random() * 1000);
      
      // Create a new user with Google information
      user = await storage.createUser({
        username: username,
        email: googleUserInfo.email,
        googleId: googleUserInfo.googleId,
        firstName: googleUserInfo.firstName || '',
        lastName: googleUserInfo.lastName || '',
        profileImageUrl: googleUserInfo.profileImageUrl || '',
        role: UserRole.USER, // Default role for new users
      });
    } 
    // If user exists but doesn't have a Google ID, update the user with the Google ID
    else if (user && !user.googleId) {
      user = await storage.updateUserGoogleId(user.id, googleUserInfo.googleId);
    }

    // Generate authentication tokens
    const accessToken = generateToken(user);
    const refreshToken = generateToken(user, 'refresh');

    // Remove sensitive information before returning
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.error('Error processing Google login:', error);
    throw new Error('Failed to process Google login');
  }
}