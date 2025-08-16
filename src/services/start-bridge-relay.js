import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { bridgeRelay } from './bridge-relay.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

async function main() {
  try {
    console.log('Starting bridge relay service...');
    await bridgeRelay.start();
    console.log('Bridge relay service started successfully');
  } catch (error) {
    console.error('Failed to start bridge relay:', error);
    process.exit(1);
  }
}

main(); 