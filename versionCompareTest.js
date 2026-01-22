// versionCompareTest.js
// Test script for version indicator logic

function isVersionUpToDate(newVersion, serverVersion) {
  if (!newVersion || !serverVersion) return false;
  return newVersion.trim() === serverVersion.trim();
}

const serverVersion = '1.2.8.0';
const testCases = [
  { outlet: 'Sambel Colek Keledokan', newVersion: '1.2.8.0', expected: true },
  { outlet: 'Sambel Colek Nusa Indah', newVersion: '1.2.8.0', expected: true },
  { outlet: 'Sambel Colek Perumnas', newVersion: '1.2.8.0', expected: true },
  { outlet: 'Sambel Colek Karanggayam', newVersion: '1.2.8.0', expected: true },
  { outlet: 'Sambel Nyah Ti', newVersion: '1.2.8.0', expected: true },
  { outlet: 'Sambel Colek Jakal', newVersion: '1.2.8.0', expected: true },
  { outlet: 'Jempolan Coffee & Eatery', newVersion: '1.2.8.0', expected: true },
  { outlet: 'Development Testing', newVersion: '1.2.7.9', expected: false },
  { outlet: 'Sambel Nyah Ti Online', newVersion: '1.2.5.4', expected: false },
  { outlet: 'Training', newVersion: '1.2.5.3', expected: false },
  { outlet: 'Whitespace test', newVersion: ' 1.2.8.0 ', expected: true },
  { outlet: 'Different', newVersion: '1.2.8.1', expected: false },
];

testCases.forEach(({ outlet, newVersion, expected }) => {
  const result = isVersionUpToDate(newVersion, serverVersion);
  console.log(
    `${outlet}: newVersion='${newVersion}' vs serverVersion='${serverVersion}' => ` +
    `indicator: ${result ? 'HIJAU' : 'KUNING'} | expected: ${expected ? 'HIJAU' : 'KUNING'} | ${result === expected ? 'PASS' : 'FAIL'}`
  );
});
