# React Simple! Utility Library
Basic utility functions for React application development. 

This documentation is for version 0.5.0.

Supports the following features:
- Equality and relational **comparers** for value types, arrays, dictionaries and objects; deep comparison customizable with callbacks.
- **Iteration** and **deep copy** helpers for arrays, dictionaries and objects fully customizable with callbacks
- Guid support
- Depth-first and breadth-first **recursive iteration** helper
- Unary and binary **operator evaluation** dynamically over values
- **Content types** and formats
- **Logging** with different log levels; by default to the console, but customizable with dependency injection
- **Call context** support for hierarchically embedding code blocks and accessing current context and context history from embedded code
- Forced **update of subscribed components** from other components which allows fine tuning React updates and provides a way for inter-component communication. For flux-like global state check the **useGlobalState()** hook in the **react-simple-state** package which along with React context provides a great alternative to the boilerplate heavy Redux.
- **Dependency injection** for pluggable architecture. All the important methods can be replaced with custom implementation by setting **REACT_SIMPLE_UTIL.DI** members.
- **Unit tests** for all fetaures

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

Members in the REACT_SIMPLE_UTIL object can be set to change the internal functions globally.

### REACT_SIMPLE_UTIL.LOGGING
- **LOG_LEVEL**: The current level of logging, can be set to **error, warning, debug, info** or **trace** to filter log messages.
- **log()**: Injectable callback function which is used for logging. By default console logging is used.

### REACT_SIMPLE_UTIL.CALL_CONTEXT
- **LOG_LEVEL**: The default log level for call contexts. Can be overriden when creating contexts.

### REACT_SIMPLE_UTIL.DI

Dependency injection references which will be called by the appropriate methods.

For example the **compareDates()** function will call the **REACT_SIMPLE_UTIL.DI.date.compareDates()** function, so it can be easily replaced with a custom implementation. 
The custom callback will be called with all parameters and the default implementation - **compareDates_default()** -, which makes wrapping the default behavior easier.

# Content

## Hooks
### useForceUpdate(), useUpdateTarget()

The **useForceUpdate()** hook returns a callback function to update the calling parent hook or component. It sets its internal state to trigger the forced update.

This hook can also be used to selectively other components subscribed using the **useUpdateTarget(*targetId*)** hook by specifying one or more *targetId*-s.
When updating components based on *targetId* also a notification message can be sent which is returned by the useUpdateTarget() hook when the subscribed component is updated.

### useUniqueId()
The **useUniqueId()** hook can be used to generate global unique identifiers. By default it returns a new GUID value, but it also supports appending prefix and suffix to it with the default '_' separator or using a custom separator. The generated ID value is stored in state.

## Log

Depending on the **REACT_SIMPLE_UTIL.LOGGING.LOG_LEVEL** value the below functions will log to the console by default or use whatever logging callback is set in **REACT_SIMPLE_UTIL.LOGGING.log()**. When **LogLevel.error** is set only errors are logged, when **LogLevel.warning** is set errors and warnings are logged etc.

Order of priority: error, warning, debug, info, trace

### Types

- **LogLevel**: The current level of logging, can be set in REACT_SIMPLE_UTIL.LOGGING.LOG_LEVEL to error, warning, debug, info, or trace.

### Functions

- **logError(*message, args*)**: Logs errors to the console if LOG_LEVEL is set to error, warning, debug, info or trace
- **logWarning(*message, args*)**: Logs warnings to the console if LOG_LEVEL is set to warning, debug, info or trace
- **logDebug(*message, args*)**: Logs warnings to the console if LOG_LEVEL is set to debug, info or trace
- **logInfo(*message, args*)**: Logs information to the console if LOG_LEVEL is set to info or trace
- **logTrace(*message, args*)**: Logs trace information to the console if LOG_LEVEL is set to trace
- **logMessage(*logLevel, message, args*)**: Expects the *logLevel* argument to specify which above method should be called

## Utils

### Types
- **Writable&lt;*T*&gt;**: Writable type to get rid of the *readonly* specifiers
- **Nullable&lt;*T*&gt;**: Nullable type which can be set to *undefined* or *null* (*T* | *undefined* | *null*)
- **Optional&lt;*T, K*&gt;**: Returns new type with nullable members specified by &lt;***K***&gt;
- **ObjectKey**: Type which can be used as a key for indexing objects (string, number, symbol)
- **ValueType**: Type which covers all primitive/scalar types (string, number, boolean, Date)
- **ValueOrCallback&lt;*Value*&gt;**: Generic type representing a concrete value or a parameterless callback function returning the value, see **getResolvedCallbackValue()**
- **ValueOrCallbackWithArg&lt;*Arg, Value*&gt;**: Generic type representing a concrete value or a callback function with a single argument returning the value, see **getResolvedCallbackValueWithArg()**
- **ValueOrArray&lt;*Value*&gt;** Generic type expressing a value or an array of values, see **getResolvedArray()**
- **DatePart**: Date part specified for date handling functions: year, month, day, hour, minute, second, millisecond
- **Guid**: String type for GUID values
- **StringCompareOptions**: Options fof string comparison functions supporting trimming and case insensitive comparison
- **CompareReturn**: Return value for relational comparison: -1 (first argument is less), 0 (equality), 1 (first argument is greater)
- **ContentType, ContentTypeCategory**: Values of different HTTP content types and extensions are defined in **CONTENT_TYPE** and groupped by category in **CONTENT_TYPES** (documents, images etc.)
- **StorybookComponent&lt;*P*&gt;**: Type for Storybook components with typed properties
- **ArrayIterationNode&lt;*Item*&gt;**: Iteration object passed to callback functions when iterating object trees depth-first or breadth-first in **recursiveIteration()**
- **ValueBinaryOperator, ValueUnaryOperator**: Supported operators for custom operator evaluation, see **evaluateUnaryOperator()** and **evaluateBinaryOperator()**

### Functions

#### Common
- **isEmpty()**: Returns wheter the passed value is *null*, *undefined*, empty string or *NaN*. Does not consider 0 and *false* empty (differs from "falsy")
- **resolveEmpty()**: Substitutes empty values. The substituted value can be specified as constant or returned by a callback function.
- **isString(), isNumber(), isBoolean(), isDate(), isArray(), isFunction(), isValueType(), isFile()**: Type guards
- **isEmptyObject()**: Returns whether the passed object is an object with no keys (!Object.keys().length)
- **getResolvedCallbackValue()**: Returns the resolved value from **ValueOrCallback&lt;*Value*&gt;**. (constant value or function return)
- **getResolvedCallbackWithArgsValue()**: Returns the resolved value from **ValueOrCallbackWithArg&lt;*Arg, Value*&gt;** (constant value or return value of a function with a single argument)
- **getResolvedArray()**: Returns the resolved values from **ValueOrArray&lt;*Value*&gt;** in an array. Can split single values, if needed.

#### Array
- **range(), rangeFromTo()**: Return range of numbers in an array
- **getNonEmptyValues(), joinNonEmptyValues(), concatNonEmptyValues(), mapNonEmptyValues()**: Helper functions processing only the non-empty values; exclude *null, undefined*, empty string, *NaN*; include 0 and *false*
- **arrayReplaceFromTo(), arrayReplaceAt(), arrayInsertAt(), arrayRemoveFromTo(), arrayRemoveAt()**: Replace parts of arrays by specifying *from-to* or *start-count* arguments
- **getDistinct(), getDistinctValues(), getDistinctBy()**: Helper funtions to get **distict values** or **dictint member values** or **objects with distinct member values** while keeping the order of the items returning only the first occurences.
- **sortArray(), sortArrayBy()**: Sort arrays by returning new array instances leaving the parameter arrays intact.
custom comparer can be specified; for deep object comparison use *compareObjects*().
- **recursiveIteration()**: Iterates arrays and objects recursively. Processes the whole object tree either *breadth-first* (default) or *depth-first*. Uses the provided **getChildren()** method for the iteration and will invoke the given **callback()** function for all items. (Uses a queue and makes no recursive calls to avoid stack overflow errors.)
- **findMapped()**: Finds the first matching item after mapping the items sequentially. Unlike the **filter(map())** construct it won't map all items first.

##### Array Comparison

- **compareArrays(), sameArrays()**: For all types we have comparison functions and equality checks. In case of arrays the comparison is shallow, items are compared by using **compareValues()** and not **compareObjects()** by default, but custom comparers can be used.  Supports **StringCompareOptions**.

#### Boolean

##### Boolean Comparison

- **compareBoolean()**: Compares boolean values and returns (-1, 0, 1)

#### Call Context

Call context can be used to run code blocks inside hierarchically embedded contexts and
the embedded code can access the current context, the data associated with the context, it's metadata (*level* for example), context history (all parents) and all open contexts.
Contexts must have a key and will have a generated guid ID assigned.

- **CALLCONTEXT_DATA**: Contains all opened contexts and the current context. The current context contains all its parent contextes and it's associated custom data.
- **callContext()**: Creates a new context. The context must be closed by either calling the returned **complete(*error?*)** method 
(usually in a *try-catch-finally* block) or the returned **run(*action*)** or **runAsync(*action*)** methods can be used to execute code inside the context after which 
the context will be closed automatically.

#### Date

- **getDate(), getToday(), getFirstDayOfMonth(), getLastDayOfMonth(), getDaysInMonth()**: Date query functions. *getDate*() and *getToday*() cut of the time portion.
- **getDatePart(), setDatePart(), dateAdd()**: Get and set specific date parts (year, month, day, hour, minute, second, millisecond)

##### Date Comparison

- **compareDates(), sameDates()**: Compare specified date values. *compareDates*() returns (-1, 0, 1) while *sameDates*() returns *true/false*

#### Dictionary (associative array)

- **convertArrayToDictionary&lt;*T*&gt;()**: Converts the given array to a string dictionary (Record<string, *T*>) by using the given callback to get the keys and values from array items
- **convertArrayToDictionary2()&lt;*T*&gt;**: Converts the given array to a two-level multi-keyyed string dictionary (Record<*string*, Record<*string, T*>>) by using the given callback to get the keys and values from array items
- **iterateDictionary(), filterDictionary(), mapDictionary(), copyDictionary()**: Helper methods to work with associative arrays
- **mergeDictionaries(), appendDictionary()**: Merge and append dictionaries (in-place or into a new dictionary)

##### Dictionary Comparison

- **compareDictionaries(), sameDictionaries()**: For all types we have comparison functions returning (-1, 0, 1) and equality checks.
In case of associative arrays the comparison is shallow, values are compared by using **compareValues**() and not **compareObjects**() by default, but custom comparers can be used. Supports **StringCompareOptions**.
 
#### Guid
- **Constants**: EMPTY_GUID, GUID_LENGTH
- **newGuid()**: Returns new GUID value

#### Number

- **clamp(), roundDown(), roundUp()**: Helpers for numbers; round methods expect *unit* parameter

##### Number Comparison

- **compareNumbers()**: Compares numbers and returns (-1, 0, 1)

#### Object

- **removeKeys(), mapObject(), deepCopyObject()**: Helper methods for objects
- **mapObject(), deepCopyObject()**: Shallow map an object or deep copy the entire object tree with custom callbacks

##### Object Comparison

- **compareObjects(), sameObjects()**: For all types we have comparison functions returning (-1, 0, 1) and equality checks.
***For objects the comparison is deep by default***, objects are compared by using **compareObjects**() and values are compared by using **compareValues**(), but custom comparers can be used.

#### Value (ValueType)

##### Value Comparison

- **compareValues(), sameValues()**: Compare specified values. **compareValues()** returns (-1, 0, 1), while **sameValues()** returns *true/false*. Supports **ValueType** types which are number, boolean, Date and string.

# Links

- How to Set Up Rollup to Run React?: https://www.codeguage.com/blog/setup-rollup-for-react
- Creating and testing a react package with CRA and rollup: https://dev.to/emeka/creating-and-testing-a-react-package-with-cra-and-rollup-5a4l
- (react-scripts) Support for TypeScript 5.x: https://github.com/facebook/create-react-app/issues/13080
