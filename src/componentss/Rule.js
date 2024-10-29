import React, { useState } from "react";

function Rule() {
  const [ruleType, setRuleType] = useState("allow");
  const [match, setMatch] = useState("");
  const [action, setAction] = useState("allow");
  const [headerName, setHeaderName] = useState("");
  const [headerValue, setHeaderValue] = useState("");

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
    let yaml = "rules:\n";
    yaml += `- action: ${action}\n`;
    yaml += "  match:\n";
    yaml += `    expr: 'origin.ip.cidrRange == "${match}"'\n`;

    if (match.includes("header")) {
      yaml += `    headers:\n`;
      yaml += `    - name: "${headerName}"\n`;
      yaml += `      exactMatch: "${headerValue}"\n`;
    }

    return yaml;
  };

  const predefinedBundles = {
    "OWASP Top 10 Protection": `
        rules:
        - action: deny
          match:
            expr: 'request.path.matches("/wp-login.php")'
        - action: deny
          match:
            expr: 'request.path.matches("/xmlrpc.php")'
      `,
    "Bot Mitigation": `
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
    return predefinedBundles[selectedBundle] || "";
  };

  return (
    <div>
      <div>
        <label htmlFor="ruleType">Rule Type:</label>
        <select
          id="ruleType"
          value={ruleType}
          onChange={handleRuleTypeChange}
        >
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
        {match.includes("header") && (
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

      <button onClick={() => console.log(generateYaml())}>
        Generate YAML
      </button>

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
    </div>
  );
}

export default Rule;
