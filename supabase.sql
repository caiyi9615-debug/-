create table if not exists public.mimi_study_state (
  sync_key_hash text primary key,
  state jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.mimi_study_state enable row level security;

-- 本项目通过 Render 后端 service role 访问，前端不直接访问本表。
-- 因此不开放 anon 读写策略。
