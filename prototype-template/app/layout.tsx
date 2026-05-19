'use client'

import { StylesProvider, ThemeProvider, duettoTheme2026 } from '@duetto/duetto-components'
import { Lato } from 'next/font/google'
import './globals.css'

const lato = Lato({ subsets: ['latin'], weight: ['400', '700'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={lato.className}>
      <body>
        <StylesProvider injectFirst>
          <ThemeProvider theme={duettoTheme2026}>
            {children}
          </ThemeProvider>
        </StylesProvider>
      </body>
    </html>
  )
}
