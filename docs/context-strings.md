Provides some helper functions to work with strings.  This list is also added to the available filters
inside your EJS templates.

-----

## **Utility**

function    | parameters          | usage
------------|---------------------|---------------------------------------
identity    | value               | returns itself
isBlank     | value               | true if its null, or trimmed to empty
isNotString | value               | true if it's not `typeof 'string'`

## identity

Returns the **input** as **output**. Great for functional programming like sorting or fallbacks.

** arguments **

* `value` can be `any` type which becomes the return value of this function.

** returns **

* the `value` that was passed in

```js
context.strings.identity('hello')   // hello
context.strings.identity(4)         // 3
context.strings.identity([1, 'a'])  // [1, 'a']
```

## isBlank
The `isBlank()` function is for...

## isNotString
The `isNotString()` function is for...

-----
## **Growing**

function    | parameters          | usage
------------|---------------------|---------------------------------------
identity    | value               | returns itself
isBlank     | value               | true if its null, or trimmed to empty
isNotString | value               | true if it's not `typeof 'string'`
camelCase   | value               | thisIsCamelCase
kebabCase   | value               | this-is-kebab-case
snakeCase   | value               | this_is_snake_case
upperCase   | value               | THIS IS UPPER CASE
lowerCase   | value               | this is lower case
startCase   | value               | This is start case
upperFirst  | value               | Changes the first character to upper case
lowerFirst  | value               | changes the first character to lower case 
pascalCase  | value               | ThisIsPascalCase
pad         | value, length, char | Pads a string to a length with by filling char
padStart    | value, length, char | Pads the start of a string
padEnd      | value, length, char | Pads the end of string
trim        | value, length, char | Removes whitespace from the edges
trimStart   | value               | Removes whitespace from the front
trimEnd     | value               | Removes whitespace from the back
repeat      | value, count        | Repeats a value, count times

## pad
The `pad()` function is for...

## padStart
The `padStart()` function is for...

## padEnd
The `padEnd()` function is for...

## repeat
The `repeat()` function is for...

-----
## **Shrinking**

function    | parameters          | usage
------------|---------------------|---------------------------------------
trim        | value, length, char | Removes whitespace from the edges
trimStart   | value               | Removes whitespace from the front
trimEnd     | value               | Removes whitespace from the back

## trim
The `trim()` function is for...

## trimStart
The `trimStart()` function is for...

## trimEnd
The `trimEnd()` function is for...

-----

## **Case Conversion**

function    | parameters          | usage
------------|---------------------|---------------------------------------
camelCase   | value               | thisIsCamelCase
kebabCase   | value               | this-is-kebab-case
snakeCase   | value               | this_is_snake_case
upperCase   | value               | THIS IS UPPER CASE
lowerCase   | value               | this is lower case
startCase   | value               | This is start case
upperFirst  | value               | Changes the first character to upper case
lowerFirst  | value               | changes the first character to lower case 
pascalCase  | value               | ThisIsPascalCase

## camelCase
The `camelCase()` function is for...

## kebabCase
The `kebabCase()` function is for...

## snakeCase
The `snakeCase()` function is for...

## upperCase
The `upperCase()` function is for...

## lowerCase
The `lowerCase()` function is for...

## startCase
The `startCase()` function is for...

## upperFirst
The `upperFirst()` function is for...

## lowerFirst
The `lowerFirst()` function is for...

## pascalCase
The `pascalCase()` function is for...
