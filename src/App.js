import React, { useState } from 'react';
import Rule from './components/Rule';

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

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handlePolicyTypeChange = (event) => {
    setPolicyType(event.target.value);
  };

  const handleDdosProtectionChange = (event) => {
    setDdosProtection(event.target.checked);
  };

  const addRule = (newRule) => {
    setRules([...rules, newRule]);
  };

  const handleAdaptiveProtectionChange = (event) => {
    setAdaptiveProtection(event.target.checked);
  };

  // ... (add event handlers for adaptiveProtectionConfig fields)

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
      <div>
        <label htmlFor="description">Description:</label>
        <textarea id="description" value={description} onChange={handleDescriptionChange} />
      </div>
      <div>
        <label htmlFor="policyType">Policy Type:</label>
        <select id="policyType" value={policyType} onChange={handlePolicyTypeChange}>
          <option value="CLOUD_ARMOR">CLOUD_ARMOR</option>
          <option value="CLOUD_ARMOR_EDGE">CLOUD_ARMOR_EDGE</option>
        </select>
      </div>
      <div>
        <input
          type="checkbox"
          id="ddosProtection"
          checked={ddosProtection}
          onChange={handleDdosProtectionChange}
        />
        <label htmlFor="ddosProtection">Enable DDoS Protection</label>
      </div>

      <h2>Rules</h2>
      <Rule onAddRule={addRule} />
      {/* ... (display rules) */}

      <h2>Advanced Options</h2>
      <div>
        <input
          type="checkbox"
          id="adaptiveProtection"
          checked={adaptiveProtection}
          onChange={handleAdaptiveProtectionChange}
        />
        <label htmlFor="adaptiveProtection">Enable Adaptive Protection</label>
      </div>
      {/* ... (input fields for adaptiveProtectionConfig) */}

      <button onClick={generateYaml}>Generate YAML</button>
      <textarea value={generatedYaml} readOnly />
    </div>
  );
}

export default App;