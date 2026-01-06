import fs from 'fs/promises';
import path from 'path';

const repoRoot = path.resolve(process.cwd(), '..');
const opsDir = path.join(repoRoot, 'publishing-engine', 'ops');
const templatePath = path.join(repoRoot, 'publishing-engine', 'templates', 'ops', 'weekly-brief.md');

function getIsoWeek(date) {
  const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = tmp.getUTCDay() || 7;
  tmp.setUTCDate(tmp.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((tmp - yearStart) / 86400000 + 1) / 7);
  return { year: tmp.getUTCFullYear(), week };
}

async function run() {
  const { year, week } = getIsoWeek(new Date());
  const weekLabel = `${year}-W${String(week).padStart(2, '0')}`;
  const outputDir = path.join(opsDir, 'weekly-briefs');
  const outputFile = path.join(outputDir, `${weekLabel}.md`);

  await fs.mkdir(outputDir, { recursive: true });

  try {
    await fs.access(outputFile);
    console.log(`Weekly brief already exists: ${outputFile}`);
    return;
  } catch {
    // Continue to create
  }

  const template = await fs.readFile(templatePath, 'utf8');
  const content = template.replace('{{week}}', weekLabel);
  await fs.writeFile(outputFile, content, 'utf8');
  console.log(`Created weekly brief: ${outputFile}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
