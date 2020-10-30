# read-a-dir utility to recursively load a directory contents

## Quick build guide

Build the lib with this command:

    $ npm install
    $ npm build
 
### API

#### `readdir (root, [options])`

Builds a directory representation of the files in the given root path.

This function will traverse the contents of `root`
[depth-first](https://en.wikipedia.org/wiki/Depth-first_search) manner.

By default a list of the files (not directories) paths are returned. This
behavior can be tuned with the `options` parameters.

The options object can include the following parameters:

* `fs`, the filesystem object (e.g.
  [memfs](https://github.com/streamich/memfs#readme)) used to read the files
  from. If not provided, Default Node.js 'fs' will be required instead.

* `includeDirs`, set it to `true` to return directories in the result.
  Otherwise directories will be traversed but not returned by the `readdir`
  function.

* `includeHidden`, set it to `true` to process the hidden (starting with dot
  `.`) files in the processing. Ignored by default.

* `filter`, a predicate to filter paths. A function like `(path) => false` will
  not process any file. Note that `includeDirs` and `includeHidden` are checked
  before this filter.

