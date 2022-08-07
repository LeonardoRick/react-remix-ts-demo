import { Outlet } from '@remix-run/react';
// this file works as a wrapper to all posts content and nested routes.
// this works a little different from Next.js because here we can have both
// posts.jsx and posts/index.jsx at the same folder level. This means that the
// posts.jsx will be the wrapper father component that shows around the outlet
// and posts/index.jsx will be the acctual /posts route content
function Posts() {
  return (
    <div>
      <p className="no-margin-top">=======</p>
      <Outlet />
    </div>
  );
}
export default Posts;
