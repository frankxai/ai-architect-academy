/**
 * Agent Dashboard Page
 *
 * Main page for the agent orchestration system.
 */

import { AgentDashboard } from '@/components/agents/AgentDashboard';

export const metadata = {
  title: 'Agent System | AI Architect Academy',
  description: 'Execute specialized AI agents and multi-agent workflows',
};

export default function AgentsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <AgentDashboard />
    </div>
  );
}
