/**
 * Parses CSV text into an array of objects with HTML-safe content.
 * Handles quoted fields with commas and line breaks.
 * @param {string} csvText - Raw CSV text content
 * @returns {Array<Object>} Parsed array of objects
 */
const parseCSV = (csvText) => {
  const rows = [];
  const lines = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      // Escaped quote
      current += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === '\n' && !inQuotes) {
      lines.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  if (current) {
    lines.push(current);
  }

  const headers = lines[0].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(h => h.trim().replace(/^"|"$/g, ''));

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i]
      .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
      .map(v => v.trim().replace(/^"|"$/g, '').replace(/\r?\n/g, '\\'));

    const obj = {};
    headers.forEach((key, j) => {
      obj[key] = values[j] || '';
    });
    rows.push(obj);
  }

  return rows;
};

export default parseCSV;
