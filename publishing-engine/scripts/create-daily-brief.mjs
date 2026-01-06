import fs from 'fs/promises';
import path from 'path';

const repoRoot = path.resolve(process.cwd(), '..');
const opsDir = path.join(repoRoot, 'publishing-engine', 'ops');
const templatePath = path.join(repoRoot, 'publishing-engine', 'templates', 'ops', 'daily-brief.md');

const date = new Date().toISOString().slice(0, 10);
const outputDir = path.join(opsDir, 'daily-briefs');
const outputFile = path.join(outputDir, `${date}.md`);

async function run() {
  await fs.mkdir(outputDir, { recursive: true });

  try {
    await fs.access(outputFile);
    console.log(`Daily brief already exists: ${outputFile}`);
    return;
  } catch {
    // Continue to create
  }

  const template = await fs.readFile(templatePath, 'utf8');
  const content = template.replace('{{date}}', date);
  await fs.writeFile(outputFile, content, 'utf8');
  console.log(`Created daily brief: ${outputFile}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
