import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, statSync } from 'fs'
import { join } from 'path'

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const pathArray = params.path || []
    let filePath = join(process.cwd(), 'public', 'standalone-apps', ...pathArray)

    // Check if it's a directory
    const stat = statSync(filePath)
    if (stat.isDirectory()) {
      filePath = join(filePath, 'index.html')
    }

    let content = readFileSync(filePath)
    const ext = filePath.split('.').pop() || 'html'

    // For HTML files, inject <base> tag to fix relative asset paths
    if (ext === 'html' && pathArray.length > 0) {
      const slug = pathArray[0]
      const basePath = `/standalone-apps/${slug}/`
      let html = content.toString()
      html = html.replace(
        /<head[^>]*>/i,
        (match) => `${match}\n    <base href="${basePath}">`
      )
      content = Buffer.from(html)
    }

    const contentTypes: Record<string, string> = {
      html: 'text/html',
      js: 'application/javascript',
      css: 'text/css',
      svg: 'image/svg+xml',
      png: 'image/png',
      json: 'application/json',
      ico: 'image/x-icon',
    }

    return new NextResponse(content, {
      headers: {
        'Content-Type': contentTypes[ext] || 'application/octet-stream',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (e) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}
