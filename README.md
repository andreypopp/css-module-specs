# css-module-spec

Specification for reusable CSS modules.

It contains two integral parts:

  * `@export` declaration
  * Component declaration

## `@export` directive

`@export` directive is being used to declare which names should be exported to
JavaScript. This allows mangle class names to prevent name clashes between
several components and even compress class names. Also it provides additional
safety which prevents you from referencing unexistent class names in JS.

Stylesheets can export several class names into JS land:

    @export .component {

    }

    @export .another-component {

    }

Then the generated JS module is an object with class name mappings:

    var styles = require('./styles.css');
    styles.component;
    styles.anotherComponent;

The same scheme can be used with ES6 modules, like this:

    import component from './styles.css';

## Component declaration

`component.css`:

    @import "./utils" as utils;

    .component {

    }

    .component.element {

    }

    .component.$modifier {

    }

    .component.element.$modifier {

    }

    @export default .component;

Some alternative syntax proposals:

  * `component` could be an alternative to `.component`
    * less typing
    * confusion with with styling element names

  * `$modifier` could be an alternative to `::modifier`
    * cn be represented in JS

## Using from CommonJS

    var component = require('./component.css')

    component.element
    component.element.$modifier
    component.$modifier

## Using from ES6 modules

    import component from './component.css'

    component.element
    component.element['::modifier']
    component['::modifier']

## Alternative proposals

### Defining modules 2

    @import "./utils" as utils;

    @component button {

      some: styles;

      element {

      }

      $modifier {

      }
    }

### Defining modules 3

    @import "./utils" as utils;

    @component button {

      some: styles;

      @element caption {

      }

      @modifier pressed {

      }
    }
