import React, { useState } from 'react';

function Rule({ onAddRule }) {
  const [action, setAction] = useState('allow');
  const [ipRanges, setIpRanges] = useState('');
  const [headerName, setHeaderName] = useState('');
  const [headerValue, setHeaderValue] = useState('');
  const [expression, setExpression] = useState('');

  const handleActionChange = (event) => {
    setAction(event.target.value);
  };

  const handleIpRangesChange = (event) => {
    setIpRanges(event.target.value);
  };

  const handleHeaderNameChange = (event) => {
    setHeaderName(event.target.value);
  };

  const handleHeaderValueChange = (event) => {
    setHeaderValue(event.target.value);
  };

  const handleExpressionChange = (event) => {
    setExpression(event.target.value);
  };

  const generateRuleYaml = () => {
    let yaml = '- action: ' + action + '\n';
    yaml += '  match:\n';

    if (ipRanges) {
      yaml += '    srcIpRanges: [' + ipRanges + ']\n';
    }

    if (headerName && headerValue) {
      yaml += '    headers:\n';
      yaml += `      - name: "${headerName}"\n`;
      yaml += `        exactMatch: "${headerValue}"\n`;
    }

    if (expression) {
      yaml += `    expr: "${expression}"\n`;
    }

    return yaml;
  };

  const handleAddRule = () => {
    const newRule = {
      action,
      ipRanges,
      headerName,
      headerValue,
      expression,
    };
    onAddRule(newRule);
  };

  return (
    <div>
      <div>
        <label htmlFor="action">Action:</label>
        <select id="action" value={action} onChange={handleActionChange}>
          <option value="allow">allow</option>
          <option value="deny">deny</option>
          {/* Add more actions as needed */}
        </select>
      </div>

      <div>
        <label htmlFor="ipRanges">IP Ranges (comma-separated):</label>
        <input
          type="text"
          id="ipRanges"
          value={ipRanges}
          onChange={handleIpRangesChange}
          placeholder="e.g., 192.168.1.0/24, 2001:db8::/32"
        />
      </div>

      <div>
        <label htmlFor="headerName">Header Name:</label>
        <input
          type="text"
          id="headerName"
          value={headerName}
          onChange={handleHeaderNameChange}
        />
      </div>

      <div>
        <label htmlFor="headerValue">Header Value:</label>
        <input
          type="text"
          id="headerValue"
          value={headerValue}
          onChange={handleHeaderValueChange}
        />
      </div>

      <div>
        <label htmlFor="expression">Expression:</label>
        <input
          type="text"
          id="expression"
          value={expression}
          onChange={handleExpressionChange}
          placeholder="Enter a CEL expression"
        />
      </div>

      <textarea value={generateRuleYaml()} readOnly />
      <button onClick={handleAddRule}>Add Rule</button>
    </div>
  );
}

export default Rule;