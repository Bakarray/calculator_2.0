# Scientific Calculator Pseudocode

## Overview

This pseudocode outlines the design and logic for a scientific calculator that supports basic arithmetic operations (+, -, \*, /, ^), trigonometric functions (sin, cos, tan), square roots, logarithms, factorials, reciprocals, constants (π, e), parentheses, and utility functions like backspace, clear, and angle mode switching (degrees/radians). The goal is to provide a structured plan that can be implemented in a programming language, with a focus on clarity and extensibility.

---

## Development Process Documentation

### Initial Thoughts

- **Goal:** Create a calculator that goes beyond basic arithmetic to include scientific functions.
- **Approach:** Initially, I thought of building the expression as a single string (e.g., "2 + 3 \* 4") and evaluating it directly. This seemed simple for basic operations.
- **Challenges Identified:** String evaluation struggles with operator precedence (e.g., 2 + 3 \* 4 should be 14, not 20) and complex expressions like "sin(30) + 2". Parentheses and functions add complexity.
- **Alternative Considered:** Parsing the expression into tokens and using a mathematical algorithm to handle precedence and evaluation.

### Refinement

- **Token-Based Approach:** Decided to use a list of tokens (e.g., ["2", "+", "3", "*", "4"]) instead of a string. This makes it easier to separate numbers, operators, and functions.
- **Parsing:** Researched and settled on the Shunting Yard algorithm to convert infix notation (user input) to postfix notation (e.g., ["2", "3", "4", "*", "+"]), which simplifies evaluation by removing parentheses and enforcing precedence.
- **Evaluation:** Chose a stack-based approach for postfix evaluation, as it naturally handles the order of operations in postfix form.
- **Features:** Added support for angle modes, constants, and utilities after realizing their importance in a scientific context.

### Final Design

- **Structure:** The calculator will have global variables to track the expression, helper functions for parsing and evaluation, and event-driven input handling for user interactions.
- **Extensibility:** Used dictionaries to define operators and functions, making it easy to add new ones later.
- **Error Handling:** Included basic checks for common issues like division by zero and unmatched parentheses, with room for expansion.

This pseudocode reflects the evolution from a simple string-based calculator to a robust, token-based scientific calculator with a clear development path.

---

## Global Variables

# Thinking: Need variables to maintain state across operations. A token list is better than a string for parsing, and angle mode is essential for trig functions.

- **token_list**: List of strings representing the current expression tokens (e.g., ["2", "+", "sin", "(", "30", ")"])
- **current_token**: String to build multi-digit numbers or decimals (e.g., "3.14")
- **angle_mode**: String ("radians" or "degrees") to adjust trigonometric calculations
- **paren_depth**: Integer to track the balance of parentheses (ensures valid expressions)

## Initialization

# Thinking: Start with a clean slate. Default to radians since it’s standard in math libraries.

Initialize:
token_list = []
current_token = ""
angle_mode = "radians"
paren_depth = 0

---

## Helper Data and Functions

### Constants

# Thinking: Define commonly used constants for convenience and accuracy.

constants = {
"pi": 3.1415926535,
"e": 2.7182818284
}

### Operators

# Thinking: Use a dictionary with lambda functions for flexibility. Initially thought of hardcoding operations, but this allows easy expansion (e.g., adding mod later).

operators = {
"+": lambda a, b: a + b,
"-": lambda a, b: a - b,
"_": lambda a, b: a _ b,
"/": lambda a, b: a / b if b != 0 else error("Division by zero"),
"^": lambda a, b: a \*\* b
}

### Functions

# Thinking: Map scientific functions to their implementations. Trig functions need angle mode adjustment, which I’ll handle during evaluation.

functions = {
"sin": sin, # Assume sin() is a built-in function
"cos": cos,
"tan": tan,
"sqrt": sqrt, # Assume sqrt() handles non-negative inputs
"ln": log, # Natural logarithm
"log10": log10, # Base-10 logarithm
"factorial": factorial, # Assume factorial() handles non-negative integers
"recip": lambda x: 1 / x if x != 0 else error("Reciprocal of zero")
}
trig_functions = ["sin", "cos", "tan"] # Subset needing angle mode adjustment

### Utility Functions

# Thinking: These helpers simplify parsing and evaluation. Initially considered inline logic but extracted them for clarity.

function is_number(s): # Check if a string can be converted to a float
try:
float(s)
return True
except ValueError:
return False

function get_precedence(op): # Define operator precedence for Shunting Yard
if op in ["+", "-"]:
return 1
elif op in ["*", "/"]:
return 2
elif op == "^":
return 3
else:
return 0 # For parentheses or functions

function is_left_associative(op): # Most operators are left-associative; ^ is an exception
return op in ["+", "-", "*", "/"]

function is_right_associative(op): # Power operator is right-associative
return op == "^"

---

## Input Handling

# Thinking: Initially planned to append everything to a string, but a token list with current_token for numbers is more robust. Each button triggers specific logic.

for each button press: ### Digits and Decimal
if button is a digit (0-9):
current_token = current_token + button # Build number, e.g., "3" -> "34"
display_expression()

    elif button is ".":
        if "." not in current_token:  # Prevent multiple decimals
            current_token = current_token + "."
        display_expression()

    ### Operators
    elif button in operators:
        if current_token != "":
            token_list.append(current_token)  # Finalize number
            current_token = ""
        token_list.append(button)
        display_expression()

    ### Functions
    elif button in functions:
        if current_token != "":
            token_list.append(current_token)
            current_token = ""
        token_list.append(button)
        if button != "recip":  # Reciprocal doesn’t need parentheses
            token_list.append("(")
            paren_depth = paren_depth + 1
        display_expression()

    ### Constants
    elif button in constants:
        if current_token != "":
            token_list.append(current_token)
            current_token = ""
        token_list.append(button)
        display_expression()

    ### Parentheses
    elif button is "(":
        if current_token != "":
            token_list.append(current_token)
            current_token = ""
        token_list.append("(")
        paren_depth = paren_depth + 1
        display_expression()

    elif button is ")":
        if current_token != "":
            token_list.append(current_token)
            current_token = ""
        if paren_depth > 0:
            token_list.append(")")
            paren_depth = paren_depth - 1
        else:
            display_error("Unmatched closing parenthesis")
        display_expression()

    ### Utilities
    elif button is "backspace":
        if current_token != "":
            current_token = current_token[:-1]  # Remove last digit
        elif token_list is not empty:
            last = token_list.pop()
            if last == "(":
                paren_depth = paren_depth - 1
            elif last == ")":
                paren_depth = paren_depth + 1
            # Simplistic; doesn’t undo function names perfectly
        display_expression()

    elif button is "clear":
        token_list = []
        current_token = ""
        paren_depth = 0
        display "0"

    elif button is "angle_toggle":
        angle_mode = "degrees" if angle_mode == "radians" else "radians"
        display_expression()  # Show current state

    ### Evaluation
    elif button is "=":
        if current_token != "":
            token_list.append(current_token)
            current_token = ""
        if paren_depth != 0:
            display_error("Unmatched parentheses")
        else:
            postfix = shunting_yard(token_list)
            result = evaluate_postfix(postfix)
            display result
            token_list = [str(result)]  # Allow further operations
            current_token = ""

---

## Shunting Yard Algorithm

# Thinking: Initially considered evaluating infix directly, but Shunting Yard handles precedence and parentheses elegantly. Adapted it for functions too.

function shunting_yard(token_list):
Inputs:
token_list: List of tokens in infix order (e.g., ["2", "+", "3", "*", "4"])
Outputs:
output_queue: List of tokens in postfix order (e.g., ["2", "3", "4", "*", "+"])

    Initialize:
        output_queue = []
        operator_stack = []

    For each token in token_list:
        if is_number(token) or token in constants:
            output_queue.append(token)  # Operands go straight to output

        elif token in functions:
            operator_stack.append(token)  # Treat functions like operators

        elif token in operators:
            # Pop operators based on precedence and associativity
            while (operator_stack is not empty AND
                   operator_stack[-1] in operators AND
                   ((is_left_associative(token) AND get_precedence(operator_stack[-1]) >= get_precedence(token)) OR
                    (is_right_associative(token) AND get_precedence(operator_stack[-1]) > get_precedence(token)))):
                output_queue.append(operator_stack.pop())
            operator_stack.append(token)

        elif token == "(":
            operator_stack.append(token)

        elif token == ")":
            while operator_stack is not empty AND operator_stack[-1] != "(":
                output_queue.append(operator_stack.pop())
            if operator_stack is not empty AND operator_stack[-1] == "(":
                operator_stack.pop()  # Discard "("
                if operator_stack is not empty AND operator_stack[-1] in functions:
                    output_queue.append(operator_stack.pop())  # Apply function

    while operator_stack is not empty:
        if operator_stack[-1] == "(":
            error("Unmatched opening parenthesis")
        else:
            output_queue.append(operator_stack.pop())

    Return output_queue

---

## Postfix Evaluation

# Thinking: Stack-based evaluation is perfect for postfix. Initially forgot about functions; added unary operation handling.

function evaluate_postfix(postfix_list):
Inputs:
postfix_list: List of tokens in postfix order (e.g., ["2", "3", "4", "*", "+"])
Outputs:
result: Float or error

    Initialize:
        value_stack = []

    For each token in postfix_list:
        if is_number(token):
            value_stack.append(float(token))

        elif token in constants:
            value_stack.append(constants[token])

        elif token in operators:
            b = value_stack.pop()
            a = value_stack.pop()
            result = operators[token](a, b)  # Errors handled in operator definition
            value_stack.append(result)

        elif token in functions:
            x = value_stack.pop()
            if angle_mode == "degrees" AND token in trig_functions:
                x = x * constants["pi"] / 180  # Convert to radians
            result = functions[token](x)
            value_stack.append(result)

    if length(value_stack) != 1:
        error("Invalid expression")
    Return value_stack[0]

---

## Display Functions

# Thinking: Separate display logic for clarity. Initially thought of inline updates, but functions are cleaner.

function display_expression():
expression = " ".join(token_list) + ("" if current_token == "" else " " + current_token)
display expression

function display(value):
output value to screen # UI-specific

function display_error(message):
output message to screen

---

## Example Usage

### Input: "2 + sin(30)" in degrees mode

1. **token_list**: ["2", "+", "sin", "(", "30", ")"]
2. **Shunting Yard**: ["2", "30", "sin", "+"]
3. **Evaluation**:
   - Stack: [2]
   - Stack: [2, 30]
   - Stack: [2, sin(30°)] → [2, 0.5] (since sin(30°) = 0.5)
   - Stack: [2 + 0.5] → [2.5]
4. **Result**: 2.5

---

## Notes

- **Error Handling:** Basic checks are included (division by zero, parentheses). Add more for edge cases like sqrt(-1) or factorial of negatives.
- **Extensibility:** Add new operators (e.g., "%") or functions (e.g., "exp") by updating dictionaries.
- **UI Considerations:** This assumes a button-based interface. Adapt for text input if needed.

This pseudocode provides a comprehensive blueprint for a scientific calculator, documenting the journey from a basic concept to a fully planned solution.
