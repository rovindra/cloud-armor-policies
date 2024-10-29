import React, { useState } from 'react';

function Rule({ onAddRule }) { // Receive onAddRule as a prop
  const [action, setAction] = useState('allow');
  const [ipRanges, setIpRanges] = useState('');
  const [headerName, setHeaderName] = useState('');
  const [headerValue, setHeaderValue] = useState('');
  const [expression, setExpression] = useState('');

  // ... (event handlers for input fields)

  const generateRuleYaml = () => {
    // ... (same as before)
  };

  const handleAddRule = () => {
    const newRule = {
      action,
      ipRanges,
      headerName,
      headerValue,
      expression,
    };
    onAddRule(newRule); // Call the onAddRule function from props
  };

  return (
    <div>
      {/* ... (input fields for action, ipRanges, headers, expression) */}

      <textarea value={generateRuleYaml()} readOnly />
      <button onClick={handleAddRule}>Add Rule</button> {/* Call handleAddRule */}
    </div>
  );
}

export default Rule;