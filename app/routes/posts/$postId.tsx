import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { useLoaderData, Link } from '@remix-run/react';
import { db } from '~/utils/db.server';
import { redirect } from '@remix-run/node';
import { getUser } from '../../utils/session.server';

function PostDetail() {
  const { post, user } = useLoaderData();
  return (
    <div>
      <div className="page-header">
        <h1>{post.title}</h1>
        <Link to="/posts" className="btn btn-reverse">
          Back
        </Link>
      </div>
      <div className="page-content">{post.body}</div>
      <div className="page-footer">
        {user && user.id === post.userId && (
          <form method="POST">
            <input type="hidden" name="_method" value="delete" />
            <button className="btn btn-delete" type="submit">
              Delete
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
export default PostDetail;

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await getUser(request);
  const post = await db.post.findUnique({
    where: { id: params.postId }
  });

  if (!post) throw new Error('Post not find');
  return { post, user };
};

/**
 * This function runs when the form is submited
 * @param param request body sent by the form submition and params on the route path
 * @returns a promise redirecting to the new post created
 */
export const action: ActionFunction = async ({ request, params }) => {
  const user = await getUser(request);
  const form = await request.formData();
  if (form.get('_method') === 'delete') {
    const post = await db.post.findUnique({
      where: { id: params.postId }
    });
    if (!post) throw new Error('Post not found');

    if (user && post.userId === user.id) {
      await db.post.delete({ where: { id: params.postId } });
    }
    return redirect('/posts');
  }
};
