function eval() {
    // Do not use eval!!!
    return;
}

function isNumeric(num) {
    return !isNaN(parseFloat(num)) && !isNaN(num - 0);
}

function isOperator(symbol) {
    return ["+", "-", "*", "/"].includes(symbol);
}

function parseExpression(expr) {
    expr = expr.trim();
    let result = [];

    for (let i = 0; i < expr.length; i++) {
        let symbol = expr[i];
        if (isNumeric(symbol)) {
            if (isNumeric(result[result.length - 1])
                || (result[result.length - 1] == "-" && (!result[result.length - 2] || isOperator(result[result.length - 2])))) {
                result[result.length - 1] += symbol;
            } else {
                result.push(symbol);
            }
        } else if (symbol == ".") {
            result[result.length - 1] += symbol;
        } else if (isOperator(symbol)) {
            result.push(symbol);
        }
    }
    return result;
}

function findMinIndex(expr, operatorOne, operatorTwo) {
    let indexOne = expr.indexOf(operatorOne);
    let indexTwo = expr.indexOf(operatorTwo);

    if (indexOne > 0 && indexTwo > 0) {
        return indexOne > indexTwo ? indexTwo : indexOne;
    }

    if (indexOne < 0 && indexTwo < 0) {
        return -1;
    }

    if (indexOne < 0 || indexTwo < 0) {
        return indexOne < 0 ? indexTwo : indexOne;
    }
}

function evalExpr(expr) {
    if (expr.length > 1) {
        expr = expr.map(e => e instanceof Array ? evalExpr(e) : e);
        let index = findMinIndex(expr, "*", "/");
        if (index < 0) {
            index = findMinIndex(expr, "+", "-");
        }

        let operator = expr[index];
        let x = parseFloat(expr[index - 1]);
        let y = parseFloat(expr[index + 1]);

        let result = 0;
        switch (operator) {
            case "+":
                result = x + y;
                break;
            case "-":
                result = x - y;
                break;
            case "*":
                result = x * y;
                break;
            case "/":
                if (y == 0) throw "TypeError: Division by zero.";
                result = x / y;
                break;
            default:
                throw "ExpressionError: Not supported operator.";
        }

        expr[index - 1] = result;
        expr.splice(index, 2);

        return evalExpr(expr);
    }

    return expr[0];
}

function expressionCalculator(expr) {
    let countStart = expr.split("").filter(e => e == "(").length;
    let countEnd = expr.split("").filter(e => e == ")").length;
    if (countStart != countEnd) throw "ExpressionError: Brackets must be paired";

    while (expr.lastIndexOf("(") > 0) {
        let start = expr.lastIndexOf("(");
        let end = expr.indexOf(")", start);
        let bracketsExpr = expr.slice(start + 1, end);
        expr = expr.replace(expr.slice(start, end + 1), expressionCalculator(bracketsExpr));
    }
    
    let elements = parseExpression(expr);
    return evalExpr(elements);
}

module.exports = {
    expressionCalculator
}