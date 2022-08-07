import type { LoaderFunction } from '@remix-run/node';
import { getUser } from '../utils/session.server';
import { useLoaderData } from '@remix-run/react';

function Home() {
  const { user } = useLoaderData();

  return (
    <>
      <h1>Welcome{user && `, ${user.username}`}</h1>
      <h2>
        <span>This is a </span>
        <a href="https://remix.run" target="_blank" rel="noreferrer">
          Remix
        </a>
        <span> demo</span>
      </h2>
      <p>
        Remix is a full stack web framework by the creators of React Router. This is a simple blog app that demonstrates some
        Remix features
      </p>
    </>
  );
}
export default Home;

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);

  return { user };
};
