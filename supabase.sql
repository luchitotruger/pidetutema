-- Pide Tu Tema - esquema inicial Supabase
create extension if not exists pgcrypto;
create table public.events (
 id uuid primary key default gen_random_uuid(),
 owner_id uuid not null references auth.users(id) on delete cascade,
 name text not null,
 slug text not null unique,
 event_date timestamptz,
 is_active boolean not null default true,
 created_at timestamptz not null default now()
);
create type public.request_status as enum ('pending','accepted','next','playing','played','rejected');
create table public.song_requests (
 id uuid primary key default gen_random_uuid(),
 event_id uuid not null references public.events(id) on delete cascade,
 title text not null check (char_length(title) between 1 and 120),
 artist text check (char_length(artist) <= 120),
 requester_name text check (char_length(requester_name) <= 80),
 message text check (char_length(message) <= 240),
 votes integer not null default 1 check (votes >= 1),
 status public.request_status not null default 'pending',
 created_at timestamptz not null default now()
);
create index song_requests_event_votes_idx on public.song_requests(event_id, votes desc);
alter table public.events enable row level security;
alter table public.song_requests enable row level security;
revoke all on public.events, public.song_requests from anon, authenticated;
grant select on public.events to anon, authenticated;
grant select, insert on public.song_requests to anon;
grant select, insert, update, delete on public.song_requests to authenticated;
create policy "active events public read" on public.events for select to anon, authenticated using (is_active=true or owner_id=auth.uid());
create policy "owner manages event" on public.events for all to authenticated using(owner_id=auth.uid()) with check(owner_id=auth.uid());
create policy "public reads active event requests" on public.song_requests for select to anon using(exists(select 1 from public.events e where e.id=event_id and e.is_active));
create policy "public inserts active event requests" on public.song_requests for insert to anon with check(status='pending' and votes=1 and exists(select 1 from public.events e where e.id=event_id and e.is_active));
create policy "owner manages requests" on public.song_requests for all to authenticated using(exists(select 1 from public.events e where e.id=event_id and e.owner_id=auth.uid())) with check(exists(select 1 from public.events e where e.id=event_id and e.owner_id=auth.uid()));
-- Voto público atómico. Para producción, añadir limitación por dispositivo/IP mediante Edge Function.
create or replace function public.vote_song(request_id uuid) returns void language plpgsql security definer set search_path=public as $$ begin update song_requests r set votes=votes+1 where r.id=request_id and exists(select 1 from events e where e.id=r.event_id and e.is_active); end $$;
revoke all on function public.vote_song(uuid) from public;
grant execute on function public.vote_song(uuid) to anon, authenticated;
alter publication supabase_realtime add table public.song_requests;
-- Tras registrar al DJ, crea el evento sustituyendo TU_USER_UUID:
-- insert into public.events(owner_id,name,slug) values ('TU_USER_UUID','Cumple de Carolina','cumple-carolina');
