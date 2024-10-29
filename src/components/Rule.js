import React, { useState } from 'react';

function Rule() {
  const [ruleType, setRuleType] = useState('allow');
  const [match, setMatch] = useState('');
  const [action, setAction] = useState('allow');
  const [headerName, setHeaderName] = useState('');
  const [headerValue, setHeaderValue] = useState('');

  const handleRuleTypeChange = (event) => {
    setRuleType(event.target.value);
  };

  const handleMatchChange = (event) => {
    setMatch(event.target.value);
  };

  const handleActionChange = (event) => {
    setAction(event.target.value);
  };

  const handleHeaderNameChange = (event) => {
    setHeaderName(event.target.value);
  };

  const handleHeaderValueChange = (event) => {
    setHeaderValue(event.target.value);
  };

  const generateYaml = () => {
    let yaml = 'rules:\n';
    yaml += `- action: ${action}\n`;
    yaml += '  match:\n';
    yaml += `    expr: 'origin.ip.cidrRange == "${match}"'\n`; // Basic IP matching for now

    if (match.includes('header')) {
      yaml += `    headers:\n`;
      yaml += `    - name: "${headerName}"\n`;
      yaml += `      exactMatch: "${headerValue}"\n`;
    }

    return yaml;
  };

  const predefinedBundles = {
    'OWASP Top 10 Protection': `
      rules:
      - action: deny
        match:
          expr: 'request.path.matches("/wp-login.php")'
      - action: deny
        match:
          expr: 'request.path.matches("/xmlrpc.php")'
    `,
    'Bot Mitigation': `
      rules:
      - action: throttle
        match:
          expr: 'origin.userAgent.matches("badbot")'
    `,
  };

  const [selectedBundle, setSelectedBundle] = useState(null);

  const handleBundleChange = (event) => {
    setSelectedBundle(event.target.value);
  };

  const getBundleYaml = () => {
    return predefinedBundles[selectedBundle] || '';
  };

  const wafRules = {
    'SQL Injection': {
      description: 'Detects and blocks SQL injection attempts.',
      sensitivityLevels: [1, 2, 3, 4, 5], // Example sensitivity levels
    },
    'Cross-Site Scripting (XSS)': {
      description: 'Protects against cross-site scripting attacks.',
      sensitivityLevels: [1, 2, 3],
    },
    'Local File Inclusion (LFI)': {
      description: 'Prevents attempts to include local files.',
      sensitivityLevels: [1, 2],
    },
    'Remote File Inclusion (RFI)': {
      description: 'Blocks attempts to include remote files.',
      sensitivityLevels: [1, 2, 3],
    },
    'Command Injection': {
      description: 'Detects and blocks command injection attacks.',
      sensitivityLevels: [1, 2],
    },
    // Add more WAF rules with descriptions and sensitivity levels
  };

  const [selectedWafRule, setSelectedWafRule] = useState(null);
  const [sensitivityLevel, setSensitivityLevel] = useState(1); // Default sensitivity level
  const [exceptions, setExceptions] = useState('');

  const handleWafRuleChange = (event) => {
    setSelectedWafRule(event.target.value);
    setSensitivityLevel(1); // Reset sensitivity level when rule changes
    setExceptions(''); // Reset exceptions when rule changes
  };

  const handleSensitivityLevelChange = (event) => {
    setSensitivityLevel(parseInt(event.target.value, 10));
  };

  const handleExceptionsChange = (event) => {
    setExceptions(event.target.value);
  };

  const addWafRule = () => {
    const rule = wafRules[selectedWafRule];
    // Logic to add the WAF rule to the policy with sensitivity and exceptions
    console.log('Adding WAF rule:', {
      rule: selectedWafRule,
      sensitivity: sensitivityLevel,
      exceptions: exceptions,
    });
  };

  return (
    <div>
      {/* ... (form elements for creating rules) */}
      <div>
        <label htmlFor="ruleType">Rule Type:</label>
        <select id="ruleType" value={ruleType} onChange={handleRuleTypeChange}>
          <option value="allow">Allow</option>
          <option value="deny">Deny</option>
        </select>
      </div>

      <div>
        <label htmlFor="match">Match:</label>
        <input
          type="text"
          id="match"
          value={match}
          onChange={handleMatchChange}
          placeholder="IP address, region, etc."
        />
      </div>

      <div>
        <label htmlFor="action">Action:</label>
        <select id="action" value={action} onChange={handleActionChange}>
          <option value="allow">Allow</option>
          <option value="deny">Deny</option>
          <option value="redirect">Redirect</option>
        </select>
      </div>

      <div>
        {match.includes('header') && (
          <>
            <label htmlFor="headerName">Header Name:</label>
            <input
              type="text"
              id="headerName"
              value={headerName}
              onChange={handleHeaderNameChange}
            />

            <label htmlFor="headerValue">Header Value:</label>
            <input
              type="text"
              id="headerValue"
              value={headerValue}
              onChange={handleHeaderValueChange}
            />
          </>
        )}
      </div>


      <h3>Preconfigured Rule Bundles</h3>
      <select value={selectedBundle} onChange={handleBundleChange}>
        <option value="">Select a bundle</option>
        {Object.keys(predefinedBundles).map((bundleName) => (
          <option key={bundleName} value={bundleName}>
            {bundleName}
          </option>
        ))}
      </select>

      <textarea value={getBundleYaml()} readOnly />

      <h3>WAF Rules</h3>
      <select value={selectedWafRule} onChange={handleWafRuleChange}>
        <option value="">Select a WAF rule</option>
        {Object.keys(wafRules).map((ruleName) => (
          <option key={ruleName} value={ruleName}>
            {ruleName}
          </option>
        ))}
      </select>

      {selectedWafRule && (
        <>
          <p>{wafRules[selectedWafRule].description}</p>

          <div>
            <label htmlFor="sensitivityLevel">Sensitivity Level:</label>
            <select
              id="sensitivityLevel"
              value={sensitivityLevel}
              onChange={handleSensitivityLevelChange}
            >
              {wafRules[selectedWafRule].sensitivityLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="exceptions">Exceptions (comma-separated):</label>
            <input
              type="text"
              id="exceptions"
              value={exceptions}
              onChange={handleExceptionsChange}
              placeholder="e.g., 192.168.1.1, /login"
            />
          </div>

          <button onClick={addWafRule}>Add Rule</button>
        </>
      )}
    </div>
  );
}

export default Rule;