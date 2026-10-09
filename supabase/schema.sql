create extension if not exists pgcrypto;

create table if not exists public.radio_config (
  id bigint primary key generated always as identity,
  version bigint not null default 1,
  updated_at timestamptz not null default now(),
  config jsonb not null
);

insert into public.radio_config(config) values (jsonb_build_object(
  'radioName','PIALANDO TRADICIONES',
  'topLabel','ESTÁS ESCUCHANDO',
  'title','PIALANDO TRADICIONES',
  'stoppedText','TOCÁ PARA ESCUCHAR',
  'playingText','Con toda la mejor música y nuestras tradiciones',
  'messageShare','Escuchá Pialando Tradiciones en vivo',
  'scrollSpeed',45,
  'initialVolume',0.70,
  'autoplay',true,
  'streamUrl','https://server.laradio.online/proxy/facundo_robles?mp=/stream',
  'backupStreamUrl','',
  'statusEndpoint','',
  'streamType','ShoutCast / Icecast compatible',
  'streamDomain','server.laradio.online',
  'streamPort','8403',
  'streamProtocol','https',
  'streamPath','/proxy/facundo_robles?mp=/stream',
  'streamSid','',
  'logoUrl','/assets/logo-pialando.png',
  'verticalBgUrl','/assets/fondo-vertical.png',
  'horizontalBgUrl','/assets/fondo-horizontal.png',
  'tvBgUrl','/assets/fondo-horizontal.png',
  'cardImageUrl','/assets/facundo-pialando.png',
  'whatsappEnabled',true,
  'whatsappNumber','',
  'whatsappMessage','Hola, escucho Pialando Tradiciones',
  'castAppId','',
  'castMode','custom',
  'versionLabel','Inicial'
)) on conflict do nothing;

alter table public.radio_config enable row level security;
drop policy if exists "public read radio config" on public.radio_config;
create policy "public read radio config" on public.radio_config for select using (true);

-- No INSERT/UPDATE/DELETE policies are intentionally created for anon/authenticated clients.
-- Netlify Functions use the service role key on the server.

do $$ begin
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='radio_config') then
    execute 'alter publication supabase_realtime add table public.radio_config';
  end if;
end $$;

insert into storage.buckets (id,name,public) values ('radio-images','radio-images',true)
on conflict (id) do nothing;

-- Public reads of image objects are allowed. Writes are performed only by Netlify Functions.
drop policy if exists "public read radio images" on storage.objects;
create policy "public read radio images" on storage.objects for select using (bucket_id='radio-images');
