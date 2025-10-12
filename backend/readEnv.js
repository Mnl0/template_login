import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pathToEnv = path.resolve(__dirname, '.env');

function readEnvFdile() {
	try {
		const data = fs.readFileSync(pathToEnv, 'utf8');
		const lines = data.split('\n');
		for (const line of lines) {
			if (line.trim() === '' || line.startsWith("#")) continue;
			const indexEquals = line.indexOf('=');
			if (indexEquals === -1) continue;
			const key = line.slice(0, indexEquals).trim();
			const value = line.slice(indexEquals + 1).trim();

			if (!process.env[key]) {
				process.env[key] = value;
			}
		}

	} catch (error) {
		if (error.code === 'ENOENT') {
			console.error('.env file not found, proceeding without it.', error);
		}
	}
}

export default readEnvFdile;