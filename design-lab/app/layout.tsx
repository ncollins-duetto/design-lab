'use client'

import { StylesProvider, ThemeProvider, duettoTheme2026 } from '@duetto/duetto-components'
import { createGenerateClassName } from '@material-ui/styles'
import MuiRegistry from './MuiRegistry'
import './globals.css'

const generateClassName = createGenerateClassName({ seed: 'dl' })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <MuiRegistry>
          <StylesProvider injectFirst generateClassName={generateClassName}>
            <ThemeProvider theme={duettoTheme2026}>
              {children}
            </ThemeProvider>
          </StylesProvider>
        </MuiRegistry>
      </body>
    </html>
  )
}
