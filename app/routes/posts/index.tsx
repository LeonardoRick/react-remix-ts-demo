import { Outlet, useLoaderData, Link } from '@remix-run/react';
import type { PostModel } from '~/models/post.model';
import { db } from '~/utils/db.server';

function PostItems() {
  const { posts } = useLoaderData<{ posts: PostModel[] }>();
  return (
    <>
      <div className="page-header">
        <h1>Posts</h1>
        <Link to="/posts/new" className="btn">
          New Post
        </Link>
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

export const loader = async () => {
  const data = {
    posts: await db.post.findMany({
      take: 20, // take 20 documents
      // we don't need the body here, so we don't select it
      select: { id: true, title: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    })
  };
  return data;
};
