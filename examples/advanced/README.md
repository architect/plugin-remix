# Advanced Example: Architect + Remix App

This example is "advanced" in that it leverages all options in `@architect/plugin-remix`. It does not fully flex Remix's capabilities.

## Project files

### app.arc

The relevant settings in `app.arc`

```arc
@remix
app-directory remix
build-directory .build
server-handler custom-remix-handler.js
```

### remix.config.js

Since `app-directory` is set in app.arc, this setting should be mirrored in Remix configuration:

```js
module.exports = {
  // if declaring a custom "app-directory" in app.arc > @remix,
  // this option must be set to match
  appDirectory: 'remix'
}
```

Technical note: this is due to the order of operations when combining plugin defaults, configured plugin options, Remix defaults, and the final generated Remix config.

[Remix config documentation](https://remix.run/docs/en/v1/api/conventions#remixconfigjs)

### custom-remix-handler.js

`@architect/plugin-remix` provides a default handler function for the Remix server, but for advanced usage it may be beneficial to create a custom handler and set the `server-handler` option.

### .env

An example .env file is included. Rename example.env to .env.

.env is automatically loaded by Architect. `NODE_ENV=development` enables Remix's live reload.

### .gitignore

It is advised to exclude Remix artifacts from version control. Adding the value of `build-directory` (in this case: `.build`) to your .gitignore will ignore both server and client builds from git.

### remix.env.d.ts

Even though this advanced example isn't written in Typescript, this type declaration file helps editors like VS Code with intellisense.
