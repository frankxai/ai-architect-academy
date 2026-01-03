import * as vscode from 'vscode';
import * as path from 'path';
import { promises as fs } from 'fs';

const ARC_CHAT_VIEW_ID = 'arcChat';
const ARC_KILO_VIEW_ID = 'arcKiloModes';
const ARC_ACADEMY_VIEW_ID = 'arcAcademy';
const ARC_VIEW_COMMAND = 'workbench.view.extension.arcSidebar';
const KILO_MODES_RELATIVE_PATH = 'data/kilo-modes.json';

interface UseCaseCache {
  syncedAt: string;
  source: string;
  items: Array<{ title: string; path: string; summary?: string }>;
}

interface KiloMode {
  slug: string;
  name: string;
  roleDefinition?: string;
  customInstructions?: string;
  academyIntegration?: {
    knowledgePoints: string[];
    certificationTrack: string;
    difficultyLevel: string;
    estimatedHours: number;
  };
}

interface AcademyProgress {
  userId: string;
  currentLevel: number;
  totalPoints: number;
  certificationTracks: Array<{
    name: string;
    progress: number;
    completedKnowledgePoints: string[];
    totalKnowledgePoints: number;
  }>;
  recentActivity: Array<{
    timestamp: string;
    action: string;
    knowledgePoints: string[];
    pointsEarned: number;
  }>;
}

class ArcChatProvider implements vscode.WebviewViewProvider {
  private view?: vscode.WebviewView;

  constructor(private readonly extensionUri: vscode.Uri) {}

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    this.view = webviewView;
    const { webview } = webviewView;
    webview.options = {
      enableScripts: true
    };
    webview.html = this.getHtml(webview);

    webview.onDidReceiveMessage(async (message: any) => {
      switch (message?.type) {
        case 'open-dashboard':
          await vscode.commands.executeCommand('arc.openDashboard');
          break;
        case 'sync-usecases':
          await vscode.commands.executeCommand('arc.syncUseCases');
          break;
        case 'open-proposal':
          await vscode.commands.executeCommand('arc.generateProposal');
          break;
        case 'open-readme':
          await this.openArcReadme();
          break;
        case 'send':
          if (typeof message.text === 'string') {
            this.handleChatMessage(message.text.trim());
          }
          break;
        default:
          break;
      }
    });
  }

  reveal(): void {
    this.view?.show?.(true);
  }

  append(entry: { role: 'user' | 'arc'; text: string }): void {
    this.view?.webview.postMessage({ type: 'append', entry });
  }

  private async openArcReadme(): Promise<void> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspaceFolder) {
      vscode.window.showWarningMessage('Open a workspace to view Arc documentation.');
      return;
    }

    const readmePath = path.join(workspaceFolder, 'Arc', 'README.md');
    try {
      const document = await vscode.workspace.openTextDocument(readmePath);
      await vscode.window.showTextDocument(document, { preview: false });
    } catch (error) {
      vscode.window.showErrorMessage(`Unable to open Arc README: ${String(error)}`);
    }
  }

  private handleChatMessage(rawInput: string): void {
    if (!rawInput) {
      return;
    }

    this.append({ role: 'user', text: rawInput });

    const reply = [
      `Arc Agent (preview) received: "${rawInput}".`,
      'Hook this chat into arc-cline or arc-kilo-suite to enable full conversations.',
      'Meanwhile, use the quick actions above to explore the Academy workflows.'
    ].join(' ');

    this.append({ role: 'arc', text: reply });
  }

  private getHtml(webview: vscode.Webview): string {
    const styles = `
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        margin: 0;
        padding: 0;
        background: #050a1a;
        color: #f5f7ff;
        display: flex;
        flex-direction: column;
        height: 100vh;
      }
      header {
        padding: 18px 20px 12px;
        background: linear-gradient(135deg, rgba(95, 140, 255, 0.22), rgba(74, 213, 192, 0.18));
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }
      header h1 {
        margin: 0;
        font-size: 18px;
      }
      header p {
        margin: 6px 0 0;
        font-size: 12px;
        opacity: 0.8;
      }
      .actions {
        display: flex;
        gap: 8px;
        margin-top: 12px;
      }
      .actions button {
        flex: 1;
        border: none;
        padding: 8px 10px;
        border-radius: 6px;
        background: rgba(21, 32, 55, 0.9);
        color: #f5f7ff;
        cursor: pointer;
        transition: background 120ms ease;
      }
      .actions button:hover {
        background: rgba(95, 140, 255, 0.4);
      }
      .chat {
        flex: 1;
        overflow-y: auto;
        padding: 16px 18px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .bubble {
        max-width: 85%;
        padding: 10px 12px;
        border-radius: 12px;
        line-height: 1.4;
        font-size: 13px;
      }
      .bubble.user {
        align-self: flex-end;
        background: rgba(95, 140, 255, 0.35);
      }
      .bubble.arc {
        align-self: flex-start;
        background: rgba(74, 213, 192, 0.25);
      }
      form {
        padding: 14px 18px 18px;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        display: flex;
        gap: 10px;
        background: rgba(5, 10, 26, 0.92);
      }
      input[type="text"] {
        flex: 1;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.18);
        background: #0b1220;
        color: #f5f7ff;
        padding: 8px 10px;
      }
      button.send {
        border: none;
        background: #5f8cff;
        color: #fff;
        padding: 8px 14px;
        border-radius: 8px;
        cursor: pointer;
      }
    `;

    return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline';" />
      <style>${styles}</style>
    </head>
    <body>
      <header>
        <h1>Arc Command Center</h1>
        <p>Preview chat. Connect arc-cline or arc-kilo-suite for full agent workflows.</p>
        <div class="actions">
          <button data-action="open-dashboard">Open Dashboard</button>
          <button data-action="sync-usecases">Sync Use Cases</button>
          <button data-action="open-proposal">Generate Proposal</button>
        </div>
      </header>
      <div class="chat" id="chat"></div>
      <form id="chatForm">
        <input type="text" id="chatInput" placeholder="Ask Arc..." />
        <button class="send" type="submit">Send</button>
      </form>
      <script>
        const vscode = acquireVsCodeApi();
        const chat = document.getElementById('chat');
        const form = document.getElementById('chatForm');
        const input = document.getElementById('chatInput');

        function appendBubble(role, text) {
          const el = document.createElement('div');
          el.classList.add('bubble', role);
          el.textContent = text;
          chat.appendChild(el);
          chat.scrollTop = chat.scrollHeight;
        }

        window.addEventListener('message', (event) => {
          const message = event.data;
          if (message?.type === 'append' && message.entry) {
            appendBubble(message.entry.role, message.entry.text);
          }
        });

        form.addEventListener('submit', (event) => {
          event.preventDefault();
          const value = input.value.trim();
          if (!value) {
            return;
          }
          vscode.postMessage({ type: 'send', text: value });
          input.value = '';
        });

        document.querySelectorAll('[data-action]').forEach((button) => {
          button.addEventListener('click', () => {
            const action = button.getAttribute('data-action');
            vscode.postMessage({ type: action });
          });
        });
      </script>
    </body>
  </html>`;
  }
}

class AcademyProgressProvider implements vscode.TreeDataProvider<AcademyProgressItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<AcademyProgressItem | undefined>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private progress: AcademyProgress | null = null;

  constructor() {
    this.loadProgress().catch(console.error);
  }

  refresh(): void {
    this.loadProgress().then(() => this._onDidChangeTreeData.fire(undefined));
  }

  getTreeItem(element: AcademyProgressItem): vscode.TreeItem {
    return element;
  }

  getChildren(): vscode.ProviderResult<AcademyProgressItem[]> {
    if (!this.progress) {
      return [new AcademyProgressItem('Loading Academy progress...', 'loading')];
    }

    const items = [
      new AcademyProgressItem(
        `Level ${this.progress.currentLevel} - ${this.progress.totalPoints} points`,
        'level',
        this.progress
      ),
      ...this.progress.certificationTracks.map(track =>
        new AcademyProgressItem(
          `${track.name}: ${track.progress}%`,
          'certification',
          track
        )
      ),
      new AcademyProgressItem(
        `${this.progress.recentActivity.length} recent activities`,
        'activity',
        this.progress.recentActivity
      )
    ];

    return items;
  }

  private async loadProgress(): Promise<void> {
    // TODO: Implement actual Academy API integration
    this.progress = {
      userId: 'current-user',
      currentLevel: 1,
      totalPoints: 150,
      certificationTracks: [
        {
          name: 'AI Core Architect',
          progress: 15,
          completedKnowledgePoints: ['ai-fundamentals'],
          totalKnowledgePoints: 25
        },
        {
          name: 'GenAI Architect',
          progress: 5,
          completedKnowledgePoints: [],
          totalKnowledgePoints: 20
        }
      ],
      recentActivity: [
        {
          timestamp: new Date().toISOString(),
          action: 'Completed RAG pattern implementation',
          knowledgePoints: ['rag-patterns', 'vector-databases'],
          pointsEarned: 50
        }
      ]
    };
  }
}

class AcademyProgressItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    private readonly type: string,
    public readonly data?: any
  ) {
    super(label);
    this.contextValue = type;
    this.tooltip = this.getTooltip();
    this.iconPath = this.getIcon();
    
    if (type === 'certification') {
      this.command = {
        command: 'arc.academyProgress',
        title: 'View Academy Progress',
        arguments: [data]
      };
    }
  }

  private getTooltip(): string {
    switch (this.type) {
      case 'level':
        return 'Current Academy level and points';
      case 'certification':
        return `Certification track: ${this.data.name}`;
      case 'activity':
        return 'Recent Academy activities';
      default:
        return '';
    }
  }

  private getIcon(): vscode.ThemeIcon {
    switch (this.type) {
      case 'level':
        return new vscode.ThemeIcon('star');
      case 'certification':
        return new vscode.ThemeIcon('checklist');
      case 'activity':
        return new vscode.ThemeIcon('history');
      default:
        return new vscode.ThemeIcon('info');
    }
  }
}

class KiloModeItem extends vscode.TreeItem {
  constructor(
    public readonly mode: KiloMode
  ) {
    super(mode.name, vscode.TreeItemCollapsibleState.None);
    this.contextValue = 'kilo-mode';
    this.tooltip = mode.roleDefinition || '';
    this.description = mode.slug;
    this.command = {
      command: 'arc.kiloModes.open',
      title: 'Open Kilo Mode',
      arguments: [mode]
    };
  }
}

class KiloModesProvider implements vscode.TreeDataProvider<KiloModeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<KiloModeItem | undefined>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private modes: KiloMode[] = [];

  constructor(private readonly extensionPath: string) {
    this.loadModes().catch((error) => {
      console.error('[Arc] Failed to load Kilo modes', error);
    });
  }

  refresh(): void {
    this.loadModes().then(() => this._onDidChangeTreeData.fire(undefined));
  }

  getTreeItem(element: KiloModeItem): vscode.TreeItem {
    return element;
  }

  getChildren(): vscode.ProviderResult<KiloModeItem[]> {
    if (this.modes.length === 0) {
      return [new KiloModeItem({ slug: 'loading', name: 'No Kilo modes found. Run Arc: Refresh Kilo Modes to reload.' })];
    }

    return this.modes.map((mode) => new KiloModeItem(mode));
  }

  private async loadModes(): Promise<void> {
    try {
      const dataPath = path.join(this.extensionPath, KILO_MODES_RELATIVE_PATH);
      const raw = await fs.readFile(dataPath, 'utf-8');
      const parsed = JSON.parse(raw);
      const customModes: KiloMode[] = parsed?.customModes ?? [];
      this.modes = customModes.filter((mode) => mode?.name && mode?.slug);
    } catch (error) {
      this.modes = [];
      vscode.window.showErrorMessage(`Arc could not load Kilo modes: ${String(error)}`);
    }
  }
}

export async function activate(context: vscode.ExtensionContext) {
  const chatProvider = new ArcChatProvider(context.extensionUri);
  const kiloProvider = new KiloModesProvider(context.extensionPath);
  const academyProvider = new AcademyProgressProvider();

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(ARC_CHAT_VIEW_ID, chatProvider),
    vscode.window.registerTreeDataProvider(ARC_KILO_VIEW_ID, kiloProvider),
    vscode.window.registerTreeDataProvider(ARC_ACADEMY_VIEW_ID, academyProvider)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('arc.openDashboard', async () => {
      const dashboardUrl = getConfig<string>('arc.dashboardUrl', 'http://localhost:3000');
      try {
        await vscode.env.openExternal(vscode.Uri.parse(dashboardUrl));
      } catch (error) {
        vscode.window.showErrorMessage(`Unable to open dashboard: ${String(error)}`);
      }
    }),
    vscode.commands.registerCommand('arc.showPanel', async () => {
      await vscode.commands.executeCommand(ARC_VIEW_COMMAND);
      chatProvider.reveal();
    }),
    vscode.commands.registerCommand('arc.syncUseCases', async () => {
      const workspaceFolder = getWorkspaceFolder();
      if (!workspaceFolder) {
        vscode.window.showWarningMessage('Open a workspace to sync use cases.');
        return;
      }

      const cacheRelative = getConfig<string>('arc.useCaseCache', '.aia/usecases.json');
      const cachePath = path.join(workspaceFolder, cacheRelative);
      const cacheDir = path.dirname(cachePath);

      await fs.mkdir(cacheDir, { recursive: true });

      const payload: UseCaseCache = {
        syncedAt: new Date().toISOString(),
        source: getConfig('arc.dashboardUrl', 'http://localhost:3000'),
        items: await collectUseCases(workspaceFolder)
      };

      await fs.writeFile(cachePath, JSON.stringify(payload, null, 2));
      vscode.window.showInformationMessage(`Synced ${payload.items.length} use cases to ${cacheRelative}.`);
    }),
    vscode.commands.registerCommand('arc.generateProposal', async () => {
      const workspaceFolder = getWorkspaceFolder();
      if (!workspaceFolder) {
        vscode.window.showWarningMessage('Open a workspace to generate proposals.');
        return;
      }

      const templatesPath = path.resolve(workspaceFolder, getConfig('arc.templatesPath', '../'));
      const proposalTemplates = await discoverTemplates(templatesPath);
      if (proposalTemplates.length === 0) {
        vscode.window.showWarningMessage('No proposal templates found. Update arc.templatesPath in settings.');
        return;
      }

      const choice = await vscode.window.showQuickPick(
        proposalTemplates.map((template) => ({
          label: template.name,
          detail: template.relative
        })),
        {
          placeHolder: 'Select a template to base the proposal on'
        }
      );

      if (!choice) {
        return;
      }

      const selected = proposalTemplates.find((template) => template.name === choice.label);
      if (!selected) {
        vscode.window.showErrorMessage('Template selection failed.');
        return;
      }

      const templateContent = await fs.readFile(selected.fullPath, 'utf-8');
      const proposalsDir = path.join(workspaceFolder, 'proposals');
      await fs.mkdir(proposalsDir, { recursive: true });
      const slug = choice.label.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
      const fileName = `${slug}-${Date.now()}.md`;
      const targetPath = path.join(proposalsDir, fileName);
      await fs.writeFile(targetPath, templateContent);

      const document = await vscode.workspace.openTextDocument(targetPath);
      await vscode.window.showTextDocument(document);
      vscode.window.showInformationMessage(`Proposal created at proposals/${fileName}.`);
    }),
    vscode.commands.registerCommand('arc.kiloModes.refresh', () => kiloProvider.refresh()),
    vscode.commands.registerCommand('arc.kiloModes.open', (mode: KiloMode) => {
      if (!mode) {
        return;
      }

      const panel = vscode.window.createWebviewPanel(
        'arcKiloModeDetails',
        `Arc Kilo Suite · ${mode.name}`,
        vscode.ViewColumn.Beside,
        { enableScripts: true }
      );
      panel.webview.html = getKiloModePanelHtml(mode);
    }),
    vscode.commands.registerCommand('arc.academyProgress', async () => {
      const panel = vscode.window.createWebviewPanel(
        'arcAcademyProgress',
        'Academy Progress',
        vscode.ViewColumn.Beside,
        { enableScripts: true }
      );
      
      const progress = await academyProvider.getChildren() || [];
      panel.webview.html = getAcademyProgressHtml(progress);
    }),
    vscode.commands.registerCommand('arc.linkKnowledge', async () => {
      const workspaceFolder = getWorkspaceFolder();
      if (!workspaceFolder) {
        vscode.window.showWarningMessage('Open a workspace to link knowledge points.');
        return;
      }

      const knowledgePoints = [
        'ai-fundamentals',
        'rag-patterns',
        'agent-design',
        'governance',
        'mlops'
      ];

      const selected = await vscode.window.showQuickPick(
        knowledgePoints.map(kp => ({ label: kp, detail: `Link current work to ${kp}` })),
        {
          canPickMany: true,
          placeHolder: 'Select knowledge points to link'
        }
      );

      if (selected && selected.length > 0) {
        vscode.window.showInformationMessage(
          `Linked to knowledge points: ${selected.map(s => s.label).join(', ')}`
        );
        
        // TODO: Implement actual knowledge point linking
        // This would update the Academy API with the linkage
      }
    }),
    vscode.commands.registerCommand('arcKiloSuite.startTask', async (task?: any) => {
      // Integration point for Arc Kilo Suite
      const taskDescription = task?.description || 'Academy workflow task';
      
      vscode.window.showInformationMessage(
        `Arc Kilo Suite: Starting Academy task - ${taskDescription}`
      );
      
      // TODO: Implement actual Arc Kilo Suite integration
      // This would call the namespaced Kilo Suite commands
    })
  );

  vscode.window.showInformationMessage(
    'Arc ready: Academy integration active. Use the sidebar to explore enhanced workflows.'
  );
}

export function deactivate() {
  // no-op for now
}

function getWorkspaceFolder(): string | undefined {
  const [first] = vscode.workspace.workspaceFolders ?? [];
  return first?.uri.fsPath;
}

function getConfig<T>(key: string, fallback: T): T {
  return vscode.workspace.getConfiguration().get<T>(key) ?? fallback;
}

async function collectUseCases(workspaceFolder: string): Promise<UseCaseCache['items']> {
  const results: Array<UseCaseCache['items'][number]> = [];
  const lookupDirs = [
    path.join(workspaceFolder, '05-projects'),
    path.join(workspaceFolder, '01-design-patterns')
  ];

  for (const dir of lookupDirs) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isFile() && entry.name.endsWith('.md')) {
          const fullPath = path.join(dir, entry.name);
          results.push({
            title: entry.name.replace('.md', ''),
            path: path.relative(workspaceFolder, fullPath)
          });
        }
      }
    } catch {
      // optional directory; ignore if missing
    }
  }

  return results;
}

async function discoverTemplates(rootPath: string): Promise<Array<{ name: string; fullPath: string; relative: string }>> {
  const results: Array<{ name: string; fullPath: string; relative: string }> = [];
  const templateRoots = [
    path.join(rootPath, '09-articles', 'templates'),
    path.join(rootPath, 'process'),
    path.join(rootPath, '02-learning-paths')
  ];

  for (const templateRoot of templateRoots) {
    try {
      const entries = await fs.readdir(templateRoot, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isFile() && entry.name.endsWith('.md')) {
          const fullPath = path.join(templateRoot, entry.name);
          results.push({
            name: entry.name.replace('.md', ''),
            fullPath,
            relative: path.relative(rootPath, fullPath)
          });
        }
      }
    } catch {
      // optional directory; ignore if missing
    }
  }

  return results;
}

function getKiloModePanelHtml(mode: KiloMode): string {
  const styles = `
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #050a1a;
      color: #f5f7ff;
      margin: 0;
      padding: 24px;
      line-height: 1.6;
    }
    h1 {
      margin-top: 0;
      font-size: 24px;
    }
    h2 {
      font-size: 16px;
      margin-top: 24px;
    }
    pre {
      white-space: pre-wrap;
      background: rgba(21, 32, 55, 0.85);
      padding: 16px;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    .academy-integration {
      background: rgba(74, 213, 192, 0.1);
      border: 1px solid rgba(74, 213, 192, 0.3);
      border-radius: 8px;
      padding: 16px;
      margin-top: 16px;
    }
  `;

  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline';" />
      <style>${styles}</style>
    </head>
    <body>
      <h1>${mode.name}</h1>
      <p><strong>Slug:</strong> ${mode.slug}</p>
      ${mode.roleDefinition ? `<h2>Role Definition</h2><pre>${mode.roleDefinition}</pre>` : ''}
      ${mode.customInstructions ? `<h2>Custom Instructions</h2><pre>${mode.customInstructions}</pre>` : ''}
      ${mode.academyIntegration ? `
        <div class="academy-integration">
          <h2>Academy Integration</h2>
          <p><strong>Certification Track:</strong> ${mode.academyIntegration.certificationTrack}</p>
          <p><strong>Knowledge Points:</strong> ${mode.academyIntegration.knowledgePoints.join(', ')}</p>
          <p><strong>Difficulty:</strong> ${mode.academyIntegration.difficultyLevel}</p>
          <p><strong>Estimated Hours:</strong> ${mode.academyIntegration.estimatedHours}</p>
        </div>
      ` : ''}
      <p style="margin-top:24px;">
        Integrate this mode with Arc Kilo Suite to unlock autonomous Academy builds.
        This mode is optimized for ${mode.academyIntegration?.certificationTrack || 'general'} certification track.
      </p>
    </body>
  </html>`;
}

function getAcademyProgressHtml(progressItems: any[]): string {
  const styles = `
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #050a1a;
      color: #f5f7ff;
      margin: 0;
      padding: 24px;
      line-height: 1.6;
    }
    .progress-card {
      background: rgba(74, 213, 192, 0.1);
      border: 1px solid rgba(74, 213, 192, 0.3);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 16px;
    }
    .certification-track {
      background: rgba(95, 140, 255, 0.1);
      border: 1px solid rgba(95, 140, 255, 0.3);
      border-radius: 8px;
      padding: 16px;
      margin: 12px 0;
    }
    .progress-bar {
      width: 100%;
      height: 8px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      overflow: hidden;
      margin: 8px 0;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #4ad5c0, #5f8cff);
      border-radius: 4px;
      transition: width 0.3s ease;
    }
  `;

  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline';" />
      <style>${styles}</style>
    </head>
    <body>
      <h1>Academy Progress</h1>
      <div class="progress-card">
        <h2>Current Status</h2>
        <p>Level 1 • 150/1000 points</p>
        <div class="progress-bar">
          <div class="progress-fill" style="width: 15%"></div>
        </div>
        <p>15% towards Level 2</p>
      </div>
      
      <h2>Certification Tracks</h2>
      <div class="certification-track">
        <h3>AI Core Architect</h3>
        <p>1/25 knowledge points completed</p>
        <div class="progress-bar">
          <div class="progress-fill" style="width: 4%"></div>
        </div>
      </div>
      
      <div class="certification-track">
        <h3>GenAI Architect</h3>
        <p>0/20 knowledge points completed</p>
        <div class="progress-bar">
          <div class="progress-fill" style="width: 0%"></div>
        </div>
      </div>
      
      <p style="margin-top:24px; opacity: 0.8;">
        Complete Academy tasks and link knowledge points to advance your certification progress.
      </p>
    </body>
  </html>`;
}
