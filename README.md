# xyz
A Node.js framework to develop applications and APIs for spatial data.

This readme is striclty for development notes in regard to code style, testing and (potentially) breaking changes.

Detailed release notes will only be published post v1.0.

Please visit the [developer guide](https://geolytix.gitbook.io/xyz-developer-guide) for a description of the project structure, configuration, and methods.

Visit the [user guide](https://geolytix.gitbook.io/xyz-user-guide) for a detailed description of the client interface.


We are still to complete the documentation and implement tests prior to a initial master release.

This branch does not make use of BabelJS to transpile the code.

xyz_entry.js *should* load in modern browser which support ES6 modules. There are however no improvements made to pre-load ressources or to facilitate http2 for parallel loads.

xyz_entry is bundled with webpack4 to facilitate module concatenation and minification of the bundle.

Leaflet, Leaflet.VectorGrid and some D3 modules are included in the bundle.



## Notable Changes:

Restructure of the \_xyz object.

Workspace is now \_xyz.ws

host, token, view_mode, log, nanoid on root \_xyz.*

Utils are now in \_xyz.utils

Svg_symbol create method and hook methods are now in \_xyz.utils

Classlist methods have been deprecated from utils. Native [classList](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList) methods add, remove, contains, toggle should be used.

utils.createElement has been replaced with the utils.\_createElement

Fonts are now in a seperate public folder. Only css should be in public\/css. Only js should be in public\/js



## Notes:

When moving js modules into folder the first file should be prefixed with \_

e.g. `import locations from './location/_locations.mjs';`

Object keys should not be quoted.

Single quotes should be used in JS, double quote in HTML. Allowing the use of HTML double quotes in JS strings.

Event listeners should be added to dom items through the createElement method.

Items should be appended to parents through the createElement method.

Arrow functions should be used where possible.

Array functions forEach and map should be used where appropriate. Object maps should faciliotate values as well as keys.

Default ES6 export should be used for factory type methods. Named exports for library type modules.

Comments should always have an empty row above.

If statements with a single expression should be in line.



Prevent large conditional blocks if possible.

DO `if (e.target.status !== 200) return`

DONT `if (e.target.status === 200) { ... }`
