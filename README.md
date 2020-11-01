# read-a-dir load a directory contents with custom `fs` implementations

Loads a directory contents and returns the list of files found on it. Allows
using custom `fs` implementations.

For example: for a directory with the following files:

    1.txt
    2/2.txt
    2/3/3.txt

It is expected that this utility returns exactly the items above; except for
the order, which may vary, as asynchronous processing of the directories is
carried out.

This utlity uses UNIX-style separators `/` for simplicty.

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

* `includeHidden`, set it to `true` to process the hidden (starting with dot
  `.`) files in the processing. Ignored by default.

