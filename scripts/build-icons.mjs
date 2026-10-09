import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
const src='public/assets/logo-pialando.png';
const out='public/icons';
fs.mkdirSync(out,{recursive:true});
try {
  execFileSync('python',['-c',`from PIL import Image\nim=Image.open(r'${src}').convert('RGB')\n# center crop to square, preserving logo artwork\nw,h=im.size\ns=min(w,h)\nleft=(w-s)//2; top=(h-s)//2\nim=im.crop((left,top,left+s,top+s))\nfor size,name in [(192,'radio-192.png'),(512,'radio-512.png'),(180,'radio-180.png')]: im.resize((size,size),Image.Resampling.LANCZOS).save(r'public/icons/'+name)\n# admin variant with a simple dark overlay and gear-like badge\nad=im.resize((512,512),Image.Resampling.LANCZOS).convert('RGBA')\nfrom PIL import ImageDraw\nd=ImageDraw.Draw(ad); d.ellipse((365,365,505,505),fill=(90,30,120,240),outline=(255,255,255,255),width=6); d.text((392,389),'⚙',fill='white')\nad.save(r'public/icons/admin-512.png')\nad.resize((192,192),Image.Resampling.LANCZOS).save(r'public/icons/admin-192.png')\n`],{stdio:'inherit'});
} catch { console.log('Si no se ejecuta el generador, usá los recursos de logo originales.'); }
