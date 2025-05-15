# Define goal

To program a calculator that takes in numbers and performs operations on them, performs functions like sin, cos, tan etc,

## Sub problems

- Input handling
- Evaluation of mathematical expression
- Display of result

### Input handling

The input should be stored in a string then passed into the eval function for evaluation.
--PROBLEM: How to recognise function input and double operators like addition and multiplication operators

The input should be stored in an array of tokens. the tokens should hold whole inputs like; multiple digit numbers 888, functions and their parameters sin(39), operators +, so we can look back to identify when a wrong input has been entered.

--QUESTION: How to collate and group the inputs into tokens?
types/classes of inputs:

- number (1, 2, 3, 4, 5, 6, 7, 8, 9, 0)
- operator (+, \*, /, ^, -, %)
- functions (sqrt, !, inverse, log, natural_log, sin, cos, tan)
- constants (pi, euler's_number)
- utility (backspace, clear, parenthesis, resize, change_angle_mode)
- calculate button
- decimal button

Now how do we handle each of these keys?

Initialize token list as an empty array

#### Numbers

For every number entered;

- if previous token is a number: join new number to previous token
- if previous token is an operator: create new token and add to token list
- if previous token is an open function: concatenate new number to the numbers in the previous token's parenthesis.
- if previous token is a closed function: append a multiplication operator to token list, then append the number as a new token
- if previous token is euler's number: calculation result = Error
- if previous token is pi: add multiplication operator as a token, then add number as new token
- if previous token is opening parenthesis: add number as a new token
- if previous token is decimal: concatenate number to the previous token

#### Operators

If token list is empty append token 0 to the list, then append new operator to list as new token

For every operator entered;

- if previous token is a number: add the operator as a new token
- if previous token is an operator:
  - if new operator is a minus operator add a open parenthesis token and a minus operator token
  - if new operator is any other operator, replace previous token with new operator
- if previous token is an open function: append new operator to previous token
- if previous token is a closed function: append new operator to token list as a new token
- if previous token is a constant: add new operator as a new token
- if previous token is a decimal point: add new operator as a new token

#### Functions

For every function entered

- if previous token is a
