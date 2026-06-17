import { useEffect, useState } from "react";
import { Bell, LogOut, Menu, RefreshCw, Search, Sparkles } from "lucide-react";
import { ApiDocs } from "../features/api-docs";
import { ApiKeys } from "../features/api-keys";
import { getMe, logout } from "../features/auth";
import { Jobs } from "../features/jobs";
import { Logs } from "../features/logs";
import { PoolManager } from "../features/pools";
import { clearAuthSession } from "../core/auth";
import { Badge } from "../shared/components";
import { tabs } from "./navigation";

const screens = { pool: PoolManager, jobs: Jobs, docs: ApiDocs, logs: Logs, keys: ApiKeys };

export function Shell() {
  const [tab, setTab] = useState("pool");
  const [me, setMe] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const loadMe = () => getMe().then(setMe).catch(() => clearAuthSession());

  useEffect(() => { loadMe(); }, [refresh]);

  if (!me) return <div className="loading">Loading...</div>;

  const Active = screens[tab];
  const activeLabel = tabs.find(([id]) => id === tab)?.[1];
  const pinnedTabs = tabs.slice(0, 2);
  const adminTabs = tabs.slice(2);
  const renderNav = (items) => items.map(([id, label, Icon]) => (
    <button key={id} className={tab === id ? "active" : ""} onClick={() => setTab(id)}>
      <Icon size={18} /> <span>{label}</span>
    </button>
  ));

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand"><Sparkles size={22} /> <span>Groks</span></div>
        <span className="sideLabel">Pinned</span>
        {renderNav(pinnedTabs)}
        <span className="sideLabel">Administration</span>
        {renderNav(adminTabs)}
        <button className="logout" onClick={async () => { try { await logout(); } catch { /* ignore */ } clearAuthSession(); location.reload(); }}><LogOut size={18} /> <span>Logout</span></button>
      </aside>
      <main className="main">
        <header className="topbar">
          <button className="iconOnly menuBtn" aria-label="Menu"><Menu size={18} /></button>
          <div className="searchBox"><Search size={17} /><input placeholder="Search pools, jobs, keys..." /></div>
          <div className="topActions">
            <button className="iconOnly notify" aria-label="Notifications"><Bell size={18} /><i>4</i></button>
            <button className="iconText" onClick={() => setRefresh((n) => n + 1)}><RefreshCw size={16} /> Refresh</button>
            <div className="userBox">
              <span>{me.email?.slice(0, 1).toUpperCase()}</span>
              <div><b>Grok Admin</b><small>{me.email}</small></div>
            </div>
          </div>
        </header>
        <section className="page">
          <div className="pageBanner">
            <div>
              <span className="eyebrow">Dashboard / {activeLabel}</span>
              <h2>{activeLabel}</h2>
              <p>Quản lý pool Grok bằng userId + cookies, điều phối job qua API key và theo dõi log vận hành.</p>
            </div>
            <div className="bannerStats">
              <Badge tone="ok">Pure HTTP</Badge>
              <Badge>{me.has_api_key ? "API key ready" : "Need API key"}</Badge>
            </div>
          </div>
          <Active me={me} reloadMe={() => setRefresh((n) => n + 1)} />
        </section>
      </main>
    </div>
  );
}
