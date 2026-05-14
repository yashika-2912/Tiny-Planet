import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import User from '../models/User.js';
import { isMongoReady } from '../utils/memoryStore.js';

dotenv.config();

const isConfiguredValue = (value) => Boolean(value && !value.includes('<') && !value.startsWith('from_'));
const hasGoogleCredentials = isConfiguredValue(process.env.GOOGLE_CLIENT_ID) && isConfiguredValue(process.env.GOOGLE_CLIENT_SECRET);

if (hasGoogleCredentials) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      if (!isMongoReady()) {
        return done(null, false, { message: 'Google OAuth needs MongoDB enabled for persistent users.' });
      }

      const email = profile.emails?.[0]?.value?.toLowerCase();
      if (!email) return done(null, false, { message: 'Google account has no public email.' });

      let user = await User.findOne({ $or: [{ googleId: profile.id }, { email }] });
      if (!user) {
        user = await User.create({
          name: profile.displayName || 'Google Traveler',
          email,
          googleId: profile.id,
          profileImage: profile.photos?.[0]?.value
        });
      } else if (!user.googleId) {
        user.googleId = profile.id;
        user.profileImage = user.profileImage || profile.photos?.[0]?.value;
        await user.save();
      }

      done(null, user);
    } catch (error) {
      done(error);
    }
  }));
}

export { hasGoogleCredentials };
export default passport;
