// Minimal in-memory mock of the Upstash REST protocol, for local journey tests only.
// Usage: node scripts/mock-kv.mjs [port]
import http from 'node:http'

const port = Number(process.argv[2] ?? 8079)
const store = new Map() // key -> string value (scalars) or Map (hashes)

const hash = (k) => {
  if (!store.has(k)) store.set(k, new Map())
  return store.get(k)
}

const commands = {
  get: (k) => store.get(k) ?? null,
  incr: (k) => {
    const n = Number(store.get(k) ?? 0) + 1
    store.set(k, String(n))
    return n
  },
  hget: (k, f) => hash(k).get(f) ?? null,
  hset: (k, ...pairs) => {
    const h = hash(k)
    for (let i = 0; i < pairs.length; i += 2) h.set(pairs[i], pairs[i + 1])
    return 'OK'
  },
  hgetall: (k) => {
    const h = store.get(k)
    if (!h) return null
    return [...h.entries()].flat()
  },
}

const server = http.createServer((req, res) => {
  let body = ''
  req.on('data', (c) => (body += c))
  req.on('end', () => {
    try {
      const command = JSON.parse(body)
      const name = String(command[0]).toLowerCase()
      const fn = commands[name]
      const result = fn ? fn(...command.slice(1)) : null
      console.log(JSON.stringify({ cmd: command, result }))
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ result }))
    } catch (e) {
      res.writeHead(400)
      res.end(JSON.stringify({ error: String(e) }))
    }
  })
})

server.listen(port, () => console.log(`mock-kv listening on :${port}`))
