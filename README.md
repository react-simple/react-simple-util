# React Simple! Utility Library
Basic utility functions for React application development
Documentation is not up-to-date, does not contain latest CultureInfo enhancements (formatting anmd parsing dates and numbers)

# Usage

## Installation
npm -i @react-simple/react-simple-util

## Build
npm run build

## Test
npm run test

## Import
import { ... } from "@react-simple/react-simple-util";

# Configuration
## REACT_SIMPLE_UTIL

Members in the REACT_SIMPLE_UTIL object can be set to update the behavior of the provided functions.

- **LOG_LEVEL**: The current level of logging, can be set to 'error', 'warning', 'debug', 'info', or 'trace', see Log chapter below

# Content

## Hooks
### useForceUpdate

The function returned by the **useForceUpdate()** hook can be used to update the calling hook/component.
(It sets an internal state to trigger the update.)

### useUniqueId
The **useUniqueId()** hook can be used to generate global unique identifiers. By default it returns a new GUID value (by calling newGuid()), but it
also supports appending prefix and suffix to it with the default '_' separator or using a custom separator.

## Log

Depending on the **REACT_SIMPLE_UTIL.LOG_LEVEL** value the below functions will write or not to the console.
When LogLevel.error is set only errors are logged, when LogLevel.warning is set errors and warnings are logged etc.
This is the priority order: [error, warning, debug, info, trace]

### Types

- **LogLevel**: The current level of logging, can be set in REACT_SIMPLE_UTIL.LOG_LEVEL to 'error', 'warning', 'debug', 'info', or 'trace'.

### Functions

- **logError**: Logs errors to the console if LOG_LEVEL is set to 'error', 'warning', 'debug', 'info' or 'trace'.
- **logWarning**: Logs warnings to the console if LOG_LEVEL is set to 'warning', 'debug', 'info' or 'trace'.
- **logDebug**: Logs warnings to the console if LOG_LEVEL is set to 'debug', 'info' or 'trace'.
- **logInfo**: Logs information to the console if LOG_LEVEL is set to 'info' or 'trace'.
- **logTrace**: Logs trace information to the console if LOG_LEVEL is set to 'trace'.
- **logMessage**: Expects the *logLevel* argument to specify which above method should be called with the rest of the arguments.

## Utils
Utility functions to work with arrays

### Types
- **Writable&lt;T&gt;**: Returns new writable type to get rid of readonly specifiers
- **Nullable&lt;T&gt;**: Returns new nullable type which can be undefined and null too
- **ObjectKey**: Returns type which can be used as a key for indexing objects (string, number, symbol)
- **PrimitiveType**: Returns type which covers all primitive/scalar types (string, number, boolean, Date)
- **ValueOrCallback&lt;Value&gt;**: Generic type which corresponds to a concrete value or a parameterless callback function returning the value
- **ValueOrCallbackWithArg&lt;Arg, Value&gt;**: Generic type which corresponds to a concrete value or a callback function with a single argument returning the value

#### Guid
- **Guid**: Type notation for GUID values (it's a string)

### State
- **StateSetter&lt;State&gt;**: State setter callback for state management hooks (partial state can be set with a direct value or with the usage of a callback function)
- **StateReturn&lt;State&gt;**: Return type for state management hooks ([State, StateSetter])

### Storybook
- **StorybookComponent&lt;P&gt;**: Type for Storybook components with typed properties

### Functions

#### Array
- **range, rangeFromTo**: Functions to return range of numbers in an array
- **getResolvedArray**: From values of type T | T[] returns the resolved array value (unchanged array value or an array made of a single item)
- **getNonEmptyValues, joinNonEmptyValues, concatNonEmptyValues, mapNonEmptyValues**: Helper functions which only operate on the non-empty values of the passed array (excludes null, undefined or empty string, includes zero and false)
- **convertArrayToDictionary**: Converts the given array to a string dictionary (Record<string, T>) by using the given callback to get the keys and values of array items
- **convertArrayToDictionary2**: Converts the given array to a two-level multi-keyyed string dictionary (Record<string, Record<string, T>>) by using the given callback to get the keys and values of array items
- **flatten, flatMap**: Clone array-of-arrays into a single flat array by concatenating the child arrays

#### Guid
- **Constants**: EMPTY_GUID, GUID_LENGTH
- **newGuid**: Returns new GUID value

#### Typing
- **isEmpty**: Returns wheter the passed value is null, undefined or empty string. Does not consider zero and false empty (different from 'falsy')
- **resolveEmpty**: Substitutes empty values with replacement values. The replacement value can be a direct value or a callback function which will be called.
- **isString, isNumber**, isBoolean, isDate, isArray, isFunction, isPrimitiveType: Type guards
- **isEmptyObject**: Returns whether the passed object is an object with no keys (!Object.keys())
- **getResolvedCallbackValue**: From values of type ValueOrCallback<Value> returns the resolved value (unchanged value or result of the callback function)
- **getResolvedCallbackWithArgsValue**: From values of type ValueOrCallbackWithArg<Arg, Value> returns the resolved value (unchanged value or result of the callback function when called with *args*)

# Links

- How to Set Up Rollup to Run React?: https://www.codeguage.com/blog/setup-rollup-for-react
- Creating and testing a react package with CRA and rollup: https://dev.to/emeka/creating-and-testing-a-react-package-with-cra-and-rollup-5a4l
- (react-scripts) Support for TypeScript 5.x: https://github.com/facebook/create-react-app/issues/13080
