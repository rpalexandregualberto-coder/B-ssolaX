# Instruções pro Claude Code

Esse documento orienta o Claude Code sobre como trabalhar com este projeto.

## Visão geral

**Central de Ação** é um SaaS de produtividade pessoal single-file (HTML+CSS+JS sem framework), com integração de IA via API da Anthropic. Está rodando em produção no **Vercel** (não Netlify — Netlify foi abandonado).

O proprietário, Alexandre (Gualberto), é representante de consórcio em Salvador/BA e está validando o produto pra comercialização junto com outro CRM (https://charm-echo-sphere.lovable.app/relatorios).

## Arquivo principal

**`index.html`** é o único arquivo de produção. Tudo está nele:
- HTML do app (~3000 linhas)
- CSS embutido (`<style>` no `<head>`)
- JavaScript embutido (`<script>` no fim do `<body>`, ~3850 linhas)

`central-de-acao.html` é cópia idêntica. Sincronizar os dois ao alterar.

## Convenções e armadilhas técnicas

### O que é seguro
- Editar funções JavaScript específicas (search por `function nomeDaFuncao`)
- Adicionar novas seções HTML antes de `</body>`
- Adicionar CSS no bloco `<style>` existente
- Usar Find & Replace pra padrões únicos

### O que JÁ deu problema antes
- **Edit/Write tool truncando o final do arquivo** quando a edição é grande ou quando muitas edições sequenciais são feitas. Sintoma: o arquivo perde `</script>`, `</body>`, `</html>` no fim. Solução: depois de editar, validar com `tail -3 index.html` esperando ver as 3 tags de fechamento. Se truncou, restaurar do `archive/v3-historico/` e reaplicar mudanças.
- **Replace strings que não batem por whitespace** — sempre verificar a string exata antes de substituir
- **Funções que mudam state mas não chamam `saveData()`** — checar persistência

### Arquitetura de dados (localStorage)

Chaves usadas:
- `central_acao_v3` — JSON com TODOS os dados do app (TASKS, PROJECTS, FIN_TRANSACTIONS, FIN_FIXAS_BY_MONTH, GOALS, meetings, doneSet, totalXP, etc.)
- `central_acao_apikey` — API key da Anthropic (sk-ant-...)
- `central_acao_pomo` — Configurações do Pomodoro
- `central_acao_notas_livres` — Texto da nota livre
- `central_acao_recurrence_last` — Última data que rodou checkRecurrenceAndCreate

### Helpers críticos

- `applyTaskCompletionEffects(id, wasDone)` — aplica XP/streak/conquistas/recorrência. **SEMPRE usar ao marcar tarefa como done** (cycleStatus, kanban drop, setPanelStatus, focoToggle).
- `getFixas()` — retorna array de contas fixas do mês atual (cada mês é um snapshot independente em `FIN_FIXAS_BY_MONTH`)
- `monthKey(year?, month?)` — gera chave "YYYY-MM" pro mês atual ou específico
- `renderAll()` — re-renderiza tudo + chama `saveData()`. **Após qualquer mutação no estado, chamar `renderAll()` (ou pelo menos `saveData()`).**
- `saveData()` / `loadData()` — persistência de tudo
- `updateApiKeyUI()` — sincroniza a UI da chave nas Configurações
- `playPomoAlarm()` — toca beep ao terminar Pomodoro
- `checkRecurrenceAndCreate()` — roda no boot, gera tarefas recorrentes do dia
- `showImportReview(ids, resumo)` — mostra modal pós-importação por IA com lista de transações pra revisar

### Chamadas pra API Anthropic

3 lugares fazem fetch pra `https://api.anthropic.com/v1/messages`:
1. `analyzeMeeting(id)` — análise de reunião (max_tokens: 4096)
2. `gerarRelatorioSemanal()` — relatório semanal IA (max_tokens: 4096)
3. `processFinFile(event, tipo)` — fatura/extrato (max_tokens: 8192)

**TODOS devem ter os headers:**
```js
{
  "Content-Type":"application/json",
  "anthropic-version":"2023-06-01",
  "anthropic-dangerous-direct-browser-access":"true",
  "x-api-key": userApiKey
}
```

E **sempre validar `userApiKey`** antes do fetch (pra mostrar erro humano em vez de 401).

## Ao fazer mudanças

1. Backup primeiro: copiar `index.html` pra `archive/v3-historico/` com timestamp
2. Editar
3. Validar JS: extrair `<script>` e rodar `node --check`
4. Validar HTML: `tail -3 index.html` deve mostrar `</div>\n</body>\n</html>`
5. Sincronizar `central-de-acao.html` (`cat index.html > central-de-acao.html`)
6. Sugerir ao usuário re-publicar no **Vercel** (push no repositório ou redeploy manual no dashboard do Vercel)

## Estilo visual

Glassmorphism + Mesh Gradient (redesign 2026-05):
- Fonte: Outfit (títulos) + Inter (corpo)
- **Dark mode (padrão):** fundo `#16112a`, cards `rgba(30,24,52,0.62)` + `backdrop-filter:blur(20px)`, accent `#a07ae8` (violeta)
- **Light mode (`data-theme="light"`):** fundo `#f5f0ff`, cards `rgba(255,255,255,0.72)` + blur, accent `#7c5fe6`, mesh pêssego/azul/lavanda
- Bordas arredondadas (16–28px), sombras difusas, sem neon glow
- Variáveis-chave: `--card-blur`, `--card-shadow`, `--card-shadow-hover`

## Próximas evoluções planejadas

1. **Adaptação pro nicho de Representante de Consórcio** (módulo Vendas/Negócios, comissões, categorias específicas)
2. **Backend pra comercialização** (Supabase + Asaas + proxy IA + créditos)
3. **PWA + mobile-first** (instalar como app)
4. **Visual refinado tipo "Investment Dashboard"** — ✅ CONCLUÍDO (Glassmorphism + Mesh Gradients + Bento Grid + dual mode light/dark)

## SimWork Cloud (Supabase) — adicionado 2026-06-12

O app foi renomeado de **BússolaX** para **SimWork** (parte da suíte SimFlow/Catálogo/CRM/SimWork) e ganhou login + sincronização na nuvem:

- **Módulo:** bloco `<style>` + HTML + `<script>` no final do `index.html` (antes de `</body>`), tudo prefixado com `sw`/`SW_`
- **Supabase:** projeto `rssrqsbxpusoglvkxqbp` (org SimWork), tabela `public.user_data` (user_id uuid PK, data jsonb, updated_at) com RLS — cada usuário só lê/escreve a própria linha
- **Modelo de dados:** blob único — `data` guarda um espelho das chaves do localStorage (`SW_CLOUD_KEYS`); a API key da Anthropic **não** é sincronizada (fica só no dispositivo)
- **Sync:** `saveData()` chama `scheduleCloudSave()` (debounce 2,5s) → upsert. No boot/login, `swCloudPull()` compara `savedAt` e puxa da nuvem se for mais novo (last-write-wins) + `location.reload()`
- **Auth:** e-mail+senha (`swAuthLogin`/`swAuthSignup`), modo local opcional (`simwork_skip_login`), chip de status fixo no canto inferior esquerdo
- **Dev local neste PC (sem Node):** `tools/dev-server.ps1` serve em http://localhost:8765 (config no `.claude/launch.json`, nome `simwork`)

## Segurança (atualizado 2026-06-12)

- **Proxy de IA autenticado**: `api/ai-proxy.js` e `api/assembly-token.js` validam o token JWT da sessão Supabase (header `Authorization: Bearer`). O `PROXY_SECRET` foi removido. No frontend, `swAIHeaders()` obtém o token; `aiDirectCall` usa o proxy quando logado e cai pro BYOK (chave própria no localStorage) só em modo local.
- **XSS**: campos de usuário (nomes de tarefas/projetos/metas/hábitos/transações/cartões/categorias, ícones, unidades, títulos de notas/agenda, saída da Ryuki) passam por `escHtml()` nos templates. `escHtml` escapa `& < > " '`. **Toda nova interpolação `${...}` de dado de usuário em HTML deve usar `escHtml()`.**
- **Troca de conta no mesmo aparelho**: `simwork_data_owner` marca o dono dos dados locais; login de outra conta limpa o localStorage e puxa da nuvem (não vaza dados entre contas).
- **Seed limpo**: `seedContasFixas()` não cria mais contas pessoais do dono pra usuários novos.

## Pontos de atenção pro usuário

- Dados são por dispositivo/navegador (localStorage) + nuvem quando logado
- Site URL do Supabase já configurada pra `https://simwork-app.vercel.app`
- E-mail embutido do Supabase tem rate limit baixo — configurar SMTP próprio antes de convidar muita gente
- Categorias financeiras nos prompts da IA ainda citam "Consórcio EVOY"/"Aporte Nubank" — personalizar por usuário no futuro
