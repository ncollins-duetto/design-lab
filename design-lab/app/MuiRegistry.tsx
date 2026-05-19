'use client'

import { useState } from 'react'
import { useServerInsertedHTML } from 'next/navigation'
import { ServerStyleSheets } from '@material-ui/core/styles'

export default function MuiRegistry({ children }: { children: React.ReactNode }) {
  const [sheets] = useState(() => new ServerStyleSheets())

  useServerInsertedHTML(() => {
    const css = sheets.toString()
    if (!css) return null
    return <style id="jss-server-side" dangerouslySetInnerHTML={{ __html: css }} />
  })

  if (typeof window !== 'undefined') {
    return <>{children}</>
  }

  return <>{sheets.collect(children)}</>
}
