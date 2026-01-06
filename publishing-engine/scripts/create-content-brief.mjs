import fs from 'fs/promises';
import path from 'path';

const repoRoot = path.resolve(process.cwd(), '..');
const opsDir = path.join(repoRoot, 'publishing-engine', 'ops');
const templatePath = path.join(repoRoot, 'publishing-engine', 'templates', 'ops', 'editorial-brief.md');

function getArg(key) {
  const arg = process.argv.find((item) => item.startsWith(`${key}=`));
  return arg ? arg.split('=')[1] : null;
}

async function run() {
  const type = getArg('--type');
  const slug = getArg('--slug');

  if (!type || !slug) {
    console.error('Usage: npm run ops:brief -- --type=concept --slug=agentic-rag');
    process.exit(1);
  }

  const outputDir = path.join(opsDir, 'content-briefs');
  const outputFile = path.join(outputDir, `${slug}.md`);

  await fs.mkdir(outputDir, { recursive: true });

  try {
    await fs.access(outputFile);
    console.log(`Content brief already exists: ${outputFile}`);
    return;
  } catch {
    // Continue to create
  }

  const template = await fs.readFile(templatePath, 'utf8');
  const content = template
    .replace('{{slug}}', slug)
    .replace('Type (concept/guide/compare):', `Type (concept/guide/compare): ${type}`);

  await fs.writeFile(outputFile, content, 'utf8');
  console.log(`Created content brief: ${outputFile}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
