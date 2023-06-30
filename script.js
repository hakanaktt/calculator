"use strict"; // Strict Mode ON

//Author: Hakan AK
//Date: 28.06.2023
//Version: 1.0
//Description: A simple calculator with keyboard functionality that can do basic math operations
//Features: 12 digit display, 4 operators, decimal point, negative numbers, backspace, clear, log, evaluate

//Main function
function calculate() {
  //Function that waits for the DOM to load and then runs the code
  document.addEventListener("DOMContentLoaded", function () {
    //Variables
    const buttons = document.querySelectorAll(".btn");
    const calc = document.querySelector(".calculation");
    const operatorSymbols = ["+", "-", "/", "*"];
    let digit = "";

    //Event listener that waits for a click on the buttons on the interface then runs the handleButtonClick function
    buttons.forEach((button) => {
      button.addEventListener("click", handleButtonClick);
    });

    //Event listener for keyboard input and then runs the handleKeyDown function
    document.addEventListener("keydown", handleKeyDown);

    //Function that waits for a button press and then runs the button related function
    function handleButtonClick(event) {
      const button = event.target.closest("button");
      if (!button) return; // Ignore clicks on elements other than buttons

      //Picks up the digit number from the data-digit attribute written in button elements
      const digit = Number(button.dataset.digit);
      //const digit = Number(button.classList[1].split("-")[1]);
      //Digit picker version of the code which uses second class of the buttons to relate the button numbers (btn-1, btn-2 e.g.)

      if (isNaN(digit)) return; // Ignore clicks on buttons without a valid digit

      switch (
        digit //Checks digits for non digit buttons and attaches them to their related functions
      ) {
        case 0:
          handleZeroDigit(); //Function for 0 digit
          break;
        case 10:
          handleClear(); //Function for clear button
          break;
        case 11:
          handleBackspace(); //Function for backspace button
          break;
        case 12:
          logCurrentValue(); //Function for log button
          break;
        case 17:
          handleNegative(); //Function for negative button
          break;
        case 18:
          handleDecimal(); //Function for decimal button
          break;
        case 19:
          handleEquals(); //Function for equals button
          break;
        default:
          handleNumberOrOperator(digit); //Function for all other buttons
          break;
      }
    }

    //Function to handle keyboard interactions
    function handleKeyDown(event) {
      const key = event.key;

      //Handling number keys
      if (!isNaN(Number(key))) {
        key === "0" ? handleZeroDigit() : handleNumberOrOperator(Number(key));
        return;
      }

      //Handling operator keys
      if (operatorSymbols.includes(key)) {
        handleNumberOrOperator(getOperatorDigit(key));
        return;
      }

      //Handling decimal point key
      if (key === "." || key === ",") {
        handleDecimal();
        return;
      }

      //Handling equals key
      if (key === "Enter" || key === "=") {
        handleEquals();
        return;
      }

      //Handle clear key
      if (key === "Escape" || key === "Delete") {
        handleClear();
        return;
      }

      //Handling backspace key
      if (key === "Backspace") {
        handleBackspace();
        return;
      }
    }

    /*Functions for interface buttons' interaction*/

    //Function for 0 digit
    //Prevents the user from entering multiple zeros or adds a zero to the expression if the expression is empty
    function handleZeroDigit() {
      if (calc.value === "0") {
        calc.value = "0";
      } else {
        calc.value += "0";
      }
    }

    //Function for clear button
    //Clears the expression
    function handleClear() {
      calc.value = "0";
    }

    //Function for backspace button
    //Removes the last character of the expression
    function handleBackspace() {
      calc.value = calc.value.slice(0, -1);
    }

    //Function for log button
    //Logs the current value of the expression into the console
    function logCurrentValue() {
      console.log(calc.value, typeof calc.value);
    }

    //Function for negative button
    //Adds a negative sign to the expression if the last character is a number
    function handleNegative() {
      const lastChar = calc.value.slice(-1);
      if (lastChar === ")") return;
      if (isLastCharNumber()) {
        calc.value = "-(" + calc.value + ")";
      } else {
        alert(`You can only add 12 numbers on the screen!`);
      }
    }

    //Function for decimal button
    //Adds a decimal point to the expression if the last character is a number
    function handleDecimal() {
      if (isLastCharNumber()) {
        calc.value += ".";
      }
    }

    //Function for equals button
    //Function for evaluating the expression using the evaluate function from math.js library in order to prevent the use of eval() function
    function handleEquals() {
      try {
        const result = math.evaluate(calc.value);
        calc.value = result;
      } catch (error) {
        alert("Invalid Expression. Nice Try!");
      }
    }

    //Function for all other buttons

    //Checks if the last character of the expression is an operator and if the current character is an operator and replaces the last operator with the current operator
    //If the last character is a number and the current character is an operator, adds the operator to the expression
    //If the last character is a number and the current character is a number, adds the number to the expression
    function handleNumberOrOperator(digit) {
      if (calc.value.length >= 12) return;

      const lastChar = calc.value.slice(-1);
      const isLastCharOperator = isOperatorTest(lastChar);
      const isCurrentCharOperator = isOperator(digit);

      if (isLastCharOperator && isCurrentCharOperator) {
        // Replace the last operator with the current operator
        calc.value = calc.value.slice(0, -1) + getOperatorSymbol(digit);
      } else {
        if (isCurrentCharOperator) {
          if (isLastCharNumber()) {
            calc.value += getOperatorSymbol(digit);
          }
        } else {
          if (calc.value === "0") {
            calc.value = "";
          }
          calc.value += digit;
        }
      }
    }

    //Helper functions
    //Function that prevents the user from entering multiple operators by checking if the last character of the expression is an operator
    function isOperatorTest(operator, array) {
      array = operatorSymbols;
      for (let i = 0; i < operatorSymbols.length; i++) {
        if (operator === operatorSymbols[i]) {
          return true;
        }
      }
      return false;
    }
    //Checks if button connected the digit is an operator
    function isOperator(digit) {
      return digit >= 13 && digit <= 16;
    }

    //Function that returns the operator symbol
    function getOperatorSymbol(digit) {
      return operatorSymbols[digit - 13];
    }

    //Function checks if the last character of the expression is a number
    function isLastCharNumber() {
      return typeof Number(calc.value.slice(-1)) === "number";
    }

    //Gets the digit related to the operator in case we enter the input from the keyboard
    function getOperatorDigit(symbol) {
      return operatorSymbols.indexOf(symbol) + 13;
    }
  });
}
//Calling the main function
calculate();

//Function that I use to see the resolution of the screen to set my css properties
/* window.addEventListener("resize", resolution);
function resolution() {
  const resolution = document.querySelector(".resolution");
  const width = window.innerWidth;
  const height = window.innerHeight;
  resolution.textContent = `Your screen resolution is ${width} x ${height}`;
}
resolution();
//refreshes the resolution text when the window is resized
window.addEventListener("resize", resolution); */
