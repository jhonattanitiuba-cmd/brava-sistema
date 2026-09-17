-- Responsável por card do Pipeline (atribuir usuário por card, estilo Trello)
-- Aplicar manualmente no Supabase da stack (Cloudfy: cryinggazelle-supabase.cloudfy.live).
-- Usado por useCardResponsavel() no TrelloCardModal (admin/index.html).

create table if not exists public.pipeline_card_responsavel (
  card_tipo      text not null,                 -- 'projeto' | 'cliente'
  card_id        text not null,                 -- id do card (mesmo id usado em pipeline_card_notas)
  responsavel_id uuid references public.usuarios(id) on delete set null,
  atualizado_em  timestamptz not null default now(),
  primary key (card_tipo, card_id)
);

create index if not exists idx_pcr_responsavel on public.pipeline_card_responsavel(responsavel_id);

alter table public.pipeline_card_responsavel enable row level security;

-- Ajuste a policy ao padrão das outras pipeline_card_* do projeto.
drop policy if exists pcr_rw on public.pipeline_card_responsavel;
create policy pcr_rw on public.pipeline_card_responsavel
  for all to authenticated using (true) with check (true);

-- Realtime (o hook escuta postgres_changes nesta tabela)
alter publication supabase_realtime add table public.pipeline_card_responsavel;
