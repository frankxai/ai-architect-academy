import { readFileSync } from 'node:fs'

const sources = JSON.parse(readFileSync(new URL('../data/knowledge-sources.json', import.meta.url), 'utf8')).sources
const args = process.argv.slice(2)
const usage = 'Usage: node site/scripts/check-source-review.mjs [--as-of YYYY-MM-DD] [source-id ...]'

function dayNumber(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return NaN
  const ms = Date.parse(value + 'T00:00:00Z')
  return Number.isFinite(ms) && new Date(ms).toISOString().startsWith(value + 'T')
    ? ms / 86_400_000 : NaN
}

function report() {
  if (args.length === 1 && args[0] === '--help') {
    console.log(usage)
    return 0
  }
  const asOf = args[0] === '--as-of' ? args.splice(0, 2)[1] : new Date().toISOString().slice(0, 10)
  const today = dayNumber(asOf)
  const wanted = new Set(args)
  const rows = sources.filter(s => !wanted.size || wanted.has(s.id))
  if (!Number.isFinite(today) || (wanted.size && rows.length !== wanted.size)) {
    console.error(usage)
    return 2
  }

  let due = 0
  for (const source of rows) {
    const reviewed = dayNumber(source.metadataReviewedAt)
    if (!Number.isFinite(reviewed) || !Number.isInteger(source.reviewAfterDays) || source.reviewAfterDays <= 0) {
      console.error('Invalid review interval: ' + source.id)
      return 2
    }
    const deadline = reviewed + source.reviewAfterDays
    if (deadline > today) continue
    const date = new Date(deadline * 86_400_000).toISOString().slice(0, 10)
    console.log([source.id, date, source.url, source.practicePath || source.decisionStages.join(',')].join('\t'))
    due++
  }
  console.log(due + ' due / ' + rows.length + ' checked at ' + asOf + ' UTC')
  return due ? 1 : 0
}

process.exitCode = report()
