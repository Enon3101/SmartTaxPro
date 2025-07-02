import { OAuth2Client } from 'google-auth-library';

import { generateToken } from './auth';
import { storage } from './storage';

// Create an OAuth client using the client ID
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Verify Google token and get user information
 * @param token Google token received from client (either ID token or access token)
 * @param token_type Type of token (e.g., 'Bearer' for access tokens)
 * @returns User information if verification successful
 */
export async function verifyGoogleToken(token: string, token_type?: string) {
  try {
    let payload;
    
    if (token_type === 'Bearer') {
      // This is an access token, use the Google OAuth2 API to get user info
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user info from Google API');
      }
      
      payload = await response.json();
    } else {
      // Assume this is an ID token, verify it
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      
      // Get the payload from the ticket
      payload = ticket.getPayload();
      if (!payload) {
        throw new Error('Invalid Google token payload');
      }
    }
    
    // Extract user info from the payload
    const googleId = payload['sub']; // Google's unique identifier for the user
    const email = payload['email'];
    const firstName = payload['given_name'] || payload['name'];
    const lastName = payload['family_name'];
    const profileImageUrl = payload['picture'];
    
    // Verify email is verified by Google if we have that info
    if (payload['email_verified'] === false) {
      throw new Error('Email not verified by Google');
    }
    
    return {
      googleId,
      email,
      firstName,
      lastName,
      profileImageUrl
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
  email: string | undefined;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
}) {
  try {
    // First, try to find a user with this Google ID
    let user = await storage.getUserByGoogleId(googleUserInfo.googleId);
    
    // If no user found, try to find by email
    if (!user && googleUserInfo.email) {
      user = await storage.getUserByEmail(googleUserInfo.email);
      
      // If found by email, update the user with Google ID
      if (user) {
        user = await storage.updateUserGoogleId(user.id, googleUserInfo.googleId);
      }
    }
    
    // If still no user found, create a new one
    if (!user) {
      // Generate a username based on email (or use a placeholder + random string)
      const username = googleUserInfo.email 
        ? googleUserInfo.email.split('@')[0] 
        : `user_${Math.random().toString(36).substring(2, 10)}`;
      
      user = await storage.createUser({
        username,
        email: googleUserInfo.email ?? '',
        firstName: googleUserInfo.firstName || undefined,
        lastName: googleUserInfo.lastName || undefined,
        role: 'user',
        googleId: googleUserInfo.googleId,
        profileImageUrl: googleUserInfo.profileImageUrl || undefined,
        passwordHash: '',
        mfaEnabled: false
      });
    }
    
    // Update last login timestamp
    // This would ideally be in storage.updateLastLogin but not implementing for brevity
    
    // Generate auth tokens
    const userPayload = { id: user.id, role: user.role as any };
    const accessToken = generateToken(userPayload, 'access');
    const refreshToken = generateToken(userPayload, 'refresh');
    
    return { user, accessToken, refreshToken };
  } catch (error) {
    console.error('Error processing Google login:', error);
    throw new Error('Failed to process Google login');
  }
}