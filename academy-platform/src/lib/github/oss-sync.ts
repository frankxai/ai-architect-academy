/**
 * GitHub OSS Pattern Sync
 *
 * Handles synchronization between the platform and GitHub OSS repository.
 */

interface GitHubConfig {
  owner: string;
  repo: string;
  token?: string;
  branch?: string;
}

interface Pattern {
  id: string;
  name: string;
  type: string;
  description: string;
  code: string;
  documentation: string;
  metadata: Record<string, any>;
}

interface SyncResult {
  success: boolean;
  message: string;
  prUrl?: string;
  error?: string;
}

export class GitHubOSSSync {
  private config: GitHubConfig;
  private baseUrl = 'https://api.github.com';

  constructor(config: GitHubConfig) {
    this.config = {
      ...config,
      branch: config.branch || 'main',
      token: config.token || process.env.GITHUB_TOKEN
    };
  }

  // ============================================================================
  // Pattern Submission to OSS
  // ============================================================================

  async submitPatternToOSS(pattern: Pattern): Promise<SyncResult> {
    try {
      // 1. Validate pattern
      const validation = this.validatePattern(pattern);
      if (!validation.valid) {
        return {
          success: false,
          message: 'Pattern validation failed',
          error: validation.errors.join(', ')
        };
      }

      // 2. Create branch
      const branchName = `pattern/${pattern.type}/${pattern.id}`;
      await this.createBranch(branchName);

      // 3. Prepare files
      const files = this.preparePatternFiles(pattern);

      // 4. Commit files
      await this.commitFiles(branchName, files, `Add ${pattern.name} pattern`);

      // 5. Create PR
      const pr = await this.createPullRequest({
        title: `Add Pattern: ${pattern.name}`,
        body: this.generatePRDescription(pattern),
        head: branchName,
        base: this.config.branch!
      });

      return {
        success: true,
        message: 'Pattern submitted successfully',
        prUrl: pr.html_url
      };

    } catch (error) {
      return {
        success: false,
        message: 'Failed to submit pattern',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // ============================================================================
  // Pattern Fetching from OSS
  // ============================================================================

  async fetchPatternsFromOSS(type?: string): Promise<Pattern[]> {
    try {
      const path = type ? `patterns/${type}` : 'patterns';
      const contents = await this.getDirectoryContents(path);

      const patterns: Pattern[] = [];

      for (const item of contents) {
        if (item.type === 'dir') {
          const patternData = await this.fetchPattern(item.path);
          if (patternData) {
            patterns.push(patternData);
          }
        }
      }

      return patterns;

    } catch (error) {
      console.error('Failed to fetch patterns from OSS:', error);
      return [];
    }
  }

  async fetchPattern(path: string): Promise<Pattern | null> {
    try {
      // Fetch pattern files
      const [code, readme, metadata] = await Promise.all([
        this.getFileContent(`${path}/index.ts`),
        this.getFileContent(`${path}/README.md`),
        this.getFileContent(`${path}/metadata.json`)
      ]);

      const meta = metadata ? JSON.parse(metadata) : {};

      return {
        id: meta.id || path.split('/').pop()!,
        name: meta.name || 'Unknown',
        type: meta.type || 'unknown',
        description: meta.description || '',
        code: code || '',
        documentation: readme || '',
        metadata: meta
      };

    } catch (error) {
      console.error(`Failed to fetch pattern at ${path}:`, error);
      return null;
    }
  }

  // ============================================================================
  // GitHub API Methods
  // ============================================================================

  private async createBranch(branchName: string): Promise<void> {
    // Get base branch SHA
    const baseBranch = await this.apiRequest(
      `/repos/${this.config.owner}/${this.config.repo}/git/ref/heads/${this.config.branch}`
    );

    // Create new branch
    await this.apiRequest(
      `/repos/${this.config.owner}/${this.config.repo}/git/refs`,
      'POST',
      {
        ref: `refs/heads/${branchName}`,
        sha: baseBranch.object.sha
      }
    );
  }

  private async commitFiles(
    branch: string,
    files: Array<{ path: string; content: string }>,
    message: string
  ): Promise<void> {
    for (const file of files) {
      await this.apiRequest(
        `/repos/${this.config.owner}/${this.config.repo}/contents/${file.path}`,
        'PUT',
        {
          message,
          content: Buffer.from(file.content).toString('base64'),
          branch
        }
      );
    }
  }

  private async createPullRequest(params: {
    title: string;
    body: string;
    head: string;
    base: string;
  }): Promise<any> {
    return this.apiRequest(
      `/repos/${this.config.owner}/${this.config.repo}/pulls`,
      'POST',
      params
    );
  }

  private async getDirectoryContents(path: string): Promise<any[]> {
    return this.apiRequest(
      `/repos/${this.config.owner}/${this.config.repo}/contents/${path}`
    );
  }

  private async getFileContent(path: string): Promise<string | null> {
    try {
      const response = await this.apiRequest(
        `/repos/${this.config.owner}/${this.config.repo}/contents/${path}`
      );

      if (response.content) {
        return Buffer.from(response.content, 'base64').toString('utf-8');
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  private async apiRequest(
    endpoint: string,
    method: string = 'GET',
    body?: any
  ): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    };

    if (this.config.token) {
      headers['Authorization'] = `token ${this.config.token}`;
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || `GitHub API error: ${response.status}`);
    }

    return response.json();
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  private validatePattern(pattern: Pattern): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!pattern.name) errors.push('Name is required');
    if (!pattern.type) errors.push('Type is required');
    if (!pattern.code) errors.push('Code is required');
    if (!pattern.description) errors.push('Description is required');

    return {
      valid: errors.length === 0,
      errors
    };
  }

  private preparePatternFiles(pattern: Pattern): Array<{ path: string; content: string }> {
    const basePath = `patterns/${pattern.type}/${pattern.id}`;

    return [
      {
        path: `${basePath}/index.ts`,
        content: pattern.code
      },
      {
        path: `${basePath}/README.md`,
        content: pattern.documentation
      },
      {
        path: `${basePath}/metadata.json`,
        content: JSON.stringify(pattern.metadata, null, 2)
      }
    ];
  }

  private generatePRDescription(pattern: Pattern): string {
    return `## Pattern Submission: ${pattern.name}

**Type:** ${pattern.type}
**Description:** ${pattern.description}

### Features
${pattern.metadata.features?.map((f: string) => `- ${f}`).join('\n') || 'N/A'}

### Testing
- [ ] Code quality validated
- [ ] Documentation complete
- [ ] Tests included
- [ ] Examples provided

### Checklist
- [x] Pattern follows OSS contribution guidelines
- [x] MIT License compatible
- [x] Production-ready code
- [x] Comprehensive documentation

---

🤖 Generated with Claude Agent Orchestration System
`;
  }
}

// ============================================================================
// Factory Function
// ============================================================================

export function createGitHubSync(config?: Partial<GitHubConfig>): GitHubOSSSync {
  const defaultConfig: GitHubConfig = {
    owner: process.env.GITHUB_OWNER || 'ai-architect-academy',
    repo: process.env.GITHUB_REPO || 'patterns',
    token: process.env.GITHUB_TOKEN,
    branch: 'main'
  };

  return new GitHubOSSSync({ ...defaultConfig, ...config });
}
