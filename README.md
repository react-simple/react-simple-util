# React Simple! Utility Library
Basic utility functions for React application development. This documentation is for version 0.4.0.

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
- **Writable&lt;T&gt;**: Returns new writable type to get rid of readonly specifiers
- **Nullable&lt;T&gt;**: Returns new nullable type which can be undefined and null too
- **ObjectKey**: Returns type which can be used as a key for indexing objects (string, number, symbol)
- **ValueType**: Returns type which covers all primitive/scalar types (string, number, boolean, Date)
- **ValueOrCallback&lt;Value&gt;**: Generic type which corresponds to a concrete value or a parameterless callback function returning the value. See *getResolvedCallbackValue*().
- **ValueOrCallbackWithArg&lt;Arg, Value&gt;**: Generic type which corresponds to a concrete value or a callback function with a single argument returning the value. See *getResolvedCallbackValueWithArg*().
- **ValueOrArray&lt;Value&gt;** Generic type to express a value or an array of such values. See *getResolvedArray*().
- **DatePart**: Date part specified for date handling functions (year/month/day/hour/minute/second/millisecond).
- **Guid**: Type notation for GUID values (it's a string)
- **StorybookComponent&lt;P&gt;**: Type for Storybook components with typed properties
- **StringCompareOptions**: String comparison supports trimming and case insensitive comparison

#### ContentType, ContentTypeCategory

Values of different HTML content types and extensions are defined in CONTENT_TYPE and in CONTENT_TYPES by category (documents, images etc.)

#### CultureInfo (~DateTimeFormat, ~NumberFormat, ~BooleanFormat)

Formatting specifiers for localization.

- DATE_FORMATS, NUMBER_FORMATS, BOOLEAN_FORMATS and CULTURE_INFO contains predefined values (ISO, EN-US, HU atm.),
but additional formats can be defined.
- **REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT** can be set to the desired default culture (EN-US by default).
- Formatting functions have *default*, *local* and *ISO* variants: *tryParseNumber*(), *tryParseNumberLocal*(), *tryParseNumberISO*()).
- The local version uses the CURRENT culture and the default version expects a format/culture parameter.
- For dates and booleans multiple formats can be specified simoultaneously and it will be recognized automatically.

### State
- **StateSetter&lt;State&gt;**: State setter callback for state management hooks (partial state can be set with a direct value or with the usage of a callback function)
- **StateReturn&lt;State&gt;**: Return type for state management hooks ([State, StateSetter])

### Functions

#### Array
- **range, rangeFromTo**: Functions to return range of numbers in an array
- **getNonEmptyValues, joinNonEmptyValues, concatNonEmptyValues, mapNonEmptyValues**: Helper functions which only operate on the non-empty values of the passed array (excludes null, undefined or empty string, includes zero and false)
- **flatten, flatMap**: Clone array-of-arrays into a single flat array by concatenating the child arrays
- **arrayReplaceFromTo, arrayReplaceAt, arrayInsertAt, arrayRemoveFromTo, arrayRemoveAt**: Replace internal parts of arrays (from/to or start/count)
- **getDistinct, getDistinctValues, getDistinctBy**: Various helper funtions to get distict values from a list or dictint member values of objects or distinct list of
objects based on their specified member value (first occurent of an object with that member value is returned only).
- **sortArray, sortArrayBy**: Sort arrays and return new arrays. Supports proper (shallow) comparison of all types by using *compareValues*() by default, but a
custom comparer can be specified; for deep object comparison use *compareObjects*().

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

#### Date

- **getDate, getToday, getFirstDayOfMonth, getLastDayOfMonth, getDaysInMonth**: Various date query functions (*getDate*() and *getToday*() cuts of the time portion).
- **getDatePart, setDatePart, dateAdd**: Modify specific parts of dates.

##### Date Comparison

- **compareDates, sameDates**: Compare specified date values (*compareDates*() returns [-1, 0, 1], while *sameDates*() returns true/false)

##### Date Localization

- **tryParseDate, tryParseDateLocal, tryParseDateISO, tryParseDateLocalOrISO**: While *tryParseDate*() expects the format parameter (see CULTURE_INFO and DATE_FORMATS),
*tryParseDateLocal*() will automatically use **REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT** and *tryParseDateISO*() is using **DATE_FORMATS.ISO**.
Multiple formats can be used simoultaneously (which are RegExps) and the recognized one will be used.
- **formateDate, formatDateLocal, formatDateISO**: Format dates without time portion using specific formats. *formatDate*() expects the format parameter,
*formatDateLocal*() uses **REACT_SIMPLE_UTIL.CULTURE_INFO.CURRENT** and *formatDateISO*() uses **DATE_FORMATS.ISO**.
- **formateDateTime, formatDateTimeLocal, formatDateTimeISO**: Same as *formatDate*() methods but supports the time portion.

#### Dictionary (associative array)

- **convertArrayToDictionary**: Converts the given array to a string dictionary (Record<string, T>) by using the given callback to get the keys and values of array items
- **convertArrayToDictionary2**: Converts the given array to a two-level multi-keyyed string dictionary (Record<string, Record<string, T>>) by using the given callback to get the keys and values of array items
- **iterateDictionary, filterDictionary, mapDictionary, copyDictionary**: Various helper methods to work with associative array

##### Dictionary Comparison

- **compareDictionaries, sameDictionaries**: For all types we have comparison functions returning [-1, 0, 1] and equality checks.
In case of associative arrays the comparison is shallow, values are compared by using *compareValues*() and not *compareObjects*() by default,
but a custom comparer can be specified. Also supports **StringCompareOptions**.
 
#### Guid
- **Constants**: EMPTY_GUID, GUID_LENGTH
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

##### Object Comparison

- **compareObjects, sameObjects**: For all types we have comparison functions returning [-1, 0, 1] and equality checks.
***For objects the comparison is deep by default***, objects are compared by using *compareObjects*() and values are compared by using *compareValues*(),
but custom comparers can be specified for both. Also supports **StringCompareOptions**.
- **removeKeys, mapObject, deepCopyObject**: Helper methods for objects
- **getObjectChildMemberValue, setObjectChildMemberValue, removeObjectChildMemberValue**:                                             

#### Typing
- **isEmpty**: Returns wheter the passed value is null, undefined or empty string. Does not consider zero and false empty (different from 'falsy')
- **resolveEmpty**: Substitutes empty values with replacement values. The replacement value can be a direct value or a callback function which will be called.
- **isString, isNumber, isBoolean, isDate, isArray, isFunction, isValueType, isFile**: Type guards
- **isEmptyObject**: Returns whether the passed object is an object with no keys (!Object.keys())
- **getResolvedCallbackValue**: From values of type *ValueOrCallback*&lt;Value&gt; returns the resolved value (unchanged value or result of the callback function)
- **getResolvedCallbackWithArgsValue**: From values of type *ValueOrCallbackWithArg*&lt;Arg, Value&gt; returns the resolved value (unchanged value or result of the callback function when called with *args*)
- **getResolvedArray**: From values of type *ValueOrArray*&lt;Value&gt; returns the resolved array or array with a single value;
supports custom *splitValue*() callback to split the parameter if it's a single value only and not an array already.

# Links

- How to Set Up Rollup to Run React?: https://www.codeguage.com/blog/setup-rollup-for-react
- Creating and testing a react package with CRA and rollup: https://dev.to/emeka/creating-and-testing-a-react-package-with-cra-and-rollup-5a4l
- (react-scripts) Support for TypeScript 5.x: https://github.com/facebook/create-react-app/issues/13080
