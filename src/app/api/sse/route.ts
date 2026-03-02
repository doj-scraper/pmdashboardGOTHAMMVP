import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected', timestamp: Date.now() })}\n\n`))

      // Send periodic heartbeat
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'heartbeat', timestamp: Date.now() })}\n\n`))
        } catch {
          clearInterval(heartbeat)
        }
      }, 30000)

      // Store in global for broadcasting updates
      if (!globalThis.sseClients) {
        globalThis.sseClients = new Set()
      }
      globalThis.sseClients.add(controller)

      // Clean up on close
      setTimeout(() => {
        clearInterval(heartbeat)
        globalThis.sseClients?.delete(controller)
        try {
          controller.close()
        } catch {}
      }, 5 * 60 * 1000) // 5 minute timeout
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  })
}

// Broadcast to all SSE clients
export function broadcastToSSEClients(data: any) {
  const message = `data: ${JSON.stringify(data)}\n\n`
  const encoder = new TextEncoder()
  
  if (globalThis.sseClients) {
    globalThis.sseClients.forEach((client: any) => {
      try {
        client.enqueue(encoder.encode(message))
      } catch {}
    })
  }
}
