# React Simple! Utility Library
Basic utility functions for React application development. This documentation is for version 0.5.0.
Supports the following features:
- Parsing and formatting number, date and boolean values using pre-defined (ISO, EN-US, HU) and custom cultures for localization and globalization. 
Any format can be specified using templates and regular expressions. 
Support for min/max decimal places, min digits, thousand separators, date/time formats in ISO or local format.
- Equality and relational comparers for value types, arrays and dictionaries/objects; deep comparison with custom callbacks.
- Iteration and deep copy helpers for arrays and dictionaries/objects with custom callbacks.
- Guid support
- Depth-first and breadth-first iteration helper
- Child member accessor for objects using full qualified paths for getting, setting and deleting members supporting nested objects, arrays, 
named references (@name) and root references (/).
- Evaluation of unary and binary operators dynamically over values.
- Content types and formats
- Logging with different log levels
- Call context support for embedding context objects (for logging or other purposes)
- Dependency injection for pluggable architecture. All the important methods can be replaced with custom implementation by setting REACT_SIMPLE_UTIL.DI members.

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

### REACT_SIMPLE_UTIL.LOGGING
- **LOG_LEVEL**: The current level of logging, can be set to 'error', 'warning', 'debug', 'info', or 'trace', see Log chapter below.
- **log**: Callback function which is used for logging. By default *logDefaultImplementation*() is set.

### REACT_SIMPLE_UTIL.CULTURE_INFO

- Contains all pre-defined cultures: **ISO, EN-US, HU** atm.
- Provides shortucts to all pre-defined **DATE_FORMATS, NUMBER_FORMATS** and **BOOLEAN_FORMATS**. 
(For example: CULTURE_INFO.DATE_FORMATS.ISO is the same object as CULTURE_INFO.ISO.DATE_FORMAT.)
- Contains the **CURRENT** and the **DEFAULT** cultures. The **CURRENT** culture can be set and it is used by all
*parse\*Local*() and *format\*Local*() functions for dates, numbers and booleans (see later).

### REACT_SIMPLE_UTIL.CALL_CONTEXT
- **LOG_LEVEL**: The default log level for call contexts. Can be overriden when creating contexts by calling **callContext()**.

### REACT_SIMPLE_UTIL.DI

Dependency injection references which will be called by the appropriate methods. For example **tryParseDate()** will 
call **REACT_SIMPLE_UTIL.DI.date.tryParseDate**, so it can be easily replaced with a custom implementation. 
The custom callback will be called with all parameters and a callback to the default implementation in case it only acts as a wrapper.

# Content

## Hooks
### useForceUpdate, useUpdateTarget

The **useForceUpdate()** returns a function to update the calling hook/component.
(It sets internal state to trigger the update.)

It can also be used to update all components using the **useUpdateTarget(*targetId*)** hook by specifying the *targetId*.
When updating components based on *targetId* also a notification message can be sent which is returned by the *useUpdateTarget*() hook.

### useUniqueId
The **useUniqueId()** hook can be used to generate global unique identifiers. By default it returns a new GUID value (by calling newGuid()), but it
also supports appending prefix and suffix to it with the default '_' separator or using a custom separator.

## Log

Depending on the **REACT_SIMPLE_UTIL.LOGGING.LOG_LEVEL** value the below functions will log to the console.
When LogLevel.error is set only errors are logged, when LogLevel.warning is set errors and warnings are logged etc.
Order of priority: [error, warning, debug, info, trace]

### Types

- **LogLevel**: The current level of logging, can be set in REACT_SIMPLE_UTIL.LOGGING.LOG_LEVEL to 'error', 'warning', 'debug', 'info', or 'trace'.

### Functions

- **logError**: Logs errors to the console if LOG_LEVEL is set to 'error', 'warning', 'debug', 'info' or 'trace'.
- **logWarning**: Logs warnings to the console if LOG_LEVEL is set to 'warning', 'debug', 'info' or 'trace'.
- **logDebug**: Logs warnings to the console if LOG_LEVEL is set to 'debug', 'info' or 'trace'.
- **logInfo**: Logs information to the console if LOG_LEVEL is set to 'info' or 'trace'.
- **logTrace**: Logs trace information to the console if LOG_LEVEL is set to 'trace'.
- **logMessage**: Expects the *logLevel* argument to specify which above method should be called with the rest of the arguments.

## Utils

### Types
- **Writable&lt;*T*&gt;**: Returns new writable type to get rid of readonly specifiers
- **Nullable&lt;*T*&gt;**: Returns new nullable type which can be undefined and null too
- **ObjectKey**: Returns type which can be used as a key for indexing objects (string, number, symbol)
- **ValueType**: Returns type which covers all primitive/scalar types (string, number, boolean, Date)
- **ValueOrCallback&lt;*Value*&gt;**: Generic type which corresponds to a concrete value or a parameterless callback function returning the value. See *getResolvedCallbackValue*().
- **ValueOrCallbackWithArg&lt;*Arg, Value*&gt;**: Generic type which corresponds to a concrete value or a callback function with a single argument returning the value. See *getResolvedCallbackValueWithArg*().
- **ValueOrArray&lt;*Value*&gt;** Generic type to express a value or an array of such values. See *getResolvedArray*().
- **DatePart**: Date part specified for date handling functions (year/month/day/hour/minute/second/millisecond).
- **Guid**: Type notation for GUID values (it's a string)
- **StringCompareOptions**: String comparison supports trimming and case insensitive comparison
- **NumberFormatOptions, DateFormatOptions, BooleanFormatOptions**: Parameters for formatting and parsing values.
- **CompareReturn**: Return value for relational comparison (-1, 0, 1).
- **ContentType, ContentTypeCategory**: Values of different HTML content types and extensions are defined in CONTENT_TYPE and in CONTENT_TYPES by category (documents, images etc.)
- **StateSetter&lt;*State*&gt;**: State setter callback for state management hooks (partial state can be set with a direct value or with the usage of a callback function)
- **StateReturn&lt;*State*&gt;**: Return type for state management hooks ([*State*, *StateSetter*])
- **StorybookComponent&lt;*P*&gt;**: Type for Storybook components with typed properties
- **GetObjectChildMemberOptions&lt;*ValueType*&gt;**: Parameters for getting accessors for child members of objects hierarchially 
by providing the full qualified name of the member in the object tree ("name.name[0].name" etc.) Named value (@name) and root (/) references are supported, also the hierarchical iteration can be customized by providing custom callbacks.
- **GetObjectChildMemberReturn&lt;*ValueType, RootObj*&gt;, ObjectWithFullQualifiedName**: Return type for getting accessors for child members. 
Provides iteration details and get, set and delete accessors (callbacks) for the given member in the object tree.
- **ArrayIterationNode&lt;*Item*&gt;**: Iteration object passed to callback functions when iterating object trees depth-first or breadth-first.
- **ValueBinaryOperator, ValueUnaryOperator**: Supported operators for custom operator evaluation.

#### CultureInfo (DateTimeFormat, NumberFormat, BooleanFormat)

Formatting specifiers for localization and globalization.

- **DATE_FORMATS, NUMBER_FORMATS, BOOLEAN_FORMATS** and **CULTURE_INFO** contains predefined formats (**ISO, EN-US, HU** atm.),
but additional formats can be defined.
- **REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT** can be set to the desired default culture (EN-US by default).
- Formatting functions have *default*, *local* and *ISO* variants: *tryParseNumber*(), *tryParseNumberLocal*(), *tryParseNumberISO*()).
- The local version uses the CURRENT culture and the default version requies a format/culture parameter.
- For dates and booleans multiple formats can be specified simoultaneously and the matching one will be recognized automatically.

### Functions

#### Common
- **isEmpty**: Returns wheter the passed value is null, undefined or empty string. Does not consider zero and false empty (different from 'falsy')
- **resolveEmpty**: Substitutes empty values with replacement values. The replacement value can be a direct value or a callback function which will be called.
- **isString, isNumber, isBoolean, isDate, isArray, isFunction, isValueType, isFile**: Type guards
- **isEmptyObject**: Returns whether the passed object is an object with no keys (!Object.keys())
- **getResolvedCallbackValue**: From values of type *ValueOrCallback*&lt;*Value*&gt; returns the resolved value (unchanged value or result of the callback function)
- **getResolvedCallbackWithArgsValue**: From values of type *ValueOrCallbackWithArg*&lt;*Arg, Value*&gt; returns the resolved value (unchanged value or result of the callback function when called with *args*)
- **getResolvedArray**: From values of type *ValueOrArray*&lt;*Value*&gt; returns the resolved array or array with a single value;
supports custom *splitValue*() callback to split the parameter if it's a single value only and not an array already.

#### Array
- **range, rangeFromTo**: Functions to return range of numbers in an array
- **getNonEmptyValues, joinNonEmptyValues, concatNonEmptyValues, mapNonEmptyValues**: Helper functions which only operate on the non-empty values of the passed array (excludes null, undefined or empty string, includes zero and false)
- **arrayReplaceFromTo, arrayReplaceAt, arrayInsertAt, arrayRemoveFromTo, arrayRemoveAt**: Replace internal parts of arrays (from/to or start/count)
- **getDistinct, getDistinctValues, getDistinctBy**: Various helper funtions to get distict values from a list or dictint member values of objects or distinct list of
objects based on their specified member value (first occurent of an object with that member value is returned only).
- **sortArray, sortArrayBy**: Sort arrays and return new arrays. Supports proper (shallow) comparison of all types by using *compareValues*() by default, but a
custom comparer can be specified; for deep object comparison use *compareObjects*().
- **recursiveIteration**: Iterates the array and the objects inside recursively. Processes the whole object tree either breadth-first (default), 
or depth-first. Uses the provided **getChildren()** method for the iteration and will invoke the given **callback()** function for all items. 
(Uses a queue so no recursive method calls will be made.)
- **findMapped**: Finds the first matching item after mapping the items sequentially. Unlike the **filter(map())** construct it won't map all items first.

##### Array Comparison

- **compareArrays, sameArrays**: For all types we have comparison functions returning [-1, 0, 1] and equality checks. In case of arrays the comparison is shallow,
items are compared by using *compareValues*() and not *compareObjects*() by default, but a custom comparer can be specified. Also supports **StringCompareOptions**.

#### Boolean

##### Boolean Comparison

- **compareBoolean**: Compares boolean values and returns [-1, 0, 1]

##### Boolean Localization

- **tryParseBoolean, tryParseBooleanLocal, tryParseBooleanISO**: While *tryParseBoolean*() expects the format parameter (see CULTURE_INFO and BOOLEAN_FORMATS),
*tryParseBooleanLocal*() will automatically use **REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT** and *tryParseBooleanISO*() is using **BOOLEAN_FORMATS.ISO**.
- **formateBoolean, formatBooleanLocal, formatBooleanISO**: Format boolean values using specific formats. *formatBoolean*() expects the format parameter,
*formatBooleanLocal*() uses **REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT** and *formatBooleanISO*() uses **BOOLEAN_FORMATS.ISO**.

#### Call Context

Call context can be used to run code inside a context which contexts can be recursivelly embedded into each other and at every moment the 
executed code can access the current context and also the custom data associated with the context. 
Contexts must have a key and will have a generated guid ID assigned.

- **CALLCONTEXT_DATA**: Contains all opened contexts and the current context. The current context contains all its parent contextes and 
can contain custom data.
- **callContext**: Creates a new context. The context must be closed by either calling the returned **complete(*error?*)** method 
(usually in a try-catch-finally block) or the returned **run(*action*)** method can be used to execute code inside the context after which 
the context will be closed automatically.

#### Date

- **getDate, getToday, getFirstDayOfMonth, getLastDayOfMonth, getDaysInMonth**: Various date query functions (*getDate*() and *getToday*() cuts of the time portion).
- **getDatePart, setDatePart, dateAdd**: Modify specific parts of dates.

##### Date Comparison

- **compareDates, sameDates**: Compare specified date values (*compareDates*() returns [-1, 0, 1], while *sameDates*() returns true/false)

##### Date Localization

- **tryParseDate, tryParseDateLocal, tryParseDateISO, tryParseDateLocalOrISO**: While *tryParseDate*() expects the format parameter (see CULTURE_INFO and DATE_FORMATS),
*tryParseDateLocal*() will automatically use **REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT** and *tryParseDateISO*() is using **DATE_FORMATS.ISO**.
Multiple formats can be used simoultaneously (regular expressions) and the recognized one will be used.
- **formateDate, formatDateLocal, formatDateISO**: Format dates without time portion using specific formats. *formatDate*() expects the format parameter,
*formatDateLocal*() uses **REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT** and *formatDateISO*() uses **DATE_FORMATS.ISO**.
- **formateDateTime, formatDateTimeLocal, formatDateTimeISO**: Same as *formatDate*() methods but supports the time portion.

#### Dictionary (associative array)

- **convertArrayToDictionary**: Converts the given array to a string dictionary (Record<string, T>) by using the given callback to get the keys and values of array items
- **convertArrayToDictionary2**: Converts the given array to a two-level multi-keyyed string dictionary (Record<string, Record<string, T>>) by using the given callback to get the keys and values of array items
- **iterateDictionary, filterDictionary, mapDictionary, copyDictionary**: Various helper methods to work with associative array
- **mergeDictionaries, appendDictionary**: Merges (creates new) and appends (in-place) dictionaries.

##### Dictionary Comparison

- **compareDictionaries, sameDictionaries**: For all types we have comparison functions returning [-1, 0, 1] and equality checks.
In case of associative arrays the comparison is shallow, values are compared by using *compareValues*() and not *compareObjects*() by default,
but a custom comparer can be specified. Also supports **StringCompareOptions**.
 
#### Guid
- **CONSTANTS**: EMPTY_GUID, GUID_LENGTH
- **newGuid**: Returns new GUID value

#### Number

- **clamp, roundDown, roundUp**: Various helper methods for numbers (round methods expect *unit* parameter)

##### Number Comparison

- **compareNumbers**: Compares numbers and returns [-1, 0, 1]

##### Number Localization

- **tryParseNumber, tryParseNumberLocal, tryParseNumberISO**: While *tryParseNumber*() expects the format parameter (see CULTURE_INFO and NUMBER_FORMATS),
*tryParseNumberLocal*() will automatically use **REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT** and *tryParseNumberISO*() is using **NUMBER_FORMATS.ISO**.
- **formateNumber, formatNumberLocal, formatNumberISO**: Format numbers using specific formats. *formatNumber*() expects the format parameter,
*formatNumberLocal*() uses **REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT** and *formatNumberISO*() uses **NUMBER_FORMATS.ISO**.

#### Object

- **removeKeys, mapObject, deepCopyObject**: Helper methods for objects
- **mapObject, deepCopyObject**: Shallow maps an object or deep copies the entire object tree with custom callbacks.
- **getObjectChildMember**: Returns accessors for a nested object member by parsing the provided full qualified name.
  - Understands nested object (.), array ([n]), named (@name) or root object (/) references.
  - Returns the details of the member with all its parents from the object tree and also the **getValue(), setValue()** and **deleteMember()** callbacks to update the member.
  - In *options* custom **getValue, setValue** and **deleteMember** callbacks can be specified to navigate the object tree. For example, by default 
  nested objects are accessed using the **parent[*childName*]** format, but it can be overriden by specifying a custom **options.getValue()** callback to 
  return **parent.childNodes[*childName*]** for example, depending on the object model traversed.

##### Object Comparison

- **compareObjects, sameObjects**: For all types we have comparison functions returning [-1, 0, 1] and equality checks.
***For objects the comparison is deep by default***, objects are compared by using *compareObjects*() and values are compared by using *compareValues*(),
but custom comparers can be specified for both. Also supports **StringCompareOptions**.

# Links

- How to Set Up Rollup to Run React?: https://www.codeguage.com/blog/setup-rollup-for-react
- Creating and testing a react package with CRA and rollup: https://dev.to/emeka/creating-and-testing-a-react-package-with-cra-and-rollup-5a4l
- (react-scripts) Support for TypeScript 5.x: https://github.com/facebook/create-react-app/issues/13080
