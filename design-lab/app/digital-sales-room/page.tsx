'use client'

import { useState, useContext, createContext, ReactNode, useEffect, useRef, useMemo } from 'react'
import { Box, Typography, Button, Card, CardContent, CardActions, Divider, Grid, List, ListItem, ListItemIcon, ListItemText, TextField, Chip, Paper, Accordion, AccordionSummary, AccordionDetails, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, IconButton, Tooltip, makeStyles, useTheme, InputAdornment, Stepper, Step, StepLabel } from '@material-ui/core'
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
    background: '#f5f5f5',
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
    background: '#f5f5f5',
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
    width: 240,
    flexShrink: 0,
    background: '#ffffff',
    borderRight: '1px solid #e0e0e0',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.3s ease-in-out',
    '&.collapsed': {
      width: 64,
    },
  },
  content: {
    flex: 1,
    background: '#f5f5f5',
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

const MOCK_HOTELS = [
  { id:'h1',  name:'The Grand Hyatt New York',         address:'109 E 42nd St, New York, NY',          rooms:1298, tz:'America/New_York',    lat:40.7527, lng:-73.9772 },
  { id:'h2',  name:'Marriott Marquis Times Square',    address:'1535 Broadway, New York, NY',           rooms:1966, tz:'America/New_York',    lat:40.7580, lng:-73.9855 },
  { id:'h3',  name:'The Westin Bonaventure',           address:'404 S Figueroa St, Los Angeles, CA',    rooms:1354, tz:'America/Los_Angeles', lat:34.0504, lng:-118.2588 },
];

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

  // Hydrate from sessionStorage after mount (avoids SSR/hydration mismatch).
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('dsr_user')
        if (stored) setUser(JSON.parse(stored))
      } catch {}
    }
  }, [])

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
          <Typography className={classes.authLogo}>DUETTO</Typography>
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
        className="w-full border border-gray-300 bg-white rounded py-3 px-4 flex items-center justify-center gap-3 cursor-pointer font-medium mb-4 hover:bg-gray-50 disabled:opacity-50"
      >
        {loading ? <span>Signing in…</span> : <>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908C16.658 14.233 17.64 11.925 17.64 9.2z" fill="#4285F4"/></svg>
          <span>Continue with Google</span>
        </>}
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
        height: 64,
        position: 'relative',
        cursor: onClick ? 'pointer' : 'default',
        marginLeft: isFirst ? 0 : -ARROW, // overlap so prev point slots into notch
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
        <Typography style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.2, color: textCol }}>
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
      padding: theme.spacing(2, 3),
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
                borderRadius: 8,
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

            <Paper elevation={0} style={{border:'1px solid #DDE1E2',borderRadius:8,overflow:'hidden'}}>
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
      <Box style={{border:'1px solid #DDE1E2',borderRadius:8,marginBottom:16}}>
        <style>{`
          .ag-theme-alpine {
            --ag-header-background-color: #F8F9FD;
            --ag-header-foreground-color: #4F5B60;
            --ag-header-cell-text-transform: uppercase;
            --ag-header-cell-padding: 12px 16px;
            --ag-cell-horizontal-padding: 16px;
            --ag-cell-vertical-padding: 14px;
            --ag-row-hover-color: #f5f5f5;
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
      <Box style={{display:'flex',gap:40,background:'#FAFAFA',borderRadius:8,padding:'12px 16px',marginBottom:16,borderTop:'2px solid #DDE1E2'}}>
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
  const [activeSection, setActiveSection] = useState('docs')
  const [accountSaved, setAccountSaved] = useState(false)
  const [proposalAccepted, setProposalAccepted] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  // Hotels: prefilled from Duetto + customer-added ones
  const [hotels, setHotels] = useState<typeof MOCK_HOTELS>([...MOCK_HOTELS])
  const [hotelSearch, setHotelSearch] = useState('')

  if (!user) {
    if (view === 'signin') return <SignInPage onBack={()=>setView('landing')} onCreateAccount={()=>setView('create')}/>
    if (view === 'create') return <CreateAccountPage onBack={()=>setView('landing')}/>
    return <LoginPage onSignIn={()=>setView('signin')} onCreateAccount={()=>setView('create')}/>
  }

  const nextStep = proposalAccepted
    ? { section:'complete', label:'Complete!' }
    : !accountSaved
    ? { section:'account',  label:'Complete Account Details' }
    : { section:'proposal', label:'Review Proposal' }

  const phaseSteps: ArrowStepConfig[] = [
    { id: 'digital-sales-room', label: 'Digital Sales Room', description: 'Documents, account & proposal' },
    { id: 'phase-2', label: 'Phase 2', description: 'Coming soon' },
    { id: 'phase-3', label: 'Phase 3', description: 'Coming soon' },
  ]

  return (
    <Box style={{display:'flex',flexDirection:'column',minHeight:'100vh',background:'#f5f5f5'}}>
      <ExternalHeader userName={user?.name} userEmail={user?.email} />

      {/* Arrow Stepper Progress Indicator */}
      <ArrowStepperComponent steps={phaseSteps} currentStepId={activePhase} onStepClick={setActivePhase} />

      {activePhase !== 'digital-sales-room' && (
        <Box style={{padding: theme.spacing(8, 4), textAlign: 'center', background: '#f5f5f5', minHeight: '60vh'}}>
          <Typography variant="h4" style={{fontWeight: 700, color: '#212121', marginBottom: 8}}>
            {phaseSteps.find(p => p.id === activePhase)?.label}
          </Typography>
          <Typography variant="body1" style={{color: '#4f5b60'}}>
            Coming soon. Content for this phase has not been built yet.
          </Typography>
        </Box>
      )}

      {activePhase === 'digital-sales-room' && (
      <div className={classes.mainContent}>
        {/* TourOperator Sidebar Pattern */}
        <Box className={`${classes.sidebar} ${sidebarCollapsed ? 'collapsed' : ''}`} style={{width: sidebarCollapsed ? 64 : 240}}>
          <Box className={classes.navSection}>
            <Typography className={`${classes.navSectionLabel} ${sidebarCollapsed ? 'hidden' : ''}`}>Digital Sales Room</Typography>
            <IconButton size="small" className={classes.sidebarToggle} onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
              {sidebarCollapsed ? <ExpandMoreIcon style={{transform: 'rotate(-90deg)'}} /> : <ExpandMoreIcon style={{transform: 'rotate(90deg)'}} />}
            </IconButton>
          </Box>
          <Divider/>
          <List disablePadding style={{paddingTop:theme.spacing(0.75)}}>
            {[
              { id:'docs',     label:'Documents',      icon:FolderIcon   },
              { id:'account',  label:'Account Details',icon:BusinessIcon },
              { id:'hotels',   label:'Hotel Details',  icon:HotelIcon    },
              { id:'proposal', label:'Sales Proposal', icon:DocumentIcon },
            ].map(({id,label,icon:Icon})=>{
              const isActive = activeSection === id
              const isLocked = id === 'hotels' && !accountSaved
              return (
                <ListItem
                  key={id}
                  button
                  disabled={isLocked}
                  onClick={!isLocked ? () => setActiveSection(id) : undefined}
                  style={{
                    borderRadius: 6,
                    margin: theme.spacing(0.25, 1),
                    background: isActive ? `rgba(${theme.palette.primary.main === '#006461' ? '0,100,97' : '0,73,72'},0.08)` : 'transparent',
                    opacity: isLocked ? 0.45 : 1,
                    cursor: isLocked ? 'not-allowed' : 'pointer',
                  }}
                >
                  <ListItemIcon style={{minWidth:36, color: isLocked ? theme.palette.text.disabled : isActive ? theme.palette.primary.main : '#63696F', transition: 'color 0.2s'}}>
                    {isLocked ? <LockIcon /> : <Icon />}
                  </ListItemIcon>
                  {!sidebarCollapsed && (
                    <ListItemText primary={label}
                      primaryTypographyProps={{className: classes.navLabel, style:{fontWeight:isActive?600:400, color: isLocked?theme.palette.text.disabled: isActive?theme.palette.primary.main:theme.palette.text.primary, fontSize:'0.875rem'}}}/>
                  )}
                </ListItem>
              )
            })}
          </List>
        </Box>

        {/* Content */}
        <Box className={classes.content}>
          {activeSection === 'docs' && <DocumentStore />}
          {activeSection === 'account' && (
            <div style={{padding:24,maxWidth:720}}>
              <Typography variant="h5" style={{fontWeight:700,marginBottom:4}}>Account Details</Typography>
              <Typography variant="body2" style={{color:'#4F5B60',marginBottom:16}}>Provide your company and billing information for your subscription agreement.</Typography>
              <Divider style={{marginBottom:24}}/>

              {!accountSaved && (
                <form onSubmit={(e) => { e.preventDefault(); setAccountSaved(true); setActiveSection('hotels') }}>
                  <Typography style={{color:'#4F5B60',fontWeight:600,textTransform:'uppercase',letterSpacing:1,fontSize:'0.7rem',marginBottom:12}}>COMPANY INFORMATION</Typography>
                  <TextField label="Company Name" type="text" variant="outlined" fullWidth size="small" style={{marginBottom:16}}/>

                  <Typography style={{color:'#4F5B60',fontWeight:600,textTransform:'uppercase',letterSpacing:1,fontSize:'0.7rem',marginBottom:12,marginTop:16}}>BILLING INFORMATION</Typography>
                  <TextField label="Billing Contact Name" type="text" variant="outlined" fullWidth size="small" style={{marginBottom:16}}/>
                  <TextField label="Billing Email" type="email" variant="outlined" fullWidth size="small" style={{marginBottom:16}}/>
                  <TextField label="Billing Entity Name" type="text" variant="outlined" fullWidth size="small" style={{marginBottom:16}}/>
                  <TextField label="Billing Address" type="text" variant="outlined" fullWidth size="small" multiline rows={3} style={{marginBottom:16}}/>

                  <div style={{display:'flex',justifyContent:'flex-end',gap:12,marginTop:8,paddingTop:16,borderTop:'1px solid #DDE1E2'}}>
                    <Button variant="outlined" style={{textTransform:'none'}}>Discard</Button>
                    <Button type="submit" variant="contained" color="primary" style={{textTransform:'none',fontWeight:600}}>Save Details</Button>
                  </div>
                </form>
              )}

              {accountSaved && (
                <Box style={{display:'flex',alignItems:'flex-start',gap:10,background:'#E8F5E9',border:'1px solid #A5D6A7',borderRadius:8,padding:'12px 16px'}}>
                  <span style={{fontSize:'1rem',marginTop:1}}>🔒</span>
                  <Typography style={{fontSize:'0.875rem',color:'#28592C'}}>
                    <strong>Account details saved.</strong> You can now proceed to Hotel Details.
                  </Typography>
                </Box>
              )}
            </div>
          )}

          {activeSection === 'hotels' && accountSaved && (
            <Box style={{padding:24,maxWidth:1000}}>
              <Typography variant="h5" style={{fontWeight:700,marginBottom:4}}>Hotel Details</Typography>
              <Typography variant="body2" style={{color:'#4F5B60',marginBottom:16}}>Search for your properties or add them manually. Select products and integrations for each hotel.</Typography>
              <Divider style={{marginBottom:24}}/>

              {/* Search & Add Section */}
              <Box style={{display:'grid',gridTemplateColumns:'1fr auto auto',gap:12,marginBottom:24}}>
                <TextField
                  placeholder="Search hotel name"
                  variant="outlined"
                  size="small"
                  value={hotelSearch}
                  onChange={e => setHotelSearch(e.target.value)}
                  fullWidth
                />
                <Button variant="outlined" color="primary" style={{textTransform:'none'}}>+ Add Manually</Button>
                <Button variant="outlined" color="primary" style={{textTransform:'none'}}>⬆ Upload from Excel</Button>
              </Box>

              {/* Default Products & Integrations */}
              <Box style={{marginBottom:24,padding:'12px 16px',background:'#FAFAFA',borderRadius:8}}>
                <Typography style={{fontSize:'0.8rem',fontWeight:600,textTransform:'uppercase',color:'#4F5B60',marginBottom:8}}>Apply to All New Hotels</Typography>
                <Box style={{marginBottom:8}}>
                  <Typography style={{fontSize:'0.75rem',fontWeight:600,color:'#4F5B60',marginBottom:8}}>Default products</Typography>
                  <Box style={{display:'flex',flexWrap:'wrap',gap:6}}>
                    {['GameChanger','ScoreBoard','BlockBuster','Advance','GameTime','HotStats'].map(p => (
                      <Chip key={p} label={p} size="small" style={{height:28}}/>
                    ))}
                  </Box>
                </Box>
                <Box>
                  <Typography style={{fontSize:'0.75rem',fontWeight:600,color:'#4F5B60',marginBottom:8}}>Default integrations (PMS & other systems)</Typography>
                  <TextField placeholder="Search integrations..." variant="outlined" size="small" fullWidth style={{maxWidth:300}}/>
                </Box>
              </Box>

              {/* Contact Details */}
              <Box style={{marginBottom:24,padding:'12px 16px',background:'#FAFAFA',borderRadius:8}}>
                <Typography style={{fontSize:'0.75rem',fontWeight:600,textTransform:'uppercase',color:'#4F5B60',marginBottom:12}}>PROPERTY IMPLEMENTATION CONTACT DETAILS</Typography>
                <Box style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
                  <TextField label="Contact Name" variant="outlined" size="small" fullWidth />
                  <TextField label="Contact Email" variant="outlined" size="small" fullWidth />
                  <TextField label="Contact Phone" variant="outlined" size="small" fullWidth />
                </Box>
              </Box>

              {/* Hotels List */}
              <Box style={{border:'1px solid #DDE1E2',borderRadius:8,overflow:'hidden'}}>
                {hotels.length === 0 ? (
                  <div style={{padding:'20px',textAlign:'center',color:'#AEB4BA'}}>
                    No hotels added yet. Search above, add manually, or upload from Excel.
                  </div>
                ) : (
                  hotels.map((h, i) => (
                    <div key={h.id}>
                      {i > 0 && <Divider/>}
                      <div style={{display:'flex',alignItems:'center',gap:12,padding:'10px 14px',background:i%2===0?'white':'#FAFAFA'}}>
                        <div style={{flex:1}}>
                          <Typography style={{fontWeight:600,fontSize:'0.875rem'}}>{h.name}</Typography>
                          <Typography style={{fontSize:'0.72rem',color:'#AEB4BA',marginTop:2}}>{h.address} · {h.rooms} rooms</Typography>
                        </div>
                        <Button size="small" style={{color:'#004948',textTransform:'none',fontWeight:600,fontSize:'0.8rem'}}>Edit</Button>
                      </div>
                    </div>
                  ))
                )}
              </Box>
            </Box>
          )}

          {activeSection === 'proposal' && accountSaved && (
            <Box style={{padding:24}}>
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

              {/* Actions */}
              <Box style={{display:'flex',gap:12,marginTop:20,paddingTop:20,borderTop:'1px solid #DDE1E2'}}>
                <Button variant="contained" color="primary" style={{textTransform:'none',fontWeight:600,paddingLeft:28,paddingRight:28}}
                  onClick={()=>setProposalAccepted(true)}>
                  ✓ Accept Proposal
                </Button>
                <Button variant="outlined" style={{textTransform:'none',fontWeight:500}}>
                  ✎ Request Changes
                </Button>
              </Box>

              {proposalAccepted && (
                <Box style={{display:'flex',alignItems:'center',gap:10,background:'#E8F5E9',borderRadius:6,padding:'14px 18px',marginTop:20}}>
                  <span style={{color:'#388C3F'}}><CheckCircleIcon/></span>
                  <Typography style={{color:'#28592C',fontWeight:600}}>Proposal accepted. Our team will reach out to begin implementation.</Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </div>
      )}

    </Box>
  )
}

// ───────────────────────────────────────────────────────────────────────────────
// External Header — stripped-down chrome for customer-facing experience
// ───────────────────────────────────────────────────────────────────────────────

function ExternalHeader({ userName, userEmail }: { userName?: string, userEmail?: string }) {
  const { logout } = useContext(AuthCtx)
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
        <Typography style={{color:'#fff',fontWeight:700,letterSpacing:3,fontSize:'0.95rem'}}>DUETTO</Typography>
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
          <Box style={{display:'flex',alignItems:'center',gap:10}}>
            <Box style={{
              width:28,height:28,borderRadius:'50%',background:'#006461',
              display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:'0.75rem',fontWeight:700,color:'#fff',
            }}>
              {userName.charAt(0).toUpperCase()}
            </Box>
            <Box style={{display:'flex',flexDirection:'column',lineHeight:1.2}}>
              <Typography style={{color:'#fff',fontSize:'0.8rem',fontWeight:600}}>{userName}</Typography>
              {userEmail && (
                <Typography style={{color:'rgba(255,255,255,0.45)',fontSize:'0.7rem'}}>{userEmail}</Typography>
              )}
            </Box>
            <Button
              size="small"
              onClick={logout}
              style={{
                color:'rgba(255,255,255,0.7)',
                textTransform:'none',
                fontSize:'0.78rem',
                fontWeight:500,
                marginLeft:4,
              }}
            >
              Sign out
            </Button>
          </Box>
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
