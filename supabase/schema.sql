-- ============================================================================
-- 创客新媒 · Supabase 数据库初始化脚本
-- 使用方法：Supabase 控制台 → SQL Editor → 粘贴本文件全部内容 → Run
-- ============================================================================

-- ------------------------------ 1. 扩展与枚举 -------------------------------

create extension if not exists "pgcrypto";

-- 作品类型约束：photo / poster / video
do $$
begin
  if not exists (select 1 from pg_type where typname = 'work_type') then
    create type public.work_type as enum ('photo', 'poster', 'video');
  end if;
end$$;

-- ------------------------------ 2. members 表 -------------------------------

create table if not exists public.members (
  id               uuid primary key references auth.users (id) on delete cascade,
  name             text not null default '',
  avatar           text not null default '',
  batch            int4 not null,
  role             text not null default '部员',
  bio              text not null default '',
  description      text not null default '',
  tags             text[] not null default '{}',
  social_links     jsonb not null default '[]',
  background_image text not null default '',
  email            text,
  created_at       timestamptz not null default now()
);

-- ------------------------------- 3. works 表 --------------------------------

create table if not exists public.works (
  id          uuid primary key default gen_random_uuid (),
  member_id   uuid not null references public.members (id) on delete cascade,
  title       text not null,
  type        public.work_type not null default 'photo',
  image_url   text not null,
  description text not null default '',
  created_at  timestamptz not null default now()
);

create index if not exists works_member_id_created_at_idx
  on public.works (member_id, created_at desc);

-- --------------------- 4. 新用户注册自动创建 members 行 ----------------------
-- 注册时前端会把 name / batch 放在 user_metadata 中

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.members (id, name, batch, role, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', ''),
    coalesce((new.raw_user_meta_data ->> 'batch')::int, 2026),
    '部员',
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- --------------------------- 5. RLS：members 表 -----------------------------

alter table public.members enable row level security;

-- 所有人可读
drop policy if exists "members_read_all" on public.members;
create policy "members_read_all"
  on public.members for select
  using (true);

-- 只能插入自己的记录（兜底；正常由触发器完成）
drop policy if exists "members_insert_self" on public.members;
create policy "members_insert_self"
  on public.members for insert
  with check (auth.uid() = id);

-- 只能更新自己的记录；batch（届别）不允许修改
drop policy if exists "members_update_self" on public.members;
create policy "members_update_self"
  on public.members for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and batch = (select batch from public.members where id = auth.uid())
  );

-- 不允许删除成员档案
drop policy if exists "members_delete_none" on public.members;
create policy "members_delete_none"
  on public.members for delete
  using (false);

-- ---------------------------- 6. RLS：works 表 ------------------------------

alter table public.works enable row level security;

-- 所有人可读
drop policy if exists "works_read_all" on public.works;
create policy "works_read_all"
  on public.works for select
  using (true);

-- 只能给自己建档
drop policy if exists "works_insert_self" on public.works;
create policy "works_insert_self"
  on public.works for insert
  with check (auth.uid() = member_id);

-- 只能改自己的作品
drop policy if exists "works_update_self" on public.works;
create policy "works_update_self"
  on public.works for update
  using (auth.uid() = member_id)
  with check (auth.uid() = member_id);

-- 只能删自己的作品
drop policy if exists "works_delete_self" on public.works;
create policy "works_delete_self"
  on public.works for delete
  using (auth.uid() = member_id);

-- ------------------------- 7. Realtime 发布配置 -----------------------------
-- 让客户端可以监听 members / works 表的实时变更

do $$
begin
  if not exists (select 1 from pg_publication_tables
                 where pubname = 'supabase_realtime'
                   and schemaname = 'public'
                   and tablename = 'members') then
    alter publication supabase_realtime add table public.members;
  end if;
  if not exists (select 1 from pg_publication_tables
                 where pubname = 'supabase_realtime'
                   and schemaname = 'public'
                   and tablename = 'works') then
    alter publication supabase_realtime add table public.works;
  end if;
end$$;

-- --------------------------- 8. Storage 存储桶 ------------------------------

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = excluded.public;

insert into storage.buckets (id, name, public)
values ('backgrounds', 'backgrounds', true)
on conflict (id) do update set public = excluded.public;

insert into storage.buckets (id, name, public)
values ('works', 'works', true)
on conflict (id) do update set public = excluded.public;

-- 三个桶：所有人可读
drop policy if exists "avatars_read_all" on storage.objects;
create policy "avatars_read_all"
  on storage.objects for select
  using (bucket_id = 'avatars');

drop policy if exists "backgrounds_read_all" on storage.objects;
create policy "backgrounds_read_all"
  on storage.objects for select
  using (bucket_id = 'backgrounds');

drop policy if exists "works_read_all" on storage.objects;
create policy "works_read_all"
  on storage.objects for select
  using (bucket_id = 'works');

-- avatars：仅本人可写，jpeg/png/webp/gif，≤ 5MB
drop policy if exists "avatars_write_self" on storage.objects;
create policy "avatars_write_self"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
    and coalesce(metadata ->> 'mimetype', '') in
      ('image/jpeg', 'image/png', 'image/webp', 'image/gif')
    and coalesce((metadata ->> 'size')::int, 0) <= 5 * 1024 * 1024
  );

drop policy if exists "avatars_update_self" on storage.objects;
create policy "avatars_update_self"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "avatars_delete_self" on storage.objects;
create policy "avatars_delete_self"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- backgrounds：仅本人可写，jpeg/png/webp/gif，≤ 10MB
drop policy if exists "backgrounds_write_self" on storage.objects;
create policy "backgrounds_write_self"
  on storage.objects for insert
  with check (
    bucket_id = 'backgrounds'
    and auth.uid()::text = (storage.foldername(name))[1]
    and coalesce(metadata ->> 'mimetype', '') in
      ('image/jpeg', 'image/png', 'image/webp', 'image/gif')
    and coalesce((metadata ->> 'size')::int, 0) <= 10 * 1024 * 1024
  );

drop policy if exists "backgrounds_update_self" on storage.objects;
create policy "backgrounds_update_self"
  on storage.objects for update
  using (
    bucket_id = 'backgrounds'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "backgrounds_delete_self" on storage.objects;
create policy "backgrounds_delete_self"
  on storage.objects for delete
  using (
    bucket_id = 'backgrounds'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- works：仅本人可写，jpeg/png/webp/gif，≤ 20MB
drop policy if exists "works_files_write_self" on storage.objects;
create policy "works_files_write_self"
  on storage.objects for insert
  with check (
    bucket_id = 'works'
    and auth.uid()::text = (storage.foldername(name))[1]
    and coalesce(metadata ->> 'mimetype', '') in
      ('image/jpeg', 'image/png', 'image/webp', 'image/gif')
    and coalesce((metadata ->> 'size')::int, 0) <= 20 * 1024 * 1024
  );

drop policy if exists "works_files_update_self" on storage.objects;
create policy "works_files_update_self"
  on storage.objects for update
  using (
    bucket_id = 'works'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "works_files_delete_self" on storage.objects;
create policy "works_files_delete_self"
  on storage.objects for delete
  using (
    bucket_id = 'works'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================================
-- 完成！表、触发器、RLS、Realtime 发布、三个公开存储桶及全部读写策略
-- （含图片类型与 5/10/20MB 大小限制）均已就绪。
-- ============================================================================
