# Webpack loader for GLSL shaders

A glsl shader loader for webpack, includes support for nested imports, 
allowing for smart code reuse among more complex shader implementations. 
The shader is returned as a string.

## Install

```shell
npm install --save-dev webpack-glsl-loader
```

## Usage

### With `require`

> **N.B.** As noted in the [webpack documentation](http://webpack.github.io/docs/using-
loaders.html#loaders-in-require), you should avoid using this and use the 
configuration method in the next section.

```javascript
require('webpack-glsl!./my-lovely-shader.glsl`;
```

### In configuration

```javascript
{
    module: {
        loaders: [
            {
                test: /\.glsl$/,
                loader: 'webpack-glsl'
            }
        ]
    }
}
```

and then

```javascript
require('./my-lovely-shader.glsl`;
```

### On command line

You can also define the module extension bind on the command line.

```shell
webpack --module-bind 'glsl=webpack-glsl'
```

## Imports

This loader supports an import syntax to allow you to maximise your code reuse
and keep those shaders
[DRY](http://en.wikipedia.org/wiki/Don%27t_repeat_yourself). This syntax is 
very similar to that of SASS.

### Example

File hierarchy:
```
src/
---- js/
---- ---- main.js
---- glsl/
---- ---- includes/
---- ---- ---- perlin-noise.glsl
---- ---- fragment.glsl
```

If I require my fragment shader inside `main.js`:

```javascript
...
var shader = require('../glsl/fragment.glsl');
...
```

I can have that shader include other `.glsl` files inline, like so:

```sass
@import ./includes/perlin-noise;
```

> **N.B.** all imports within `.glsl` files exclude the file extension and 
are relative to the file doing the importing.
