import { Link, useActionData } from '@remix-run/react';
import type { ActionFunction, TypedResponse } from '@remix-run/node';
import { json } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { db } from '~/utils/db.server';
import type { PostModel } from '~/models/post.model';
import { getUser } from '../../utils/session.server';

function NewPost() {
  const actionData = useActionData();
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
            <input type="text" name="title" id="title" defaultValue={actionData?.fields?.title} />
            <div className="error">
              <p>{actionData?.fieldErrors?.title}</p>
            </div>
          </div>
          <div className="form-control">
            <label htmlFor="body">Body</label>
            <textarea name="body" id="body" defaultValue={actionData?.fields?.body} />
          </div>
          <div className="error">
            <p>{actionData?.fieldErrors?.body}</p>
          </div>
          <button type="submit" className="btn btn-block btn-form">
            Add post
          </button>
        </form>
      </div>
    </div>
  );
}
export default NewPost;

/**
 * This function runs when the form is submited
 * @param param request from the form submition
 * @returns a promise redirecting to the new post created
 */
export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const user = await getUser(request);

  const fields: PostModel = {
    title: form.get('title') as string,
    body: form.get('body') as string,
    userId: user?.id as string
  };

  if (!user) {
    return badRequest({ fields, formError: 'Something went wrong' });
  }

  // build an object with the string explaining the errors from each field.
  // We can read this information on the main component using useActionData
  const fieldErrors: PostModel = {
    title: validateTitle(fields.title),
    body: validateBody(fields.body)
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    console.log(fieldErrors);
    // we want to return our previous when we have an error
    // we don't want to rest our form. We need to be able to
    // refil the form with the wrong data so the user can keep editing
    // after the error to fix it from where he stoped
    return badRequest({ fieldErrors, fields });
  }

  const post = await db.post.create({
    data: {
      title: fields.title,
      body: fields.body,
      userId: user.id
    }
  });
  return redirect(`/posts/${post.id}`);
};

function validateTitle(title: FormDataEntryValue | null): string {
  if (typeof title !== 'string' || title.length < 3) {
    return 'Title should be at least 3 characters long';
  }
  return '';
}

function validateBody(body: FormDataEntryValue | null): string {
  if (typeof body !== 'string' || body.length < 10) {
    return 'Body should be at leat 10 characters long';
  }
  return '';
}

function badRequest(data: {
  formError?: string;
  fieldErrors?: Partial<Record<keyof PostModel, string>>;
  fields: PostModel;
}): TypedResponse {
  return json(data, { status: 400 });
}
