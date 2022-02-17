@app
arc-remix-example-advanced

@plugins
architect/plugin-remix

@remix
# mount /remix
app-directory remix
build-directory .build
server-handler custom-remix-handler.js
# persist-build true

@static
