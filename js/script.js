let displayValue = '0';
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

const display = document.querySelector('.result');
const clearButton = document.getElementById('clear');

function updateDisplay() {
    display.textContent = displayValue;

    const displayContainer = document.querySelector('.display');
    const maxWidth = displayContainer.clientWidth - 40;
    let fontSize = 80;

    display.style.fontSize = `${fontSize}px`;

    while (display.scrollWidth > maxWidth) {
        fontSize -= 1;
        display.style.fontSize = `${fontSize}px`;
    }

    clearButton.textContent = displayValue === '0' && firstOperand === null ? 'AC' : 'C';
}

function inputDigit(digit) {
    if (digit === ',') return;
    if (waitingForSecondOperand) {
        displayValue = digit;
        waitingForSecondOperand = false;
    } else {
        displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
    updateDisplay();
}

function inputDecimal() {
    if (waitingForSecondOperand) {
        displayValue = '0,';
        waitingForSecondOperand = false;
        updateDisplay();
        return;
    }
    if (!displayValue.includes(',')) {
        displayValue += ',';
    } else {
    }
    updateDisplay();
}

function handleOperator(nextOperator) {
    const inputValue = parseFloat(displayValue.replace(',', '.'));

    if (operator && waitingForSecondOperand) {
        operator = nextOperator;
        updateActiveOperator(nextOperator);
        return;
    }

    if (firstOperand === null && !isNaN(inputValue)) {
        firstOperand = inputValue;
    } else if (operator) {
        const result = calculate(firstOperand, inputValue, operator);
        displayValue = `${parseFloat(result.toFixed(7))}`.replace('.', ',');
        firstOperand = result;
    }

    waitingForSecondOperand = true;
    operator = nextOperator;
    updateActiveOperator(nextOperator);
    updateDisplay();
}

function updateActiveOperator(nextOperator) {
    const operators = document.querySelectorAll('.button.operator');
    operators.forEach(op => {
        if (op.dataset.operator === nextOperator && nextOperator !== '=') {
            op.classList.add('active');
        } else {
            op.classList.remove('active');
        }
    });

    if (nextOperator === '=') {
        const equalButton = document.querySelector('.button.operator[data-operator="="]');
        equalButton.classList.add('active');
        setTimeout(() => equalButton.classList.remove('active'), 150);
    }
}

function calculate(first, second, op) {
    switch (op) {
        case '+': return first + second;
        case '-': return first - second;
        case '×': return first * second;
        case '÷': return second === 0 ? 'Error' : first / second;
        default: return second;
    }
}

function resetCalculator() {
    displayValue = '0';
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
    updateActiveOperator(null);
    updateDisplay();
}

function handleFunction(func) {
    switch (func) {
        case 'AC':
        case 'C':
            resetCalculator();
            break;
        case '+/-':
            displayValue = (parseFloat(displayValue.replace(',', '.')) * -1).toString().replace('.', ',');
            updateDisplay();
            break;
        case '%':
            displayValue = (parseFloat(displayValue.replace(',', '.')) / 100).toString().replace('.', ',');
            updateDisplay();
            break;
    }
}

function simulateButtonClick(button) {
    if (!button) return;
    button.classList.add('active');
    setTimeout(() => button.classList.remove('active'), 150);
}

document.querySelector('.buttons').addEventListener('click', (event) => {
    if (!event.target.matches('button')) return;

    if (event.target.classList.contains('number')) {
        inputDigit(event.target.textContent);
    }

    if (event.target.classList.contains('operator')) {
        handleOperator(event.target.textContent);
    }

    if (event.target.textContent === ',') {
        inputDecimal();
    }

    if (event.target.classList.contains('function')) {
        handleFunction(event.target.textContent);
    }
});

document.addEventListener('keydown', (event) => {
    const { key, altKey } = event;
    let button;

    if (key >= '0' && key <= '9') {
        button = document.querySelector(`.button.number[data-key="${key}"]`);
        simulateButtonClick(button);
        inputDigit(key);
    } else if (key === '.' || key === ',') {
        button = document.querySelector('.button[data-key="comma"]');
        simulateButtonClick(button);
        inputDecimal();
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        const operatorMap = {
            '+': '+',
            '-': '-',
            '*': '×',
            '/': '÷'
        };
        button = document.querySelector(`.button.operator[data-key="${operatorMap[key]}"]`);
        simulateButtonClick(button);
        handleOperator(operatorMap[key]);
    } else if (key === 'Enter' || key === '=') {
        button = document.querySelector('.button.operator[data-key="="]');
        simulateButtonClick(button);
        handleOperator('=');
    } else if (key === 'Backspace') {
        if (displayValue.length > 1) {
            displayValue = displayValue.slice(0, -1);
        } else {
            displayValue = '0';
        }
        updateDisplay();
    } else if (key === 'Escape') {
        if (altKey) {
            button = document.querySelector('.button.function[data-key="Escape"]');
            simulateButtonClick(button);
            handleFunction('AC');
        } else {
            button = document.querySelector('.button.function[data-key="Escape"]');
            simulateButtonClick(button);
            handleFunction(clearButton.textContent);
        }
    } else if (key.toUpperCase() === 'C') {
        button = document.querySelector('.button.function[data-key="Escape"]');
        simulateButtonClick(button);
        handleFunction('C');
    } else if (altKey && key === '-') {
        button = document.querySelector('.button.function[data-key="+/-"]');
        simulateButtonClick(button);
        handleFunction('+/-');
    } else if (key === '%') {
        button = document.querySelector('.button.function[data-key="%"]');
        simulateButtonClick(button);
        handleFunction('%');
    }
});

updateDisplay();
