import { create, all } from 'mathjs';

const math = create(all);

export const calculateExpression = (expression: string): string => {
  try {
    // Basic sanitization and handling of common math symbols
    const sanitized = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/π/g, 'PI')
      .replace(/e/g, 'E')
      .replace(/√\(/g, 'sqrt(')
      .replace(/log\(/g, 'log10(')
      .replace(/ln\(/g, 'log(');

    const result = math.evaluate(sanitized);
    
    if (typeof result === 'number') {
      if (isNaN(result)) return 'Error';
      if (!isFinite(result)) return 'Infinity';
      // Format to 8 decimal places if needed
      return Number(result.toFixed(8)).toString();
    }
    
    return result.toString();
  } catch (error) {
    console.error('Calculation error:', error);
    return 'Error';
  }
};
