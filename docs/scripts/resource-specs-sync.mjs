import fs from 'fs';
import fetch from 'node-fetch';

async function run() {
  // TODO: use staging.exp.host when we're ready to test this
  const hostname = 'localhost:3000';

  const response = await fetch(`http://${hostname}/--/api/v2/project/configuration/resource-specs`);
  const data = await response.text();

  // TODO: is public the correct place for this?
  const resourcePath = 'public/static/resource-specs.json';

  await fs.writeFile(resourcePath, data, { encoding: 'utf8' }, () => {});
}

run();
