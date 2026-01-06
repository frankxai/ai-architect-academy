# Sync & Deployment Strategy: Open Core Monorepo

**Objective:** Manage a single repository (`ai-architect-academy`) that serves as both the Open Source Knowledge Base (OSS) and the Commercial SaaS Platform (`academy-platform`), ensuring efficient syncing and deployment.

## 1. Architectural Model: Monorepo with Path Filtering

We will use a **Single Repository (Monorepo)** approach.

*   **Root (`/`)**: Contains the Open Source content, patterns, and curriculum.
*   **Platform (`/academy-platform`)**: Contains the commercial Next.js application.

### Why this strategy?
1.  **Content-Code Unity:** The SaaS platform needs to read the Markdown files (`01-design-patterns/`, etc.) to render the curriculum. A Monorepo makes these files locally accessible during the build process without complex submodules or API calls.
2.  **Unified Contribution:** Community members contributing a new "Pattern" (Markdown) can also contribute the UI component (React) to render it in the same PR.
3.  **Simplified Governance:** One set of issues, one set of permissions.

---

## 2. Sync Strategy & Repository Management

### A. Repository Structure
```text
ai-architect-academy/
├── .github/                # Shared CI/CD workflows
├── 01-design-patterns/     # OSS Content (Knowledge Base)
├── 02-learning-paths/      # OSS Content (Curriculum)
├── academy-platform/       # SaaS Application (Next.js)
│   ├── src/                # App Code
│   └── package.json        # Platform Dependencies
└── legacy-saas-skeleton/   # Archived (Frozen)
```

### B. Synchronization Logic
*   **OSS Sync (GitHub):** The entire repo is synced to GitHub. The root `README.md` represents the OSS project.
*   **SaaS Sync (Vercel):** Vercel is connected to the **same GitHub repository** but is configured with a specific **Root Directory**.

---

## 3. Deployment Pipeline (CI/CD)

We define two distinct pipelines based on which files are modified in a Commit.

### Pipeline A: The Content Pipeline (OSS)
*   **Trigger:** Changes to `/**/*.md` (Markdown files in root).
*   **Action:** 
    1.  **Lint:** Check Markdown formatting and broken links.
    2.  **Deploy:** Updates the static GitHub Pages site (if applicable).
    3.  **Trigger SaaS Update:** Since the SaaS reads these files, a content change *should* trigger a SaaS redeploy.

### Pipeline B: The Platform Pipeline (SaaS)
*   **Trigger:** Changes to `academy-platform/**`.
*   **Action:**
    1.  **Build:** Runs `next build` inside `academy-platform`.
    2.  **Test:** Runs unit tests (`npm test`).
    3.  **Deploy:** Vercel automatically deploys to `app.ai-architect-academy.com`.

### Vercel Configuration (Crucial)
To prevent the SaaS from rebuilding when you only change a `README.md` that *doesn't* matter, we use Vercel's **Ignored Build Step**.

**Command:** `git diff --quiet HEAD^ HEAD -- academy-platform/ 01-design-patterns/ 02-learning-paths/`

*   If this command returns `1` (changes found), Vercel builds.
*   If `0`, Vercel skips the build.
*   *Note: We include the content folders in the watch path so the SaaS stays fresh.*

---

## 4. Branch Protection & Access Control

### Branch Rules (`main`)
*   **Require Pull Request:** No direct pushes to `main`.
*   **Require Status Checks:**
    *   `ci/platform-build`: Must pass (ensures SaaS doesn't break).
    *   `ci/content-lint`: Must pass (ensures Docs are valid).
*   **Review:** Require 1 approval for code changes.

### Access Control (RBAC)
*   **Admins (Frank):** Full access to Repository Settings, Vercel Production, and Secrets.
*   **Core Team:** Write access to Repo. Can merge PRs. No access to Vercel Env Vars.
*   **Community:** Read access. Can submit PRs from Forks.

---

## 5. Sync Conflict Resolution

Since `academy-platform` is just a folder, merge conflicts are handled via standard Git flow.

**Scenario:** Two professors edit the same "RAG Pattern" markdown file.
*   **Resolution:** Git will flag the conflict in the PR. The merger must manually resolve the line differences.

**Scenario:** A change to the OSS folder structure breaks the SaaS import script.
*   **Resolution:** The `ci/platform-build` check will fail on the PR. The contributor must update the SaaS data-fetching logic to match the new folder structure *before* the merge is allowed.

---

## 6. Implementation Checklist

1.  [ ] **Vercel Project Settings:**
    *   Root Directory: `academy-platform`
    *   Framework: Next.js
    *   Include Source Files: *Ensure Vercel has access to parent directories (monorepo default).*

2.  [ ] **GitHub Actions (`.github/workflows/ci.yml`):**
    *   Create a workflow that runs `npm run build` in `academy-platform` whenever code changes.

3.  [ ] **Content Ingestion:**
    *   Ensure `academy-platform` uses `fs.readFileSync` with `path.join(process.cwd(), '..')` to access the OSS content.
