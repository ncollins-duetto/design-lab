import { Link, useLocation } from 'react-router-dom';

type NavItem = { label: string; items?: string[] };

const MAIN_NAV: NavItem[] = [
  { label: 'Home' },
  { label: 'Advance' },
  {
    label: 'Pricing & Strategy',
    items: ['Manage Rates', 'Segment Strategy', 'Yield Management', 'Competitive Intelligence'],
  },
  {
    label: 'Forecasts & Budgets',
    items: ['Annual Budget', 'Rolling Forecasts', 'Budget Templates', 'Budget Comparison'],
  },
  {
    label: 'Reports',
    items: ['Performance Dashboard', 'Custom Reports', 'Analytics', 'Audit Log'],
  },
  {
    label: 'Groups',
    items: ['Group Quotes', 'Group Calendar', 'Group Analytics'],
  },
];

const TOP_LEVEL_CATEGORIES = [
  'Hotel & Company Configuration',
  'Users & Permissions',
  'Segmentation',
  'Reporting',
  'Data, Imports & Exports',
  'Miscellaneous',
];

const COSTS_NAV = [
  { label: 'Costs & Spend', path: null },
  { label: 'Advanced Costs', path: '/' },
  { label: 'Channels', path: '/channel-attribution' },
  { label: 'Group Ancillary Categories', path: null },
  { label: 'Revenue Categories', path: null },
  { label: 'Taxes', path: null },
];

// Breadcrumb separator — 12×12px arrow matching Figma spec
function BreadcrumbSep() {
  return (
    <span className="material-icons" style={{
      fontSize: 12, color: '#9e9e9e', lineHeight: 1, flexShrink: 0,
    }}>chevron_right</span>
  );
}

function Breadcrumb() {
  const { pathname } = useLocation();
  const isNew = pathname === '/new';
  const isEdit = pathname.startsWith('/edit/');
  const isChannelAttribution = pathname === '/channel-attribution';
  const isNewChannel = pathname === '/channel-attribution/new';
  const isEditChannel = pathname.startsWith('/channel-attribution/edit/');

  // Link style: #006461, 12px Lato Regular
  const linkStyle: React.CSSProperties = { color: '#006461', textDecoration: 'none', fontSize: 12, whiteSpace: 'nowrap' };
  // Current page style: #4f5b60
  const currentStyle: React.CSSProperties = { color: '#4f5b60', fontSize: 12, whiteSpace: 'nowrap' };

  return (
    <nav style={{
      height: 32,
      background: '#fafafa',
      borderBottom: '1px solid #dde1e2',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: 24,
      flexShrink: 0,
    }}>
      {/* Breadcrumb trail — gap: 4px matching Figma */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={linkStyle}>Home</span>
        <BreadcrumbSep />
        <span style={linkStyle}>Settings</span>
        <BreadcrumbSep />
        {(isNewChannel || isEditChannel) ? (
          <>
            <Link to="/channel-attribution" style={linkStyle}>Channels</Link>
            <BreadcrumbSep />
            <span style={currentStyle}>{isNewChannel ? 'New Channel' : 'Edit Channel'}</span>
          </>
        ) : isChannelAttribution ? (
          <span style={currentStyle}>Channels</span>
        ) : (isNew || isEdit) ? (
          <>
            <Link to="/" style={linkStyle}>Advanced Costs</Link>
            <BreadcrumbSep />
            <span style={currentStyle}>{isNew ? 'New Cost' : 'Edit Cost'}</span>
          </>
        ) : (
          <span style={currentStyle}>Advanced Costs</span>
        )}
      </div>

      {/* Property picker — 312px, border-left + border-bottom matching Figma */}
      <div style={{
        width: 312,
        height: 32,
        borderLeft: '1px solid #dde1e2',
        borderBottom: '1px solid #dde1e2',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 7,
        paddingRight: 8,
        gap: 4,
        cursor: 'pointer',
        flexShrink: 0,
      }}>
        <span className="material-icons" style={{ fontSize: 20, color: '#1c1c1c' }}>apartment</span>
        <span style={{ flex: 1, fontSize: 13, color: '#006461', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          Hotel Barcelona
        </span>
        <span className="material-icons" style={{ fontSize: 17, color: '#1c1c1c' }}>keyboard_arrow_down</span>
      </div>
    </nav>
  );
}

// Utility icon wrapper — 32×32px rounded container from Figma
function NavIcon({ children, badge }: { children: React.ReactNode; badge?: string }) {
  return (
    <div style={{ position: 'relative', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 40, cursor: 'pointer' }}>
      <div style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: 40 }}>
        {children}
      </div>
      {badge && (
        <div style={{
          position: 'absolute', top: 4, left: 16,
          background: '#d32f2f', color: '#fff', borderRadius: 64,
          fontSize: 8, fontWeight: 500, padding: '1px 3px', lineHeight: 1.4, whiteSpace: 'nowrap',
        }}>{badge}</div>
      )}
    </div>
  );
}

export default function ProtoLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();

  return (
    <div className="app">

      {/* ── Top nav bar — 40px, #0e2124, px-24, gap-16 ── */}
      <header style={{
        height: 40,
        background: '#0e2124',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: 16,
        flexShrink: 0,
      }}>
        {/* Logo — 2026 brand, lime green #C4FF45, 72px wide × auto height (≈15.4px) */}
        <img
          src="/duetto-logo-white.svg"
          alt="Duetto"
          style={{ width: 72, height: 'auto', flexShrink: 0, display: 'block' }}
        />

        {/* Nav items with hover dropdowns */}
        <div style={{ display: 'flex', flex: 1, height: 40, overflow: 'hidden', alignItems: 'flex-start' }}>
          {MAIN_NAV.map((item) => (
            <div key={item.label} className="nav-item">
              {item.label}
              {item.items && (
                <span className="material-icons" style={{ fontSize: 16, lineHeight: 1 }}>
                  arrow_drop_down
                </span>
              )}
              {item.items && (
                <div className="nav-dropdown">
                  {item.items.map((sub) => (
                    <a key={sub} href="#">{sub}</a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Utility items — gap-12, matching Figma utility-items-nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <NavIcon badge="99+">
            <span className="material-icons" style={{ fontSize: 20, color: '#fff' }}>notifications</span>
          </NavIcon>
          <NavIcon>
            <span className="material-icons" style={{ fontSize: 20, color: '#fff' }}>help_outline</span>
          </NavIcon>
          <NavIcon>
            <span className="material-icons" style={{ fontSize: 20, color: '#fff' }}>settings</span>
          </NavIcon>
          {/* Avatar — 20×20px orange circle, bold "M" */}
          <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              width: 20, height: 20, borderRadius: 64,
              background: '#ff5900',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: '#fff', cursor: 'pointer',
            }}>M</div>
          </div>
        </div>
      </header>

      {/* ── Breadcrumb + property picker bar ── */}
      <Breadcrumb />

      {/* ── Body ── */}
      <div className="body">
        <aside className="sidebar" style={{ width: 260 }}>
          {/* Search */}
          <div style={{ padding: '12px 16px 8px' }}>
            <input
              type="text"
              placeholder="Search"
              style={{
                width: '100%', height: 32, border: '1px solid #dde1e2', borderRadius: 4,
                padding: '0 10px', fontSize: 14, fontFamily: 'inherit',
                color: '#1c1c1c', background: '#fff', boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Collapsed top-level categories */}
          {TOP_LEVEL_CATEGORIES.slice(0, 3).map((cat) => (
            <div key={cat} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '9px 16px', cursor: 'pointer', fontSize: 14, color: '#1c1c1c',
            }}>
              <span>{cat}</span>
              <span className="material-icons" style={{ fontSize: 18, color: '#4f5b60' }}>expand_more</span>
            </div>
          ))}

          {/* Costs & Profitability — expanded */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '9px 16px', cursor: 'pointer', fontSize: 14, color: '#1c1c1c',
          }}>
            <span>Costs &amp; Profitability</span>
            <span className="material-icons" style={{ fontSize: 18, color: '#4f5b60' }}>expand_less</span>
          </div>

          {/* Costs & Profitability items */}
          <div style={{ paddingBottom: 4 }}>
            {COSTS_NAV.map((item) => {
              const isActive = item.path && (
                pathname === item.path ||
                (item.path === '/' && (pathname.startsWith('/edit/') || pathname === '/new')) ||
                (item.path === '/channel-attribution' && pathname.startsWith('/channel-attribution'))
              );
              return item.path ? (
                <Link
                  key={item.label}
                  to={item.path}
                  style={{
                    display: 'block', padding: '6px 16px 6px 28px', fontSize: 14,
                    color: isActive ? '#1c1c1c' : '#006461',
                    textDecoration: 'none', fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  key={item.label}
                  style={{
                    display: 'block', padding: '6px 16px 6px 28px',
                    fontSize: 14, color: '#006461', cursor: 'pointer',
                  }}
                >
                  {item.label}
                </span>
              );
            })}
          </div>

          {/* Remaining collapsed categories */}
          {TOP_LEVEL_CATEGORIES.slice(3).map((cat) => (
            <div key={cat} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '9px 16px', cursor: 'pointer', fontSize: 14, color: '#1c1c1c',
            }}>
              <span>{cat}</span>
              <span className="material-icons" style={{ fontSize: 18, color: '#4f5b60' }}>expand_more</span>
            </div>
          ))}
        </aside>
        <main className="main">{children}</main>
      </div>
    </div>
  );
}
