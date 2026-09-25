import React, { useMemo, useState } from "react";
import {
  Activity, AlertTriangle, ArrowRight, Bell, Boxes, Building2, CheckCircle2,
  ChevronDown, CircleHelp, ClipboardList, FileText, Gauge, HeartPulse, LayoutDashboard,
  Lightbulb, MapPin, Menu, Package, RefreshCw, Search, Settings, ShieldCheck,
  Sparkles, TrendingDown, TrendingUp, Truck, Users, X, Zap
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, CartesianGrid, Legend, LineChart, Line,
  ResponsiveContainer, Tooltip, XAxis, YAxis
} from "recharts";

const facilities = [
  { name:"District Hospital A", code:"DHA-01", district:"Central District", stock:82, risk:"Low", medicines:14, beds:18, staff:92 },
  { name:"Community Health Centre B", code:"CHB-02", district:"North District", stock:48, risk:"Medium", medicines:11, beds:7, staff:78 },
  { name:"Primary Health Centre C", code:"PHC-03", district:"East District", stock:27, risk:"High", medicines:9, beds:3, staff:64 },
  { name:"Sub-District Hospital D", code:"SDH-04", district:"South District", stock:71, risk:"Low", medicines:16, beds:12, staff:88 },
  { name:"Urban Health Centre E", code:"UHC-05", district:"West District", stock:39, risk:"Medium", medicines:10, beds:5, staff:73 }
];

const demandData = [
  { day:"Mon", demand:860, stock:1120 },
  { day:"Tue", demand:910, stock:1040 },
  { day:"Wed", demand:980, stock:970 },
  { day:"Thu", demand:1040, stock:900 },
  { day:"Fri", demand:1090, stock:860 },
  { day:"Sat", demand:1160, stock:820 },
  { day:"Sun", demand:1210, stock:790 }
];

const medicines = [
  { name:"Paracetamol 500mg", facility:"DHA-01", stock:1200, forecast:980, safety:500, days:9, status:"Healthy", trend:"up" },
  { name:"Amoxicillin 250mg", facility:"PHC-03", stock:180, forecast:420, safety:200, days:3, status:"Critical", trend:"up" },
  { name:"ORS Sachets", facility:"CHB-02", stock:650, forecast:720, safety:300, days:5, status:"Watch", trend:"up" },
  { name:"Azithromycin 500mg", facility:"UHC-05", stock:320, forecast:350, safety:220, days:6, status:"Watch", trend:"down" },
  { name:"Insulin Vials", facility:"SDH-04", stock:460, forecast:310, safety:180, days:12, status:"Healthy", trend:"down" }
];

const initialAlerts = [
  { id:1, type:"Critical", title:"Amoxicillin stock-out risk", facility:"PHC-03", text:"Forecast demand may exceed available stock in 3 days.", time:"12 min ago" },
  { id:2, type:"Warning", title:"ORS demand rising", facility:"CHB-02", text:"Consumption is 18% above the recent baseline.", time:"38 min ago" },
  { id:3, type:"Info", title:"Redistribution opportunity", facility:"DHA-01 → PHC-03", text:"Surplus stock could be reviewed for transfer.", time:"1 hr ago" }
];

function App() {
  const [page, setPage] = useState("Dashboard");
  const [sidebar, setSidebar] = useState(false);
  const [alerts, setAlerts] = useState(initialAlerts);
  const [search, setSearch] = useState("");
  const [selectedFacility, setSelectedFacility] = useState(null);

  const nav = [
    ["Dashboard", LayoutDashboard], ["Inventory", Package], ["Forecasting", TrendingUp],
    ["Alerts", Bell], ["Resource Matching", Truck], ["Facilities", Building2],
    ["Analytics", Gauge]
  ];

  const filteredFacilities = useMemo(() =>
    facilities.filter(f => `${f.name} ${f.district}`.toLowerCase().includes(search.toLowerCase())), [search]);

  const dismissAlert = id => setAlerts(a => a.filter(x => x.id !== id));

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebar ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><HeartPulse size={23}/></div>
          <div><strong>HealthGrid</strong><span>Resource Intelligence</span></div>
          <button className="icon-btn mobile-close" onClick={()=>setSidebar(false)}><X size={19}/></button>
        </div>
        <div className="workspace">
          <span className="dot"></span> Prototype Workspace <ChevronDown size={15}/>
        </div>
        <nav>
          <p className="nav-label">MAIN</p>
          {nav.map(([label, Icon]) =>
            <button key={label} className={`nav-item ${page===label ? "active":""}`} onClick={()=>{setPage(label);setSidebar(false)}}>
              <Icon size={18}/><span>{label}</span>{label==="Alerts" && alerts.length>0 && <b>{alerts.length}</b>}
            </button>
          )}
          <p className="nav-label">SYSTEM</p>
          <button className={`nav-item ${page==="Reports"?"active":""}`} onClick={()=>setPage("Reports")}><FileText size={18}/>Reports</button>
          <button className={`nav-item ${page==="Settings"?"active":""}`} onClick={()=>setPage("Settings")}><Settings size={18}/>Settings</button>
        </nav>
        <div className="sidebar-foot">
          <ShieldCheck size={18}/>
          <div><strong>Decision support only</strong><span>Final actions remain with authorized administrators.</span></div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="icon-btn mobile-menu" onClick={()=>setSidebar(true)}><Menu/></button>
          <div className="crumb"><span>HealthGrid</span><ArrowRight size={14}/><strong>{page}</strong></div>
          <div className="top-actions">
            <div className="search"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search facilities..." /></div>
            <button className="notification" onClick={()=>setPage("Alerts")}><Bell size={19}/>{alerts.length>0&&<i/>}</button>
            <div className="avatar">AS</div>
          </div>
        </header>

        <div className="content">
          {page==="Dashboard" && <Dashboard alerts={alerts} dismissAlert={dismissAlert} setPage={setPage} facilities={filteredFacilities} setSelectedFacility={setSelectedFacility} />}
          {page==="Inventory" && <Inventory />}
          {page==="Forecasting" && <Forecasting />}
          {page==="Alerts" && <Alerts alerts={alerts} dismissAlert={dismissAlert} />}
          {page==="Resource Matching" && <Matching />}
          {page==="Facilities" && <Facilities list={filteredFacilities} setSelectedFacility={setSelectedFacility}/>}
          {page==="Analytics" && <Analytics />}
          {page==="Reports" && <Reports />}
          {page==="Settings" && <SettingsPage />}
        </div>
      </main>

      {selectedFacility && <FacilityModal facility={selectedFacility} close={()=>setSelectedFacility(null)} />}
    </div>
  );
}

function PageHeader({eyebrow,title,text,action}) {
  return <div className="page-header">
    <div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{text}</p></div>
    {action}
  </div>
}

function Dashboard({alerts,dismissAlert,setPage,facilities,setSelectedFacility}) {
  return <>
    <PageHeader eyebrow="OVERVIEW" title="Good evening, Administrator" text="Here’s your resource intelligence snapshot across the HealthGrid network."
      action={<button className="soft-btn" onClick={()=>setPage("Reports")}><FileText size={16}/> View report</button>} />
    <div className="status-strip"><span><span className="live-dot"/> Data sync healthy</span><span>Last updated 2 min ago</span><span className="source-tag">Synthetic prototype data</span></div>
    <section className="metric-grid">
      <Metric icon={Building2} label="Facilities monitored" value="5" sub="Across 5 districts" />
      <Metric icon={Package} label="Medicine stock health" value="82%" sub="+4.8% vs last week" trend="up" />
      <Metric icon={AlertTriangle} label="Active stock risks" value="4" sub="1 critical · 3 watch" tone="warning" />
      <Metric icon={Truck} label="Match opportunities" value="7" sub="Potential redistribution" />
    </section>
    <div className="grid-2">
      <Card title="Demand vs available stock" subtitle="7-day network trend" action={<button className="link-btn" onClick={()=>setPage("Forecasting")}>Open forecast <ArrowRight size={14}/></button>}>
        <div className="chart"><ResponsiveContainer width="100%" height={265}><AreaChart data={demandData}><defs><linearGradient id="demand" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopOpacity=".18"/><stop offset="100%" stopOpacity="0"/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8eef0"/><XAxis dataKey="day" axisLine={false} tickLine={false}/><YAxis axisLine={false} tickLine={false}/><Tooltip/><Area type="monotone" dataKey="stock" stroke="#4d9a89" fill="url(#demand)" strokeWidth={2}/><Line type="monotone" dataKey="demand" stroke="#6b7280" strokeWidth={2} dot={false}/></AreaChart></ResponsiveContainer></div>
        <div className="legend"><span><i className="green-dot"/>Available stock</span><span><i className="gray-dot"/>Forecast demand</span></div>
      </Card>
      <Card title="Risk overview" subtitle="Facilities requiring attention">
        <div className="risk-list">{facilities.slice().sort((a,b)=>({High:0,Medium:1,Low:2}[a.risk]-({High:0,Medium:1,Low:2}[b.risk]))).map(f=>
          <button className="risk-row" key={f.code} onClick={()=>setSelectedFacility(f)}>
            <div className={`risk-icon ${f.risk.toLowerCase()}`}>{f.risk==="High"?<AlertTriangle size={17}/>:<Activity size={17}/>}</div>
            <div className="risk-main"><strong>{f.name}</strong><span>{f.district} · {f.stock}% stock health</span></div>
            <Pill text={f.risk}/><ArrowRight size={15}/>
          </button>)}</div>
      </Card>
    </div>
    <div className="grid-2 bottom-grid">
      <Card title="Priority alerts" subtitle="Latest signals from the risk engine" action={<button className="link-btn" onClick={()=>setPage("Alerts")}>View all <ArrowRight size={14}/></button>}>
        {alerts.slice(0,3).map(a=><AlertItem key={a.id} alert={a} dismiss={()=>dismissAlert(a.id)}/>)}
      </Card>
      <Card title="AI insight" subtitle="Natural-language summary">
        <div className="ai-box"><div className="ai-icon"><Sparkles size={18}/></div><div><strong>Network signal detected</strong><p>Demand for essential medicines is trending upward at 2 facilities. PHC-03 may need attention before the projected 3-day threshold.</p><button className="text-action" onClick={()=>setPage("Resource Matching")}>Review recommended actions <ArrowRight size={14}/></button></div></div>
      </Card>
    </div>
  </>;
}

function Metric({icon:Icon,label,value,sub,trend,tone}) {
  return <div className="metric"><div className="metric-top"><div className="metric-icon"><Icon size={19}/></div>{trend&&<span className="trend"><TrendingUp size={13}/> 4.8%</span>}</div><strong>{value}</strong><span className="metric-label">{label}</span><small className={tone==="warning"?"warn":""}>{sub}</small></div>
}
function Card({title,subtitle,action,children}) { return <section className="card"><div className="card-head"><div><h3>{title}</h3><p>{subtitle}</p></div>{action}</div>{children}</section> }
function Pill({text}) { return <span className={`pill ${text.toLowerCase()}`}>{text}</span> }

function AlertItem({alert,dismiss}) {
  return <div className="alert-item"><div className={`alert-symbol ${alert.type.toLowerCase()}`}>{alert.type==="Critical"?<AlertTriangle size={16}/>:alert.type==="Warning"?<Zap size={16}/>:<Lightbulb size={16}/>}</div><div className="alert-copy"><strong>{alert.title}</strong><span>{alert.facility} · {alert.time}</span><p>{alert.text}</p></div><button className="dismiss" onClick={dismiss}><X size={15}/></button></div>
}

function Inventory() {
  return <><PageHeader eyebrow="INVENTORY" title="Medicine inventory" text="Monitor stock, safety levels and consumption signals across facilities." action={<button className="soft-btn"><RefreshCw size={16}/> Refresh data</button>}/><div className="metric-grid compact"><Metric icon={Package} label="Total units tracked" value="2,810" sub="Across 5 facilities"/><Metric icon={CheckCircle2} label="Healthy items" value="71%" sub="Within safety stock"/><Metric icon={TrendingDown} label="Below safety stock" value="6" sub="Needs review" tone="warning"/><Metric icon={Boxes} label="Medicine types" value="16" sub="Prototype dataset"/></div><Card title="Current inventory" subtitle="Synthetic facility-level data"><InventoryTable/></Card></>
}
function InventoryTable() {
 return <div className="table-wrap"><table><thead><tr><th>Medicine</th><th>Facility</th><th>Available</th><th>7-day forecast</th><th>Safety stock</th><th>Days left</th><th>Status</th></tr></thead><tbody>{medicines.map(m=><tr key={m.name}><td><strong>{m.name}</strong></td><td>{m.facility}</td><td>{m.stock.toLocaleString()}</td><td>{m.forecast.toLocaleString()}</td><td>{m.safety}</td><td>{m.days}</td><td><Pill text={m.status}/></td></tr>)}</tbody></table></div>
}

function Forecasting() {
 return <><PageHeader eyebrow="FORECASTING" title="Demand forecasting" text="Short-term estimates based on historical consumption patterns." action={<span className="model-chip"><Activity size={15}/> Moving-average prototype</span>}/><div className="grid-2"><Card title="Network demand forecast" subtitle="Illustrative 7-day projection"><div className="chart"><ResponsiveContainer width="100%" height={340}><LineChart data={demandData}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8eef0"/><XAxis dataKey="day" axisLine={false} tickLine={false}/><YAxis axisLine={false} tickLine={false}/><Tooltip/><Legend/><Line name="Forecast demand" type="monotone" dataKey="demand" stroke="#4d9a89" strokeWidth={3}/><Line name="Available stock" type="monotone" dataKey="stock" stroke="#9aa6aa" strokeWidth={2} strokeDasharray="6 4"/></LineChart></ResponsiveContainer></div></Card><Card title="Forecast methodology" subtitle="How the MVP produces estimates"><div className="steps">{["Historical consumption is standardized.","A short-term moving average estimates demand.","The risk engine compares forecast with inventory and safety stock.","Administrators review the signal before taking action."].map((s,i)=><div className="step" key={s}><b>{i+1}</b><span>{s}</span></div>)}</div><div className="notice"><CircleHelp size={16}/><span>This prototype uses simple forecasting rather than claiming a production-grade AI model.</span></div></Card></div></>
}

function Alerts({alerts,dismissAlert}) {
 return <><PageHeader eyebrow="ALERT CENTER" title="Stock-risk alerts" text="Early warnings generated by comparing forecast demand with available and safety stock."/><div className="alert-banner"><AlertTriangle size={20}/><div><strong>{alerts.length} active signals</strong><span>Review alerts before making operational decisions.</span></div></div><Card title="Active alerts" subtitle="Prioritized by risk signal">{alerts.length ? alerts.map(a=><AlertItem key={a.id} alert={a} dismiss={()=>dismissAlert(a.id)}/>) : <Empty title="No active alerts" text="All current signals have been dismissed."/ >}</Card></>
}

function Matching() {
 return <><PageHeader eyebrow="RESOURCE MATCHING" title="Redistribution opportunities" text="Potential surplus-to-shortage relationships for administrator review."/><div className="match-grid">{[
  ["District Hospital A","Primary Health Centre C","Amoxicillin 250mg","Surplus 260","Risk 3 days"],
  ["Sub-District Hospital D","Community Health Centre B","ORS Sachets","Surplus 190","Risk 5 days"],
  ["District Hospital A","Urban Health Centre E","Azithromycin 500mg","Surplus 120","Risk 6 days"]
].map((m,i)=><div className="match-card" key={i}><div className="match-top"><span className="match-badge"><Truck size={16}/> Potential match</span><span>#{i+1}</span></div><div className="route"><div><strong>{m[0]}</strong><span>Surplus facility</span></div><ArrowRight size={20}/><div><strong>{m[1]}</strong><span>Potential shortage</span></div></div><div className="match-details"><span><Package size={15}/>{m[2]}</span><span><TrendingUp size={15}/>{m[3]}</span><span><AlertTriangle size={15}/>{m[4]}</span></div><button className="review-btn">Review suggestion <ArrowRight size={15}/></button></div>)}</div><div className="notice"><ShieldCheck size={17}/><span>HealthGrid only surfaces possible matches. It does not autonomously authorize transfers or procurement.</span></div></>
}

function Facilities({list,setSelectedFacility}) {
 return <><PageHeader eyebrow="FACILITIES" title="Facility network" text="View the simulated public healthcare facilities included in this MVP."/><div className="facility-grid">{list.map(f=><button className="facility-card" key={f.code} onClick={()=>setSelectedFacility(f)}><div className="facility-head"><div className="facility-icon"><Building2 size={19}/></div><Pill text={f.risk}/></div><h3>{f.name}</h3><span>{f.code} · {f.district}</span><div className="mini-stats"><span><Package size={14}/>{f.medicines} medicines</span><span><HeartPulse size={14}/>{f.beds} beds</span><span><Users size={14}/>{f.staff}% staff</span></div><div className="healthbar"><i style={{width:`${f.stock}%`}}/></div><small>{f.stock}% stock health</small></button>)}</div></>
}

function Analytics() {
 const data = facilities.map(f=>({name:f.code,stock:f.stock,staff:f.staff,beds:f.beds*5}));
 return <><PageHeader eyebrow="ANALYTICS" title="Network analytics" text="Visual overview of resource health and utilization signals."/><div className="grid-2"><Card title="Facility stock health" subtitle="Current percentage"><div className="chart"><ResponsiveContainer width="100%" height={320}><BarChart data={data}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8eef0"/><XAxis dataKey="name" axisLine={false} tickLine={false}/><YAxis axisLine={false} tickLine={false}/><Tooltip/><Bar dataKey="stock" fill="#76a99f" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer></div></Card><Card title="Resource signals" subtitle="Prototype operational metrics"><div className="analytics-list">{[["Medicine coverage","82%","Healthy"],["Staff attendance","79%","Stable"],["Bed availability","63%","Monitor"],["Forecast confidence","86%","Model signal"]].map(x=><div className="analytic-row" key={x[0]}><span>{x[0]}</span><strong>{x[1]}</strong><Pill text={x[2]}/></div>)}</div></Card></div></>
}

function Reports() {
 return <><PageHeader eyebrow="REPORTS" title="Administrator report" text="A concise view of the signals currently visible in HealthGrid." action={<button className="soft-btn" onClick={()=>window.print()}><FileText size={16}/> Print / save PDF</button>}/><div className="report"><div className="report-title"><div className="brand-mark"><HeartPulse size={20}/></div><div><h2>HealthGrid Network Snapshot</h2><span>Prototype · Synthetic dataset · Administrator review</span></div></div><div className="report-kpis"><Metric icon={Building2} label="Facilities" value="5" sub="Monitored"/><Metric icon={AlertTriangle} label="Risks" value="4" sub="Active"/><Metric icon={Truck} label="Matches" value="7" sub="Potential"/></div><h3>Priority findings</h3><ul className="report-list"><li>PHC-03 has the highest current stock-risk signal.</li><li>Demand is trending upward for selected essential medicines.</li><li>Three potential redistribution relationships are surfaced for review.</li></ul><div className="notice"><ShieldCheck size={17}/><span>All procurement, redistribution and healthcare-management decisions remain with authorized human administrators.</span></div></div></>
}

function SettingsPage() {
 return <><PageHeader eyebrow="SETTINGS" title="Workspace settings" text="Prototype controls and transparency information."/><div className="settings-list"><Setting title="Synthetic dataset" desc="Use clearly labelled prototype data for the demo." on/><Setting title="AI natural-language insights" desc="Generate summaries from approved non-clinical operational data." on/><Setting title="Administrator confirmation" desc="Require human review before any operational action." on locked/><Setting title="Patient diagnosis features" desc="Clinical diagnosis and treatment recommendations are outside the MVP." disabled/></div></>
}
function Setting({title,desc,on,locked,disabled}) { const [v,setV]=useState(on); return <div className="setting"><div><strong>{title}</strong><p>{desc}</p></div><button disabled={disabled||locked} className={`toggle ${v?"on":""}`} onClick={()=>setV(!v)}><i/></button></div> }
function Empty({title,text}) { return <div className="empty"><CheckCircle2 size={30}/><strong>{title}</strong><span>{text}</span></div> }

function FacilityModal({facility,close}) {
 return <div className="modal-backdrop" onClick={close}><div className="modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={close}><X/></button><div className="facility-modal-icon"><Building2 size={22}/></div><div className="eyebrow">FACILITY PROFILE</div><h2>{facility.name}</h2><p>{facility.code} · {facility.district}</p><div className="modal-grid"><div><span>Stock health</span><strong>{facility.stock}%</strong></div><div><span>Risk</span><Pill text={facility.risk}/></div><div><span>Medicines</span><strong>{facility.medicines}</strong></div><div><span>Staff attendance</span><strong>{facility.staff}%</strong></div></div><div className="notice"><MapPin size={16}/><span>Map view is represented as a facility-level prototype; live GIS integration is future scope.</span></div></div></div>
}

export default App;