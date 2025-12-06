import { rmSync } from 'fs';
import { join } from 'path';
import { existsSync } from 'fs';

const vercelDir = join(process.cwd(), '.vercel');
if (existsSync(vercelDir)) {
  try {
    rmSync(vercelDir, { recursive: true, force: true });
    console.log('✓ Directorio .vercel limpiado');
  } catch (error) {
    console.warn('⚠ No se pudo limpiar .vercel:', error.message);
  }
}

