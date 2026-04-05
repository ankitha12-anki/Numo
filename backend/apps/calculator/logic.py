import math
from simpleeval import SimpleEval, NameNotDefined

class CalculatorLogic:
    def __init__(self):
        self.evaluator = SimpleEval()
        
        # Add math functions
        self.evaluator.functions = {
            'sin': lambda x: math.sin(math.radians(x)),
            'cos': lambda x: math.cos(math.radians(x)),
            'tan': lambda x: math.tan(math.radians(x)),
            'log': math.log10,
            'ln': math.log,
            'sqrt': math.sqrt,
            'pow': pow,
            'factorial': math.factorial,
            'abs': abs
        }
        
        # Add math constants
        self.evaluator.names = {
            'pi': math.pi,
            'e': math.e
        }

    def evaluate(self, expression):
        try:
            # Basic cleanup
            expression = expression.lower().replace('^', '**')
            result = self.evaluator.eval(expression)
            return float(result)
        except Exception as e:
            raise ValueError(f"Invalid expression: {str(e)}")
