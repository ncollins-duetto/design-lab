'use client'

import { StylesProvider, ThemeProvider, duettoTheme2026 } from '@duetto/duetto-components'
import { createGenerateClassName } from '@material-ui/core/styles'
import { Lato } from 'next/font/google'
import './globals.css'

const lato = Lato({ subsets: ['latin'], weight: ['400', '700'] })
const generateClassName = createGenerateClassName({ seed: 'dl' })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={lato.className} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <StylesProvider injectFirst generateClassName={generateClassName}>
          <ThemeProvider theme={duettoTheme2026}>
            {children}
          </ThemeProvider>
        </StylesProvider>
      </body>
    </html>
  )
}
