import React, { useState } from 'react';

function App() {
  const [policyName, setPolicyName] = useState('');
  const [description, setDescription] = useState('');
  const [policyType, setPolicyType] = useState('CLOUD_ARMOR');
  const [ddosProtection, setDdosProtection] = useState(false);
  const [rules, setRules] = useState([]);
  const [adaptiveProtection, setAdaptiveProtection] = useState(false);
  const [adaptiveProtectionConfig, setAdaptiveProtectionConfig] = useState({}); // Add fields as needed
  const [generatedYaml, setGeneratedYaml] = useState('');

  const handlePolicyNameChange = (event) => {
    setPolicyName(event.target.value);
  };

  // ... (other event handlers for policy details)

  const addRule = (newRule) => {
    setRules([...rules, newRule]);
  };

  // ... (event handlers for adaptive protection)

  const generateYaml = () => {
    let yaml = 'securityPolicy:\n';
    yaml += `  name: "${policyName}"\n`;
    if (description) {
      yaml += `  description: "${description}"\n`;
    }
    yaml += `  type: "${policyType}"\n`;
    yaml += `  ddosProtectionConfig:\n`;
    yaml += `    ddosProtection: "${ddosProtection ? 'ENABLED' : 'DISABLED'}"\n`;

    if (rules.length > 0) {
      yaml += `  rules:\n`;
      rules.forEach((rule) => {
        yaml += `  - action: "${rule.action}"\n`;
        yaml += `    match:\n`;
        if (rule.ipRanges) {
          yaml += `      srcIpRanges: [${rule.ipRanges}]\n`;
        }
        if (rule.headerName && rule.headerValue) {
          yaml += `      headers:\n`;
          yaml += `      - name: "${rule.headerName}"\n`;
          yaml += `        exactMatch: "${rule.headerValue}"\n`;
        }
        if (rule.expression) {
          yaml += `      expr: "${rule.expression}"\n`;
        }
        // ... (add other match conditions)
      });
    }

    if (adaptiveProtection) {
      yaml += `  adaptiveProtectionConfig:\n`;
      // ... (add adaptiveProtectionConfig fields)
    }

    setGeneratedYaml(yaml);
  };

  return (
    <div className="App">
      <h1>Cloud Armor Policy Generator</h1>

      <h2>Policy Details</h2>
      <div>
        <label htmlFor="policyName">Policy Name:</label>
        <input type="text" id="policyName" value={policyName} onChange={handlePolicyNameChange} />
      </div>
      {/* ... (other input fields for policy details) */}

      <h2>Rules</h2>
      <Rule onAddRule={addRule} /> {/* Pass the addRule function to the Rule component */}
      {/* ... (display rules) */}

      <h2>Advanced Options</h2>
      {/* ... (input fields for adaptive protection) */}

      <button onClick={generateYaml}>Generate YAML</button>
      <textarea value={generatedYaml} readOnly />
    </div>
  );
}

export default App;