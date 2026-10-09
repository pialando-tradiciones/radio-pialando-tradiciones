import crypto from 'node:crypto';
const pin = process.argv[2] || '1231';
const salt = crypto.randomBytes(16).toString('hex');
const hash = crypto.pbkdf2Sync(pin, salt, 150000, 32, 'sha256').toString('hex');
console.log(`ADMIN_PIN_HASH=pbkdf2$150000$${salt}$${hash}`);
