import type { ActionFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { logout } from '~/utils/session.server';

// this file is a rout without a component because we use a form with an action="/auth/logout".
// This means that we receive the form post on our action function and, on loader, already
// redirect the user to the home
export const action: ActionFunction = async ({ request }) => {
  return logout(request);
};

export const loader = async () => {
  return redirect('/');
};
