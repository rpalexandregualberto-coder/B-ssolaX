# Central de Ação

Sistema pessoal de produtividade single-file (HTML/CSS/JS) com integração de IA via Anthropic Claude API.

## 🚀 Como usar

**Online (produção):** https://centraldeacao.netlify.app

**Local (desenvolvimento):** abra `index.html` no Chrome.

## 📁 Estrutura

```
CentralDeAcao/
├── index.html              # Versão de produção (igual ao deploy no Netlify)
├── central-de-acao.html    # Cópia identical, nome legível
├── CLAUDE.md               # Instruções pro Claude Code
├── README.md               # Este arquivo
├── CHANGELOG.md            # Histórico de versões e mudanças
├── backups/                # Backups JSON dos dados (localStorage)
│   ├── central-acao-backup-2026-05-02T00-15-52.json
│   └── central-acao-backup-2026-05-04T22-28-22.json
└── archive/                # Versões antigas (histórico de evolução)
    ├── v1-prototipos/      # Protótipos iniciais (JSX + HTML cru)
    ├── v2-historico/       # Iterações da versão 2 (40 arquivos)
    └── v3-historico/       # Iterações da versão 3 (32 arquivos)
```

## ✨ Funcionalidades

- **Tarefas + Kanban** com drag & drop, urgência colorida, recorrência (diária/semanal/mensal automática)
- **Modo Foco** com Pomodoro editável e alarme sonoro
- **Projetos** com tarefas vinculadas, editar/excluir, progresso automático
- **Financeiro Pessoal** com snapshot mensal de contas fixas (cada mês independente)
- **Reuniões + IA** análise automática de transcrições via Claude
- **Importação de Fatura/Extrato** com IA categorizando (CSV/OFX/TXT)
- **Gamificação** XP, níveis, conquistas, arquétipos, streaks
- **Calendário, Agenda, Metas, Templates, Notas (espelho de tarefas)**
- **Backup completo** Exportar/Importar JSON
- **API Key persistente** salva no localStorage, mascarada quando configurada

## 🛠 Stack

- HTML + CSS (vanilla) + JavaScript (vanilla)
- **Sem framework, sem build, sem servidor**
- Dados em `localStorage` (por dispositivo/navegador/domínio)
- IA via fetch direto pra `api.anthropic.com/v1/messages` (BYOK — Bring Your Own Key)

## 📦 Deploy

Single-file HTML. Deploy = arrastar `index.html` no [Netlify Drop](https://app.netlify.com/drop) ou qualquer host estático (Vercel, Cloudflare Pages, GitHub Pages).

## 🔐 Segurança

- API Key fica no localStorage do navegador (não vai pra servidor algum)
- Dados do usuário ficam no localStorage (privados ao dispositivo)
- Importação de backup valida JSON antes de gravar

## 🗺 Roadmap (próximas fases)

**Fase 2 — Comercialização (planejada):**
- Backend (Supabase Auth + Postgres + Edge Functions)
- Sistema de créditos pré-pagos
- Proxy de chamadas IA (esconde chave do dono)
- Pagamento via Asaas / Mercado Pago / Stripe
- Sync de dados entre dispositivos

**Adaptação pro nicho de Representante de Consórcio:**
- Módulo Vendas/Negócios (kanban Lead → Proposta → Fechado)
- Comissões automáticas
- Categorias financeiras específicas
- Templates de fluxo de venda
