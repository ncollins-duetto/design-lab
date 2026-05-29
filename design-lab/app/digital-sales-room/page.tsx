'use client'

import { useState, useContext, createContext, ReactNode, useEffect, useRef, useMemo } from 'react'
import { Box, Typography, Button, Card, CardContent, CardActions, Divider, Grid, List, ListItem, ListItemIcon, ListItemText, TextField, Chip, Paper, Accordion, AccordionSummary, AccordionDetails, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, IconButton, Tooltip, makeStyles, useTheme } from '@material-ui/core'
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

const useStyles = makeStyles((theme) => ({
  authContainer: {
    minHeight: '100vh',
    background: theme.palette.background.default,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
  },
  authCard: {
    width: '100%',
    maxWidth: 440,
    padding: theme.spacing(3),
  },
  authLogo: {
    textAlign: 'center',
    color: theme.palette.primary.main,
    fontWeight: 700,
    letterSpacing: 3,
    marginBottom: theme.spacing(2),
    fontSize: '1.25rem',
  },
  phaseBar: {
    position: 'sticky',
    top: 0,
    zIndex: 1200,
    background: theme.palette.secondary.main,
    width: '100%',
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(1, 3),
    height: 40,
    borderBottom: `1px solid rgba(255,255,255,0.1)`,
  },
  stepIndicators: {
    display: 'flex',
    height: 56,
  },
  stepItem: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    padding: theme.spacing(0, 2),
    gap: theme.spacing(1.25),
  },
  appContainer: {
    display: 'flex',
    flex: 1,
    minHeight: 'calc(100vh - 96px)',
  },
  sidebar: {
    width: 240,
    flexShrink: 0,
    background: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
    position: 'sticky',
    top: 96,
    height: 'calc(100vh - 96px)',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    background: theme.palette.background.default,
    overflowY: 'auto',
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
  tableHeader: {
    background: theme.palette.background.paper,
    padding: theme.spacing(1.5, 2),
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
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      try { return JSON.parse(localStorage.getItem('dsr_user')||'null') } catch { return null }
    }
    return null
  })

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
      localStorage.setItem('dsr_user', JSON.stringify(u))
    }
    setUser(u)
  }

  const logout = () => {
    if (typeof window !== 'undefined') {
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
  const [vals, setVals] = useState({ email:'', password:'' })
  const [errs, setErrs] = useState<{email?:string, password?:string}>({})
  const [serverErr, setServerErr] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrs: typeof errs = {}
    if (!vals.email) newErrs.email = 'Required'
    if (!vals.password) newErrs.password = 'Required'
    if (Object.keys(newErrs).length) { setErrs(newErrs); return }
    const err = loginWithEmail(vals.email, vals.password)
    if (err) setServerErr(err)
  }

  return (
    <AuthShell title="Sign In" subtitle="Sign in to your Digital Sales Room account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <TextField label="Email" type="email" variant="outlined" fullWidth size="small"
            value={vals.email} onChange={e => { setVals(v=>({...v,email:e.target.value})); setErrs(r=>({...r,email:''})); }}
            error={!!errs.email} helperText={errs.email}/>
        </div>
        <div>
          <TextField label="Password" type="password" variant="outlined" fullWidth size="small"
            value={vals.password} onChange={e => { setVals(v=>({...v,password:e.target.value})); setErrs(r=>({...r,password:''})); }}
            error={!!errs.password} helperText={errs.password}/>
        </div>
        {serverErr && <p className="text-red-600 text-xs mt-2">{serverErr}</p>}
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
  const [vals, setVals] = useState({ name:'', email:'', password:'', confirm:'' })
  const [errs, setErrs] = useState<Record<string,string>>({})
  const [serverErr, setServerErr] = useState('')

  const validate = () => {
    const e: Record<string,string> = {}
    if (!vals.name) e.name = 'Required'
    if (!vals.email || !/\S+@\S+\.\S+/.test(vals.email)) e.email = 'Valid email required'
    if (!vals.password || vals.password.length < 8) e.password = 'Min 8 characters'
    if (vals.password !== vals.confirm) e.confirm = 'Passwords must match'
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
      <form onSubmit={handleSubmit} className="space-y-4">
        {[['name','Full Name','text'],['email','Email','email'],['password','Password','password'],['confirm','Confirm Password','password']].map(([k,l,t])=>(
          <div key={k}>
            <TextField label={l as string} type={t as string} variant="outlined" fullWidth size="small"
              value={vals[k as keyof typeof vals]} onChange={e => { setVals(v=>({...v,[k]:e.target.value})); setErrs(r=>({...r,[k]:''})); }}
              error={!!errs[k]} helperText={errs[k]}/>
          </div>
        ))}
        {serverErr && <p className="text-red-600 text-xs">{serverErr}</p>}
        <Button type="submit" variant="contained" color="primary" fullWidth
          style={{textTransform:'none',fontWeight:600,padding:'10px 0',marginTop:4}}>
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
  const phases = ['Digital Sales Room','Phase 2','Phase 3']
  const nextStepColors: Record<string, {bg: string, text: string}> = {
    account:  { bg:'#FFB90F', text:'#774700' },
    hotels:   { bg:'#FFB90F', text:'#774700' },
    proposal: { bg:'#52D9CE', text: theme.palette.primary.main },
    complete: { bg:'#388C3F', text:'#ffffff' },
  }
  const col = nextStep ? nextStepColors[nextStep.section] : null
  const isComplete = nextStep?.section === 'complete'

  return (
    <Box className={useStyles().phaseBar}>
      {/* Logo row */}
      <Box className={useStyles().logoRow}>
        <Typography style={{color:'white',fontWeight:700,letterSpacing:3,fontSize:'0.85rem'}}>DUETTO</Typography>
        <Box style={{display:'flex',alignItems:'center',gap:theme.spacing(2)}}>
          {nextStep && (
            <Box onClick={isComplete ? undefined : onNextStep}
              style={{display:'flex',alignItems:'center',gap:8,background:col?.bg,color:col?.text,
                padding:'4px 14px',borderRadius:20,cursor:isComplete?'default':'pointer',fontWeight:700,fontSize:'0.78rem',
                boxShadow:'0 2px 8px rgba(0,0,0,0.3)',transition:'opacity 0.15s',userSelect:'none'}}
              onMouseOver={e=>{ if(!isComplete) (e.currentTarget as HTMLElement).style.opacity='0.88'; }}
              onMouseOut={e=>(e.currentTarget as HTMLElement).style.opacity='1'}>
              {isComplete
                ? <span style={{fontSize:'0.9rem',marginRight:2}}>✓</span>
                : <><span style={{fontSize:'0.7rem',opacity:0.8,fontWeight:600,textTransform:'uppercase',letterSpacing:0.5}}>Next Step</span>
                   <span style={{width:1,height:12,background:col?.text,opacity:0.3}}/></>
              }
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
      <Box className={useStyles().stepIndicators}>
        {phases.map((label,i)=>{
          const isActive = i===0
          const isLast = i===phases.length-1
          return (
            <Box key={i} className={useStyles().stepItem} style={{
              background: isActive ? theme.palette.primary.main : 'rgba(255,255,255,0.06)',
            }}>
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

function DocumentStore() {
  return (
    <div className="p-6 max-w-7xl">
      <div className="mb-4">
        <Typography variant="h5" style={{fontWeight:700}}>Documents</Typography>
        <Typography variant="body2" style={{color:'#4F5B60',marginTop:4}}>
          All presentations and documents shared during your sales process.
        </Typography>
      </div>
      <Divider style={{marginBottom:28}}/>

      {DOC_SECTIONS.map(section => {
        const docs = MOCK_DOCS.filter(d => d.section === section.id)
        return (
          <div key={section.id} style={{marginBottom:32}}>
            <Typography style={{fontWeight:700,fontSize:'1rem',marginBottom:2}}>{section.label}</Typography>
            <Typography style={{fontSize:'0.8rem',color:'#4F5B60',marginBottom:10}}>{section.description}</Typography>
            <Paper elevation={0} style={{border:'1px solid #DDE1E2',borderRadius:8,overflow:'hidden'}}>
              {docs.map((doc, i) => {
                const isPdf = doc.type === 'pdf'
                return (
                  <div key={doc.id}>
                    {i > 0 && <Divider/>}
                    <div style={{display:'flex',alignItems:'center',gap:12,padding:'10px 14px',borderRadius:6,transition:'background 0.12s',cursor:'pointer'}}
                      onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='#F5F5F5'}
                      onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background='transparent'}>
                      <div style={{width:36,height:36,borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,
                        background: isPdf ? '#FDECEA' : '#FEF3EE'}}>
                        <span style={{fontSize:'0.6rem',fontWeight:800,letterSpacing:0.3,color: isPdf?'#D32F2F':'#D04A02'}}>
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
            </Paper>
          </div>
        )
      })}
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
// Main App
// ───────────────────────────────────────────────────────────────────────────────

function DigitalSalesRoomApp() {
  const { user } = useContext(AuthCtx)
  const [view, setView] = useState('landing')
  const [activeSection, setActiveSection] = useState('docs')
  const [accountSaved, setAccountSaved] = useState(false)
  const [proposalAccepted, setProposalAccepted] = useState(false)

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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <PhaseBar userName={user.name} nextStep={nextStep} onNextStep={()=>setActiveSection(nextStep.section)}/>
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-60 flex-shrink-0 bg-white border-r border-gray-300 sticky top-24 h-[calc(100vh-96px)] overflow-y-auto flex flex-col">
          <div className="px-4 pt-3 pb-2">
            <p className="text-xs text-gray-600 font-bold uppercase tracking-wider">Phase 1</p>
          </div>
          <hr />
          <List disablePadding className="pt-1">
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
                  button={!isLocked}
                  onClick={!isLocked ? () => setActiveSection(id) : undefined}
                  style={{
                    borderRadius: 6,
                    margin: '2px 8px',
                    background: isActive ? 'rgba(0,73,72,0.08)' : 'transparent',
                    opacity: isLocked ? 0.45 : 1,
                    cursor: isLocked ? 'not-allowed' : 'pointer',
                  }}
                >
                  <ListItemIcon style={{minWidth:36, color: isLocked ? '#AEB4BA' : isActive ? '#004948' : '#63696F'}}>
                    {isLocked ? <LockIcon /> : <Icon />}
                  </ListItemIcon>
                  <ListItemText primary={label}
                    primaryTypographyProps={{style:{fontWeight:isActive?600:400, color: isLocked?'#AEB4BA': isActive?'#004948':'#1C1C1C', fontSize:'0.875rem'}}}/>
                </ListItem>
              )
            })}
          </List>
        </div>

        {/* Content */}
        <div className="flex-1 bg-gray-50 overflow-y-auto">
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
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">Hotel Details</h2>
              <p className="text-gray-600 text-sm mb-4">Search for your properties or add them manually.</p>
              <hr className="mb-6" />
              <p className="text-gray-500">Hotel management coming soon...</p>
            </div>
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

              {/* Table */}
              <Box style={{overflowX:'auto',border:'1px solid #DDE1E2',borderRadius:8}}>
                <table style={{width:'100%',borderCollapse:'collapse',minWidth:700}}>
                  <thead>
                    <tr style={{background:'#F8F9FD'}}>
                      {['Hotel','Products','Cost / Room / Month','Annual Subscription','Implementation Fee'].map(h=>(
                        <th key={h} style={{padding:'12px 16px',textAlign:h.includes('Cost')||h.includes('Annual')||h.includes('Impl')?'right':'left',
                          fontSize:'0.72rem',fontWeight:700,textTransform:'uppercase',letterSpacing:0.5,color:'#4F5B60',
                          borderBottom:'2px solid #DDE1E2',whiteSpace:'nowrap'}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_PROPOSAL.lines.map((line,i)=>{
                      const fmt = (n: number) => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n)
                      return (
                        <tr key={line.id} style={{borderBottom:'1px solid #DDE1E2',background:i%2===0?'white':'#FAFAFA'}}>
                          <td style={{padding:'14px 16px'}}>
                            <Typography style={{fontWeight:600,fontSize:'0.875rem'}}>{line.hotel}</Typography>
                            <Typography style={{fontSize:'0.75rem',color:'#4F5B60'}}>{line.rooms} rooms</Typography>
                          </td>
                          <td style={{padding:'14px 16px'}}>
                            <Box style={{display:'flex',flexWrap:'wrap',gap:4}}>
                              {line.products.map(p=>(
                                <Box key={p} style={{padding:'2px 8px',borderRadius:4,fontSize:'0.7rem',fontWeight:700,background:(PRODUCT_COLORS[p]||{bg:'#E0F0EF'}).bg,color:(PRODUCT_COLORS[p]||{text:'#004948'}).text}}>{p}</Box>
                              ))}
                            </Box>
                          </td>
                          <td style={{padding:'14px 16px',textAlign:'right'}}>
                            <Typography style={{fontWeight:600,fontSize:'0.875rem',whiteSpace:'nowrap'}}>
                              {fmt(line.products.reduce((s,p)=>s+({GameChanger:8.5,ScoreBoard:3,BlockBuster:4,Advance:2.5,GameTime:2,HotStats:1.5}[p as keyof typeof PRODUCT_COLORS]||0),0))}
                            </Typography>
                          </td>
                          <td style={{padding:'14px 16px',textAlign:'right',fontWeight:600,fontSize:'0.875rem'}}>{fmt(line.annual)}</td>
                          <td style={{padding:'14px 16px',textAlign:'right',fontWeight:600,fontSize:'0.875rem'}}>{fmt(line.impl)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot>
                    <tr style={{background:'#FAFAFA',borderTop:'2px solid #DDE1E2'}}>
                      <td colSpan={3} style={{padding:'12px 16px',fontWeight:700}}>Total</td>
                      <td style={{padding:'12px 16px',textAlign:'right',fontWeight:700}}>
                        {new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(MOCK_PROPOSAL.lines.reduce((s,l)=>s+l.annual,0))}
                      </td>
                      <td style={{padding:'12px 16px',textAlign:'right',fontWeight:700}}>
                        {new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(MOCK_PROPOSAL.lines.reduce((s,l)=>s+l.impl,0))}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </Box>

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
        </div>
      </div>
    </div>
  )
}

export default function DigitalSalesRoomPage() {
  return (
    <AuthProvider>
      <DigitalSalesRoomApp />
    </AuthProvider>
  )
}
