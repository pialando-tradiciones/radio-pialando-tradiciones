import {json} from '../_lib/server.js';
export async function onRequestPost(){return json({ok:true},200,{'set-cookie':'pialando_admin=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0'});}
