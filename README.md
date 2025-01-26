# Docusaurus comment section plugin

> Checkout `DEV_README.md` file to learn about how this npm package is maintained.

This is pretty straightforward npm package code. For docusaurus (but, actually, can be used for any other react project) website to have comment section. Comments are stored in firestore database.

[npm package website](https://www.npmjs.com/package/docusaurus-comment-section)

[github](https://github.com/naglissul/docusaurus-comment-section)

## How to use

### Step 1: Setting up firestore database

1. Have Google account.
2. Go to console.firebase.google.com and create new project (or use an existing one), create firestore database.
3. Set security rules:

```json
rules_version = '2';

service cloud.firestore { match /databases/{database}/documents { match /posts/{postId} { allow read: if true; allow write: if true; } match /comments/{commentId} { allow read: if true; allow create: if ( request.resource.data.postId is string && request.resource.data.content is string && request.resource.data.timestamp is timestamp ); allow update: if true; allow delete: if false; } } }

```

4. Go to project settings and create an app (web app). Copy the `const firebaseConfig = { ... }` part.

### Step 2: Use the package (basic example)

```bash
npm install docusaurus-comment-section
```

in your react project root dir and you're good to go.

Here's the usage example. Or just checkout the `test-app/`. It has the complete usage example. For the `firebaseConfig` part just paste the copied part from firebase project created web app.

```js
import { CommentSection, FirebaseProvider } from "docusaurus-comment-section";

const firebaseConfig = {
  apiKey: "AIqaSyB9pUI5p93eatRFG4ZAU1g88oYACmDxXC4",
  authDomain: "abc.firebaseapp.com",
  projectId: "abc",
  storageBucket: "abc.firebasestorage.app",
  messagingSenderId: "496235222546",
  appId: "1:497425222546:web:404e256e643ff0337b44f4b",
};

function App() {
  return (
    <>
      <h1>Comments</h1>
      <FirebaseProvider config={firebaseConfig}>
        <CommentSection postId={"hohoho"} isDefaultVerified={true} />
      </FirebaseProvider>
    </>
  );
}

export default App;
```

### Step 3: Implementing in docusaurus blog posts (example)

Of course you can use component as you like, but here is one of the possible solutions - show comment section only in the end of single page blog post display.

```bash
npm run swizzle BlogPostPage --eject
```

And then insert this code in `src/theme/BlogPostPage/index.tsx`:

```js
      <BlogPostItem>{children}</BlogPostItem>

      {/* Added content */}
      <FirebaseProvider config={firebaseConfig}>
        <CommentSection postId={metadata.title} isDefaultVerified={true} />
      </FirebaseProvider>{" "}
      {/* End of added content */}

      {(nextItem || prevItem) && (
        <BlogPostPaginator nextItem={nextItem} prevItem={prevItem} />
      )}
```

Also, of course, include firebaseConfig constant in the file.

## How this works

Based on the website [sesinuliai.lt](https://sesinuliai.lt).

Firestore database structure:

```json
{
  "posts": [
    {
      "postId": "AnyIdButUnique",
      "isDefaultVerified": false
    }
  ],
  "comments": [
    {
      "postId": "AnyIdButUnique",
      "content": "Required content",
      "name": "Not required name, can be anonymous",
      "isAuthor": false,
      "email": "Not required email. Not shown",
      "verified": true
    }
  ]
}
```

More detailed explanation later.

## Future improvements

1. Ability to easily customize style.
2. Admin console for verifications.
3. Ability to make replies.
4. Informing user via email about given reply to the comment and about verification updates.
