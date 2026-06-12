# Histórico de Versões

## v3.30 — 2026-05-05 (Versão atual em produção)

**Recuperação completa + grandes melhorias**

### Adicionado
- Aba **⚙️ Configurações** dedicada (API key escondida quando salva, mascarada como `sk-ant-•••...`)
- Aba **Notas Rápidas** virou espelho de tarefas (concluídas no topo, pendentes por urgência colorida)
- **Snapshot mensal de contas fixas** (`FIN_FIXAS_BY_MONTH`) — cada mês independente, com botão de copiar do anterior
- **Painel de revisão pós-importação IA** (`showImportReview`) — mostra resumo + transações que precisam confirmação
- **Pomodoro editável** — usuário customiza tempos de foco/pausa via Configurações
- **Alarme sonoro Pomodoro** (Web Audio API)
- **Botão "Focar" toggle** — clicar de novo na mesma tarefa desfoca
- **Recorrência auto-criar** (`checkRecurrenceAndCreate`) — gera tarefas recorrentes diárias/semanais/mensais no boot
- **Tarefas com horário (HH:MM)** — campo de hora na barra de adição rápida
- Botões **⬇ Exportar** e **⬆ Importar** backup no topo (também em Configurações)
- Botões **✏️ Editar** e **🗑 Excluir** em cada card de projeto

### Corrigido
- API Anthropic agora envia header `anthropic-version: 2023-06-01` (antes faltava, causava erro)
- `max_tokens` aumentado: 4096 (reuniões/relatório) e 8192 (financeiro) — antes truncava JSON
- `updateMetrics` e `gotoView` à prova de elementos faltando (não quebra `renderAll`)
- `cycleStatus`, kanban drop, `setPanelStatus` e `focoToggle` usam `applyTaskCompletionEffects` (XP sincronizado em todos)
- Foco esconde tarefas concluídas (antes mostrava cinza)
- Bug do `projMeetings` undefined em `renderProjects` (quebrava render de projetos)
- Persistência (`saveData`) em addContaFixa, updateFixaValor, toggleContaPaga, deleteContaFixa, addComment, deleteComment, saveGoal, incrementGoal, deleteGoal, saveMeeting, saveMeetingAndAnalyze
- API key persiste no localStorage via `loadApiKey()`/`saveApiKey()`
- JSON parse com mensagem de erro humana quando IA retorna resposta cortada

## v3.29 e anteriores
Iterações intermediárias da v3 (32 arquivos em `archive/v3-historico/`)

## v2 (40 arquivos em `archive/v2-historico/`)
Reescrita completa do app — primeira versão com Bento Grid, sidebar, gamificação

## v1 (5 arquivos em `archive/v1-prototipos/`)
Protótipos iniciais em HTML cru e JSX

## v3.31 — 2026-05-11

### Adicionado (preparação para compartilhamento)
- **Perfil de usuário personalizado** — USER_PROFILE com nome/cargo/cidade
- **Modal de onboarding** na primeira abertura (pede nome obrigatório)
- **Editor de perfil em Configurações** (👤 Seu Perfil)
- Avatar do sidebar mostra iniciais automáticas (ex: "AG" pra "Alexandre Gualberto")
- Saudações dinâmicas: "Bom dia, [Nome]"
- Prompts da IA usam nome/cargo/cidade do usuário
- Title da aba do navegador: "Central de Ação — [Nome]"

### Corrigido (acumuladas hoje)
- Notas Livres: font-size 16px (evita zoom iOS), atributos touch melhorados, indicador "💾 Salvo" visual
- Removidas todas as 13 referências hardcoded a "Alexandre"

## v3.32 - 2026-06-12

### SimWork Cloud (Supabase)
- Renomeado de BussolaX para **SimWork** (titulo, rodape, onboarding, document.title)
- **Login com e-mail+senha** (Supabase Auth) + opcao "Continuar sem conta"
- **Sincronizacao na nuvem**: dados espelhados na tabela user_data (RLS por usuario), debounce 2,5s apos cada saveData
- **Migracao automatica**: primeiro login sobe os dados do localStorage; em outros dispositivos, baixa da nuvem (last-write-wins por savedAt)
- **Chip de status** no canto inferior esquerdo (sincronizado / modo local / erro)
- **Alerta de falha de salvamento**: aviso ao usuario quando localStorage falha (antes era silencioso)
- Mini servidor de dev em PowerShell (tools/dev-server.ps1) pra maquinas sem Node
