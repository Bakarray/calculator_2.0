// Global variables
let token_list = [];
let current_token = "";
let angle_mode = "radians";
let paren_depth = 0;

// Html element selectors
const inputDisplay = document.querySelector(".input_display");
const resultDisplay = document.querySelector(".result_display");
const angleModeBtnTxt = document.querySelector(".angle_mode");

// Event listeners for button clicks
document.querySelectorAll(".key").forEach((key) => {
  key.addEventListener("click", () => {
    const buttonText = key.textContent;
    handleButtonClick(buttonText);
  });
});

// Handle button click
function handleButtonClick(buttonText) {
  if (buttonText >= "0" && buttonText <= "9") {
    current_token += buttonText;
  } else if (buttonText === ".") {
    if (!current_token.includes(".")) {
      current_token += ".";
    }
  } else if (["+", "-", "×", "÷", "^", "%"].includes(buttonText)) {
    if (current_token !== "") {
      token_list.push(current_token);
      current_token = "";
    }
    const operatorMap = {
      "+": "+",
      "-": "-",
      "×": "*",
      "÷": "/",
      "^": "^",
      "%": "%",
    };
    token_list.push(operatorMap[buttonText]);
  } else if (["sin", "cos", "tan", "√", "lg", "ln"].includes(buttonText)) {
    if (current_token !== "") {
      token_list.push(current_token);
      current_token = "";
    }
    const functionMap = {
      sin: "sin",
      cos: "cos",
      tan: "tan",
      "√": "sqrt",
      lg: "lg",
      ln: "ln",
    };
    token_list.push(functionMap[buttonText]);
    token_list.push("(");
    paren_depth++;
  } else if (["π", "e"].includes(buttonText)) {
    if (current_token !== "") {
      token_list.push(current_token);
      current_token = "";
    }
    const constantMap = {
      π: "pi",
      e: "e",
    };
    token_list.push(constantMap[buttonText]);
  } else if (buttonText === "(") {
    if (current_token !== "") {
      token_list.push(current_token);
      current_token = "";
    }
    token_list.push("(");
    paren_depth++;
  } else if (buttonText === ")") {
    if (current_token !== "") {
      token_list.push(current_token);
      current_token = "";
    }
    if (paren_depth > 0) {
      paren_depth--;
      token_list.push(")");
    } else {
      displayResult("Error: unmatched )");
    }
  } else if (buttonText === "C") {
    token_list = [];
    current_token = "";
    paren_depth = 0;
    displayResult("");
  } else if (buttonText === "⌫") {
    if (current_token !== "") {
      current_token = current_token.slice(0, -1);
    } else if (token_list.length > 0) {
      let lastToken = token_list.pop();
      if (lastToken === "(") {
        paren_depth--;
      } else if (lastToken === ")") {
        paren_depth++;
      }
    }
  } else if (buttonText === "=") {
    if (current_token !== "") {
      token_list.push(current_token);
      current_token = "";
    }
    if (paren_depth !== 0) {
      displayResult("Error: unmatched (");
    } else {
      let postfix = shunting_yard(token_list);
      let result = evaluate_postfix(postfix);
      displayResult(result);
      // token_list = [result.toString()];
    }
  } else if (["deg", "rad"].includes(buttonText)) {
    angle_mode = angle_mode === "radians" ? "degrees" : "radians";
    angleModeBtnTxt.textContent =
      angleModeBtnTxt.textContent === "deg" ? "rad" : "deg";
  } else if (buttonText === "x!") {
    if (current_token !== "") {
      token_list.push(current_token);
      current_token = "";
    }
    token_list.push("factorial");
  } else if (buttonText === "x⁻¹") {
    if (current_token !== "") {
      token_list.push(current_token);
      current_token = "";
    }
    token_list.push("reciprocal");
  }
  // Todo: implement logic for resize and arc-sin...

  updateDisplay();
}

// Use objects to define operators and functions to make it easy to modify and add new ones

// constants
const constants = { pi: Math.PI, e: Math.E };

// operators
const operators = {
  "+": (a, b) => a + b,
  "-": (a, b) => a - b,
  "*": (a, b) => a * b,
  "/": (a, b) => (b !== 0 ? a / b : Infinity),
  "^": (a, b) => a ** b,
  "%": (a, b) => a % b,
};

// prefix functions
const functions = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  sqrt: Math.sqrt,
  lg: Math.log10,
  ln: Math.log,
};

const trig_functions = ["sin", "cos", "tan"];

// Unary postfix operators
const postfix_operators = {
  "!": factorial,
  reciprocal: (x) => (x !== 0 ? 1 / x : Infinity),
};

// Factorial function
function factorial(n) {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  let result = 1;
  if (n > 0) {
    for (let i = n; i > 0; i--) {
      result *= i;
    }
    return result;
  } else if (n == 0) {
    return result;
  }
}

// Operator precedence
function get_precedence(op) {
  if (op in postfix_operators) return 4;
  if (op === "^") return 3;
  if (op === "*" || op == "/") return 2;
  if (op === "+" || op == "-") return 1;

  return 0;
}

// Associativity
// The '^' operator is right associative
function is_left_associative(op) {
  return op in operators || op in postfix_operators;
}

function is_right_associative(op) {
  return op === "^";
}

// Shunting yard algorithm to convert math expressions into postfix (RPN) for easier evaluation
function shunting_yard(token_list) {
  let output_queue = [];
  let operator_stack = [];

  for (let token of token_list) {
    if (!isNaN(parseFloat(token))) {
      output_queue.push(token);
    } else if (token in constants) {
      output_queue.push(token);
    } else if (token in functions || token in postfix_operators) {
      operator_stack.push(token);
    } else if (token in operators) {
      while (
        operator_stack.length > 0 &&
        (operator_stack[operator_stack.length - 1] in operators ||
          operator_stack[operator_stack.length - 1] in postfix_operators) &&
        ((is_left_associative(token) &&
          get_precedence(operator_stack[operator_stack.length - 1]) >=
            get_precedence(token)) ||
          (is_right_associative(token) &&
            get_precedence(operator_stack[operator_stack.length - 1]) >
              get_precedence(token)))
      ) {
        output_queue.push(operator_stack.pop());
      }
      operator_stack.push(token);
    } else if (token === "(") {
      operator_stack.push(token);
    } else if (token === ")") {
      while (
        operator_stack.length > 0 &&
        operator_stack[operator_stack.length - 1] !== "("
      ) {
        output_queue.push(operator_stack.pop());
      }
      if (
        operator_stack.length > 0 &&
        operator_stack[operator_stack.length - 1] === "("
      ) {
        operator_stack.pop();

        if (
          operator_stack.length > 0 &&
          operator_stack[operator_stack.length - 1] in functions
        ) {
          output_queue.push(operator_stack.pop());
        }
      }
    }
  }

  // After exhausting the input tokens and operators are still in stack
  while (operator_stack.length > 0) {
    // discard unmatched '('
    if (operator_stack[operator_stack.length - 1] === "(") {
      operator_stack.pop();
    } else {
      output_queue.push(operator_stack.pop());
    }
  }

  return output_queue;
}

// function to evaluate the RPN expression
function evaluate_postfix(postfix_list) {
  let value_stack = [];

  for (let token of postfix_list) {
    if (!isNaN(parseFloat(token))) {
      value_stack.push(parseFloat(token));
    } else if (token in constants) {
      value_stack.push(constants[token]);
    } else if (token in operators) {
      let b = value_stack.pop();
      let a = value_stack.pop();
      let result = operators[token](a, b);
      value_stack.push(result);
    } else if (token in functions || token in postfix_operators) {
      let x = value_stack.pop();
      if (angle_mode === "degrees" && trig_functions.includes(token)) {
        x = (x * Math.PI) / 180;
      }
      let func =
        token in functions ? functions[token] : postfix_operators[token];
      let result = func(x);

      value_stack.push(result);
    }
  }

  return value_stack.length > 0 ? value_stack[0] : NaN;
}

// update input display
function updateDisplay() {
  let expression =
    token_list.join(" ") + (current_token ? " " + current_token : "");
  inputDisplay.textContent = expression || "0";
}

// Display result
function displayResult(value) {
  let displayValue = "";

  if (typeof value === "number" && !isNaN(value)) {
    displayValue = value.toString();
  } else if (typeof value === "string" && value.startsWith("Error")) {
    displayValue = value;
  } else if (value === "") {
    displayValue = "";
  } else {
    displayValue = "Error";
  }

  resultDisplay.textContent = displayValue;
}

// Initialize display
updateDisplay();
