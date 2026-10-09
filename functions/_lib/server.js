const json = (data, status=200, extra={}) => new Response(JSON.stringify(data), {
  status,
  headers: { 'content-type':'application/json; charset=utf-8', 'cache-control':'no-store', ...extra }
});
function envValue(env, name) { const v=env?.[name]; if(!v) throw new Error(`Falta variable ${name}`); return v; }
function cookieValue(request,name) {
  const c=request.headers.get('cookie')||'';
  const m=c.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  try { return m ? decodeURIComponent(m[1]) : ''; } catch { return ''; }
}
function b64url(bytes) {
  let s=''; for (const b of bytes) s+=String.fromCharCode(b);
  return btoa(s).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
}
function fromB64url(s) {
  s=String(s).replace(/-/g,'+').replace(/_/g,'/'); while(s.length%4)s+='=';
  const raw=atob(s); return Uint8Array.from(raw,c=>c.charCodeAt(0));
}
async function hmac(secret, message) {
  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
  return new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(message)));
}
export async function signSession(payload, env) {
  const body=b64url(new TextEncoder().encode(JSON.stringify(payload)));
  const sig=b64url(await hmac(envValue(env,'SESSION_SECRET'),body));
  return `${body}.${sig}`;
}
export async function verifySession(token, env) {
  try {
    const [body,sig]=String(token||'').split('.'); if(!body||!sig)return null;
    const expected=b64url(await hmac(envValue(env,'SESSION_SECRET'),body));
    if(sig!==expected)return null;
    const p=JSON.parse(new TextDecoder().decode(fromB64url(body)));
    if(!p.exp||p.exp<Date.now())return null; return p;
  } catch { return null; }
}
export async function requireAdmin(request, env) {
  const p=await verifySession(cookieValue(request,'pialando_admin'),env);
  if(!p) throw new Error('UNAUTHORIZED'); return p;
}
export async function pinMatches(pin, env) {
  try {
    const raw=envValue(env,'ADMIN_PIN_HASH');
    const m=raw.match(/^pbkdf2\$(\d+)\$([^$]+)\$([a-f0-9]+)$/i); if(!m)return false;
    const [,iters,salt,expected]=m;
    const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(String(pin)),'PBKDF2',false,['deriveBits']);
    const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt:new TextEncoder().encode(salt),iterations:Number(iters),hash:'SHA-256'},key,expected.length*4);
    const got=[...new Uint8Array(bits)].map(b=>b.toString(16).padStart(2,'0')).join('');
    return got===expected;
  } catch { return false; }
}
export async function sb(env,path,{method='GET',body,headers={}}={}) {
  const base=envValue(env,'SUPABASE_URL').replace(/\/$/,'');
  const key=envValue(env,'SUPABASE_SERVICE_ROLE_KEY');
  const h={apikey:key,Authorization:`Bearer ${key}`,...headers};
  if(body!==undefined)h['content-type']='application/json';
  const r=await fetch(base+path,{method,headers:h,body:body===undefined?undefined:JSON.stringify(body)});
  const text=await r.text();
  if(!r.ok)throw new Error(`Supabase ${r.status}: ${text.slice(0,500)}`);
  try{return JSON.parse(text)}catch{return text}
}
export async function getConfig(env) {
  const rows=await sb(env,'/rest/v1/radio_config?select=id,version,updated_at,config&order=id.desc&limit=1');
  return rows[0]||null;
}
export {json,envValue};
