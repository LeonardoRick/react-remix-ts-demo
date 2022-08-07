import bcrypt from 'bcrypt';
import { db } from './db.server';
import { createCookieSessionStorage, redirect } from '@remix-run/node';
import type { LoginModel } from '../models/login.model';

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error('No session Secret');
}

// create session storate
const storage = createCookieSessionStorage({
  cookie: {
    name: 'remixblog_session',
    secure: process.env.NODE_ENV === 'production',
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 60, // 60 days,
    httpOnly: true
  }
});

export const createUserSession = async (userId: string, redirectTo: string) => {
  const session = await storage.getSession();
  session.set('userId', userId);
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session)
    }
  });
};

// Get user session
export const getUserSession = async (request: Request) => {
  return storage.getSession(request.headers.get('Cookie'));
};

// get logged in user
export const getUser = async (request: Request) => {
  const session = await getUserSession(request);
  const userId = session.get('userId');
  if (!userId || typeof userId !== 'string') return null;
  try {
    const user = await db.user.findUnique({
      where: {
        id: userId
      }
    });
    return user;
  } catch (e) {
    return null;
  }
};

// check if user already exists
export async function checkNewuser(username: string) {
  return await db.user.findFirst({
    where: {
      username
    }
  });
}

// register new user
export async function register({ username, password }: LoginModel) {
  const passwordHash = await bcrypt.hash(password, 10);
  return db.user.create({
    data: {
      username,
      passwordHash
    }
  });
}
// Login user
export async function login({ username, password }: LoginModel) {
  const user = await db.user.findUnique({
    where: {
      username
    }
  });

  if (!user) return null;

  // check password
  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isCorrectPassword) return null;

  return user;
}

// Logout user and destroy session
export async function logout(request: Request) {
  const session = await storage.getSession(request.headers.get('Cookie'));
  return redirect('/auth/logout', {
    headers: {
      'Set-Cookie': await storage.destroySession(session)
    }
  });
}
