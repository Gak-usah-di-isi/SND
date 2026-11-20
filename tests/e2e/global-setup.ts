import { execSync } from 'node:child_process';

export default function globalSetup() {
    const root = process.cwd();

    execSync('php artisan migrate --force', { cwd: root, stdio: 'inherit' });
    execSync('php artisan db:seed --class=DeploySeeder --force', { cwd: root, stdio: 'inherit' });
    execSync('php tests/e2e/seed-admin.php', { cwd: root, stdio: 'inherit' });
}
