'use client'

import { useState, useContext, createContext, ReactNode, useEffect, useRef, useMemo } from 'react'
import { Box, Typography, Button, Card, CardContent, CardActions, Divider, Grid, List, ListItem, ListItemIcon, ListItemText, TextField, Chip, Paper, Accordion, AccordionSummary, AccordionDetails, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, IconButton, Tooltip, makeStyles, useTheme, InputAdornment, Stepper, Step, StepLabel, Menu, MenuItem, Switch, FormControlLabel, Checkbox } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import * as XLSX from 'xlsx'
import { AgGridReact } from 'ag-grid-react'
import { ModuleRegistry, AllCommunityModule, ColDef } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

if (typeof window !== 'undefined') {
  ModuleRegistry.registerModules([AllCommunityModule])
}
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import DeleteIcon from '@material-ui/icons/Delete'
import AddIcon from '@material-ui/icons/Add'
import FolderIcon from '@material-ui/icons/Folder'
import BusinessIcon from '@material-ui/icons/Business'
import HotelIcon from '@material-ui/icons/Hotel'
import DocumentIcon from '@material-ui/icons/Description'
import LockIcon from '@material-ui/icons/Lock'
import EditIcon from '@material-ui/icons/Edit'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
// AppShell removed — Digital Sales Room uses a stripped-down ExternalHeader
// for customer-facing experience (no internal Duetto nav, property picker, etc.)

// ArrowStepper types
enum StepState {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  INACTIVE = 'inactive',
  DISABLED = 'disabled',
}

interface StepConfig {
  id: string
  label: string
  description?: string
  state?: StepState
}

const useStyles = makeStyles((theme) => ({
  authContainer: {
    minHeight: '100vh',
    background: '#FAFAFA',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
  },
  authCard: {
    width: '100%',
    maxWidth: 440,
    padding: theme.spacing(4),
    background: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  authLogo: {
    textAlign: 'center',
    color: '#1976D2',
    fontWeight: 700,
    letterSpacing: 3,
    marginBottom: theme.spacing(2),
    fontSize: '1.5rem',
  },
  pageHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(3, 3, 2),
    background: '#FAFAFA',
    borderBottom: '1px solid #e0e0e0',
  },
  pageTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    lineHeight: 1.4,
    color: '#212121',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
  },
  mainContent: {
    display: 'flex',
    flex: 1,
    minHeight: '100vh',
  },
  sidebar: {
    width: 220,
    flexShrink: 0,
    background: '#ffffff',
    borderRight: '1px solid #e0e0e0',
    overflow: 'visible', // FAB needs to escape, but no internal scroll
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.3s ease-in-out',
    position: 'fixed', // truly fixed — does not scroll with page
    top: 175, // header (~60) + stepper container (~115)
    left: 0,
    height: 'calc(100vh - 175px)',
    zIndex: 600,
    '&.collapsed': {
      width: 64,
    },
  },
  navRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 26,
    paddingRight: 20,
    cursor: 'pointer',
    position: 'relative',
    borderRadius: 0,
    borderLeft: '3px solid transparent', // reserve space so active state doesn't shift content
    transition: 'background 0.12s',
    '&:hover': {
      background: 'rgba(0,100,97,0.04)',
    },
  },
  navRowActive: {
    background: 'rgba(0,100,97,0.07)',
    borderLeftColor: '#006461',
    '&:hover': {
      background: 'rgba(0,100,97,0.07)',
    },
  },
  navRowDisabled: {
    cursor: 'not-allowed',
    opacity: 0.5,
    '&:hover': {
      background: 'transparent',
    },
  },
  sidebarCollapseFab: {
    position: 'absolute',
    top: '50%',
    right: -14,
    transform: 'translateY(-50%)',
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: '#ffffff',
    border: '1px solid #d0d4d8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
    zIndex: 9999,
    color: '#4f5b60',
    transition: 'background 0.12s, border-color 0.12s',
    '&:hover': {
      background: '#FAFAFA',
      borderColor: '#aeb4ba',
    },
  },
  content: {
    flex: 1,
    background: '#FAFAFA',
    overflowY: 'auto',
    padding: theme.spacing(3),
  },
  navSection: {
    padding: theme.spacing(1.75, 2),
  },
  navSectionLabel: {
    color: theme.palette.text.secondary,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: '0.68rem',
    transition: 'opacity 0.3s ease-in-out',
    '&.hidden': {
      opacity: 0,
      height: 0,
      overflow: 'hidden',
      margin: 0,
      padding: 0,
    },
  },
  sidebarToggle: {
    alignSelf: 'flex-end',
    margin: theme.spacing(0.5, 1),
    minWidth: 'auto',
  },
  sidebarCollapseRow: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(1.5, 2),
    borderTop: '1px solid #e0e0e0',
    cursor: 'pointer',
    color: '#4f5b60',
    fontSize: '0.8rem',
    fontWeight: 500,
    transition: 'background 0.15s',
    '&:hover': {
      background: '#FAFAFA',
    },
  },
  navLabel: {
    transition: 'opacity 0.3s ease-in-out',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  docRow: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    padding: theme.spacing(1.25, 1.75),
    borderRadius: 6,
    transition: 'background 0.12s',
    cursor: 'pointer',
    '&:hover': {
      background: theme.palette.action.hover,
    },
  },
  docIcon: {
    width: 36,
    height: 36,
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    fontSize: '0.6rem',
    fontWeight: 800,
    letterSpacing: 0.3,
  },
  formField: {
    marginBottom: theme.spacing(2),
  },
  floatingButton: {
    position: 'fixed',
    bottom: theme.spacing(3),
    right: theme.spacing(3),
    zIndex: 999,
  },
  stepper: {
    background: 'transparent',
    padding: theme.spacing(2, 0),
  },
  arrowStepperContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: theme.spacing(2, 3),
    background: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.divider}`,
    gap: theme.spacing(2),
  },
  stepItem: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    minWidth: 120,
  },
  stepNumber: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: theme.palette.primary.main,
    color: 'white',
    fontWeight: 700,
    fontSize: '0.875rem',
  },
  stepNumberInactive: {
    background: theme.palette.action.disabled,
    color: theme.palette.text.disabled,
  },
  stepNumberCompleted: {
    background: theme.palette.success.main,
  },
  stepLabel: {
    fontSize: '0.875rem',
    fontWeight: 600,
  },
  stepArrow: {
    color: theme.palette.divider,
    fontSize: '1.5rem',
  },
  card: {
    background: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  successBadge: {
    background: '#4CAF50',
    color: '#ffffff',
    padding: theme.spacing(0.5, 1),
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  warningBadge: {
    background: '#FF9800',
    color: '#ffffff',
    padding: theme.spacing(0.5, 1),
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  errorBadge: {
    background: '#F44336',
    color: '#ffffff',
    padding: theme.spacing(0.5, 1),
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  infoBadge: {
    background: '#2196F3',
    color: '#ffffff',
    padding: theme.spacing(0.5, 1),
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  sectionHeader: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#212121',
    marginBottom: theme.spacing(2),
    marginTop: 0,
    paddingBottom: theme.spacing(1),
    borderBottom: '2px solid #e0e0e0',
  },
  documentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.5),
  },
}))

// ───────────────────────────────────────────────────────────────────────────────
// Mock Data
// ───────────────────────────────────────────────────────────────────────────────

// Searchable hotel database — Duetto-curated list of known properties.
// In production this would be backed by an API; here it's static.
interface HotelRecord {
  id: string
  name: string
  address: string
  rooms: number
  tz?: string
  lat?: number
  lng?: number
}

const HOTEL_DATABASE: HotelRecord[] = [
  { id:'h1',  name:'The Grand Hyatt New York',         address:'109 E 42nd St, New York, NY',          rooms:1298, tz:'America/New_York',    lat:40.7527, lng:-73.9772 },
  { id:'h2',  name:'Marriott Marquis Times Square',    address:'1535 Broadway, New York, NY',           rooms:1966, tz:'America/New_York',    lat:40.7580, lng:-73.9855 },
  { id:'h3',  name:'The Westin Bonaventure',           address:'404 S Figueroa St, Los Angeles, CA',    rooms:1354, tz:'America/Los_Angeles', lat:34.0504, lng:-118.2588 },
  { id:'h4',  name:'The Ritz-Carlton San Francisco',   address:'600 Stockton St, San Francisco, CA',    rooms:336,  tz:'America/Los_Angeles' },
  { id:'h5',  name:'Four Seasons Hotel Chicago',       address:'120 E Delaware Pl, Chicago, IL',        rooms:345,  tz:'America/Chicago' },
  { id:'h6',  name:'The Plaza Hotel',                  address:'768 5th Ave, New York, NY',             rooms:282,  tz:'America/New_York' },
  { id:'h7',  name:'Waldorf Astoria New York',         address:'301 Park Ave, New York, NY',            rooms:1413, tz:'America/New_York' },
  { id:'h8',  name:'The Beverly Hills Hotel',          address:'9641 Sunset Blvd, Beverly Hills, CA',   rooms:208,  tz:'America/Los_Angeles' },
  { id:'h9',  name:'The Peninsula Beverly Hills',      address:'9882 S Santa Monica Blvd, Beverly Hills, CA', rooms:194, tz:'America/Los_Angeles' },
  { id:'h10', name:'Hotel del Coronado',               address:'1500 Orange Ave, Coronado, CA',         rooms:757,  tz:'America/Los_Angeles' },
  { id:'h11', name:'Fontainebleau Miami Beach',        address:'4441 Collins Ave, Miami Beach, FL',     rooms:1594, tz:'America/New_York' },
  { id:'h12', name:'The Breakers Palm Beach',          address:'1 S County Rd, Palm Beach, FL',         rooms:540,  tz:'America/New_York' },
  { id:'h13', name:'Bellagio Las Vegas',               address:'3600 S Las Vegas Blvd, Las Vegas, NV',  rooms:3950, tz:'America/Los_Angeles' },
  { id:'h14', name:'Wynn Las Vegas',                   address:'3131 S Las Vegas Blvd, Las Vegas, NV',  rooms:2716, tz:'America/Los_Angeles' },
  { id:'h15', name:'The Cosmopolitan of Las Vegas',    address:'3708 S Las Vegas Blvd, Las Vegas, NV',  rooms:3027, tz:'America/Los_Angeles' },
  { id:'h16', name:'Hyatt Regency Atlanta',            address:'265 Peachtree St NE, Atlanta, GA',      rooms:1260, tz:'America/New_York' },
  { id:'h17', name:'The Mark Hotel',                   address:'25 E 77th St, New York, NY',            rooms:152,  tz:'America/New_York' },
  { id:'h18', name:'Hotel Bel-Air',                    address:'701 Stone Canyon Rd, Los Angeles, CA',  rooms:103,  tz:'America/Los_Angeles' },
  { id:'h19', name:'Mandarin Oriental, Boston',        address:'776 Boylston St, Boston, MA',           rooms:148,  tz:'America/New_York' },
  { id:'h20', name:'The Langham, Chicago',             address:'330 N Wabash Ave, Chicago, IL',         rooms:316,  tz:'America/Chicago' },
  { id:'h21', name:'Faena Hotel Miami Beach',          address:'3201 Collins Ave, Miami Beach, FL',     rooms:169,  tz:'America/New_York' },
  { id:'h22', name:'The St. Regis Atlanta',            address:'88 W Paces Ferry Rd NW, Atlanta, GA',   rooms:151,  tz:'America/New_York' },
  { id:'h23', name:'Conrad New York Downtown',         address:'102 North End Ave, New York, NY',       rooms:463,  tz:'America/New_York' },
  { id:'h24', name:'The Joule Dallas',                 address:'1530 Main St, Dallas, TX',              rooms:160,  tz:'America/Chicago' },
  { id:'h25', name:'Loews Miami Beach Hotel',          address:'1601 Collins Ave, Miami Beach, FL',     rooms:790,  tz:'America/New_York' },
];

// Backward-compat alias used in proposal table seeds
const MOCK_HOTELS = HOTEL_DATABASE.slice(0, 3);

// Default products applied to all hotels (used as initial state)
const DEFAULT_PRODUCTS = ['GameChanger','ScoreBoard','Advance'];

// Hotel as added by the customer (extends HotelRecord with custom-product settings)
interface AddedHotel extends HotelRecord {
  isNew: boolean              // true if not found in HOTEL_DATABASE (manually typed)
  useCustomProducts: boolean  // if true, this hotel overrides global products
  products: string[]
}

const MOCK_DOCS = [
  { id:'d1',  name:'Duetto Platform Overview 2026',              type:'pptx', date:'Apr 15, 2026', size:'4.2 MB', section:'marketing' },
  { id:'d2',  name:'GameChanger Revenue Strategy Deep Dive',     type:'pptx', date:'Apr 18, 2026', size:'6.8 MB', section:'marketing' },
  { id:'d3',  name:'ScoreBoard Analytics & Reporting Guide',     type:'pdf',  date:'Apr 20, 2026', size:'2.1 MB', section:'marketing' },
];

const MOCK_PROPOSAL = {
  id: 'PROP-2026-001',
  date: 'May 12, 2026',
  lines: [
    { id:'h1',  hotel:'The Grand Hyatt New York', rooms:175, products:['GameChanger','ScoreBoard','Advance'],              annual:37_590,  impl:12_000 },
    { id:'h2',  hotel:'Marriott Marquis Times Square',      rooms:221, products:['GameChanger','ScoreBoard','BlockBuster','Advance'], annual:47_553,  impl:14_500 },
  ],
};

const PRODUCT_COLORS: Record<string, {bg: string, text: string}> = {
  'GameChanger': { bg:'#E0F0EF', text:'#004948' },
  'ScoreBoard':  { bg:'#E8EAF6', text:'#3949AB' },
  'BlockBuster': { bg:'#EDE7F6', text:'#6A1B9A' },
  'Advance':     { bg:'#E8F5E9', text:'#2E7D32' },
  'GameTime':    { bg:'#FFF8E1', text:'#774700' },
  'HotStats':    { bg:'#E3F2FD', text:'#1565C0' },
};

const PRODUCTS = ['GameChanger','ScoreBoard','BlockBuster','Advance','GameTime','HotStats'];

const PRODUCT_DESCRIPTIONS: Record<string,string> = {
  GameChanger: 'AI-driven revenue optimization and pricing strategy recommendations',
  ScoreBoard: 'Real-time analytics dashboard and performance reporting',
  BlockBuster: 'Competitor intelligence and market positioning analysis',
  Advance: 'Advanced booking engine with conversion optimization',
  GameTime: 'Dynamic package creation and upsell management',
  HotStats: 'Historical data analytics and trend forecasting',
};

const INTEGRATIONS = [
  { id:'opera',        label:'Opera',             group:'PMS' },
  { id:'mews',         label:'Mews',              group:'PMS' },
  { id:'cloudbeds',    label:'Cloudbeds',          group:'PMS' },
  { id:'salesforce',   label:'Salesforce',         group:'Other' },
  { id:'cvent',        label:'Cvent',              group:'Other' },
];

const DOC_SECTIONS = [
  { id:'marketing', label:'General Info & Marketing',     description:'Product overviews, case studies, and platform materials shared by your Duetto team.' },
  { id:'account',   label:'Your Account',                 description:'Documents prepared specifically for your portfolio and onboarding process.' },
  { id:'contracts', label:'Contracts & Commercial Terms', description:'Formal agreements and commercial terms for your review and signature.' },
];

// ───────────────────────────────────────────────────────────────────────────────
// Auth Context
// ───────────────────────────────────────────────────────────────────────────────

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  login: (user: User) => void
  logout: () => void
  createAccount: (name: string, email: string, password: string) => string | null
  loginWithEmail: (email: string, password: string) => string | null
}

const AuthCtx = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  createAccount: () => null,
  loginWithEmail: () => null,
})

function AuthProvider({ children }: { children: ReactNode }) {
  // Start unauthenticated on every page load — force login each fresh visit.
  // Session is held in sessionStorage so it survives client-side navigation
  // and refreshes within the same tab, but clears when the tab closes.
  const [user, setUser] = useState<User | null>(null)

  // (Sign-in stays up on every page visit — no auto-hydration of stored user.)

  const getAccounts = () => {
    if (typeof window !== 'undefined') {
      try { return JSON.parse(localStorage.getItem('dsr_accounts')||'[]') } catch { return [] }
    }
    return []
  }

  const saveAccounts = (list: any[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dsr_accounts', JSON.stringify(list))
    }
  }

  const login = (u: User) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('dsr_user', JSON.stringify(u))
      // Clean up legacy persistent session if present
      localStorage.removeItem('dsr_user')
    }
    setUser(u)
  }

  const logout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('dsr_user')
      localStorage.removeItem('dsr_user')
    }
    setUser(null)
  }

  const createAccount = (name: string, email: string, password: string) => {
    const accounts = getAccounts()
    if (accounts.find((a: any) => a.email.toLowerCase() === email.toLowerCase())) {
      return 'An account with that email already exists.'
    }
    const newUser = { id: `local-${Date.now()}`, name, email, password }
    saveAccounts([...accounts, newUser])
    login({ id: newUser.id, name, email })
    return null
  }

  const loginWithEmail = (email: string, password: string) => {
    const accounts = getAccounts()
    const match = accounts.find((a: any) => a.email.toLowerCase() === email.toLowerCase())
    if (!match) return 'No account found with that email.'
    if (match.password !== password) return 'Incorrect password.'
    login({ id: match.id, name: match.name, email: match.email })
    return null
  }

  return (
    <AuthCtx.Provider value={{ user, login, logout, createAccount, loginWithEmail }}>
      {children}
    </AuthCtx.Provider>
  )
}

// ───────────────────────────────────────────────────────────────────────────────
// Auth Pages
// ───────────────────────────────────────────────────────────────────────────────

function AuthShell({ title, subtitle, children }: { title: string, subtitle?: string, children: ReactNode }) {
  const theme = useTheme()
  const classes = useStyles()

  return (
    <Box className={classes.authContainer}>
      <Card className={classes.authCard} elevation={3}>
        <CardContent>
          <Box style={{display:'flex',justifyContent:'center',marginBottom:theme.spacing(2)}}>
            <img src="/duetto-logo-green.svg" alt="Duetto" style={{height:32}} />
          </Box>
          <Typography variant="h6" align="center" style={{marginBottom: theme.spacing(1)}}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" align="center" style={{color: theme.palette.text.secondary, marginBottom: theme.spacing(2.5)}}>
              {subtitle}
            </Typography>
          )}
          <Divider style={{marginBottom: theme.spacing(2.5)}}/>
          {children}
          <Typography style={{color: theme.palette.text.disabled, textAlign: 'center', fontSize: '0.7rem', marginTop: theme.spacing(2.5)}}>
            By continuing you agree to Duetto's Terms of Service and Privacy Policy.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

function LoginPage({ onSignIn, onCreateAccount }: { onSignIn: () => void, onCreateAccount: () => void }) {
  const { login } = useContext(AuthCtx)
  const [loading, setLoading] = useState(false)

  const handleGoogle = () => {
    setLoading(true)
    setTimeout(() => {
      login({ id:'g-001', name:'Demo User', email:'demo@example.com' })
    }, 1000)
  }

  return (
    <AuthShell title="Digital Sales Room" subtitle="Access your personalised sales experience">
      <button
        disabled={loading}
        onClick={handleGoogle}
        style={{
          width: '100%',
          height: 44,
          background: '#ffffff',
          border: '1px solid #d0d4d8',
          borderRadius: 6,
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          cursor: loading ? 'wait' : 'pointer',
          fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
          fontSize: 14,
          fontWeight: 500,
          color: '#1f1f1f',
          marginBottom: 16,
          transition: 'background 0.15s, border-color 0.15s',
          opacity: loading ? 0.7 : 1,
        }}
        onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = '#f8f9fa' }}
        onMouseLeave={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = '#ffffff' }}
      >
        {loading ? (
          <span>Signing in…</span>
        ) : (
          <>
            {/* Official Google "G" multicolor logo */}
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9087c1.7018-1.5668 2.6836-3.874 2.6836-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.4673-.806 5.9564-2.1805l-2.9087-2.2581c-.8059.54-1.8368.8595-3.0477.8595-2.344 0-4.3282-1.5832-5.0359-3.7105H.9573v2.3318C2.4382 15.9832 5.4818 18 9 18z" fill="#34A853"/>
              <path d="M3.9641 10.71c-.18-.54-.2823-1.1168-.2823-1.71s.1023-1.17.2823-1.71V4.9582H.9573C.3477 6.1731 0 7.5477 0 9c0 1.4523.3477 2.8269.9573 4.0418L3.9641 10.71z" fill="#FBBC05"/>
              <path d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.3463l2.5813-2.5814C13.4632.8918 11.426 0 9 0 5.4818 0 2.4382 2.0168.9573 4.9582L3.9641 7.29C4.6718 5.1627 6.656 3.5795 9 3.5795z" fill="#EA4335"/>
            </svg>
            <span>Sign in with Google</span>
          </>
        )}
      </button>

      <div className="flex items-center gap-3 my-4">
        <hr className="flex-1" />
        <span className="text-xs text-gray-500">or</span>
        <hr className="flex-1" />
      </div>

      <Button variant="outlined" color="primary" fullWidth onClick={onSignIn}
        style={{textTransform:'none',fontWeight:600,padding:'10px 0',marginBottom:12}}>
        Sign in with email
      </Button>

      <Button variant="contained" color="primary" fullWidth onClick={onCreateAccount}
        style={{textTransform:'none',fontWeight:600,padding:'10px 0'}}>
        Create an account
      </Button>
    </AuthShell>
  )
}

function SignInPage({ onBack, onCreateAccount }: { onBack: () => void, onCreateAccount: () => void }) {
  const { loginWithEmail } = useContext(AuthCtx)
  const classes = useStyles()
  const theme = useTheme()
  const [vals, setVals] = useState({ email:'', password:'' })
  const [showPassword, setShowPassword] = useState(false)
  const [errs, setErrs] = useState<{email?:string, password?:string}>({})
  const [serverErr, setServerErr] = useState('')

  const validateEmail = (email: string) => {
    if (!email) return 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email address'
    return ''
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrs: typeof errs = {}
    const emailErr = validateEmail(vals.email)
    if (emailErr) newErrs.email = emailErr
    if (!vals.password) newErrs.password = 'Password is required'
    if (Object.keys(newErrs).length) { setErrs(newErrs); return }
    const err = loginWithEmail(vals.email, vals.password)
    if (err) setServerErr(err)
  }

  return (
    <AuthShell title="Sign In" subtitle="Sign in to your Digital Sales Room account">
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email address"
          type="email"
          variant="outlined"
          fullWidth
          size="small"
          className={classes.formField}
          value={vals.email}
          onChange={e => { setVals(v=>({...v,email:e.target.value})); setErrs(r=>({...r,email:''})); setServerErr('') }}
          error={!!errs.email}
          helperText={errs.email}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          fullWidth
          size="small"
          className={classes.formField}
          value={vals.password}
          onChange={e => { setVals(v=>({...v,password:e.target.value})); setErrs(r=>({...r,password:''})); setServerErr('') }}
          error={!!errs.password}
          helperText={errs.password}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {serverErr && (
          <Box style={{color: theme.palette.error.main, fontSize:'0.875rem', marginBottom: theme.spacing(2)}}>
            {serverErr}
          </Box>
        )}
        <Button type="submit" variant="contained" color="primary" fullWidth
          style={{textTransform:'none',fontWeight:600,padding:'10px 0',marginTop:8}}>
          Sign In
        </Button>
      </form>
      <div className="flex items-center gap-3 my-4">
        <hr className="flex-1" />
        <span className="text-xs text-gray-500">or</span>
        <hr className="flex-1" />
      </div>
      <div className="flex justify-between gap-4">
        <a onClick={onBack} className="text-teal-900 cursor-pointer font-medium text-sm">← Back</a>
        <a onClick={onCreateAccount} className="text-teal-900 cursor-pointer font-medium text-sm">Create an account →</a>
      </div>
    </AuthShell>
  )
}

function CreateAccountPage({ onBack }: { onBack: () => void }) {
  const { createAccount } = useContext(AuthCtx)
  const classes = useStyles()
  const theme = useTheme()
  const [vals, setVals] = useState({ name:'', email:'', password:'', confirm:'' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errs, setErrs] = useState<Record<string,string>>({})
  const [serverErr, setServerErr] = useState('')

  const validate = () => {
    const e: Record<string,string> = {}
    if (!vals.name) e.name = 'Full name is required'
    if (!vals.email) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vals.email)) e.email = 'Invalid email address'
    if (!vals.password) e.password = 'Password is required'
    else if (vals.password.length < 8) e.password = 'Password must be at least 8 characters'
    if (!vals.confirm) e.confirm = 'Confirm password is required'
    else if (vals.password !== vals.confirm) e.confirm = 'Passwords do not match'
    return e
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const fieldErrs = validate()
    if (Object.keys(fieldErrs).length) { setErrs(fieldErrs); return }
    const err = createAccount(vals.name, vals.email, vals.password)
    if (err) setServerErr(err)
  }

  return (
    <AuthShell title="Create Account" subtitle="Set up your Digital Sales Room account">
      <form onSubmit={handleSubmit}>
        <TextField
          label="Full Name"
          type="text"
          variant="outlined"
          fullWidth
          size="small"
          className={classes.formField}
          value={vals.name}
          onChange={e => { setVals(v=>({...v,name:e.target.value})); setErrs(r=>({...r,name:''})); setServerErr('') }}
          error={!!errs.name}
          helperText={errs.name}
        />
        <TextField
          label="Email address"
          type="email"
          variant="outlined"
          fullWidth
          size="small"
          className={classes.formField}
          value={vals.email}
          onChange={e => { setVals(v=>({...v,email:e.target.value})); setErrs(r=>({...r,email:''})); setServerErr('') }}
          error={!!errs.email}
          helperText={errs.email}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          fullWidth
          size="small"
          className={classes.formField}
          value={vals.password}
          onChange={e => { setVals(v=>({...v,password:e.target.value})); setErrs(r=>({...r,password:''})); setServerErr('') }}
          error={!!errs.password}
          helperText={errs.password}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Confirm Password"
          type={showConfirm ? 'text' : 'password'}
          variant="outlined"
          fullWidth
          size="small"
          className={classes.formField}
          value={vals.confirm}
          onChange={e => { setVals(v=>({...v,confirm:e.target.value})); setErrs(r=>({...r,confirm:''})); setServerErr('') }}
          error={!!errs.confirm}
          helperText={errs.confirm}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setShowConfirm(!showConfirm)} edge="end">
                  {showConfirm ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {serverErr && (
          <Box style={{color: theme.palette.error.main, fontSize:'0.875rem', marginBottom: theme.spacing(2)}}>
            {serverErr}
          </Box>
        )}
        <Button type="submit" variant="contained" color="primary" fullWidth
          style={{textTransform:'none',fontWeight:600,padding:'10px 0',marginTop:8}}>
          Create Account
        </Button>
      </form>
      <div className="flex items-center gap-3 my-4">
        <hr className="flex-1" />
        <span className="text-xs text-gray-500">or</span>
        <hr className="flex-1" />
      </div>
      <p className="text-center text-sm">
        Already have an account?{' '}
        <a onClick={onBack} className="text-teal-900 cursor-pointer font-medium">Sign in</a>
      </p>
    </AuthShell>
  )
}

// ───────────────────────────────────────────────────────────────────────────────
// Phase Bar
// ───────────────────────────────────────────────────────────────────────────────

function PhaseBar({ userName, nextStep, onNextStep }: { userName?: string, nextStep?: any, onNextStep: () => void }) {
  const { logout } = useContext(AuthCtx)
  const theme = useTheme()
  const classes = useStyles()
  const phases = ['Digital Sales Room','Phase 2','Phase 3']
  const nextStepColors: Record<string, {bg: string, text: string}> = {
    account:  { bg:'#FFB90F', text:'#774700' },
    hotels:   { bg:'#FFB90F', text:'#774700' },
    proposal: { bg:'#52D9CE', text: theme.palette.primary.main },
    complete: { bg:'#388C3F', text:'#ffffff' },
  }
  const col = nextStep ? nextStepColors[nextStep.section] : null
  const isComplete = nextStep?.section === 'complete'

  const headerBg = (theme.palette as any).header?.background ?? '#0e2124'

  return (
    <Box style={{position:'sticky',top:0,zIndex:1200,background:headerBg,width:'100%'}}>
      {/* Logo & Nav row */}
      <Box style={{display:'flex',alignItems:'center',height:40,paddingLeft:theme.spacing(2),paddingRight:theme.spacing(2),gap:theme.spacing(0.5)}}>
        <Box style={{display:'flex',alignItems:'center',marginRight:theme.spacing(2),flexShrink:0}}>
          <Typography style={{color:'white',fontWeight:700,letterSpacing:3,fontSize:'0.85rem'}}>DUETTO</Typography>
        </Box>
        <Box style={{display:'flex',alignItems:'stretch',flex:1,height:'100%'}}>
          <Box style={{display:'flex',alignItems:'center',padding:'0 12px',fontSize:13,fontWeight:400,color:'rgba(255,255,255,0.85)',height:'100%',gap:2,
            borderBottom:'2px solid transparent',whiteSpace:'nowrap',background:'rgba(255,255,255,0.1)',cursor:'default'}}>
            Digital Sales Room
          </Box>
        </Box>
        <Box style={{display:'flex',alignItems:'center',marginLeft:'auto',gap:theme.spacing(2)}}>
          {nextStep && (
            <Box onClick={isComplete ? undefined : onNextStep}
              style={{display:'flex',alignItems:'center',gap:8,background:col?.bg,color:col?.text,
                padding:'4px 14px',borderRadius:20,cursor:isComplete?'default':'pointer',fontWeight:700,fontSize:'0.78rem',
                boxShadow:'0 2px 8px rgba(0,0,0,0.3)',transition:'opacity 0.15s',userSelect:'none'}}
              onMouseOver={e=>{ if(!isComplete) (e.currentTarget as HTMLElement).style.opacity='0.88'; }}
              onMouseOut={e=>(e.currentTarget as HTMLElement).style.opacity='1'}>
              {isComplete ? <span style={{fontSize:'0.9rem',marginRight:2}}>✓</span> : 'Next Step'}
              {nextStep.label}{!isComplete && ' →'}
            </Box>
          )}
          {userName && <Typography style={{color:'rgba(255,255,255,0.5)',fontSize:'0.75rem'}}>{userName}</Typography>}
          {userName && (
            <Box onClick={logout} style={{color:'rgba(255,255,255,0.35)',fontSize:'0.72rem',cursor:'pointer',userSelect:'none',transition:'color 0.15s'}}
              onMouseOver={e=>(e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.7)'}
              onMouseOut={e=>(e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.35)'}>
              Sign out
            </Box>
          )}
        </Box>
      </Box>

      {/* Step indicator */}
      <Box style={{display:'flex',height:56,background:(theme.palette as any).header?.secondaryBarBackground ?? theme.palette.grey[50]}}>
        {phases.map((label,i)=>{
          const isActive = i===0
          const isLast = i===phases.length-1
          return (
            <Box key={i} style={{
              flex:1,display:'flex',alignItems:'center',justifyContent:'center',position:'relative',
              background: isActive ? theme.palette.primary.main : 'rgba(255,255,255,0.06)',
              padding:theme.spacing(0,2),gap:theme.spacing(1.25)}}>
              <Box style={{width:26,height:26,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.75rem',fontWeight:700,flexShrink:0,
                background: isActive ? 'white' : 'transparent',
                border: isActive ? 'none' : '2px solid rgba(255,255,255,0.25)',
                color: isActive ? theme.palette.primary.main : 'rgba(255,255,255,0.35)'}}>
                {i+1}
              </Box>
              <Typography noWrap style={{fontWeight: isActive?700:400, fontSize:'0.85rem',
                color: isActive ? 'white' : 'rgba(255,255,255,0.35)'}}>
                {label}
              </Typography>
              {!isLast && (
                <Box style={{position:'absolute',right:-14,top:'50%',transform:'translateY(-50%)',width:0,height:0,
                  borderTop:'28px solid transparent',borderBottom:'28px solid transparent',
                  borderLeft:`14px solid ${isActive?theme.palette.primary.main:'rgba(255,255,255,0.06)'}`,zIndex:1}}/>
              )}
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}

// ───────────────────────────────────────────────────────────────────────────────
// Document Store
// ───────────────────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────────────────
// Arrow Stepper (from Storybook)
// ───────────────────────────────────────────────────────────────────────────────

interface ArrowStepConfig {
  id: string
  label: string
  description?: string
}

// ───────────────────────────────────────────────────────────────────────────────
// Duetto Switch — matches Figma 12536:1630 (iOS-style compact pill)
// ───────────────────────────────────────────────────────────────────────────────
const useDuettoSwitchStyles = makeStyles({
  root: {
    width: 36,
    height: 20,
    padding: 0,
    margin: 4,
    overflow: 'visible',
  },
  switchBase: {
    padding: 2,
    color: '#ffffff',
    '&$checked': {
      transform: 'translateX(16px)',
      color: '#ffffff',
      '& + $track': {
        backgroundColor: '#006461',
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      color: '#006461',
      border: '6px solid #ffffff',
    },
  },
  thumb: {
    width: 16,
    height: 16,
    boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
  },
  track: {
    borderRadius: 10,
    border: '1px solid #aeb4ba',
    backgroundColor: '#cfd3d6',
    opacity: 1,
    transition: 'background-color 0.15s, border-color 0.15s',
  },
  checked: {},
  focusVisible: {},
})

function DuettoSwitch(props: React.ComponentProps<typeof Switch>) {
  const classes = useDuettoSwitchStyles()
  return (
    <Switch
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  )
}

// Single chevron step — uses ResizeObserver to draw SVG path at exact
// pixel dimensions so the point/notch stay fixed at 14px regardless of width.
function ChevronStep({
  step,
  isActive,
  isFirst,
  isLast,
  onClick,
}: {
  step: ArrowStepConfig
  isActive: boolean
  isFirst: boolean
  isLast: boolean
  onClick?: () => void
}) {
  const theme = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 0, h: 64 })

  useEffect(() => {
    if (!containerRef.current) return
    const el = containerRef.current
    const obs = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ w: Math.max(1, width), h: Math.max(1, height) })
    })
    obs.observe(el)
    // initial measure
    const r = el.getBoundingClientRect()
    setSize({ w: Math.max(1, r.width), h: Math.max(1, r.height) })
    return () => obs.disconnect()
  }, [])

  // Geometry constants
  const ARROW = 14    // point/notch horizontal extension in px
  const R = 8         // outer corner radius in px
  const STROKE = isActive ? 1.5 : 1
  const INSET = STROKE / 2  // path inset so stroke stays inside box

  const activeBg = '#d7f7ed'
  const activeBorder = '#006461'
  const activeText = '#006461'
  const inactiveBg = '#ffffff'
  const inactiveBorder = '#aeb4ba'
  const inactiveText = '#4f5b60'

  const bg = isActive ? activeBg : inactiveBg
  const border = isActive ? activeBorder : inactiveBorder
  const textCol = isActive ? activeText : inactiveText

  const W = size.w
  const H = size.h
  const midY = H / 2

  // Build path. Going clockwise from top-left.
  let d = ''
  const leftEdgeX = INSET
  const rightEdgeX = W - INSET
  const topY = INSET
  const bottomY = H - INSET

  if (isFirst) {
    // rounded top-left
    d += `M ${leftEdgeX + R} ${topY} `
  } else {
    // top-left at flat left edge
    d += `M ${leftEdgeX} ${topY} `
  }

  if (isLast) {
    // straight to rounded top-right
    d += `L ${rightEdgeX - R} ${topY} `
    d += `A ${R} ${R} 0 0 1 ${rightEdgeX} ${topY + R} `
    d += `L ${rightEdgeX} ${bottomY - R} `
    d += `A ${R} ${R} 0 0 1 ${rightEdgeX - R} ${bottomY} `
  } else {
    // top edge to base of point
    d += `L ${rightEdgeX - ARROW} ${topY} `
    // diagonal to point tip
    d += `L ${rightEdgeX} ${midY} `
    // diagonal back to bottom of point base
    d += `L ${rightEdgeX - ARROW} ${bottomY} `
  }

  if (isFirst) {
    // bottom edge to rounded bottom-left
    d += `L ${leftEdgeX + R} ${bottomY} `
    d += `A ${R} ${R} 0 0 1 ${leftEdgeX} ${bottomY - R} `
    d += `L ${leftEdgeX} ${topY + R} `
    d += `A ${R} ${R} 0 0 1 ${leftEdgeX + R} ${topY} `
  } else {
    // bottom edge to bottom-left flat
    d += `L ${leftEdgeX} ${bottomY} `
    // up into notch peak (concave) — peak indented by ARROW px
    d += `L ${leftEdgeX + ARROW} ${midY} `
    // up to top-left corner
    d += `L ${leftEdgeX} ${topY} `
  }

  d += 'Z'

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      style={{
        flex: '1 1 0',
        minWidth: 0,
        height: 72,
        position: 'relative',
        cursor: onClick ? 'pointer' : 'default',
        marginLeft: isFirst ? 0 : 8, // 8px gap between chevron steps
        zIndex: isActive ? 20 : 1,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0, display: 'block', overflow: 'visible' }}
      >
        <path
          d={d}
          fill={bg}
          stroke={border}
          strokeWidth={STROKE}
          strokeLinejoin="round"
        />
      </svg>
      {/* Label content — padded to clear notch on left and point on right */}
      <Box
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingLeft: isFirst ? 20 : ARROW + 12,
          paddingRight: isLast ? 20 : ARROW + 12,
          color: textCol,
          pointerEvents: 'none',
        }}
      >
        <Typography style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.2, color: textCol }}>
          {step.label}
        </Typography>
        {step.description && (
          <Typography style={{ fontSize: 12, fontWeight: 400, marginTop: 4, lineHeight: 1.2, color: textCol, opacity: 0.85 }}>
            {step.description}
          </Typography>
        )}
      </Box>
    </div>
  )
}

function ArrowStepperComponent({ steps, currentStepId, onStepClick }: { steps: ArrowStepConfig[], currentStepId: string, onStepClick?: (id: string) => void }) {
  const theme = useTheme()
  const currentIdx = steps.findIndex(s => s.id === currentStepId)

  // Match Figma node 13429-927:
  // Active: bg #d7f7ed (teal-50), text #006461 (teal-700), border #006461
  // Inactive: bg #ffffff, text #4f5b60 (secondary), border #aeb4ba (border/emphasis)

  return (
    <Box style={{
      display: 'flex',
      gap: 0,
      padding: '20px 32px',
      background: '#ffffff',
      borderBottom: '1px solid #e0e0e0',
      overflowX: 'auto',
      alignItems: 'center',
    }}>
      {steps.map((step, index) => (
        <ChevronStep
          key={step.id}
          step={step}
          isActive={index === currentIdx}
          isFirst={index === 0}
          isLast={index === steps.length - 1}
          onClick={() => onStepClick?.(step.id)}
        />
      ))}
    </Box>
  )
}

// ───────────────────────────────────────────────────────────────────────────────
// Upload Storage — IndexedDB wrapper (handles large files like videos)
// ───────────────────────────────────────────────────────────────────────────────

interface UploadedFile {
  id: string
  name: string
  type: string         // short extension label e.g. 'pdf', 'mp4'
  mime: string         // full MIME type
  size: number         // bytes
  section: string
  uploadedAt: string
}

const DB_NAME = 'dsr_uploads_db'
const STORE = 'files'

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'id' })
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function dbPut(record: UploadedFile & { blob: Blob }): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(record)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

async function dbDelete(id: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).delete(id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

async function dbAll(): Promise<(UploadedFile & { blob: Blob })[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).getAll()
    req.onsuccess = () => resolve(req.result || [])
    req.onerror = () => reject(req.error)
  })
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

function extFromName(name: string): string {
  const m = name.toLowerCase().match(/\.([a-z0-9]+)$/)
  return m ? m[1] : 'file'
}

function iconColors(ext: string): { bg: string, fg: string } {
  if (ext === 'pdf') return { bg: '#FDECEA', fg: '#D32F2F' }
  if (['ppt','pptx','key'].includes(ext)) return { bg: '#FEF3EE', fg: '#D04A02' }
  if (['doc','docx'].includes(ext)) return { bg: '#E3F2FD', fg: '#1565C0' }
  if (['xls','xlsx','csv'].includes(ext)) return { bg: '#E8F5E9', fg: '#2E7D32' }
  if (['mp4','mov','webm','avi','mkv'].includes(ext)) return { bg: '#EDE7F6', fg: '#6A1B9A' }
  if (['jpg','jpeg','png','gif','webp','svg'].includes(ext)) return { bg: '#FFF8E1', fg: '#774700' }
  return { bg: '#ECEFF1', fg: '#455A64' }
}

function DocumentStore() {
  const [uploads, setUploads] = useState<(UploadedFile & { blob: Blob })[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState<string | null>(null) // sectionId being uploaded to
  const [snack, setSnack] = useState<{open: boolean, msg: string, severity: 'success' | 'error'}>({open: false, msg: '', severity: 'success'})
  const [preview, setPreview] = useState<(UploadedFile & { blob: Blob }) | null>(null)
  const [dragOverSection, setDragOverSection] = useState<string | null>(null)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  // Load uploads on mount
  useEffect(() => {
    dbAll()
      .then(rows => { setUploads(rows); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleFiles = async (sectionId: string, files: FileList | File[]) => {
    setUploading(sectionId)
    const list = Array.from(files)
    try {
      const newRecords: (UploadedFile & { blob: Blob })[] = []
      for (const file of list) {
        const ext = extFromName(file.name)
        const record: UploadedFile & { blob: Blob } = {
          id: `upload-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name: file.name,
          type: ext,
          mime: file.type || 'application/octet-stream',
          size: file.size,
          section: sectionId,
          uploadedAt: new Date().toISOString(),
          blob: file,
        }
        await dbPut(record)
        newRecords.push(record)
      }
      setUploads(prev => [...prev, ...newRecords])
      setSnack({open: true, msg: `Uploaded ${list.length} file${list.length === 1 ? '' : 's'}`, severity: 'success'})
    } catch (err: any) {
      setSnack({open: true, msg: `Upload failed: ${err?.message || 'unknown error'}`, severity: 'error'})
    } finally {
      setUploading(null)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await dbDelete(id)
      setUploads(prev => prev.filter(u => u.id !== id))
      setSnack({open: true, msg: 'File deleted', severity: 'success'})
    } catch (err: any) {
      setSnack({open: true, msg: `Delete failed: ${err?.message || 'unknown error'}`, severity: 'error'})
    }
  }

  const handleDownload = (file: UploadedFile & { blob: Blob }) => {
    const url = URL.createObjectURL(file.blob)
    const a = document.createElement('a')
    a.href = url
    a.download = file.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  const onDragOver = (e: React.DragEvent, sectionId: string) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOverSection(sectionId)
  }

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOverSection(null)
  }

  const onDrop = (e: React.DragEvent, sectionId: string) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOverSection(null)
    const files = e.dataTransfer.files
    if (files && files.length > 0) handleFiles(sectionId, files)
  }

  return (
    <div style={{padding: 24, maxWidth: 1280}}>
      <div style={{marginBottom: 16}}>
        <Typography variant="h5" style={{fontWeight:700}}>Documents</Typography>
        <Typography variant="body2" style={{color:'#4F5B60',marginTop:4}}>
          All presentations and documents shared during your sales process. Upload files or videos to share with the team.
        </Typography>
      </div>
      <Divider style={{marginBottom:28}}/>

      {DOC_SECTIONS.map(section => {
        const mockDocs = MOCK_DOCS.filter(d => d.section === section.id)
        const sectionUploads = uploads.filter(u => u.section === section.id)
        const isDragOver = dragOverSection === section.id
        const isUploading = uploading === section.id

        return (
          <div key={section.id} style={{marginBottom:32}}>
            <div style={{display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:10, gap:16}}>
              <div>
                <Typography style={{fontWeight:700,fontSize:'1rem',marginBottom:2}}>{section.label}</Typography>
                <Typography style={{fontSize:'0.8rem',color:'#4F5B60'}}>{section.description}</Typography>
              </div>
              <div>
                <input
                  ref={el => { fileInputRefs.current[section.id] = el }}
                  type="file"
                  multiple
                  accept="*/*"
                  style={{display:'none'}}
                  onChange={e => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFiles(section.id, e.target.files)
                      e.target.value = ''
                    }
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  disabled={isUploading}
                  startIcon={<AddIcon/>}
                  onClick={() => fileInputRefs.current[section.id]?.click()}
                  style={{textTransform:'none', fontWeight:600, whiteSpace:'nowrap'}}
                >
                  {isUploading ? 'Uploading...' : 'Upload files'}
                </Button>
              </div>
            </div>

            {/* Drop zone */}
            <div
              onDragOver={e => onDragOver(e, section.id)}
              onDragEnter={e => onDragOver(e, section.id)}
              onDragLeave={onDragLeave}
              onDrop={e => onDrop(e, section.id)}
              onClick={() => fileInputRefs.current[section.id]?.click()}
              style={{
                border: `2px dashed ${isDragOver ? '#006461' : '#AEB4BA'}`,
                background: isDragOver ? '#d7f7ed' : '#FAFAFA',
                borderRadius: 6,
                padding: '14px 18px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s',
                marginBottom: 10,
                fontSize: '0.85rem',
                color: '#4F5B60',
              }}
            >
              {isDragOver ? 'Drop files here' : 'Drag and drop files or videos here, or click to browse'}
            </div>

            <Paper elevation={0} style={{border:'1px solid #DDE1E2',borderRadius:6,overflow:'hidden'}}>
              {/* Mock docs */}
              {mockDocs.map((doc, i) => {
                const colors = iconColors(doc.type)
                return (
                  <div key={doc.id}>
                    {i > 0 && <Divider/>}
                    <div style={{display:'flex',alignItems:'center',gap:12,padding:'10px 14px',transition:'background 0.12s'}}
                      onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='#F5F5F5'}
                      onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background='transparent'}>
                      <div style={{width:36,height:36,borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,
                        background: colors.bg}}>
                        <span style={{fontSize:'0.6rem',fontWeight:800,letterSpacing:0.3,color: colors.fg}}>
                          {doc.type.toUpperCase()}
                        </span>
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <Typography style={{fontWeight:600,fontSize:'0.875rem',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{doc.name}</Typography>
                        <Typography style={{fontSize:'0.72rem',color:'#AEB4BA',marginTop:1}}>Shared {doc.date} · {doc.size}</Typography>
                      </div>
                      <Button size="small" style={{color:'#004948',textTransform:'none',fontWeight:600,flexShrink:0,fontSize:'0.8rem'}}>View</Button>
                    </div>
                  </div>
                )
              })}

              {/* Uploaded files */}
              {sectionUploads.map((file, i) => {
                const colors = iconColors(file.type)
                const isVideo = file.mime.startsWith('video/')
                const isImage = file.mime.startsWith('image/')
                const dateStr = new Date(file.uploadedAt).toLocaleDateString()
                return (
                  <div key={file.id}>
                    {(mockDocs.length > 0 || i > 0) && <Divider/>}
                    <div style={{display:'flex',alignItems:'center',gap:12,padding:'10px 14px',transition:'background 0.12s'}}
                      onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='#F5F5F5'}
                      onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background='transparent'}>
                      <div style={{width:36,height:36,borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,
                        background: colors.bg}}>
                        <span style={{fontSize:'0.6rem',fontWeight:800,letterSpacing:0.3,color: colors.fg}}>
                          {file.type.toUpperCase().slice(0, 4)}
                        </span>
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <Typography style={{fontWeight:600,fontSize:'0.875rem',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{file.name}</Typography>
                        <Typography style={{fontSize:'0.72rem',color:'#AEB4BA',marginTop:1}}>
                          Uploaded {dateStr} · {formatBytes(file.size)}
                          {isVideo && ' · Video'}
                          {isImage && ' · Image'}
                        </Typography>
                      </div>
                      {(isVideo || isImage) && (
                        <Button size="small" onClick={() => setPreview(file)} style={{color:'#004948',textTransform:'none',fontWeight:600,flexShrink:0,fontSize:'0.8rem'}}>Preview</Button>
                      )}
                      <Button size="small" onClick={() => handleDownload(file)} style={{color:'#004948',textTransform:'none',fontWeight:600,flexShrink:0,fontSize:'0.8rem'}}>Download</Button>
                      <IconButton size="small" onClick={() => handleDelete(file.id)} style={{color: '#D32F2F'}}>
                        <DeleteIcon fontSize="small"/>
                      </IconButton>
                    </div>
                  </div>
                )
              })}

              {mockDocs.length === 0 && sectionUploads.length === 0 && !loading && (
                <div style={{padding:'20px 14px',textAlign:'center',color:'#AEB4BA',fontSize:'0.85rem'}}>
                  No files yet. Upload to get started.
                </div>
              )}
            </Paper>
          </div>
        )
      })}

      {/* Preview Dialog */}
      <Dialog open={!!preview} onClose={() => setPreview(null)} maxWidth="md" fullWidth>
        <DialogTitle>
          {preview?.name}
        </DialogTitle>
        <DialogContent>
          {preview && preview.mime.startsWith('video/') && (
            <video controls style={{width:'100%',maxHeight:'70vh',background:'#000',borderRadius:6}}>
              <source src={URL.createObjectURL(preview.blob)} type={preview.mime}/>
              Your browser does not support this video format.
            </video>
          )}
          {preview && preview.mime.startsWith('image/') && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={URL.createObjectURL(preview.blob)} alt={preview.name} style={{maxWidth:'100%',maxHeight:'70vh',display:'block',margin:'0 auto'}}/>
          )}
        </DialogContent>
        <DialogActions>
          {preview && (
            <Button onClick={() => handleDownload(preview)} style={{textTransform:'none'}}>Download</Button>
          )}
          <Button onClick={() => setPreview(null)} variant="contained" color="primary" style={{textTransform:'none'}}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3500}
        onClose={() => setSnack(s => ({...s, open: false}))}
        anchorOrigin={{vertical:'bottom', horizontal:'center'}}
        message={snack.msg}
      />
    </div>
  )
}

// ───────────────────────────────────────────────────────────────────────────────
// Product Selector
// ───────────────────────────────────────────────────────────────────────────────

function ProductSelector({ value, onChange, label }: { value: string[], onChange: (v: string[]) => void, label?: string }) {
  const toggle = (p: string) => {
    onChange(value.includes(p) ? value.filter(x=>x!==p) : [...value, p])
  }

  return (
    <div>
      {label && <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-2">{label}</p>}
      <div className="flex flex-wrap gap-2">
        {PRODUCTS.map(p=>{
          const sel = value.includes(p)
          const c = PRODUCT_COLORS[p]
          return (
            <button
              key={p}
              onClick={()=>toggle(p)}
              className="px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition"
              style={{
                border: `2px solid ${sel?c.text:'#DDE1E2'}`,
                background: sel?c.bg:'white',
                color: sel?c.text:'#4F5B60',
              }}
            >
              {sel && <span>✓ </span>}{p}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ───────────────────────────────────────────────────────────────────────────────
// Sales Proposal Table — AG-Grid
// ───────────────────────────────────────────────────────────────────────────────

interface ProposalLine {
  id: string
  hotel: string
  rooms: number
  products: string[]
  annual: number
  impl: number
}

interface Proposal {
  id: string
  date: string
  lines: ProposalLine[]
}

function ProductsRenderer({ value }: { value: string[] }) {
  return (
    <Box style={{display:'flex',flexWrap:'wrap',gap:4,padding:'8px 0'}}>
      {value.map(p=>(
        <Box key={p} style={{padding:'2px 8px',borderRadius:4,fontSize:'0.7rem',fontWeight:700,background:(PRODUCT_COLORS[p]||{bg:'#E0F0EF'}).bg,color:(PRODUCT_COLORS[p]||{text:'#004948'}).text}}>{p}</Box>
      ))}
    </Box>
  )
}

function HotelRenderer({ data }: { data: ProposalLine }) {
  return (
    <Box>
      <Typography style={{fontWeight:600,fontSize:'0.875rem'}}>{data.hotel}</Typography>
      <Typography style={{fontSize:'0.75rem',color:'#4F5B60'}}>{data.rooms} rooms</Typography>
    </Box>
  )
}

function SalesProposalTable({ proposal, productColors }: { proposal: Proposal, productColors: Record<string, {bg: string, text: string}> }) {
  const fmt = (n: number) => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n)

  const rowData = proposal.lines.map(line => ({
    ...line,
    costPerRoom: line.products.reduce((s,p)=>s+({GameChanger:8.5,ScoreBoard:3,BlockBuster:4,Advance:2.5,GameTime:2,HotStats:1.5}[p as keyof typeof productColors]||0),0),
  }))

  const columnDefs: ColDef[] = [
    {
      field: 'hotel',
      headerName: 'Hotel',
      flex: 1.5,
      cellRenderer: (params: any) => <HotelRenderer data={params.data} />,
      minWidth: 200,
    },
    {
      field: 'products',
      headerName: 'Products',
      flex: 1.8,
      cellRenderer: (params: any) => <ProductsRenderer value={params.value} />,
      minWidth: 240,
      autoHeight: true,
    },
    {
      field: 'costPerRoom',
      headerName: 'Cost / Room / Month',
      flex: 1,
      cellRenderer: (params: any) => <Typography style={{fontWeight:600,fontSize:'0.875rem',whiteSpace:'nowrap'}}>{fmt(params.value)}</Typography>,
      minWidth: 150,
      headerClass: 'ag-right-aligned-header',
      cellClass: 'ag-right-aligned-cell',
    },
    {
      field: 'annual',
      headerName: 'Annual Subscription',
      flex: 1,
      cellRenderer: (params: any) => <Typography style={{fontWeight:600,fontSize:'0.875rem',whiteSpace:'nowrap'}}>{fmt(params.value)}</Typography>,
      minWidth: 150,
      headerClass: 'ag-right-aligned-header',
      cellClass: 'ag-right-aligned-cell',
    },
    {
      field: 'impl',
      headerName: 'Implementation Fee',
      flex: 1,
      cellRenderer: (params: any) => <Typography style={{fontWeight:600,fontSize:'0.875rem',whiteSpace:'nowrap'}}>{fmt(params.value)}</Typography>,
      minWidth: 150,
      headerClass: 'ag-right-aligned-header',
      cellClass: 'ag-right-aligned-cell',
    },
  ]

  const totalAnnual = proposal.lines.reduce((s,l)=>s+l.annual,0)
  const totalImpl = proposal.lines.reduce((s,l)=>s+l.impl,0)

  return (
    <Box>
      <Box style={{border:'1px solid #DDE1E2',borderRadius:6,marginBottom:16}}>
        <style>{`
          .ag-theme-alpine {
            --ag-header-background-color: #F8F9FD;
            --ag-header-foreground-color: #4F5B60;
            --ag-header-cell-text-transform: uppercase;
            --ag-header-cell-padding: 12px 16px;
            --ag-cell-horizontal-padding: 16px;
            --ag-cell-vertical-padding: 14px;
            --ag-row-hover-color: #FAFAFA;
            --ag-borders-side-color: #DDE1E2;
            --ag-border-color: #DDE1E2;
            --ag-header-border-color: #DDE1E2;
          }
          .ag-theme-alpine .ag-header-cell-text {
            font-size: 0.72rem;
            font-weight: 700;
            letter-spacing: 0.5px;
          }
          .ag-theme-alpine .ag-cell {
            font-size: 0.875rem;
          }
          .ag-right-aligned-header {
            text-align: right !important;
          }
          .ag-right-aligned-cell {
            text-align: right !important;
          }
          .ag-theme-alpine .ag-row:nth-child(odd) {
            background-color: #FAFAFA;
          }
          .ag-theme-alpine .ag-row:nth-child(even) {
            background-color: white;
          }
        `}</style>
        <div className="ag-theme-alpine" style={{width:'100%',height:'auto'}}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={{
              sortable:false,
              filter:false,
              resizable:true,
            }}
            domLayout="autoHeight"
            rowHeight={undefined}
            suppressHorizontalScroll={false}
            suppressMovableColumns={true}
          />
        </div>
      </Box>

      {/* Footer totals */}
      <Box style={{display:'flex',gap:40,background:'#FAFAFA',borderRadius:6,padding:'12px 16px',marginBottom:16,borderTop:'2px solid #DDE1E2'}}>
        <Box style={{flex:1}}>
          <Typography style={{fontSize:'0.72rem',fontWeight:700,textTransform:'uppercase',letterSpacing:0.5,color:'#4F5B60',marginBottom:4}}>Total</Typography>
        </Box>
        <Box style={{textAlign:'right'}}>
          <Typography style={{fontWeight:700,fontSize:'0.875rem',whiteSpace:'nowrap'}}>{fmt(totalAnnual)}</Typography>
        </Box>
        <Box style={{textAlign:'right',minWidth:150}}>
          <Typography style={{fontWeight:700,fontSize:'0.875rem',whiteSpace:'nowrap'}}>{fmt(totalImpl)}</Typography>
        </Box>
      </Box>
    </Box>
  )
}

// ───────────────────────────────────────────────────────────────────────────────
// Main App
// ───────────────────────────────────────────────────────────────────────────────

function DigitalSalesRoomApp() {
  const classes = useStyles()
  const theme = useTheme()
  const { user } = useContext(AuthCtx)
  const [view, setView] = useState('landing')
  const [activePhase, setActivePhase] = useState('digital-sales-room')
  const [activeSection, setActiveSection] = useState('account')
  // (Auth hydration removed — sign-in screen always shows on a fresh page visit.)
  const [accountSaved, setAccountSaved] = useState(false)
  const [proposalAccepted, setProposalAccepted] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  // Hotels: prefilled from Duetto + customer-added ones
  const [hotels, setHotels] = useState<AddedHotel[]>(() =>
    MOCK_HOTELS.map(h => ({ ...h, isNew: false, useCustomProducts: false, products: [...DEFAULT_PRODUCTS] }))
  )
  const [hotelSearch, setHotelSearch] = useState('')
  const [allHotelsSameProducts, setAllHotelsSameProducts] = useState(true)
  const [globalProducts, setGlobalProducts] = useState<string[]>([...DEFAULT_PRODUCTS])
  const [excelError, setExcelError] = useState('')
  const [excelToast, setExcelToast] = useState('')
  const excelInputRef = useRef<HTMLInputElement>(null)
  // Add New Hotel modal
  interface NewHotelForm {
    name: string
    address: string
    rooms: string // input as string, parse on submit
    products: string[]
    overrideProducts: boolean // if true, this hotel uses its own products instead of global
    integrations: string
    contactName: string
    contactEmail: string
    contactPhone: string
  }
  const emptyNewHotelForm = (prefilledName = ''): NewHotelForm => ({
    name: prefilledName,
    address: '',
    rooms: '',
    products: [...globalProducts],
    overrideProducts: false,
    integrations: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
  })
  const [newHotelOpen, setNewHotelOpen] = useState(false)
  const [newHotelForm, setNewHotelForm] = useState<NewHotelForm>(emptyNewHotelForm())
  // When editing, holds the id of the hotel being edited; null = add mode
  const [editingHotelId, setEditingHotelId] = useState<string | null>(null)
  // Hotel card expansion state
  const [expandedHotels, setExpandedHotels] = useState<Set<string>>(new Set())
  const toggleHotelExpanded = (id: string) =>
    setExpandedHotels(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const openNewHotelModal = (prefilledName = '') => {
    setEditingHotelId(null)
    setNewHotelForm(emptyNewHotelForm(prefilledName))
    setNewHotelOpen(true)
  }

  const openEditHotelModal = (hotel: AddedHotel) => {
    setEditingHotelId(hotel.id)
    setNewHotelForm({
      name: hotel.name,
      address: hotel.address,
      rooms: hotel.rooms ? String(hotel.rooms) : '',
      products: [...hotel.products],
      overrideProducts: hotel.useCustomProducts,
      integrations: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
    })
    setNewHotelOpen(true)
  }

  // Persist current form to hotels list. Returns true on success, false if invalid.
  const persistHotelForm = (): boolean => {
    const name = newHotelForm.name.trim()
    if (!name) return false

    // Effective override = explicit toggle OR global products are off, OR products differ from globalProducts
    const override = !allHotelsSameProducts || newHotelForm.overrideProducts ||
      newHotelForm.products.join(',') !== globalProducts.join(',')
    // If not overriding, sync products to current global so future global changes propagate
    const finalProducts = override ? [...newHotelForm.products] : [...globalProducts]

    if (editingHotelId) {
      // Edit existing hotel
      setHotels(prev => prev.map(h => h.id === editingHotelId ? {
        ...h,
        name,
        address: newHotelForm.address.trim(),
        rooms: Number(newHotelForm.rooms) || 0,
        products: finalProducts,
        useCustomProducts: override,
      } : h))
      return true
    }

    // Add new
    if (hotels.some(h => h.name.toLowerCase() === name.toLowerCase())) return false
    const matchInDb = HOTEL_DATABASE.find(d => d.name.toLowerCase() === name.toLowerCase())
    const next: AddedHotel = {
      id: `new-${Date.now()}`,
      name,
      address: newHotelForm.address.trim(),
      rooms: Number(newHotelForm.rooms) || 0,
      isNew: !matchInDb,
      useCustomProducts: override,
      products: finalProducts,
    }
    setHotels(prev => [...prev, next])
    return true
  }

  const handleSaveAndClose = () => {
    if (persistHotelForm()) {
      setNewHotelOpen(false)
      setHotelSearch('')
    }
  }

  const handleSaveAndAddAnother = () => {
    if (persistHotelForm()) {
      // Reset to fresh add-mode for the next hotel; keep modal open
      setEditingHotelId(null)
      setNewHotelForm(emptyNewHotelForm())
    }
  }

  // Add hotel from search field. If value matches database, copy known data.
  // Otherwise mark as a new (manually entered) hotel.
  const addHotelByName = (rawName: string) => {
    const name = rawName.trim()
    if (!name) return
    if (hotels.some(h => h.name.toLowerCase() === name.toLowerCase())) return // dedupe
    const match = HOTEL_DATABASE.find(h => h.name.toLowerCase() === name.toLowerCase())
    const next: AddedHotel = match
      ? { ...match, isNew: false, useCustomProducts: false, products: [...globalProducts] }
      : {
          id: `new-${Date.now()}`,
          name,
          address: '',
          rooms: 0,
          isNew: true,
          useCustomProducts: false,
          products: [...globalProducts],
        }
    setHotels(prev => [...prev, next])
    setHotelSearch('')
  }

  const removeHotel = (id: string) => setHotels(prev => prev.filter(h => h.id !== id))

  const setHotelProducts = (id: string, products: string[]) =>
    setHotels(prev => prev.map(h => (h.id === id ? { ...h, products } : h)))

  const setHotelCustomToggle = (id: string, useCustomProducts: boolean) =>
    setHotels(prev =>
      prev.map(h =>
        h.id === id
          ? { ...h, useCustomProducts, products: useCustomProducts ? h.products : [...globalProducts] }
          : h,
      ),
    )

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setExcelError('')
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const buf = await file.arrayBuffer()
      const wb = XLSX.read(buf, { type: 'array' })
      const ws = wb.Sheets[wb.SheetNames[0]]
      const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(ws, { defval: '' })
      if (!rows.length) throw new Error('Sheet is empty')
      // Accept any header that includes "name" (case-insensitive) as hotel name.
      const nameKey = Object.keys(rows[0]).find(k => /name/i.test(k))
      if (!nameKey) throw new Error('No "name" column found in spreadsheet')
      const addressKey = Object.keys(rows[0]).find(k => /address/i.test(k))
      const roomsKey = Object.keys(rows[0]).find(k => /room/i.test(k))

      let added = 0
      setHotels(prev => {
        const next = [...prev]
        rows.forEach((row, i) => {
          const name = String(row[nameKey] || '').trim()
          if (!name) return
          if (next.some(h => h.name.toLowerCase() === name.toLowerCase())) return
          const match = HOTEL_DATABASE.find(h => h.name.toLowerCase() === name.toLowerCase())
          const address = addressKey ? String(row[addressKey] || '').trim() : ''
          const roomsNum = roomsKey ? Number(row[roomsKey]) || 0 : 0
          next.push(
            match
              ? { ...match, isNew: false, useCustomProducts: false, products: [...globalProducts] }
              : {
                  id: `xls-${Date.now()}-${i}`,
                  name,
                  address: address || (match as any)?.address || '',
                  rooms: roomsNum || (match as any)?.rooms || 0,
                  isNew: true,
                  useCustomProducts: false,
                  products: [...globalProducts],
                },
          )
          added += 1
        })
        return next
      })
      setExcelToast(added > 0 ? `${added} hotel${added === 1 ? '' : 's'} imported` : 'No new hotels to import')
    } catch (err: any) {
      setExcelError(err?.message || 'Failed to read spreadsheet')
    } finally {
      // Reset input so the same file can be re-uploaded
      if (excelInputRef.current) excelInputRef.current.value = ''
    }
  }

  if (!user) {
    if (view === 'signin') return <SignInPage onBack={()=>setView('landing')} onCreateAccount={()=>setView('create')}/>
    if (view === 'create') return <CreateAccountPage onBack={()=>setView('landing')}/>
    return <LoginPage onSignIn={()=>setView('signin')} onCreateAccount={()=>setView('create')}/>
  }

  const nextStep = proposalAccepted
    ? { section:'complete', label:'Complete!' }
    : !accountSaved
    ? { section:'account',  label:'Complete Enter Details' }
    : { section:'proposal', label:'Review Proposal' }

  const phaseSteps: ArrowStepConfig[] = [
    { id: 'account', label: 'Enter Details' },
    { id: 'hotels', label: 'Hotel Details' },
    { id: 'docs', label: 'Documents' },
    { id: 'proposal', label: 'Sales Proposal' },
  ]

  const handleStepClick = (stepId: string) => {
    if (stepId === 'hotels' && !accountSaved) return
    setActiveSection(stepId)
  }

  return (
    <Box style={{display:'flex',flexDirection:'column',minHeight:'100vh',background:'#FAFAFA'}}>
      {/* Sticky header + stepper bundle */}
      <Box style={{position:'sticky',top:0,zIndex:500,background:'#ffffff'}}>
        <ExternalHeader userName={user?.name} userEmail={user?.email} />
        <ArrowStepperComponent steps={phaseSteps} currentStepId={activeSection} onStepClick={handleStepClick} />
      </Box>

      {/* Content */}
      <Box style={{flex:1,display:'flex',flexDirection:'column',background:'#FAFAFA',padding:theme.spacing(3),maxWidth:1200,margin:'0 auto',width:'100%'}}>
          {activeSection === 'docs' && (
            <DocumentStore />
          )}
          {activeSection === 'account' && (
            <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
              <div style={{padding:24,maxWidth:720,paddingBottom:24}}>
                <Typography variant="h5" style={{fontWeight:700,marginBottom:4}}>Enter Details</Typography>
                <Typography variant="body2" style={{color:'#4F5B60',marginBottom:16}}>Provide your company and billing information for your subscription agreement.</Typography>
                <Divider style={{marginBottom:24}}/>

                {accountSaved && (
                  <Box style={{display:'flex',alignItems:'flex-start',gap:10,background:'#E8F5E9',border:'1px solid #A5D6A7',borderRadius:6,padding:'12px 16px',marginBottom:20}}>
                    <CheckCircleIcon style={{fontSize:'1.1rem',marginTop:1,color:'#388C3F'}}/>
                    <Typography style={{fontSize:'0.875rem',color:'#28592C'}}>
                      <strong>Account details saved.</strong> Hotel Details unlocked — edit any field below and re-save to update.
                    </Typography>
                  </Box>
                )}

                {/* Account form — always visible, editable before and after save */}
                <form onSubmit={(e) => { e.preventDefault(); setAccountSaved(true); setActiveSection('hotels') }}>
                  <Typography style={{color:'#4F5B60',fontWeight:600,textTransform:'uppercase',letterSpacing:1,fontSize:'0.7rem',marginBottom:12}}>COMPANY INFORMATION</Typography>
                  <TextField label="Company Name" type="text" variant="outlined" fullWidth size="small" style={{marginBottom:16}}/>

                  <Typography style={{color:'#4F5B60',fontWeight:600,textTransform:'uppercase',letterSpacing:1,fontSize:'0.7rem',marginBottom:12,marginTop:16}}>BILLING INFORMATION</Typography>
                  <TextField label="Billing Contact Name" type="text" variant="outlined" fullWidth size="small" style={{marginBottom:16}}/>
                  <TextField label="Billing Email" type="email" variant="outlined" fullWidth size="small" style={{marginBottom:16}}/>
                  <TextField label="Contact Telephone Number" type="tel" variant="outlined" fullWidth size="small" style={{marginBottom:16}}/>
                  <TextField label="Billing Address" type="text" variant="outlined" fullWidth size="small" multiline rows={3} style={{marginBottom:16}}/>
                </form>
              </div>
              </div>
          )}

          {activeSection === 'hotels' && accountSaved && (
            <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
            <Box style={{padding:24,maxWidth:1000,paddingBottom:24}}>
              <Typography variant="h5" style={{fontWeight:700,marginBottom:4}}>Hotel Details</Typography>
              <Typography variant="body2" style={{color:'#4F5B60',marginBottom:16}}>Search Duetto's hotel database or type a new property name. Assign products globally or per hotel.</Typography>
              <Divider style={{marginBottom:24}}/>

              {/* Global products toggle + checkbox editor — ABOVE search */}
              <Box style={{marginBottom:24,padding:'14px 16px',background:'#ffffff',borderRadius:6,border:'1px solid #EBEDEF'}}>
                <Box style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:allHotelsSameProducts?12:0}}>
                  <Box>
                    <Typography style={{fontSize:'0.9rem',fontWeight:700,color:'#1c1c1c'}}>All hotels have the same products</Typography>
                    <Typography style={{fontSize:'0.75rem',color:'#4F5B60'}}>Toggle off to set products per hotel.</Typography>
                  </Box>
                  <DuettoSwitch
                    checked={allHotelsSameProducts}
                    color="primary"
                    onChange={(_, checked) => {
                      setAllHotelsSameProducts(checked)
                      if (checked) {
                        setHotels(prev => prev.map(h => ({ ...h, useCustomProducts: false, products: [...globalProducts] })))
                      }
                    }}
                  />
                </Box>
                {allHotelsSameProducts && (
                  <Box>
                    <Typography style={{fontSize:'0.75rem',fontWeight:600,color:'#4F5B60',marginBottom:8}}>Products applied to all hotels</Typography>
                    <Box style={{display:'grid',gridTemplateColumns:'1fr 1fr',columnGap:32,rowGap:12}}>
                      {PRODUCTS.map(p => {
                        const on = globalProducts.includes(p)
                        return (
                          <FormControlLabel
                            key={p}
                            control={
                              <Checkbox
                                size="small"
                                color="primary"
                                checked={on}
                                onChange={() => {
                                  const nextGlobal = on ? globalProducts.filter(x => x !== p) : [...globalProducts, p]
                                  setGlobalProducts(nextGlobal)
                                  setHotels(prev => prev.map(h => h.useCustomProducts ? h : { ...h, products: nextGlobal }))
                                }}
                              />
                            }
                            label={
                              <Box>
                                <Typography style={{
                                  fontWeight: on ? 600 : 500,
                                  fontSize: '0.85rem',
                                  color: '#1c1c1c',
                                  lineHeight: 1.3,
                                }}>
                                  {p}
                                </Typography>
                                <Typography style={{
                                  fontSize: '0.7rem',
                                  color: '#4F5B60',
                                  lineHeight: 1.3,
                                  marginTop: 2,
                                }}>
                                  {PRODUCT_DESCRIPTIONS[p]}
                                </Typography>
                              </Box>
                            }
                          />
                        )
                      })}
                    </Box>
                  </Box>
                )}
              </Box>

              {/* Add Hotel + Excel upload */}
              <Box style={{display:'flex',gap:12,marginBottom:24,alignItems:'center',justifyContent:'flex-end'}}>
                <input
                  ref={excelInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleExcelUpload}
                  style={{display:'none'}}
                />
                <Button
                  variant="outlined"
                  color="primary"
                  style={{textTransform:'none'}}
                  onClick={() => excelInputRef.current?.click()}
                >
                  ⬆ Upload from Excel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon/>}
                  style={{textTransform:'none',fontWeight:600}}
                  onClick={() => openNewHotelModal('')}
                >
                  Add Hotel
                </Button>
              </Box>
              {excelError && (
                <Box style={{marginBottom:16,padding:'8px 12px',background:'#FFE9E9',borderRadius:6,color:'#A12121',fontSize:'0.8rem'}}>
                  {excelError}
                </Box>
              )}

              {/* Contact Details */}
              <Box style={{marginBottom:24,padding:'12px 16px',background:'#FAFAFA',borderRadius:8}}>
                <Typography style={{fontSize:'0.75rem',fontWeight:600,textTransform:'uppercase',color:'#4F5B60',marginBottom:12}}>PROPERTY IMPLEMENTATION CONTACT DETAILS</Typography>
                <Box style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
                  <TextField label="Contact Name" variant="outlined" size="small" fullWidth />
                  <TextField label="Contact Email" variant="outlined" size="small" fullWidth />
                  <TextField label="Contact Phone" variant="outlined" size="small" fullWidth />
                </Box>
              </Box>

              {/* Hotels List — accordion cards */}
              {hotels.length === 0 ? (
                <Box style={{border:'1px solid #DDE1E2',borderRadius:6,padding:'20px',textAlign:'center',color:'#AEB4BA',background:'#ffffff'}}>
                  No hotels added yet. Click "Add Hotel" above or upload from Excel.
                </Box>
              ) : (
                <Box style={{display:'flex',flexDirection:'column',gap:10}}>
                  {hotels.map((h) => {
                    const isOpen = expandedHotels.has(h.id)
                    const dbMatch = HOTEL_DATABASE.find(d => d.name.toLowerCase() === h.name.toLowerCase())
                    const coords = dbMatch && dbMatch.lat && dbMatch.lng ? `${dbMatch.lat}, ${dbMatch.lng}` : '—'
                    const tz = dbMatch?.tz || '—'
                    return (
                      <Box
                        key={h.id}
                        style={{
                          background:'#ffffff',
                          border:'1px solid #DDE1E2',
                          borderRadius:6,
                          overflow:'hidden',
                        }}
                      >
                        {/* Header row */}
                        <Box
                          onClick={() => toggleHotelExpanded(h.id)}
                          style={{
                            display:'flex',
                            alignItems:'center',
                            gap:12,
                            padding:'14px 16px',
                            cursor:'pointer',
                          }}
                        >
                          <HotelIcon style={{color:'#006461',fontSize:22,flexShrink:0}}/>
                          <Box style={{flex:1,minWidth:0,display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
                            <Typography style={{fontWeight:700,fontSize:'0.95rem',color:'#1c1c1c'}}>{h.name}</Typography>
                            {h.isNew && (
                              <Box style={{padding:'2px 8px',borderRadius:10,background:'#FFF4D6',color:'#7A5400',fontSize:'0.68rem',fontWeight:700,letterSpacing:0.3,textTransform:'uppercase'}}>
                                New hotel
                              </Box>
                            )}
                          </Box>

                          {/* Right cluster: small product chips + room count + trash + chevron */}
                          <Box style={{display:'flex',alignItems:'center',gap:8,flexShrink:0}}>
                            <Box style={{display:'flex',gap:4,flexWrap:'nowrap'}}>
                              {h.products.slice(0,3).map(p => (
                                <Box
                                  key={p}
                                  style={{
                                    padding:'3px 10px',
                                    borderRadius:10,
                                    fontSize:'0.72rem',
                                    fontWeight:700,
                                    background: PRODUCT_COLORS[p]?.bg || '#E0F0EF',
                                    color: PRODUCT_COLORS[p]?.text || '#004948',
                                    whiteSpace:'nowrap',
                                  }}
                                >
                                  {p}
                                </Box>
                              ))}
                              {h.products.length > 3 && (
                                <Box style={{padding:'3px 8px',borderRadius:10,fontSize:'0.7rem',fontWeight:700,background:'#F1F3F5',color:'#4F5B60'}}>
                                  +{h.products.length - 3}
                                </Box>
                              )}
                            </Box>
                            {h.rooms > 0 && (
                              <Box style={{padding:'3px 10px',borderRadius:10,fontSize:'0.72rem',fontWeight:600,background:'#F4F6F8',color:'#4F5B60',whiteSpace:'nowrap'}}>
                                {h.rooms.toLocaleString()} rooms
                              </Box>
                            )}
                            <ExpandMoreIcon
                              style={{
                                color:'#4F5B60',
                                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s',
                              }}
                            />
                          </Box>
                        </Box>

                        {/* Expanded body */}
                        {isOpen && (
                          <Box style={{borderTop:'1px solid #EBEDEF',padding:'16px 20px'}}>
                            {/* Metadata grid */}
                            <Box style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:24,marginBottom:20}}>
                              <Box>
                                <Typography style={{fontSize:'0.7rem',fontWeight:700,letterSpacing:0.5,textTransform:'uppercase',color:'#4F5B60',marginBottom:6}}>Address</Typography>
                                <Typography style={{fontSize:'0.875rem',color:'#1c1c1c'}}>
                                  {h.address || (h.isNew ? 'Pending Duetto follow-up' : '—')}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography style={{fontSize:'0.7rem',fontWeight:700,letterSpacing:0.5,textTransform:'uppercase',color:'#4F5B60',marginBottom:6}}>Coordinates</Typography>
                                <Typography style={{fontSize:'0.875rem',color:'#1c1c1c'}}>{coords}</Typography>
                              </Box>
                              <Box>
                                <Typography style={{fontSize:'0.7rem',fontWeight:700,letterSpacing:0.5,textTransform:'uppercase',color:'#4F5B60',marginBottom:6}}>Timezone</Typography>
                                <Typography style={{fontSize:'0.875rem',color:'#1c1c1c'}}>{tz}</Typography>
                              </Box>
                            </Box>

                            {/* Products */}
                            <Box style={{marginBottom:16}}>
                              <Typography style={{fontSize:'0.7rem',fontWeight:700,letterSpacing:0.5,textTransform:'uppercase',color:'#4F5B60',marginBottom:6}}>Products</Typography>
                              {h.products.length === 0 ? (
                                <Typography style={{fontSize:'0.85rem',color:'#8a9096'}}>—</Typography>
                              ) : (
                                <Box style={{display:'flex',flexWrap:'wrap',gap:6}}>
                                  {h.products.map(p => (
                                    <Box
                                      key={p}
                                      style={{
                                        padding:'4px 12px',
                                        borderRadius:12,
                                        fontSize:'0.75rem',
                                        fontWeight:700,
                                        background: PRODUCT_COLORS[p]?.bg || '#E0F0EF',
                                        color: PRODUCT_COLORS[p]?.text || '#004948',
                                      }}
                                    >
                                      {p}
                                    </Box>
                                  ))}
                                </Box>
                              )}
                            </Box>

                            {/* Integrations */}
                            <Box style={{marginBottom:16}}>
                              <Typography style={{fontSize:'0.7rem',fontWeight:700,letterSpacing:0.5,textTransform:'uppercase',color:'#4F5B60',marginBottom:6}}>Integrations</Typography>
                              <Typography style={{fontSize:'0.875rem',color:'#8a9096'}}>—</Typography>
                            </Box>

                            {/* Implementation Contact */}
                            <Box style={{marginBottom:8}}>
                              <Typography style={{fontSize:'0.7rem',fontWeight:700,letterSpacing:0.5,textTransform:'uppercase',color:'#4F5B60',marginBottom:6}}>Implementation Contact</Typography>
                              <Typography style={{fontSize:'0.875rem',color:'#8a9096'}}>—</Typography>
                            </Box>

                            {/* Actions — Figma text buttons (11533:1107): Lato 16px, color #006461, 44px tall, 16px h-padding */}
                            <Box style={{display:'flex',justifyContent:'flex-end',gap:4,marginTop:12,paddingTop:12,borderTop:'1px dashed #EBEDEF'}}>
                              <button
                                onClick={() => openEditHotelModal(h)}
                                style={{
                                  height:44,
                                  padding:'12px 16px',
                                  border:'none',
                                  background:'transparent',
                                  borderRadius:4,
                                  cursor:'pointer',
                                  fontFamily:'Lato, -apple-system, BlinkMacSystemFont, sans-serif',
                                  fontSize:16,
                                  fontWeight:400,
                                  color:'#006461',
                                  display:'inline-flex',
                                  alignItems:'center',
                                  gap:8,
                                  transition:'background 0.12s',
                                }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#F5F5F5' }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => removeHotel(h.id)}
                                style={{
                                  height:44,
                                  padding:'12px 16px',
                                  border:'none',
                                  background:'transparent',
                                  borderRadius:4,
                                  cursor:'pointer',
                                  fontFamily:'Lato, -apple-system, BlinkMacSystemFont, sans-serif',
                                  fontSize:16,
                                  fontWeight:400,
                                  color:'#006461',
                                  display:'inline-flex',
                                  alignItems:'center',
                                  gap:8,
                                  transition:'background 0.12s',
                                }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#F5F5F5' }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
                              >
                                Remove
                              </button>
                            </Box>
                          </Box>
                        )}
                      </Box>
                    )
                  })}
                </Box>
              )}

              <Snackbar
                open={!!excelToast}
                autoHideDuration={3000}
                onClose={() => setExcelToast('')}
                message={excelToast}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              />

              {/* Add New Hotel modal */}
              <Dialog
                open={newHotelOpen}
                onClose={() => setNewHotelOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{ style: { borderRadius: 10 } }}
              >
                <DialogTitle disableTypography style={{padding:'20px 24px',borderBottom:'1px solid #EBEDEF'}}>
                  <Typography style={{fontSize:'1.05rem',fontWeight:700}}>
                    {editingHotelId ? 'Edit Hotel' : 'Add New Hotel'}
                  </Typography>
                </DialogTitle>
                <DialogContent style={{padding:'24px',display:'flex',flexDirection:'column',gap:24}}>
                  {/* Search Duetto database — auto-populates Property Details when picked */}
                  <Box style={{padding:'14px 16px',background:'#F4F8F7',borderRadius:6,border:'1px solid #DDE7E5'}}>
                    <Typography style={{fontSize:'0.72rem',fontWeight:700,letterSpacing:0.5,textTransform:'uppercase',color:'#4F5B60',marginBottom:8}}>
                      Search Duetto's Hotel Database
                    </Typography>
                    <Autocomplete<HotelRecord, false, false, true>
                      freeSolo
                      options={HOTEL_DATABASE.filter(d => !hotels.some(h => h.name.toLowerCase() === d.name.toLowerCase()))}
                      getOptionLabel={(opt) => (typeof opt === 'string' ? opt : opt.name)}
                      filterOptions={(opts, state) => {
                        const q = state.inputValue.trim().toLowerCase()
                        if (!q) return opts.slice(0, 10)
                        return opts.filter(o => o.name.toLowerCase().includes(q) || o.address.toLowerCase().includes(q)).slice(0, 20)
                      }}
                      onChange={(_, value) => {
                        if (!value) return
                        if (typeof value === 'string') {
                          setNewHotelForm(f => ({ ...f, name: value }))
                        } else {
                          // Populate full property details from DB record
                          setNewHotelForm(f => ({
                            ...f,
                            name: value.name,
                            address: value.address,
                            rooms: String(value.rooms || ''),
                          }))
                        }
                      }}
                      renderOption={(opt) => (
                        <Box style={{display:'flex',flexDirection:'column'}}>
                          <Typography style={{fontSize:'0.875rem',fontWeight:600}}>{opt.name}</Typography>
                          <Typography style={{fontSize:'0.72rem',color:'#8a9096'}}>{opt.address} · {opt.rooms.toLocaleString()} rooms</Typography>
                        </Box>
                      )}
                      noOptionsText="No match — fill the form below to add a new hotel"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Search hotel name or address…"
                          variant="outlined"
                          size="small"
                          fullWidth
                        />
                      )}
                    />
                    <Typography style={{fontSize:'0.72rem',color:'#4F5B60',marginTop:6}}>
                      Pick a known hotel to auto-fill name, address &amp; rooms. Or type a new one and fill in the details below.
                    </Typography>
                  </Box>

                  {/* Property Details */}
                  <Box>
                    <Typography style={{fontSize:'0.72rem',fontWeight:700,letterSpacing:0.5,textTransform:'uppercase',color:'#4F5B60',marginBottom:12}}>
                      Property Details
                    </Typography>
                    <Box style={{display:'flex',flexDirection:'column',gap:12}}>
                      <TextField
                        label="Property Name"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={newHotelForm.name}
                        onChange={(e) => setNewHotelForm(f => ({ ...f, name: e.target.value }))}
                      />
                      <TextField
                        label="Property Address"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={newHotelForm.address}
                        onChange={(e) => setNewHotelForm(f => ({ ...f, address: e.target.value }))}
                      />
                      <TextField
                        label="Number of Rooms"
                        variant="outlined"
                        size="small"
                        fullWidth
                        type="number"
                        value={newHotelForm.rooms}
                        onChange={(e) => setNewHotelForm(f => ({ ...f, rooms: e.target.value }))}
                      />
                    </Box>
                  </Box>

                  {/* Products */}
                  <Box>
                    <Typography style={{fontSize:'0.72rem',fontWeight:700,letterSpacing:0.5,textTransform:'uppercase',color:'#4F5B60',marginBottom:8,borderBottom:'1px solid #EBEDEF',paddingBottom:8}}>
                      Products
                    </Typography>
                    {allHotelsSameProducts && (
                      <Box style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8,padding:'8px 12px',background:'#FAFAFA',borderRadius:6}}>
                        <Box>
                          <Typography style={{fontSize:'0.82rem',fontWeight:600,color:'#1c1c1c'}}>Override this hotel</Typography>
                          <Typography style={{fontSize:'0.72rem',color:'#4F5B60'}}>
                            Off: this hotel inherits the global product list.
                          </Typography>
                        </Box>
                        <DuettoSwitch
                          color="primary"
                          checked={newHotelForm.overrideProducts}
                          onChange={(_, checked) => setNewHotelForm(f => ({
                            ...f,
                            overrideProducts: checked,
                            // When turning override OFF, snap products back to current global
                            products: checked ? f.products : [...globalProducts],
                          }))}
                        />
                      </Box>
                    )}
                    <Typography style={{fontSize:'0.82rem',color:'#4F5B60',marginBottom:8}}>Select the Duetto products for this property</Typography>
                    <Box style={{display:'flex',flexWrap:'wrap',columnGap:16,opacity: (allHotelsSameProducts && !newHotelForm.overrideProducts) ? 0.55 : 1}}>
                      {PRODUCTS.map(p => {
                        const on = newHotelForm.products.includes(p)
                        const disabled = allHotelsSameProducts && !newHotelForm.overrideProducts
                        return (
                          <FormControlLabel
                            key={p}
                            disabled={disabled}
                            control={
                              <Checkbox
                                size="small"
                                color="primary"
                                checked={on}
                                onChange={() => setNewHotelForm(f => ({
                                  ...f,
                                  products: on ? f.products.filter(x => x !== p) : [...f.products, p],
                                }))}
                              />
                            }
                            label={
                              <Box>
                                <Typography style={{
                                  fontWeight: on ? 600 : 500,
                                  fontSize: '0.85rem',
                                  color: '#1c1c1c',
                                  lineHeight: 1.3,
                                }}>
                                  {p}
                                </Typography>
                                <Typography style={{
                                  fontSize: '0.7rem',
                                  color: '#4F5B60',
                                  lineHeight: 1.3,
                                  marginTop: 2,
                                }}>
                                  {PRODUCT_DESCRIPTIONS[p]}
                                </Typography>
                              </Box>
                            }
                          />
                        )
                      })}
                    </Box>
                  </Box>

                  {/* Integrations */}
                  <Box>
                    <Typography style={{fontSize:'0.72rem',fontWeight:700,letterSpacing:0.5,textTransform:'uppercase',color:'#4F5B60',marginBottom:8,borderBottom:'1px solid #EBEDEF',paddingBottom:8}}>
                      Integrations
                    </Typography>
                    <Typography style={{fontSize:'0.82rem',color:'#4F5B60',marginBottom:8}}>PMS &amp; other integrating systems</Typography>
                    <TextField
                      placeholder="Search integrations…"
                      variant="outlined"
                      size="small"
                      fullWidth
                      value={newHotelForm.integrations}
                      onChange={(e) => setNewHotelForm(f => ({ ...f, integrations: e.target.value }))}
                    />
                  </Box>

                  {/* Contact Details */}
                  <Box>
                    <Typography style={{fontSize:'0.72rem',fontWeight:700,letterSpacing:0.5,textTransform:'uppercase',color:'#4F5B60',marginBottom:12,borderBottom:'1px solid #EBEDEF',paddingBottom:8}}>
                      Property Implementation Contact Details
                    </Typography>
                    <Box style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
                      <TextField
                        label="Contact Name"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={newHotelForm.contactName}
                        onChange={(e) => setNewHotelForm(f => ({ ...f, contactName: e.target.value }))}
                      />
                      <TextField
                        label="Contact Email"
                        variant="outlined"
                        size="small"
                        fullWidth
                        type="email"
                        value={newHotelForm.contactEmail}
                        onChange={(e) => setNewHotelForm(f => ({ ...f, contactEmail: e.target.value }))}
                      />
                      <TextField
                        label="Contact Phone"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={newHotelForm.contactPhone}
                        onChange={(e) => setNewHotelForm(f => ({ ...f, contactPhone: e.target.value }))}
                      />
                    </Box>
                  </Box>
                </DialogContent>
                <DialogActions style={{padding:'16px 24px',borderTop:'1px solid #EBEDEF',gap:8,justifyContent:'space-between'}}>
                  <Button
                    variant="text"
                    onClick={() => setNewHotelOpen(false)}
                    style={{textTransform:'none',color:'#1c1c1c',fontWeight:600}}
                  >
                    Cancel
                  </Button>
                  <Box style={{display:'flex',gap:8}}>
                    {!editingHotelId && (
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleSaveAndAddAnother}
                        disabled={!newHotelForm.name.trim()}
                        style={{textTransform:'none',fontWeight:600}}
                      >
                        Save and add another
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSaveAndClose}
                      disabled={!newHotelForm.name.trim()}
                      style={{textTransform:'none',fontWeight:600,paddingLeft:20,paddingRight:20}}
                    >
                      Save and close
                    </Button>
                  </Box>
                </DialogActions>
              </Dialog>
            </Box>
            </div>
          )}

          {activeSection === 'proposal' && accountSaved && (
            <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
            <Box style={{padding:24,paddingBottom:24}}>
              <Box style={{display:'flex',alignItems:'center',gap:12,marginBottom:4,flexWrap:'wrap'}}>
                <Typography variant="h5" style={{fontWeight:700}}>Sales Proposal</Typography>
                <Box style={{padding:'4px 12px',borderRadius:12,background:'#FFF8E1',color:'#774700',fontWeight:700,fontSize:'0.75rem'}}>
                  Pending Review
                </Box>
              </Box>
              <Typography variant="body2" style={{color:'#4F5B60',marginBottom:16}}>Review the products and pricing for your portfolio. Accept to proceed or request changes.</Typography>
              <Divider style={{marginBottom:20}}/>

              {/* Meta */}
              <Box style={{display:'flex',gap:40,marginBottom:24}}>
                {[['Proposal ID',MOCK_PROPOSAL.id],['Date Issued',MOCK_PROPOSAL.date],['Properties',MOCK_PROPOSAL.lines.length]].map(([l,v])=>(
                  <Box key={l as string}>
                    <Typography style={{color:'#4F5B60',fontSize:'0.7rem',fontWeight:600,textTransform:'uppercase',letterSpacing:0.5,marginBottom:2}}>{l as string}</Typography>
                    <Typography style={{fontWeight:500,fontSize:'0.875rem'}}>{v}</Typography>
                  </Box>
                ))}
              </Box>

              {/* AG-Grid Table */}
              <SalesProposalTable proposal={MOCK_PROPOSAL} productColors={PRODUCT_COLORS} />

              {proposalAccepted && (
                <Box style={{display:'flex',alignItems:'center',gap:10,background:'#E8F5E9',borderRadius:6,padding:'14px 18px',marginTop:20}}>
                  <span style={{color:'#388C3F'}}><CheckCircleIcon/></span>
                  <Typography style={{color:'#28592C',fontWeight:600}}>Proposal accepted. Our team will reach out to begin implementation.</Typography>
                </Box>
              )}
            </Box>
            </div>
          )}
        </Box>

      <Box style={{position:'sticky',bottom:0,background:'#ffffff',borderTop:'1px solid #DDE1E2',padding:'16px 24px',display:'flex',justifyContent:'flex-end',gap:12,boxShadow:'0 -2px 8px rgba(0,0,0,0.08)',zIndex:100}}>
        {activeSection === 'account' && (
          <>
            <Button variant="outlined" style={{textTransform:'none'}}>Discard</Button>
            <Button onClick={()=>{setAccountSaved(true);setActiveSection('hotels')}} variant="contained" color="primary" style={{textTransform:'none',fontWeight:600}}>
              Save and Next
            </Button>
          </>
        )}
        {activeSection === 'hotels' && (
          <>
            <Button variant="outlined" style={{textTransform:'none'}} onClick={()=>setActiveSection('account')}>Back</Button>
            <Button variant="contained" color="primary" style={{textTransform:'none',fontWeight:600}} onClick={()=>setActiveSection('docs')}>Next</Button>
          </>
        )}
        {activeSection === 'docs' && (
          <>
            <Button variant="outlined" style={{textTransform:'none'}} onClick={()=>setActiveSection('hotels')}>Back</Button>
            <Button variant="contained" color="primary" style={{textTransform:'none',fontWeight:600}} onClick={()=>setActiveSection('proposal')}>Next</Button>
          </>
        )}
        {activeSection === 'proposal' && (
          <>
            <Button variant="contained" color="primary" style={{textTransform:'none',fontWeight:600,paddingLeft:28,paddingRight:28}} onClick={()=>setProposalAccepted(true)}>
              ✓ Accept Proposal
            </Button>
            <Button variant="outlined" style={{textTransform:'none',fontWeight:500}}>
              ✎ Request Changes
            </Button>
          </>
        )}
      </Box>

    </Box>
  )
}

// ───────────────────────────────────────────────────────────────────────────────
// External Header — stripped-down chrome for customer-facing experience
// ───────────────────────────────────────────────────────────────────────────────

function ExternalHeader({ userName, userEmail }: { userName?: string, userEmail?: string }) {
  const { logout } = useContext(AuthCtx)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget)
  const handleClose = () => setAnchorEl(null)
  const handleSignOut = () => { handleClose(); logout() }

  return (
    <Box style={{
      display:'flex',
      alignItems:'center',
      justifyContent:'space-between',
      padding:'12px 24px',
      background:'#0e2124',
      color:'#fff',
      borderBottom:'1px solid rgba(255,255,255,0.08)',
      flexShrink:0,
    }}>
      <Box style={{display:'flex',alignItems:'center',gap:16}}>
        <img src="/duetto-logo-figma.png" alt="Duetto" style={{height:24,width:'auto',display:'block'}}/>
        <Box style={{width:1,height:20,background:'rgba(255,255,255,0.15)'}}/>
        <Typography style={{color:'rgba(255,255,255,0.85)',fontSize:'0.85rem',fontWeight:500}}>
          Digital Sales Room
        </Typography>
      </Box>
      <Box style={{display:'flex',alignItems:'center',gap:20}}>
        <a
          href="mailto:support@duettoresearch.com"
          style={{color:'rgba(255,255,255,0.6)',fontSize:'0.8rem',textDecoration:'none',cursor:'pointer'}}
        >
          Need help?
        </a>
        {userName && (
          <>
            <Box
              onClick={handleOpen}
              aria-haspopup="true"
              aria-expanded={open}
              style={{
                display:'flex',
                alignItems:'center',
                gap:10,
                padding:'4px 10px 4px 4px',
                borderRadius:24,
                cursor:'pointer',
                background: open ? 'rgba(255,255,255,0.08)' : 'transparent',
                transition:'background 0.15s',
              }}
              onMouseEnter={e => { if (!open) (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.05)' }}
              onMouseLeave={e => { if (!open) (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
            >
              <Box style={{
                width:32,height:32,borderRadius:'50%',background:'#006461',
                display:'flex',alignItems:'center',justifyContent:'center',
                fontSize:'0.85rem',fontWeight:700,color:'#fff',
              }}>
                {userName.charAt(0).toUpperCase()}
              </Box>
              <Typography style={{color:'#fff',fontSize:'0.85rem',fontWeight:600}}>{userName}</Typography>
              <ExpandMoreIcon style={{
                color:'rgba(255,255,255,0.6)',
                fontSize:18,
                transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                transition:'transform 0.15s',
              }}/>
            </Box>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              getContentAnchorEl={null}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              PaperProps={{
                style: {
                  marginTop: 8,
                  minWidth: 220,
                  borderRadius: 6,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.16)',
                },
              }}
              MenuListProps={{ disablePadding: true }}
            >
              <Box style={{padding:'12px 16px',borderBottom:'1px solid #eee'}}>
                <Typography style={{fontSize:'0.85rem',fontWeight:600,color:'#1c1c1c',lineHeight:1.3}}>{userName}</Typography>
                {userEmail && (
                  <Typography style={{fontSize:'0.75rem',color:'#4f5b60',lineHeight:1.3,marginTop:2}}>{userEmail}</Typography>
                )}
              </Box>
              <MenuItem
                onClick={handleSignOut}
                style={{
                  fontSize:'0.85rem',
                  color:'#1c1c1c',
                  padding:'10px 16px',
                }}
              >
                Sign out
              </MenuItem>
            </Menu>
          </>
        )}
      </Box>
    </Box>
  )
}

export default function DigitalSalesRoomPage() {
  return (
    <AuthProvider>
      <DigitalSalesRoomApp />
    </AuthProvider>
  )
}
