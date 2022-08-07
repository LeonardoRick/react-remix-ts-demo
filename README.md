# react-remix-ts-demo

|Home|Login|Posts List| New Post | Post Detail|
|:---:|:--:|:--------:|:--------:|:-----------:|
![image](https://user-images.githubusercontent.com/17517057/183308879-be6a6966-5679-4858-a9c2-ef5d70e840b2.png)|![image](https://user-images.githubusercontent.com/17517057/183308892-50b1b963-1bcd-4247-b002-a3cf8b5e19c7.png)|![image](https://user-images.githubusercontent.com/17517057/183308900-06015750-aa11-4abd-be43-c2749aee1b3a.png)|![image](https://user-images.githubusercontent.com/17517057/183308903-aada7919-3df9-4211-9bab-494f4b3ecee9.png)|![image](https://user-images.githubusercontent.com/17517057/183308914-dd362211-f841-408d-87cd-8f1980160ac7.png)

Basic project that shows a demo of a a Remix (<https://remix.run>) app

To run:
1. `npm i`
2. `npx prisma db push`
3. `node prisma/seed.js`
4. `npm run dev`

Remix has SSR just out of the box!

Open the see page source of any page and see the SEO content over there.

This project shows some Remix features such as

- Routing
- Loader (loader() and useLoaderData)
- Action (action() and useActionData)
- Error Boundary
- Absolute imports with '~'
- link (< link>)
- meta (< meta>)
- createCookieSessionStorage to manage authentication

The authentication is stored as a cookie and manage the following app features:
- Users can only create posts when authenticated
- Users can only deleted their own created posts
- When logged the header and home changes its content to show username

We also use thiss features to complement the app

- Prisma as database with SQLite
- bcrypt to hash user password

This app follows the Amazing Remix Crash Course on YouTube:
<https://www.youtube.com/watch?v=d_BhzHVV4aQ>
