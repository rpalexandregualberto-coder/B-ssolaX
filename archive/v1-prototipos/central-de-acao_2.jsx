import { useState, useEffect, useRef, useCallback } from "react";

// ─── PALETTE ───────────────────────────────────────────────
const C = {
  bg:"#09090b", surface:"#101012", card:"#15151a", card2:"#1c1c22",
  border:"#222228", border2:"#2e2e38",
  accent:"#e2ff5a", accent2:"#b8d400",
  red:"#ff4d6d", redD:"rgba(255,77,109,.1)", redB:"rgba(255,77,109,.25)",
  blue:"#5b9fff", blueD:"rgba(91,159,255,.1)", blueB:"rgba(91,159,255,.25)",
  green:"#3dffa0", greenD:"rgba(61,255,160,.1)", greenB:"rgba(61,255,160,.25)",
  orange:"#ffaa3c", orangeD:"rgba(255,170,60,.1)", orangeB:"rgba(255,170,60,.25)",
  purple:"#b47dff", purpleD:"rgba(180,125,255,.1)", purpleB:"rgba(180,125,255,.25)",
  yellowD:"rgba(226,255,90,.1)", yellowB:"rgba(226,255,90,.22)",
  text:"#eeeef0", muted:"#5c5c66", dim:"#8c8c99",
};

// ─── INITIAL TASKS ─────────────────────────────────────────
const INIT_TASKS = [
  {id:1,  name:"Concluir com Mateus",                  sec:"amanha",   icon:"🌅", bl:"Amanhã",    cat:"📋 Outros",     badge:"amanha"},
  {id:2,  name:"Landing Page Troca Fácil",             sec:"urgente",  icon:"🔥", bl:"Urgente",   cat:"🔥 Urgente",    badge:"urg"},
  {id:3,  name:"Postar HB20",                          sec:"urgente",  icon:"🔥", bl:"Urgente",   cat:"🔥 Urgente",    badge:"urg"},
  {id:4,  name:"Anunciar Exacta",                      sec:"urgente",  icon:"🏢", bl:"Urgente",   cat:"🏢 Exacta",     badge:"urg"},
  {id:5,  name:"Negociar — a partir de segunda",       sec:"segunda",  icon:"📅", bl:"Segunda",   cat:"📋 Outros",     badge:"seg"},
  {id:6,  name:"Reunião rápida — definir pautas",      sec:"segunda",  icon:"📅", bl:"Segunda",   cat:"📋 Outros",     badge:"seg"},
  {id:7,  name:"3 posts no Instagram",                 sec:"conteudo", icon:"📲", bl:"Conteúdo",  cat:"📲 Conteúdo",   badge:"cont"},
  {id:8,  name:"Programar postagens",                  sec:"conteudo", icon:"📲", bl:"Conteúdo",  cat:"📲 Conteúdo",   badge:"cont"},
  {id:9,  name:"Criar 3 vídeos para postar",           sec:"conteudo", icon:"📲", bl:"Conteúdo",  cat:"📲 Conteúdo",   badge:"cont"},
  {id:10, name:"Comprar passagens",                    sec:"fin",      icon:"💰", bl:"Financeiro",cat:"💰 Financeiro",  badge:"fin"},
  {id:11, name:"Organizar compra das passagens",       sec:"fin",      icon:"💰", bl:"Financeiro",cat:"💰 Financeiro",  badge:"fin"},
  {id:12, name:"Alinhar financeiro pessoal",           sec:"fin",      icon:"💰", bl:"Financeiro",cat:"💰 Financeiro",  badge:"fin"},
  {id:13, name:"Tarefas da Exacta",                    sec:"outros",   icon:"🏢", bl:"Pendente",  cat:"🏢 Exacta",     badge:"ns"},
  {id:14, name:"Listar todos os pós-venda",            sec:"outros",   icon:"🤝", bl:"Pendente",  cat:"🤝 Pós-Venda",  badge:"ns"},
  {id:15, name:"Lista do material de vingança",        sec:"outros",   icon:"📋", bl:"Pendente",  cat:"📋 Outros",     badge:"ns"},
];

const BADGE_STYLES = {
  amanha: {bg:C.yellowD, color:C.accent,  border:C.yellowB,  label:"Amanhã"},
  urg:    {bg:C.redD,    color:C.red,     border:C.redB,     label:"Urgente"},
  seg:    {bg:C.blueD,   color:C.blue,    border:C.blueB,    label:"Segunda"},
  cont:   {bg:C.purpleD, color:C.purple,  border:C.purpleB,  label:"Conteúdo"},
  fin:    {bg:C.orangeD, color:C.orange,  border:C.orangeB,  label:"Financeiro"},
  ns:     {bg:"#1c1c22", color:C.muted,   border:C.border,   label:"Pendente"},
  proc:   {bg:C.blueD,   color:C.blue,    border:C.blueB,    label:"Processo"},
  done:   {bg:C.greenD,  color:C.green,   border:C.greenB,   label:"Concluído"},
  meet:   {bg:C.purpleD, color:C.purple,  border:C.purpleB,  label:"Reunião"},
};

const CAT_MAP = {
  "🔥 Urgente":    {sec:"urgente", icon:"🔥", badge:"urg"},
  "📲 Conteúdo":   {sec:"conteudo",icon:"📲", badge:"cont"},
  "🏢 Exacta":     {sec:"outros",  icon:"🏢", badge:"ns"},
  "💰 Financeiro": {sec:"fin",     icon:"💰", badge:"fin"},
  "🤝 Pós-Venda":  {sec:"outros",  icon:"🤝", badge:"ns"},
  "📋 Outros":     {sec:"outros",  icon:"📋", badge:"ns"},
};

// ─── STYLES ────────────────────────────────────────────────
const s = {
  app:{display:"flex",minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Segoe UI',system-ui,sans-serif",fontSize:"14px"},
  sidebar:{width:220,background:C.surface,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",flexShrink:0,position:"sticky",top:0,height:"100vh",overflow:"hidden"},
  logoWrap:{padding:"18px 16px 14px",borderBottom:`1px solid ${C.border}`},
  logoMark:{width:32,height:32,background:C.accent,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:9,fontSize:16,fontWeight:900,color:"#000"},
  logoTitle:{fontWeight:800,fontSize:11,letterSpacing:"0.13em",textTransform:"uppercase",color:C.text},
  logoSub:{fontSize:10,color:C.muted,marginTop:1},
  navWrap:{flex:1,overflowY:"auto",padding:"8px 8px 0"},
  navLabel:{fontSize:9.5,textTransform:"uppercase",letterSpacing:"0.14em",color:C.muted,padding:"10px 8px 3px",fontWeight:700},
  navBtn:(active)=>({display:"flex",alignItems:"center",gap:8,padding:"7px 9px",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:500,color:active?C.accent:C.dim,background:active?C.yellowD:"transparent",border:active?`1px solid ${C.yellowB}`:"1px solid transparent",width:"100%",textAlign:"left",marginBottom:2,transition:"all .15s"}),
  navIcon:{fontSize:13,width:17,textAlign:"center",flexShrink:0},
  navBadge:(color)=>({marginLeft:"auto",background:color,color:"#fff",fontSize:9,fontWeight:800,padding:"1px 6px",borderRadius:99,minWidth:17,textAlign:"center"}),
  sideFooter:{padding:"12px 16px",borderTop:`1px solid ${C.border}`},
  avatar:{width:30,height:30,background:`linear-gradient(135deg,${C.accent},${C.accent2})`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:11,color:"#000",flexShrink:0},
  main:{flex:1,display:"flex",flexDirection:"column",minWidth:0},
  topbar:{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 24px",borderBottom:`1px solid ${C.border}`,background:"rgba(9,9,11,.9)",backdropFilter:"blur(12px)",position:"sticky",top:0,zIndex:50},
  topbarH:{fontWeight:800,fontSize:15,letterSpacing:"-.01em"},
  topbarSub:{fontSize:11,color:C.muted,marginTop:1},
  chip:(color,bg,border)=>({display:"flex",alignItems:"center",gap:4,fontSize:11,fontWeight:600,padding:"4px 10px",borderRadius:99,background:bg,color,border:`1px solid ${border}`}),
  content:{padding:"20px 24px 60px",flex:1},
  // metrics
  metrics:(cols)=>({display:"grid",gridTemplateColumns:`repeat(${cols},1fr)`,gap:10,marginBottom:18}),
  met:{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"13px 15px",position:"relative",overflow:"hidden"},
  metLabel:{fontSize:9.5,textTransform:"uppercase",letterSpacing:"0.11em",color:C.muted,fontWeight:700,marginBottom:5},
  metVal:{fontWeight:900,fontSize:28,lineHeight:1},
  metSub:{fontSize:10,color:C.muted,marginTop:2},
  // progress
  gpWrap:{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 18px",display:"flex",alignItems:"center",gap:16,marginBottom:18},
  gpLabel:{fontSize:9.5,textTransform:"uppercase",letterSpacing:"0.12em",color:C.muted,fontWeight:700,whiteSpace:"nowrap"},
  gpTrack:{flex:1,height:5,background:C.border2,borderRadius:99,overflow:"hidden"},
  gpFill:(w)=>({height:"100%",width:w+"%",background:`linear-gradient(90deg,${C.accent},${C.accent2})`,borderRadius:99,transition:"width .6s cubic-bezier(.4,0,.2,1)"}),
  gpPct:{fontWeight:900,fontSize:16,color:C.accent,whiteSpace:"nowrap"},
  // section header
  secH:{display:"flex",alignItems:"center",justifyContent:"space-between",margin:"20px 0 8px"},
  secTitle:{display:"flex",alignItems:"center",gap:6,fontWeight:800,fontSize:10.5,textTransform:"uppercase",letterSpacing:"0.1em",color:C.dim},
  secDot:(color)=>({width:6,height:6,borderRadius:"50%",background:color,flexShrink:0}),
  // task row
  trow:(done)=>({display:"grid",gridTemplateColumns:"20px 1fr auto",alignItems:"center",gap:10,padding:"8px 11px",background:done?"#111312":C.card,border:`1px solid ${done?"#1d2a1d":C.border}`,borderRadius:7,cursor:"pointer",marginBottom:3,opacity:done?.6:1,transition:"all .15s"}),
  cb:(done)=>({width:19,height:19,borderRadius:5,border:`1.5px solid ${done?"#2d5a2d":C.border2}`,background:done?"#2d5a2d":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:9,color:done?"#6aff6a":"transparent"}),
  tname:(done)=>({fontSize:13,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:done?"#3d6a3d":C.text,textDecoration:done?"line-through":"none"}),
  tmeta:{display:"flex",alignItems:"center",gap:5,flexShrink:0},
  badge:(type)=>({fontSize:9,fontWeight:700,letterSpacing:"0.05em",textTransform:"uppercase",padding:"2px 6px",borderRadius:5,background:BADGE_STYLES[type]?.bg||C.card,color:BADGE_STYLES[type]?.color||C.muted,border:`1px solid ${BADGE_STYLES[type]?.border||C.border}`,whiteSpace:"nowrap"}),
  // add bar
  addBar:{display:"flex",alignItems:"center",gap:8,background:C.card,border:`1px solid ${C.border2}`,borderRadius:10,padding:"8px 12px",marginBottom:16},
  addInput:{flex:1,background:"transparent",border:"none",outline:"none",fontSize:13,color:C.text,fontFamily:"inherit"},
  addSelect:{background:C.surface,border:`1px solid ${C.border2}`,borderRadius:5,padding:"3px 6px",fontSize:11,color:C.dim,outline:"none",cursor:"pointer"},
  btnPrimary:{background:C.accent,color:"#000",border:"none",borderRadius:7,padding:"6px 13px",fontSize:11,fontWeight:800,cursor:"pointer",letterSpacing:"0.04em"},
  btnGhost:{background:C.card2,color:C.dim,border:`1px solid ${C.border2}`,borderRadius:7,padding:"6px 13px",fontSize:11,fontWeight:700,cursor:"pointer"},
  btnAI:{background:"linear-gradient(135deg,#b47dff,#7b4dff)",color:"#fff",border:"none",borderRadius:8,padding:"8px 16px",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:6},
  // board
  board:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12},
  bcol:{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"},
  bcolHead:{padding:"10px 12px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:6},
  bcolDot:(c)=>({width:7,height:7,borderRadius:"50%",background:c,flexShrink:0}),
  bcolTitle:{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.09em"},
  bcolCnt:{marginLeft:"auto",fontSize:10,color:C.muted,background:C.border,padding:"1px 7px",borderRadius:99},
  bcard:{background:C.card,border:`1px solid ${C.border}`,borderRadius:7,padding:"9px 11px",cursor:"pointer",marginBottom:5,transition:"all .15s"},
  bcardTitle:{fontSize:12,fontWeight:500,lineHeight:1.4,marginBottom:6},
  // meeting
  meetCard:{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,marginBottom:8,overflow:"hidden"},
  meetHead:{display:"flex",alignItems:"center",gap:10,padding:"12px 15px",cursor:"pointer"},
  meetInfo:{flex:1},
  meetTitle:{fontSize:13,fontWeight:600},
  meetMeta:{fontSize:10,color:C.muted,marginTop:1},
  meetBody:{borderTop:`1px solid ${C.border}`,padding:16},
  aiBox:{background:`linear-gradient(135deg,${C.purpleD},rgba(91,79,255,.07))`,border:`1px solid ${C.purpleB}`,borderRadius:10,marginTop:14,overflow:"hidden"},
  aiHead:{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",borderBottom:`1px solid ${C.purpleB}`},
  aiTitle:{fontWeight:800,fontSize:10,textTransform:"uppercase",letterSpacing:"0.09em",color:C.purple},
  aiBody:{padding:14},
  aiSecTitle:(color)=>({fontWeight:800,fontSize:9.5,textTransform:"uppercase",letterSpacing:"0.1em",color,marginBottom:6,display:"flex",alignItems:"center",gap:5}),
  aiItem:(type)=>({fontSize:12,lineHeight:1.6,padding:"5px 9px",borderRadius:6,marginBottom:3,background:type==="alert"?C.redD:type==="task"?C.greenD:C.blueD,borderLeft:`2px solid ${type==="alert"?C.red:type==="task"?C.green:C.blue}`,color:C.text}),
  aiSummary:{fontSize:12,lineHeight:1.65,color:C.text,background:C.yellowD,border:`1px solid ${C.yellowB}`,borderRadius:8,padding:"9px 11px"},
  // recorder
  recWrap:{background:`linear-gradient(135deg,${C.redD},${C.purpleD})`,border:`1px solid ${C.redB}`,borderRadius:10,padding:"14px 16px",marginBottom:12},
  recBtn:(state)=>({width:48,height:48,borderRadius:"50%",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,background:state==="paused"?C.orange:C.red,flexShrink:0,boxShadow:state==="recording"?"0 0 0 0 rgba(255,77,109,.4)":"none"}),
  // form
  fLabel:{fontSize:9.5,textTransform:"uppercase",letterSpacing:"0.1em",color:C.muted,fontWeight:700,display:"block",marginBottom:4},
  fInput:{width:"100%",background:C.surface,border:`1px solid ${C.border2}`,borderRadius:7,padding:"7px 10px",fontSize:12,color:C.text,outline:"none",fontFamily:"inherit",boxSizing:"border-box"},
  fTextarea:{width:"100%",background:C.surface,border:`1px solid ${C.border2}`,borderRadius:7,padding:"9px 11px",fontSize:12,color:C.text,outline:"none",resize:"vertical",lineHeight:1.65,fontFamily:"inherit",minHeight:90,boxSizing:"border-box"},
  // calendar
  calGrid:{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3},
  calDay:(today,other)=>({background:other?"transparent":C.card,border:`1px solid ${today?C.accent:other?"transparent":C.border}`,borderRadius:7,minHeight:72,padding:"6px 7px",opacity:other?.35:1}),
  calDLabel:{textAlign:"center",fontSize:9.5,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.1em",color:C.muted,padding:"6px 0"},
  calEv:(type)=>({fontSize:9,padding:"2px 4px",borderRadius:3,marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",background:type==="y"?C.yellowD:type==="r"?C.redD:type==="b"?C.blueD:type==="g"?C.greenD:C.purpleD,color:type==="y"?C.accent:type==="r"?C.red:type==="b"?C.blue:type==="g"?C.green:C.purple,borderLeft:`2px solid ${type==="y"?C.accent:type==="r"?C.red:type==="b"?C.blue:type==="g"?C.green:C.purple}`}),
  // notes
  noteGrid:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10},
  noteCard:{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px"},
  noteH:{fontWeight:800,fontSize:9.5,textTransform:"uppercase",letterSpacing:"0.07em",color:C.dim,marginBottom:7},
  noteTA:{width:"100%",background:"transparent",border:"none",outline:"none",resize:"none",fontSize:11.5,color:C.text,lineHeight:1.65,minHeight:65,fontFamily:"inherit"},
};

// ─── BADGE ─────────────────────────────────────────────────
const Badge = ({type,label})=>(
  <span style={s.badge(type)}>{label||BADGE_STYLES[type]?.label}</span>
);

// ─── TASK ROW ──────────────────────────────────────────────
const TaskRow = ({task, onCycle})=>{
  const done = task.status==="done";
  const proc = task.status==="proc";
  const badgeType = done?"done":proc?"proc":task.badge;
  return (
    <div style={s.trow(done)} onClick={()=>onCycle(task.id)}>
      <div style={s.cb(done)}>{done?"✓":""}</div>
      <div style={s.tname(done)}>{task.icon} {task.name}</div>
      <div style={s.tmeta}>
        <Badge type={badgeType}/>
        <span style={{fontSize:9.5,color:C.muted}}>{task.cat}</span>
      </div>
    </div>
  );
};

// ─── SECTION ───────────────────────────────────────────────
const Section = ({color, label, tasks, onCycle})=>(
  <>
    <div style={s.secH}>
      <div style={s.secTitle}><span style={s.secDot(color)}/>{label}</div>
    </div>
    {tasks.map(t=><TaskRow key={t.id} task={t} onCycle={onCycle}/>)}
  </>
);

// ─── RECORDER HOOK ─────────────────────────────────────────
function useRecorder(onTranscript){
  const [recState, setRecState] = useState("idle");
  const [secs, setSecs] = useState(0);
  const recRef = useRef(null);
  const timerRef = useRef(null);
  const finalRef = useRef("");
  const waveRef = useRef([]);

  const stopTimer = ()=>{ clearInterval(timerRef.current); };
  const startTimer = ()=>{ timerRef.current = setInterval(()=>setSecs(s=>s+1),1000); };

  const animateWave = (active)=>{
    clearInterval(waveRef.current);
    if(!active){ waveRef.current=[]; return; }
    waveRef.current = setInterval(()=>{
      for(let i=0;i<8;i++){
        const el=document.getElementById(`rwb${i}`);
        if(el) el.style.height=(Math.random()*20+4)+"px";
      }
    },130);
  };

  const buildRecognition = ()=>{
    const SR = window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR) return null;
    const r = new SR();
    r.lang="pt-BR"; r.continuous=true; r.interimResults=true;
    r.onresult=(e)=>{
      let interim="";
      for(let i=e.resultIndex;i<e.results.length;i++){
        const t=e.results[i][0].transcript;
        if(e.results[i].isFinal) finalRef.current+=t+" ";
        else interim=t;
      }
      onTranscript(finalRef.current+(interim?`[${interim}]`:""));
    };
    r.onerror=(e)=>{ if(e.error==="not-allowed"){ alert("Permissão de microfone negada. Clique em Permitir quando o navegador pedir."); stop(); } };
    r.onend=()=>{ if(recRef._state==="recording"){ try{r.start();}catch(e){} } };
    return r;
  };

  const start = ()=>{
    const r=buildRecognition();
    if(!r){ alert("Use o Chrome para gravar."); return; }
    finalRef.current = "";
    recRef.current=r; recRef._state="recording";
    try{r.start();}catch(e){return;}
    setRecState("recording"); setSecs(0);
    startTimer(); animateWave(true);
  };

  const stop = ()=>{
    recRef._state="stopped";
    if(recRef.current){try{recRef.current.stop();}catch(e){} recRef.current=null;}
    stopTimer(); animateWave(false);
    setRecState("idle");
    onTranscript(finalRef.current.trim());
  };

  const pause = ()=>{
    recRef._state="paused";
    if(recRef.current){try{recRef.current.stop();}catch(e){}}
    stopTimer(); animateWave(false);
    setRecState("paused");
  };

  const resume = ()=>{
    const r=buildRecognition();
    if(!r) return;
    recRef.current=r; recRef._state="recording";
    try{r.start();}catch(e){return;}
    setRecState("recording"); startTimer(); animateWave(true);
  };

  const clear = ()=>{ finalRef.current=""; onTranscript(""); };

  const fmt = ()=>{ const m=String(Math.floor(secs/60)).padStart(2,"0"),sc=String(secs%60).padStart(2,"0"); return `${m}:${sc}`; };

  useEffect(()=>()=>{ recRef._state="stopped"; if(recRef.current)try{recRef.current.stop();}catch(e){} stopTimer(); clearInterval(waveRef.current); },[]);

  return {recState, timer:fmt(), start, stop, pause, resume, clear};
}

// ─── RECORDER UI ───────────────────────────────────────────
const Recorder = ({onTranscript})=>{
  const {recState,timer,start,stop,pause,resume,clear}=useRecorder(onTranscript);
  const toggle=()=>recState==="idle"?start():stop();
  return (
    <div style={s.recWrap}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <button style={{...s.recBtn(recState),animation:recState==="recording"?"pulse 1.2s ease-in-out infinite":"none"}} onClick={toggle}>
          {recState==="idle"?"🎙":recState==="recording"?"⏹":"▶"}
        </button>
        <div style={{flex:1}}>
          <div style={{fontWeight:800,fontSize:10.5,textTransform:"uppercase",letterSpacing:"0.1em",color:recState==="idle"?C.muted:recState==="recording"?C.red:C.orange}}>
            {recState==="idle"?"Pronto para gravar":recState==="recording"?"● Gravando...":"⏸ Pausado"}
          </div>
          <div style={{fontWeight:900,fontSize:22,color:C.text,marginTop:1}}>{timer}</div>
          <div style={{display:"flex",alignItems:"center",gap:3,height:22,marginTop:3}}>
            {Array.from({length:8},(_,i)=>(
              <div key={i} id={`rwb${i}`} style={{width:3,borderRadius:99,background:C.red,opacity:.7,height:4,transition:"height .1s"}}/>
            ))}
          </div>
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {recState==="recording"&&<button style={s.btnGhost} onClick={pause}>⏸ Pausar</button>}
          {recState==="paused"&&<button style={{...s.btnGhost,color:C.green,borderColor:C.greenB}} onClick={resume}>▶ Continuar</button>}
          {recState!=="idle"&&<button style={{...s.btnGhost,color:C.red,borderColor:C.redB}} onClick={stop}>⏹ Parar</button>}
          <button style={s.btnGhost} onClick={clear}>🗑</button>
        </div>
      </div>
      <div style={{fontSize:10,color:C.muted,marginTop:8}}>
        💡 Clique no <b style={{color:C.red}}>🎙</b> para gravar · Transcrição em tempo real · Melhor no Chrome
      </div>
      <style>{`@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(255,77,109,.5)}70%{box-shadow:0 0 0 12px rgba(255,77,109,0)}100%{box-shadow:0 0 0 0 rgba(255,77,109,0)}}`}</style>
    </div>
  );
};

// ─── AI ANALYSIS ───────────────────────────────────────────
async function analyzeWithAI(meeting){
  const prompt=`Você é o assistente pessoal de Alexandre, gestor de vendas em Salvador/BA.
Analise a reunião abaixo e retorne APENAS JSON válido (sem markdown):

{
  "resumo": "resumo executivo em 2-3 frases",
  "alertas": ["pontos críticos/riscos identificados (máx 4)"],
  "tarefas": ["tarefas geradas pela reunião (máx 6)"],
  "plano_de_acao": ["próximos passos concretos em ordem de prioridade (máx 5)"]
}

REUNIÃO: ${meeting.title}
DATA: ${meeting.date} | EQUIPE: ${meeting.team} | PARTICIPANTES: ${meeting.pic}
PAUTAS: ${meeting.agenda}
TRANSCRIÇÃO: ${meeting.transcript}

Responda APENAS com o JSON.`;

  const resp=await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",
    headers:{"Content-Type":"application/json","anthropic-dangerous-direct-browser-access":"true"},
    body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:1200,messages:[{role:"user",content:prompt}]})
  });
  const data=await resp.json();
  if(!resp.ok) throw new Error(data?.error?.message||`HTTP ${resp.status}`);
  const raw=(data.content||[]).map(b=>b.text||"").join("").trim();
  const clean=raw.replace(/^```json\s*/,"").replace(/^```\s*/,"").replace(/\s*```$/,"").trim();
  return JSON.parse(clean);
}

// ─── MEETING CARD ──────────────────────────────────────────
const MeetingCard=({meeting, onAnalyzed, onAddTask})=>{
  const [open,setOpen]=useState(false);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");

  const analyze=async()=>{
    setLoading(true); setError("");
    try{
      const result=await analyzeWithAI(meeting);
      onAnalyzed(meeting.id,result);
    }catch(e){ setError(e.message||"Erro na análise"); }
    finally{ setLoading(false); }
  };

  const dateStr=meeting.date?new Date(meeting.date+"T12:00:00").toLocaleDateString("pt-BR"):"—";
  return(
    <div style={s.meetCard}>
      <div style={s.meetHead} onClick={()=>setOpen(o=>!o)}>
        <span style={{fontSize:18}}>🎙</span>
        <div style={s.meetInfo}>
          <div style={s.meetTitle}>{meeting.title}</div>
          <div style={s.meetMeta}>{dateStr} · {meeting.team} · {meeting.pic||"—"}</div>
        </div>
        <div style={{display:"flex",gap:5,alignItems:"center"}}>
          {meeting.aiData?<Badge type="done" label="IA ✓"/>:<Badge type="ns" label="Pendente"/>}
          <span style={{fontSize:11,color:C.muted,marginLeft:4,transform:open?"rotate(90deg)":"none",transition:"transform .2s",display:"inline-block"}}>▶</span>
        </div>
      </div>
      {open&&(
        <div style={s.meetBody}>
          {meeting.agenda&&(
            <div style={{marginBottom:12}}>
              <label style={s.fLabel}>Pautas</label>
              <div style={{fontSize:12,lineHeight:1.65,color:C.text,whiteSpace:"pre-wrap",background:C.surface,padding:"9px 11px",borderRadius:7,border:`1px solid ${C.border}`}}>{meeting.agenda}</div>
            </div>
          )}
          {meeting.transcript&&(
            <div style={{marginBottom:14}}>
              <label style={s.fLabel}>Transcrição</label>
              <div style={{fontSize:11,lineHeight:1.65,color:C.dim,whiteSpace:"pre-wrap",maxHeight:140,overflowY:"auto",background:C.surface,padding:"9px 11px",borderRadius:7,border:`1px solid ${C.border}`}}>{meeting.transcript}</div>
            </div>
          )}
          {!meeting.aiData&&!loading&&(
            <button style={s.btnAI} onClick={analyze}>✨ Analisar com IA</button>
          )}
          {loading&&(
            <div style={{display:"flex",alignItems:"center",gap:8,color:C.purple,fontSize:13,padding:"8px 0"}}>
              <div style={{width:16,height:16,border:`2px solid ${C.purpleB}`,borderTopColor:C.purple,borderRadius:"50%",animation:"spin .7s linear infinite"}}/>
              Analisando transcrição...
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          )}
          {error&&<div style={{fontSize:12,color:C.red,marginTop:8}}>⚠️ {error} <button style={{...s.btnGhost,fontSize:11,marginLeft:8}} onClick={analyze}>Tentar novamente</button></div>}
          {meeting.aiData&&(
            <div style={s.aiBox}>
              <div style={s.aiHead}><div style={s.aiTitle}>✨ Análise da IA</div></div>
              <div style={s.aiBody}>
                {meeting.aiData.resumo&&(
                  <div style={{marginBottom:14}}>
                    <div style={s.aiSecTitle(C.accent)}>📋 Resumo Executivo</div>
                    <div style={s.aiSummary}>{meeting.aiData.resumo}</div>
                  </div>
                )}
                {meeting.aiData.alertas?.length>0&&(
                  <div style={{marginBottom:14}}>
                    <div style={s.aiSecTitle(C.red)}>🚨 Alertas & Pontos Críticos</div>
                    {meeting.aiData.alertas.map((a,i)=><div key={i} style={s.aiItem("alert")}>🚨 {a}</div>)}
                  </div>
                )}
                {meeting.aiData.tarefas?.length>0&&(
                  <div style={{marginBottom:14}}>
                    <div style={s.aiSecTitle(C.green)}>✅ Tarefas Geradas</div>
                    {meeting.aiData.tarefas.map((t,i)=>(
                      <div key={i} style={{...s.aiItem("task"),cursor:"pointer"}} onClick={()=>onAddTask(t,meeting.id)}>
                        ✅ {t} <span style={{fontSize:9.5,color:C.dim,marginLeft:4}}>(clique para adicionar)</span>
                      </div>
                    ))}
                  </div>
                )}
                {meeting.aiData.plano_de_acao?.length>0&&(
                  <div>
                    <div style={s.aiSecTitle(C.blue)}>📌 Plano de Ação</div>
                    {meeting.aiData.plano_de_acao.map((p,i)=><div key={i} style={s.aiItem("plan")}>📌 {i+1}. {p}</div>)}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── CALENDAR DATA ─────────────────────────────────────────
const CAL_EVENTS={21:[{l:"Hoje!",t:"y"}],22:[{l:"Mateus 🤝",t:"y"}],26:[{l:"Negociação",t:"b"},{l:"Reunião",t:"b"}],27:[{l:"Postar HB20",t:"r"}],28:[{l:"3 Posts IG",t:"p"}],30:[{l:"🚨 Deadline",t:"r"},{l:"Passagens",t:"g"}]};

// ─── MAIN APP ──────────────────────────────────────────────
export default function App(){
  const [view,setView]=useState("dashboard");
  const [tasks,setTasks]=useState(INIT_TASKS.map(t=>({...t,status:"ns"})));
  const [meetings,setMeetings]=useState([]);
  const [showNewMeet,setShowNewMeet]=useState(false);
  const [nmForm,setNmForm]=useState({title:"",date:new Date().toISOString().split("T")[0],pic:"",team:"Swat 🚓",agenda:"",transcript:""});
  const [addCat,setAddCat]=useState("🔥 Urgente");
  const [addName,setAddName]=useState("");
  const [pvRows,setPvRows]=useState([]);
  const [pvForm,setPvForm]=useState({cli:"",prod:"Consórcio Auto",canal:"WhatsApp",appSt:"Ativo"});
  const nextId=useRef(100);
  const aiTasksAdded=useRef(new Set());

  // task cycle
  const cycleTask=useCallback((id)=>{
    setTasks(ts=>ts.map(t=>{
      if(t.id!==id) return t;
      const ns=t.status==="ns"?"proc":t.status==="proc"?"done":"ns";
      return {...t,status:ns};
    }));
  },[]);

  // quick add
  const quickAdd=()=>{
    if(!addName.trim()) return;
    const m=CAT_MAP[addCat]||CAT_MAP["📋 Outros"];
    setTasks(ts=>[...ts,{id:nextId.current++,name:addName,sec:m.sec,icon:m.icon,badge:m.badge,bl:"Pendente",cat:addCat,status:"ns"}]);
    setAddName("");
  };

  // meeting save
  const saveMeeting=(analyze=false)=>{
    if(!nmForm.title.trim()){ alert("Informe o título."); return; }
    const m={id:Date.now(),...nmForm,aiData:null};
    setMeetings(ms=>[m,...ms]);
    setNmForm({title:"",date:new Date().toISOString().split("T")[0],pic:"",team:"Swat 🚓",agenda:"",transcript:""});
    setShowNewMeet(false);
  };

  const onAnalyzed=(id,result)=>{
    setMeetings(ms=>ms.map(m=>m.id===id?{...m,aiData:result}:m));
  };

  const onAddTask=(name,meetingId)=>{
    const key=`${meetingId}-${name}`;
    if(aiTasksAdded.current.has(key)) return;
    aiTasksAdded.current.add(key);
    setTasks(ts=>[...ts,{id:nextId.current++,name,sec:"outros",icon:"🎙",badge:"meet",bl:"Reunião",cat:"📋 Outros",status:"ns"}]);
  };

  // metrics
  const done=tasks.filter(t=>t.status==="done").length;
  const proc=tasks.filter(t=>t.status==="proc").length;
  const pct=Math.round(done/tasks.length*100);
  const daysLeft=Math.max(0,Math.ceil((new Date(2025,3,30)-new Date())/864e5));

  // task filter helpers
  const bySecAndStatus=(sec)=>tasks.filter(t=>t.sec===sec);
  const byCat=(cat)=>tasks.filter(t=>t.cat===cat);

  // nav
  const NAV=[
    {id:"dashboard",icon:"⚡",label:"Dashboard"},
    {id:"board",icon:"🗂",label:"Kanban Board",badge:proc>0?proc:null,bc:C.blue},
    {id:"tarefas",icon:"✅",label:"Todas as Tarefas"},
    {id:"calendar",icon:"📅",label:"Calendário"},
    ["sep","Reuniões"],
    {id:"reunioes",icon:"🎙",label:"Reuniões + IA",badge:meetings.length||null,bc:C.red},
    ["sep","Equipes"],
    {id:"teams",icon:"👥",label:"Swat · Sherlok · Suits"},
    {id:"posvenda",icon:"🤝",label:"Pós-Venda"},
    ["sep","Projetos"],
    {id:"exacta",icon:"🏢",label:"Exacta"},
    {id:"conteudo",icon:"📲",label:"Conteúdo"},
    {id:"financeiro",icon:"💰",label:"Financeiro"},
    ["sep","Ferramentas"],
    {id:"notas",icon:"📝",label:"Notas Rápidas"},
  ];

  const VIEW_META={
    dashboard:["Dashboard","Visão geral · Abril 2025"],
    board:["Kanban Board","Task & Supervise"],
    tarefas:["Todas as Tarefas","Lista completa"],
    calendar:["Calendário","Abril 2025"],
    reunioes:["Reuniões + IA","Transcrição e análise automática"],
    teams:["Equipes","Swat · Sherlok · Suits"],
    posvenda:["Pós-Venda","Planilha de acompanhamento"],
    exacta:["Exacta","Projeto e tarefas"],
    conteudo:["Conteúdo","Redes sociais e vídeos"],
    financeiro:["Financeiro & Viagem","Passagens e financeiro pessoal"],
    notas:["Notas Rápidas","Pautas e anotações"],
  };
  const [vh,vs]=VIEW_META[view]||["",""];

  return(
    <div style={s.app}>
      {/* SIDEBAR */}
      <aside style={s.sidebar}>
        <div style={s.logoWrap}>
          <div style={s.logoMark}>⚡</div>
          <div style={s.logoTitle}>Central de Ação</div>
          <div style={s.logoSub}>Alexandre · SSA / BA</div>
        </div>
        <div style={s.navWrap}>
          {NAV.map((item,i)=>{
            if(Array.isArray(item)) return <div key={i} style={s.navLabel}>{item[1]}</div>;
            return(
              <button key={item.id} style={s.navBtn(view===item.id)} onClick={()=>setView(item.id)}>
                <span style={s.navIcon}>{item.icon}</span>
                <span style={{flex:1,textAlign:"left"}}>{item.label}</span>
                {item.badge&&<span style={s.navBadge(item.bc||C.blue)}>{item.badge}</span>}
              </button>
            );
          })}
        </div>
        <div style={s.sideFooter}>
          <div style={{display:"flex",alignItems:"center",gap:9}}>
            <div style={s.avatar}>AL</div>
            <div><div style={{fontSize:12,fontWeight:600}}>Alexandre</div><div style={{fontSize:10,color:C.muted}}>Gestor · Exacta</div></div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main style={s.main}>
        <div style={s.topbar}>
          <div>
            <div style={s.topbarH}>{vh}</div>
            <div style={s.topbarSub}>{vs}</div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <div style={s.chip(C.red,C.redD,C.redB)}>⏳ {daysLeft} dias</div>
            <div style={s.chip(C.accent,C.yellowD,C.yellowB)}>{pct}% concluído</div>
          </div>
        </div>

        <div style={s.content}>

        {/* ── DASHBOARD ── */}
        {view==="dashboard"&&(
          <>
            <div style={s.gpWrap}>
              <span style={s.gpLabel}>Progresso Abril</span>
              <div style={s.gpTrack}><div style={s.gpFill(pct)}/></div>
              <span style={s.gpPct}>{pct}%</span>
            </div>
            <div style={s.metrics(4)}>
              {[["Total",tasks.length,"tarefas de abril",C.accent],["Concluídas",done,"finalizadas",C.green],["Em Processo",proc,"em andamento",C.blue],["Pendentes",tasks.length-done-proc,"não iniciadas",C.red]].map(([l,v,sub,color])=>(
                <div key={l} style={{...s.met,borderTop:`2px solid ${color}`}}>
                  <div style={s.metLabel}>{l}</div>
                  <div style={{...s.metVal,color}}>{v}</div>
                  <div style={s.metSub}>{sub}</div>
                </div>
              ))}
            </div>
            <div style={s.addBar}>
              <span style={{color:C.muted,fontSize:16}}>+</span>
              <input style={s.addInput} value={addName} onChange={e=>setAddName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&quickAdd()} placeholder="Nova tarefa rápida..."/>
              <select style={s.addSelect} value={addCat} onChange={e=>setAddCat(e.target.value)}>
                {Object.keys(CAT_MAP).map(c=><option key={c}>{c}</option>)}
              </select>
              <button style={s.btnPrimary} onClick={quickAdd}>Adicionar</button>
            </div>
            <Section color={C.accent}   label="Amanhã cedo — Prioridade" tasks={bySecAndStatus("amanha")}   onCycle={cycleTask}/>
            <Section color={C.red}      label="Urgente — Matar logo"       tasks={bySecAndStatus("urgente")}  onCycle={cycleTask}/>
            <Section color={C.blue}     label="A partir de Segunda-feira"   tasks={bySecAndStatus("segunda")}  onCycle={cycleTask}/>
            <Section color={C.purple}   label="Conteúdo & Redes"            tasks={bySecAndStatus("conteudo")} onCycle={cycleTask}/>
            <Section color={C.orange}   label="Financeiro & Viagem"         tasks={bySecAndStatus("fin")}      onCycle={cycleTask}/>
            <Section color={C.dim}      label="Exacta & Outros"             tasks={bySecAndStatus("outros")}   onCycle={cycleTask}/>
          </>
        )}

        {/* ── BOARD ── */}
        {view==="board"&&(
          <div style={s.board}>
            {[["ns","Não Iniciado",C.dim],["proc","Em Processo",C.blue],["done","Concluído",C.green]].map(([st,label,color])=>{
              const ts=tasks.filter(t=>t.status===st);
              return(
                <div key={st} style={s.bcol}>
                  <div style={s.bcolHead}>
                    <div style={s.bcolDot(color)}/>
                    <span style={{...s.bcolTitle,color}}>{label}</span>
                    <span style={s.bcolCnt}>{ts.length}</span>
                  </div>
                  <div style={{padding:9}}>
                    {ts.length===0&&<div style={{textAlign:"center",padding:"20px 12px",fontSize:11,color:C.muted}}>Vazio</div>}
                    {ts.map(t=>(
                      <div key={t.id} style={s.bcard} onClick={()=>cycleTask(t.id)}>
                        <div style={s.bcardTitle}>{t.icon} {t.name}</div>
                        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                          <Badge type={t.badge}/><span style={{fontSize:9.5,color:C.muted}}>{t.cat}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── TAREFAS ── */}
        {view==="tarefas"&&(
          <>
            <div style={s.addBar}>
              <span style={{color:C.muted,fontSize:16}}>+</span>
              <input style={s.addInput} value={addName} onChange={e=>setAddName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&quickAdd()} placeholder="Nova tarefa..."/>
              <select style={s.addSelect} value={addCat} onChange={e=>setAddCat(e.target.value)}>
                {Object.keys(CAT_MAP).map(c=><option key={c}>{c}</option>)}
              </select>
              <button style={s.btnPrimary} onClick={quickAdd}>Adicionar</button>
            </div>
            {tasks.map(t=><TaskRow key={t.id} task={t} onCycle={cycleTask}/>)}
          </>
        )}

        {/* ── CALENDAR ── */}
        {view==="calendar"&&(
          <div style={s.calGrid}>
            {["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"].map(d=><div key={d} style={s.calDLabel}>{d}</div>)}
            {[27,28,29,30,31].map(d=><div key={"m"+d} style={s.calDay(false,true)}><div style={{fontWeight:800,fontSize:11,color:C.dim}}>{d}</div></div>)}
            {Array.from({length:30},(_,i)=>i+1).map(d=>(
              <div key={d} style={s.calDay(d===21,false)}>
                <div style={{fontWeight:800,fontSize:11,color:d===21?C.accent:C.dim,marginBottom:3}}>{d}</div>
                {(CAL_EVENTS[d]||[]).map((ev,i)=><div key={i} style={s.calEv(ev.t)}>{ev.l}</div>)}
              </div>
            ))}
            {[1,2,3].map(d=><div key={"n"+d} style={s.calDay(false,true)}><div style={{fontWeight:800,fontSize:11,color:C.dim}}>{d}</div></div>)}
          </div>
        )}

        {/* ── REUNIÕES ── */}
        {view==="reunioes"&&(
          <>
            <div style={s.metrics(3)}>
              {[["Reuniões",meetings.length,"registradas",C.blue],["Analisadas",meetings.filter(m=>m.aiData).length,"com IA",C.green],["Tarefas IA",aiTasksAdded.current.size,"adicionadas",C.purple]].map(([l,v,sub,color])=>(
                <div key={l} style={{...s.met,borderTop:`2px solid ${color}`}}>
                  <div style={s.metLabel}>{l}</div>
                  <div style={{...s.metVal,color}}>{v}</div>
                  <div style={s.metSub}>{sub}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:8,marginBottom:18}}>
              <button style={s.btnPrimary} onClick={()=>setShowNewMeet(v=>!v)}>
                {showNewMeet?"✕ Fechar":"+ Nova Reunião"}
              </button>
            </div>
            {showNewMeet&&(
              <div style={{background:C.card,border:`1px solid ${C.border2}`,borderRadius:10,padding:"18px 20px",marginBottom:20}}>
                <div style={{fontWeight:800,fontSize:11,textTransform:"uppercase",letterSpacing:"0.09em",color:C.dim,marginBottom:14}}>🎙 Nova Reunião</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                  <div><label style={s.fLabel}>Título</label><input style={s.fInput} value={nmForm.title} onChange={e=>setNmForm(f=>({...f,title:e.target.value}))} placeholder="Ex: Reunião Equipe Swat..."/></div>
                  <div><label style={s.fLabel}>Data</label><input style={{...s.fInput,colorScheme:"dark"}} type="date" value={nmForm.date} onChange={e=>setNmForm(f=>({...f,date:e.target.value}))}/></div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                  <div><label style={s.fLabel}>Participantes</label><input style={s.fInput} value={nmForm.pic} onChange={e=>setNmForm(f=>({...f,pic:e.target.value}))} placeholder="Alexandre, Mateus, Paola..."/></div>
                  <div><label style={s.fLabel}>Equipe</label>
                    <select style={{...s.fInput,cursor:"pointer"}} value={nmForm.team} onChange={e=>setNmForm(f=>({...f,team:e.target.value}))}>
                      {["Swat 🚓","Sherlok 🎩","Suits 🕴️","Exacta 🏢","Interno 📋","Cliente 🤝"].map(t=><option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{marginBottom:10}}><label style={s.fLabel}>Pautas / Agenda</label><textarea style={{...s.fTextarea,minHeight:70}} value={nmForm.agenda} onChange={e=>setNmForm(f=>({...f,agenda:e.target.value}))} placeholder="1. Ponto 1&#10;2. Ponto 2..."/></div>
                <div>
                  <label style={s.fLabel}>Transcrição</label>
                  <Recorder onTranscript={t=>setNmForm(f=>({...f,transcript:t}))}/>
                  <textarea style={s.fTextarea} value={nmForm.transcript} onChange={e=>setNmForm(f=>({...f,transcript:e.target.value}))} rows={6} placeholder="A transcrição aparece aqui enquanto você fala... ou cole/escreva manualmente."/>
                </div>
                <div style={{display:"flex",gap:8,marginTop:14}}>
                  <button style={s.btnPrimary} onClick={()=>saveMeeting(false)}>Salvar</button>
                  <button style={{...s.btnAI}} onClick={()=>{ saveMeeting(false); }}>Salvar + Analisar ✨</button>
                </div>
              </div>
            )}
            {meetings.length===0&&!showNewMeet&&(
              <div style={{textAlign:"center",padding:"40px 20px",color:C.muted,fontSize:12}}>
                Nenhuma reunião ainda. Clique em <b style={{color:C.accent}}>+ Nova Reunião</b> para começar.
              </div>
            )}
            {meetings.map(m=>(
              <MeetingCard key={m.id} meeting={m} onAnalyzed={onAnalyzed} onAddTask={onAddTask}/>
            ))}
          </>
        )}

        {/* ── EQUIPES ── */}
        {view==="teams"&&(
          <>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}}>
              {[["🚓","Swat"],["🎩","Sherlok"],["🕴️","Suits"]].map(([icon,name])=>(
                <div key={name} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
                  <div style={{padding:"14px 16px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:22}}>{icon}</span>
                    <div><div style={{fontWeight:800,fontSize:14}}>{name}</div><div style={{fontSize:10,color:C.muted}}>Cronograma Diário Vendedor</div></div>
                  </div>
                  <div style={{padding:"14px 16px"}}>
                    {[["Leads","—",C.blue],["Agendamentos","—",C.green],["Vendas","—",C.accent]].map(([l,v,c])=>(
                      <div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                        <span style={{fontSize:11,color:C.dim}}>{l}</span>
                        <span style={{fontWeight:900,fontSize:13,color:c}}>{v}</span>
                      </div>
                    ))}
                    <div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:8}}>
                      <Badge type="proc" label="Agendamento"/><Badge type="done" label="Leads"/><Badge type="ns" label="Produção"/>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={s.secH}><div style={s.secTitle}><span style={s.secDot(C.purple)}/>Relatórios Paola</div></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div style={s.noteCard}><div style={s.noteH}>📊 Resumo Diário</div><textarea style={s.noteTA} defaultValue="Registre aqui o resumo diário de performance..."/></div>
              <div style={s.noteCard}><div style={s.noteH}>📞 Ligações</div><textarea style={s.noteTA} defaultValue="Registre o volume de ligações e resultados..."/></div>
            </div>
          </>
        )}

        {/* ── PÓS-VENDA ── */}
        {view==="posvenda"&&(
          <>
            <div style={{overflowX:"auto",background:C.card,border:`1px solid ${C.border}`,borderRadius:10,marginBottom:14}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                <thead><tr>{["Cliente","Produto","Canal","App","Status","Nova Opp","Resp"].map(h=><th key={h} style={{textAlign:"left",padding:"9px 13px",fontSize:9.5,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.1em",color:C.muted,borderBottom:`1px solid ${C.border}`,background:C.surface}}>{h}</th>)}</tr></thead>
                <tbody>
                  {pvRows.length===0&&<tr><td colSpan={7} style={{textAlign:"center",color:C.muted,padding:"22px",fontSize:11}}>Adicione clientes abaixo →</td></tr>}
                  {pvRows.map((r,i)=>(
                    <tr key={i}>
                      <td style={{padding:"9px 13px",fontWeight:600}}>{r.cli}</td>
                      <td style={{padding:"9px 13px"}}><Badge type="ns" label={r.prod}/></td>
                      <td style={{padding:"9px 13px"}}>{r.canal}</td>
                      <td style={{padding:"9px 13px",fontSize:11}}>App Real Invest</td>
                      <td style={{padding:"9px 13px"}}><Badge type={r.appSt==="Ativo"?"done":r.appSt==="Inativo"?"urg":"ns"} label={r.appSt}/></td>
                      <td style={{padding:"9px 13px"}}><Badge type="proc" label="Em análise"/></td>
                      <td style={{padding:"9px 13px",fontSize:11,color:C.dim}}>Alexandre</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={s.addBar}>
              <input style={s.addInput} value={pvForm.cli} onChange={e=>setPvForm(f=>({...f,cli:e.target.value}))} placeholder="Nome do cliente..."/>
              {["prod","canal","appSt"].map(k=>(
                <select key={k} style={s.addSelect} value={pvForm[k]} onChange={e=>setPvForm(f=>({...f,[k]:e.target.value}))}>
                  {k==="prod"&&["Consórcio Auto","Consórcio Imóvel","Financiamento Veicular","Refinanciamento"].map(o=><option key={o}>{o}</option>)}
                  {k==="canal"&&["WhatsApp","Ligação","Visita","E-mail"].map(o=><option key={o}>{o}</option>)}
                  {k==="appSt"&&["Ativo","Inativo","Não Instalado"].map(o=><option key={o}>{o}</option>)}
                </select>
              ))}
              <button style={s.btnPrimary} onClick={()=>{ if(!pvForm.cli.trim())return; setPvRows(r=>[...r,{...pvForm}]); setPvForm(f=>({...f,cli:""})); }}>+ Adicionar</button>
            </div>
            <div style={s.secH}><div style={s.secTitle}><span style={s.secDot(C.blue)}/>Tarefas Pós-Venda</div></div>
            {byCat("🤝 Pós-Venda").map(t=><TaskRow key={t.id} task={t} onCycle={cycleTask}/>)}
          </>
        )}

        {/* ── EXACTA ── */}
        {view==="exacta"&&(
          <>
            <div style={s.metrics(3)}>
              {[["Empresa","Exacta",C.accent],["Tarefas",byCat("🏢 Exacta").length,C.blue],["Status","Ativo",C.green]].map(([l,v,color])=>(
                <div key={l} style={{...s.met,borderTop:`2px solid ${color}`}}><div style={s.metLabel}>{l}</div><div style={{...s.metVal,color,fontSize:20}}>{v}</div></div>
              ))}
            </div>
            <div style={s.secH}><div style={s.secTitle}><span style={s.secDot(C.accent)}/>Tarefas Exacta</div></div>
            {byCat("🏢 Exacta").map(t=><TaskRow key={t.id} task={t} onCycle={cycleTask}/>)}
            <div style={s.secH}><div style={s.secTitle}><span style={s.secDot(C.purple)}/>Guia de Vendas</div></div>
            <div style={s.noteGrid}>
              {[["🎯 Primeiro Contato","Qualificar: Estado, Veículo, Valor Entrada, Valor. Usar rapport e neurociência."],["🔥 Fechamento","Gatilhos: Escassez, Urgência, Prova Social. Cada gatilho aplicado de forma planejada."],["🤝 Pós-Venda","App Real Invest, Grupo WhatsApp, CRM. Verificar status. Identificar nova oportunidade."]].map(([h,v])=>(
                <div key={h} style={s.noteCard}><div style={s.noteH}>{h}</div><textarea style={s.noteTA} defaultValue={v}/></div>
              ))}
            </div>
          </>
        )}

        {/* ── CONTEÚDO ── */}
        {view==="conteudo"&&(
          <>
            <div style={s.metrics(3)}>
              {[["Posts IG",3,C.purple],["Vídeos",3,C.accent],["Agendamentos","—",C.blue]].map(([l,v,color])=>(
                <div key={l} style={{...s.met,borderTop:`2px solid ${color}`}}><div style={s.metLabel}>{l}</div><div style={{...s.metVal,color}}>{v}</div><div style={s.metSub}>meta do mês</div></div>
              ))}
            </div>
            <div style={s.secH}><div style={s.secTitle}><span style={s.secDot(C.purple)}/>Tarefas de Conteúdo</div></div>
            {byCat("📲 Conteúdo").map(t=><TaskRow key={t.id} task={t} onCycle={cycleTask}/>)}
            <div style={s.secH}><div style={s.secTitle}><span style={s.secDot(C.accent)}/>Roteiro de Vídeos</div></div>
            <div style={s.noteGrid}>
              {["🎬 Vídeo 1","🎬 Vídeo 2","🎬 Vídeo 3"].map(h=>(
                <div key={h} style={s.noteCard}><div style={s.noteH}>{h}</div><textarea style={s.noteTA} placeholder="Tema, roteiro, CTA..."/></div>
              ))}
            </div>
          </>
        )}

        {/* ── FINANCEIRO ── */}
        {view==="financeiro"&&(
          <>
            <div style={s.secH}><div style={s.secTitle}><span style={s.secDot(C.orange)}/>Tarefas Financeiro & Viagem</div></div>
            {byCat("💰 Financeiro").map(t=><TaskRow key={t.id} task={t} onCycle={cycleTask}/>)}
            <div style={s.secH}><div style={s.secTitle}><span style={s.secDot(C.accent)}/>Anotações</div></div>
            <div style={s.noteGrid}>
              {[["✈️ Passagens","Pesquisar destino, datas, comparar companhias, usar milhas?"],["📊 Financeiro Pessoal","Alinhar entradas vs saídas. Reserva de emergência?"],["📋 Lista Vingança","Adicione os itens aqui..."]].map(([h,v])=>(
                <div key={h} style={s.noteCard}><div style={s.noteH}>{h}</div><textarea style={s.noteTA} defaultValue={v}/></div>
              ))}
            </div>
          </>
        )}

        {/* ── NOTAS ── */}
        {view==="notas"&&(
          <div style={s.noteGrid}>
            {[["🧠 Pautas Reunião Segunda","Definir pautas da reunião rápida..."],["🚗 HB20 Anúncio","Ano, modelo, km, preço, diferenciais..."],["🔗 Troca Fácil LP","Itens pendentes da landing page..."],["💬 Mateus","Pontos para resolver amanhã cedo..."],["🤝 Negociação","A partir de segunda. Pontos-chave..."],["📌 Geral","Espaço livre para anotações..."]].map(([h,v])=>(
              <div key={h} style={s.noteCard}><div style={s.noteH}>{h}</div><textarea style={s.noteTA} defaultValue={v}/></div>
            ))}
          </div>
        )}

        </div>
      </main>
    </div>
  );
}
