import { Outlet, useLoaderData, Link } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/node';
import type { PostModel } from '~/models/post.model';
import { db } from '~/utils/db.server';
import { getUser } from '../../utils/session.server';
import type { UserModel } from '../../models/user.model';

function PostItems() {
  const { posts, user } = useLoaderData<{ posts: PostModel[]; user: UserModel }>();
  return (
    <>
      <div className="page-header">
        <h1>Posts</h1>
        {user && (
          <Link to="/posts/new" className="btn">
            New Post
          </Link>
        )}
      </div>
      <ul className="posts-list">
        {posts.map(post => (
          <Link className="list-item" key={post.id} to={post.id?.toString() || '/'}>
            <h3>{post.title}</h3>
            {post.createdAt && new Date(post.createdAt).toLocaleString()}
          </Link>
        ))}
      </ul>
      <Outlet />
    </>
  );
}
export default PostItems;

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  const data = {
    posts: await db.post.findMany({
      take: 20, // take 20 documents
      // we don't need the body here, so we don't select it
      select: { id: true, title: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    }),
    user
  };
  return data;
};
