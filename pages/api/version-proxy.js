export default async function handler(req, res) {
  try {
    const response = await fetch('https://gaspollmanagementcenter.com/server/version.txt');
    const text = await response.text();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).send(text.trim());
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch remote version' });
  }
}
