import type { ErrorBoundaryComponent, LoaderFunction } from '@remix-run/node';
import { Outlet, LiveReload, Link, Links, Meta, useLoaderData } from '@remix-run/react';
import globalStylesUrl from '~/styles/global.css';

import { getUser } from './utils/session.server';

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);

  return { user };
};
// here is where we should put hour full html structure
// live reload need to be imported as a component too
export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  );
}

const Document: React.FC<{ title?: string }> = ({ children, title }) => {
  return (
    <html lang="en">
      <head>
        <Links />
        <Meta />
        <title>{title ? title : 'My Remix Demo Blog'}</title>
      </head>
      <body>
        {children}
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
};

const Layout: React.FC = ({ children }) => {
  const { user } = useLoaderData();

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="logo">
          Remix
        </Link>
        <ul className="nav">
          <li>
            <Link to="/posts">Posts</Link>
          </li>
          <li>
            {user ? (
              <form action="/auth/logout" method="POST">
                <button className="btn" type="submit">
                  Logout {user.username}
                </button>
              </form>
            ) : (
              <Link to="/auth/login">Login</Link>
            )}
          </li>
        </ul>
      </nav>
      <div className="container">{children}</div>
    </>
  );
};

// this somehow is understood by the Links component imported by Remix and added to head.
export const links = () => [
  {
    rel: 'stylesheet',
    href: globalStylesUrl
  }
];

// this somehow is understood by the Meta component imported by Remix and added to head.
export const meta = () => {
  return {
    description: 'A cool blog built with Remix',
    keyword: 'remix, react, javascript'
  };
};

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  console.log(error);
  return (
    <Document title="error">
      <Layout>
        <h1>Error</h1>
        <p>{error.message}</p>
      </Layout>
    </Document>
  );
};
