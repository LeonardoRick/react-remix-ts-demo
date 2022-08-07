import type { ActionFunction, TypedResponse } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useActionData } from '@remix-run/react';
import { checkNewuser, login, register } from '~/utils/session.server';
import type { LoginModel } from '../../models/login.model';
import { createUserSession } from '../../utils/session.server';

function Login() {
  const actionData = useActionData();
  return (
    <div className="auth-container">
      <div className="page-header">
        <h1>Login</h1>
      </div>
      <div className="page-content">
        <form method="POST">
          <fieldset>
            <legend>Login or register</legend>
            <label htmlFor="loginType">
              <input
                type="radio"
                name="loginType"
                id="login"
                value="login"
                defaultChecked={!actionData?.fields?.loginType || actionData?.fields?.loginType === 'login'}
              />
              <span> Login</span>
            </label>
            <label htmlFor="loginType">
              <input
                type="radio"
                name="loginType"
                id="register"
                value="register"
                defaultChecked={actionData?.fields?.loginType === 'register'}
              />
              <span> Register</span>
            </label>
          </fieldset>
          <div className="form-control">
            <label htmlFor="username">Username</label>
            <input type="text" name="username" id="username" defaultValue={actionData?.fields?.username} />
          </div>
          <div className="error">
            <p>{actionData?.fieldErrors?.username}</p>
          </div>

          <div className="form-control">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" defaultValue={actionData?.fields?.password} />
          </div>
          <div className="error">
            <p>{actionData?.fieldErrors?.password}</p>
          </div>

          <button className="btn btn-block btn-form" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
export default Login;

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const fields: LoginModel = {
    loginType: form.get('loginType') as 'login' | 'register',
    username: form.get('username') as string,
    password: form.get('password') as string
  };

  const fieldErrors: Record<keyof LoginModel, string> = {
    username: validateUsername(fields.username),
    password: validatePassword(fields.password),
    loginType: ''
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  switch (fields.loginType) {
    case 'login':
      const user = await login(fields);
      if (!user) {
        return badRequest({ fields, fieldErrors: { username: 'Invalid credentials' } });
      }
      return createUserSession(user.id, '/posts');

    case 'register':
      const userExists = await checkNewuser(fields.username);

      if (userExists) {
        return badRequest({
          fields,
          fieldErrors: { username: `User '${fields.username}' already exists` }
        });
      }
      const newUser = await register(fields);
      if (!newUser) {
        return badRequest({
          fields,
          formError: 'Something went wrong'
        });
      }

      return createUserSession(newUser.id, '/posts');
    default:
      return badRequest({
        fields,
        formError: 'Login type is not valid'
      });
  }
};

function validateUsername(title: FormDataEntryValue | null): string {
  if (typeof title !== 'string' || title.length < 3) {
    return 'Name should be at least 3 characters long';
  }
  return '';
}

function validatePassword(title: FormDataEntryValue | null): string {
  if (typeof title !== 'string' || title.length < 3) {
    return 'Password should be at least 6 characters long';
  }
  return '';
}

function badRequest(data: {
  formError?: string;
  fieldErrors?: Partial<Record<keyof LoginModel, string>>;
  fields: LoginModel;
}): TypedResponse {
  return json(data, { status: 400 });
}
