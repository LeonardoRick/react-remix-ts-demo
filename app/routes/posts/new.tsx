import type { ActionFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { db } from '~/utils/db.server';
import type { PostModel } from '~/models/post.model';

function NewPost() {
  return (
    <div>
      <div className="page-header">
        <Link to="/posts" className="btn btn-reverse">
          Back
        </Link>
      </div>
      <div className="page-content">
        <form method="POST">
          <div className="form-control">
            <label htmlFor="title">Title</label>
            <input type="text" name="title" id="title" />
          </div>
          <div className="form-control">
            <label htmlFor="body">Body</label>
            <textarea name="body" id="body" />
          </div>
          <button type="submit" className="btn btn-block">
            Add post
          </button>
        </form>
      </div>
    </div>
  );
}
export default NewPost;

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const data: PostModel = {
    title: form.get('title') as string,
    body: form.get('body') as string
  };
  const post = await db.post.create({ data });
  return redirect(`/posts/${post.id}`);
};
