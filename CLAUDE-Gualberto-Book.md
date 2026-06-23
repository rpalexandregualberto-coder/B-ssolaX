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

## Pontos de atenção pro usuário

- Não tem auth — qualquer um com a URL acessa um app limpo
- Dados são por dispositivo/navegador (localStorage)
- API key ficar no cliente é OK pra BYOK pessoal, **NÃO pra comercialização** (precisaria backend)
