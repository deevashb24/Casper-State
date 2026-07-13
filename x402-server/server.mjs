// CasperFlow x402 demo server — the "earn" side of the agent economy.
//
// A paid HTTP endpoint that follows the x402 flow:
//   1. GET /premium with no payment  -> HTTP 402 + Casper payment requirements
//   2. The client pays on Casper (a real CSPR transfer) and replays the request
//      with an X-PAYMENT header carrying the settlement tx hash
//   3. The server VERIFIES that transfer on-chain via CSPR.cloud, then returns
//      the premium content + an X-PAYMENT-RESPONSE receipt header
//
// Zero dependencies: Node 18+ (built-in http + global fetch). Run:
//   CSPR_CLOUD_KEY=xxx PAY_TO=<your-public-key-hex> node x402-server/server.mjs
//
// Use a DIFFERENT account for PAY_TO than the paying agent (no self-transfers).

import http from 'node:http'

const PORT = Number(process.env.PORT || 4021)
const NETWORK = process.env.NETWORK === 'mainnet' ? 'mainnet' : 'testnet'
const CHAIN = NETWORK === 'mainnet' ? 'casper:casper' : 'casper:casper-test'
const CSPR_CLOUD_KEY = process.env.CSPR_CLOUD_KEY || ''
const PAY_TO = (process.env.PAY_TO || '').trim()
const PRICE_MOTES = BigInt(process.env.PRICE_MOTES || '2500000000') // 2.5 CSPR
const API_BASE = NETWORK === 'mainnet' ? 'https://api.cspr.cloud' : 'https://api.testnet.cspr.cloud'

if (!PAY_TO) console.warn('⚠️  PAY_TO is not set — set it to a public key you control (e.g. one of your wallets).')
if (!CSPR_CLOUD_KEY) console.warn('⚠️  CSPR_CLOUD_KEY is not set — on-chain verification will fail.')

const cors = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'X-PAYMENT, PAYMENT-SIGNATURE, Content-Type')
  res.setHeader('Access-Control-Expose-Headers', 'X-PAYMENT-RESPONSE, PAYMENT-RESPONSE')
}
const b64encode = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64')
const b64decode = (s) => {
  try { return JSON.parse(Buffer.from(s, 'base64').toString('utf8')) } catch { return null }
}

// Poll CSPR.cloud for a transfer to PAY_TO whose deploy hash matches and whose
// amount covers the price. Returns true once found (or false after the timeout).
async function verifyOnChain(txHash, { timeoutMs = 75000 } = {}) {
  const want = String(txHash || '').replace(/^0x/, '').toLowerCase()
  if (!want || !CSPR_CLOUD_KEY || !PAY_TO) return false
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    try {
      const r = await fetch(`${API_BASE}/accounts/${PAY_TO}/transfers?page=1&page_size=100`, {
        headers: { authorization: CSPR_CLOUD_KEY, accept: 'application/json' },
      })
      if (r.ok) {
        const j = await r.json()
        const rows = j?.data ?? []
        for (const t of rows) {
          // Casper 2.0 indexes the hash as transaction_hash; 1.x as deploy_hash.
          const hash = String(t.transaction_hash ?? t.deploy_hash ?? '').toLowerCase()
          const amount = BigInt(t.amount ?? 0)
          if (hash === want && amount >= PRICE_MOTES) return true
        }
        console.log(`  …verifying: ${rows.length} transfers seen for PAY_TO, target not indexed yet`)
      } else {
        console.log(`  …verifying: CSPR.cloud HTTP ${r.status} (retrying)`)
      }
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 8000))
  }
  return false
}

const paymentRequirements = () => ({
  x402Version: 1,
  error: 'payment required',
  accepts: [
    {
      scheme: 'exact',
      network: CHAIN,
      maxAmountRequired: PRICE_MOTES.toString(),
      resource: '/premium',
      description: 'Premium CSPR market signal (CasperFlow x402 demo)',
      payTo: PAY_TO,
      asset: 'CSPR',
      mimeType: 'application/json',
    },
  ],
})

// The current listing being sold. A CasperFlow "Sell via x402" agent can POST
// new content to /publish; until then we serve a default demo signal.
let listing = null

const premiumContent = () =>
  listing ?? {
    resource: 'premium-signal',
    asset: 'CSPR',
    signal: 'BUY',
    confidence: 0.82,
    note: 'Paid signal delivered after on-chain settlement on Casper.',
    servedAt: new Date().toISOString(),
  }

const readBody = (req) =>
  new Promise((resolve) => {
    let data = ''
    req.on('data', (c) => (data += c))
    req.on('end', () => resolve(data))
    req.on('error', () => resolve(''))
  })

// Security: Rate Limiting & Input Sanitization
const rateLimitMap = new Map()
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 5

const checkRateLimit = (ip) => {
  const now = Date.now()
  let record = rateLimitMap.get(ip)
  if (!record) {
    record = { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS }
    rateLimitMap.set(ip, record)
    return true
  }
  if (now > record.resetAt) {
    record.count = 1
    record.resetAt = now + RATE_LIMIT_WINDOW_MS
    return true
  }
  if (record.count >= MAX_ATTEMPTS) {
    return false
  }
  record.count++
  return true
}

const sanitizeInput = (str) => {
  if (typeof str !== 'string') return str
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;')
}

const sanitizeObject = (obj) => {
  if (typeof obj === 'string') return sanitizeInput(obj)
  if (Array.isArray(obj)) return obj.map(sanitizeObject)
  if (typeof obj === 'object' && obj !== null) {
    const clean = {}
    for (const [k, v] of Object.entries(obj)) clean[sanitizeInput(k)] = sanitizeObject(v)
    return clean
  }
  return obj
}

const server = http.createServer(async (req, res) => {
  cors(res)
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end() }
  
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown'
  if (req.url === '/publish' || req.url === '/premium') {
    if (!checkRateLimit(ip)) {
      console.warn(`[SECURITY AUDIT] Rate limit exceeded for IP: ${ip}`)
      res.writeHead(429, { 'content-type': 'application/json' })
      return res.end(JSON.stringify({ error: 'Too many requests, please try again later.' }))
    }
  }

  const url = new URL(req.url, `http://localhost:${PORT}`)

  if (url.pathname === '/' ) {
    res.writeHead(200, { 'content-type': 'application/json' })
    return res.end(JSON.stringify({
      service: 'CasperFlow x402 demo server',
      network: CHAIN,
      payTo: PAY_TO || '(set PAY_TO)',
      price_motes: PRICE_MOTES.toString(),
      paidEndpoint: `http://localhost:${PORT}/premium`,
    }, null, 2))
  }

  // The "earn" side: a CasperFlow agent lists what it sells.
  if (url.pathname === '/publish' && req.method === 'POST') {
    const raw = await readBody(req)
    let parsed
    try { parsed = JSON.parse(raw) } catch { parsed = { content: raw } }
    
    // Security: Sanitize input
    parsed = sanitizeObject(parsed)
    console.log(`[SECURITY AUDIT] Sanitized input for /publish from IP: ${ip}`)

    listing = {
      resource: 'agent-listing',
      asset: 'CSPR',
      content: parsed?.content ?? parsed,
      seller: parsed?.seller ?? PAY_TO,
      listedAt: new Date().toISOString(),
    }
    console.log('↑ new listing published by a CasperFlow agent')
    res.writeHead(200, { 'content-type': 'application/json' })
    return res.end(JSON.stringify({ ok: true, listed: true, price_motes: PRICE_MOTES.toString() }))
  }

  if (url.pathname === '/premium') {
    const header = req.headers['x-payment'] || req.headers['payment-signature']
    if (!header) {
      console.log('→ 402 (no payment) for /premium')
      res.writeHead(402, { 'content-type': 'application/json' })
      return res.end(JSON.stringify(paymentRequirements()))
    }
    const payload = b64decode(Array.isArray(header) ? header[0] : header)
    const txHash = sanitizeInput(payload?.payload?.transaction || payload?.payload?.txHash || payload?.transaction || '')
    console.log(`→ payment presented, verifying tx ${String(txHash).slice(0, 16)}… on-chain`)
    const ok = await verifyOnChain(txHash)
    if (!ok) {
      console.warn(`[SECURITY AUDIT] Invalid payment verification for IP: ${ip}`)
      console.log('✗ payment NOT verified on-chain')
      res.writeHead(402, { 'content-type': 'application/json' })
      return res.end(JSON.stringify({ ...paymentRequirements(), error: 'payment not verified on-chain (yet)' }))
    }
    console.log(`[SECURITY AUDIT] Payment successfully verified for IP: ${ip}`)
    console.log('✓ payment verified — delivering premium content')
    res.setHeader('X-PAYMENT-RESPONSE', b64encode({ success: true, network: CHAIN, transaction: txHash }))
    res.writeHead(200, { 'content-type': 'application/json' })
    return res.end(JSON.stringify(premiumContent()))
  }

  res.writeHead(404, { 'content-type': 'application/json' })
  res.end(JSON.stringify({ error: 'not found' }))
})

server.listen(PORT, () => {
  console.log(`CasperFlow x402 demo server on http://localhost:${PORT}`)
  console.log(`  network:   ${CHAIN}`)
  console.log(`  pay to:    ${PAY_TO || '(set PAY_TO)'}`)
  console.log(`  price:     ${PRICE_MOTES} motes (${Number(PRICE_MOTES) / 1e9} CSPR)`)
  console.log(`  paid URL:  http://localhost:${PORT}/premium`)
})
