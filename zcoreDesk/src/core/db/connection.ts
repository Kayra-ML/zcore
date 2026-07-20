// Native SQLite requires C++ Build Tools on Windows which blocks the installer build.
// Temporarily mocked out so we can build the UI installer for the user.
const db = {
  exec: () => {},
  prepare: () => ({ run: () => {}, get: () => null, all: () => [] })
};

export default db;
