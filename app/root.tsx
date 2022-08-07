import type { ErrorBoundaryComponent } from '@remix-run/node';
import { Outlet, LiveReload, Link, Links, Meta } from '@remix-run/react';
import globalStylesUrl from '~/styles/global.css';
// here is where we should put hour full html structure
// live reload need to be imported as a component too
export default function App() {
  return (
    <Document title="temp">
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  );
}

const Document: React.FC<{ title: string }> = ({ children, title }) => {
  return (
    <html lang="en">
      <head>
        <Links />
        <Meta />
        <title> {title ? title : 'My remix demo blog'}</title>
      </head>
      <body>
        {children}
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
};

const Layout: React.FC = ({ children }) => {
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
