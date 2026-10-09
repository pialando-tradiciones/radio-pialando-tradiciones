import fs from 'node:fs';
const required=['public/radio/index.html','public/radio/app.js','public/radio/manifest.webmanifest','public/radio/sw.js','public/admin/index.html','public/admin/app.js','public/admin/manifest.webmanifest','public/admin/sw.js','public/receiver.html','public/shared.css','netlify.toml','supabase/schema.sql','README.md','public/assets/fondo-horizontal.png','public/assets/fondo-vertical.png','public/assets/logo-pialando.png'];
const missing=required.filter(p=>!fs.existsSync(p));
if(missing.length){console.error('Faltan:',missing);process.exit(1)}
console.log('OK: archivos principales presentes:',required.length);
