/**
 * Claude Agent Orchestrator
 *
 * Central orchestration system for multi-agent workflows using Claude SDK.
 * Handles agent composition, task distribution, and result aggregation.
 */

import Anthropic from '@anthropic-ai/sdk';

// ============================================================================
// Types & Interfaces
// ============================================================================

export type AgentProvider = 'claude-3-5-sonnet' | 'claude-3-5-haiku' | 'claude-3-opus';

export interface AgentConfig {
  name: string;
  provider: AgentProvider;
  systemPrompt: string;
  temperature?: number;
  maxTokens?: number;
  tools?: AnthropicTool[];
}

export interface AnthropicTool {
  name: string;
  description: string;
  input_schema: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface AgentTask {
  id: string;
  agentName: string;
  prompt: string;
  context?: Record<string, any>;
  dependencies?: string[]; // IDs of tasks that must complete first
}

export interface AgentResult {
  taskId: string;
  agentName: string;
  success: boolean;
  output: string;
  metadata?: Record<string, any>;
  toolUses?: ToolUse[];
  error?: string;
  startTime: Date;
  endTime: Date;
  durationMs: number;
}

export interface ToolUse {
  name: string;
  input: any;
  output?: any;
}

export interface WorkflowConfig {
  name: string;
  description: string;
  tasks: AgentTask[];
  agents: AgentConfig[];
}

export interface WorkflowResult {
  workflowName: string;
  success: boolean;
  results: AgentResult[];
  totalDurationMs: number;
  startTime: Date;
  endTime: Date;
  error?: string;
}

// ============================================================================
// Claude Orchestrator Class
// ============================================================================

export class ClaudeOrchestrator {
  private client: Anthropic;
  private agents: Map<string, AgentConfig>;
  private activeWorkflows: Map<string, WorkflowResult>;

  constructor(apiKey?: string) {
    this.client = new Anthropic({
      apiKey: apiKey || process.env.ANTHROPIC_API_KEY,
    });
    this.agents = new Map();
    this.activeWorkflows = new Map();
  }

  // ============================================================================
  // Agent Registration
  // ============================================================================

  registerAgent(config: AgentConfig): void {
    this.agents.set(config.name, config);
  }

  registerAgents(configs: AgentConfig[]): void {
    configs.forEach(config => this.registerAgent(config));
  }

  getAgent(name: string): AgentConfig | undefined {
    return this.agents.get(name);
  }

  listAgents(): AgentConfig[] {
    return Array.from(this.agents.values());
  }

  // ============================================================================
  // Single Agent Execution
  // ============================================================================

  async executeAgent(
    agentName: string,
    prompt: string,
    context?: Record<string, any>
  ): Promise<AgentResult> {
    const startTime = new Date();
    const taskId = `${agentName}-${Date.now()}`;

    try {
      const agent = this.agents.get(agentName);
      if (!agent) {
        throw new Error(`Agent "${agentName}" not found. Register it first.`);
      }

      // Build messages with context
      const messages: Anthropic.MessageParam[] = [
        {
          role: 'user',
          content: context
            ? `Context: ${JSON.stringify(context, null, 2)}\n\nTask: ${prompt}`
            : prompt
        }
      ];

      // Execute with Claude SDK
      const response = await this.client.messages.create({
        model: agent.provider,
        max_tokens: agent.maxTokens || 4096,
        temperature: agent.temperature || 0.7,
        system: agent.systemPrompt,
        messages,
        tools: agent.tools,
      });

      const endTime = new Date();
      const durationMs = endTime.getTime() - startTime.getTime();

      // Extract text content
      const textContent = response.content
        .filter((block): block is Anthropic.TextBlock => block.type === 'text')
        .map(block => block.text)
        .join('\n');

      // Extract tool uses
      const toolUses = response.content
        .filter((block): block is Anthropic.ToolUseBlock => block.type === 'tool_use')
        .map(block => ({
          name: block.name,
          input: block.input,
        }));

      return {
        taskId,
        agentName,
        success: true,
        output: textContent,
        toolUses,
        metadata: {
          model: agent.provider,
          stopReason: response.stop_reason,
          usage: response.usage,
        },
        startTime,
        endTime,
        durationMs,
      };

    } catch (error) {
      const endTime = new Date();
      return {
        taskId,
        agentName,
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Unknown error',
        startTime,
        endTime,
        durationMs: endTime.getTime() - startTime.getTime(),
      };
    }
  }

  // ============================================================================
  // Workflow Execution
  // ============================================================================

  async executeWorkflow(workflow: WorkflowConfig): Promise<WorkflowResult> {
    const startTime = new Date();
    const results: AgentResult[] = [];
    const completedTasks = new Set<string>();
    const taskOutputs = new Map<string, string>();

    // Register agents from workflow
    this.registerAgents(workflow.agents);

    try {
      // Build dependency graph
      const taskMap = new Map(workflow.tasks.map(t => [t.id, t]));
      const pendingTasks = new Set(workflow.tasks.map(t => t.id));

      // Execute tasks in dependency order
      while (pendingTasks.size > 0) {
        // Find tasks ready to execute (all dependencies completed)
        const readyTasks = Array.from(pendingTasks).filter(taskId => {
          const task = taskMap.get(taskId)!;
          return !task.dependencies ||
                 task.dependencies.every(depId => completedTasks.has(depId));
        });

        if (readyTasks.length === 0 && pendingTasks.size > 0) {
          throw new Error('Circular dependency detected or missing tasks');
        }

        // Execute ready tasks in parallel
        const taskPromises = readyTasks.map(async (taskId) => {
          const task = taskMap.get(taskId)!;

          // Build context with outputs from dependencies
          const enhancedContext = {
            ...task.context,
            dependencies: task.dependencies?.reduce((acc, depId) => {
              acc[depId] = taskOutputs.get(depId);
              return acc;
            }, {} as Record<string, any>),
          };

          const result = await this.executeAgent(
            task.agentName,
            task.prompt,
            enhancedContext
          );

          taskOutputs.set(taskId, result.output);
          completedTasks.add(taskId);
          pendingTasks.delete(taskId);

          return result;
        });

        const batchResults = await Promise.all(taskPromises);
        results.push(...batchResults);

        // Check for failures
        const failures = batchResults.filter(r => !r.success);
        if (failures.length > 0) {
          throw new Error(
            `Workflow failed: ${failures.map(f => f.error).join(', ')}`
          );
        }
      }

      const endTime = new Date();
      const workflowResult: WorkflowResult = {
        workflowName: workflow.name,
        success: true,
        results,
        totalDurationMs: endTime.getTime() - startTime.getTime(),
        startTime,
        endTime,
      };

      this.activeWorkflows.set(workflow.name, workflowResult);
      return workflowResult;

    } catch (error) {
      const endTime = new Date();
      const workflowResult: WorkflowResult = {
        workflowName: workflow.name,
        success: false,
        results,
        totalDurationMs: endTime.getTime() - startTime.getTime(),
        startTime,
        endTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      this.activeWorkflows.set(workflow.name, workflowResult);
      return workflowResult;
    }
  }

  // ============================================================================
  // Streaming Execution (for real-time UI updates)
  // ============================================================================

  async *streamAgentExecution(
    agentName: string,
    prompt: string,
    context?: Record<string, any>
  ): AsyncGenerator<{ type: 'start' | 'content' | 'tool' | 'end'; data: any }> {
    const agent = this.agents.get(agentName);
    if (!agent) {
      throw new Error(`Agent "${agentName}" not found`);
    }

    yield { type: 'start', data: { agentName, prompt } };

    const messages: Anthropic.MessageParam[] = [
      {
        role: 'user',
        content: context
          ? `Context: ${JSON.stringify(context, null, 2)}\n\nTask: ${prompt}`
          : prompt
      }
    ];

    const stream = await this.client.messages.stream({
      model: agent.provider,
      max_tokens: agent.maxTokens || 4096,
      temperature: agent.temperature || 0.7,
      system: agent.systemPrompt,
      messages,
      tools: agent.tools,
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta') {
        if (event.delta.type === 'text_delta') {
          yield {
            type: 'content',
            data: { text: event.delta.text }
          };
        }
      } else if (event.type === 'message_start') {
        yield {
          type: 'start',
          data: { message: event.message }
        };
      }
    }

    const finalMessage = await stream.finalMessage();
    yield { type: 'end', data: finalMessage };
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

  getWorkflowResult(workflowName: string): WorkflowResult | undefined {
    return this.activeWorkflows.get(workflowName);
  }

  listWorkflows(): string[] {
    return Array.from(this.activeWorkflows.keys());
  }

  clearWorkflowHistory(): void {
    this.activeWorkflows.clear();
  }

  exportWorkflowMetrics(): {
    totalWorkflows: number;
    successRate: number;
    averageDuration: number;
    totalTasks: number;
  } {
    const workflows = Array.from(this.activeWorkflows.values());
    const successful = workflows.filter(w => w.success).length;
    const totalDuration = workflows.reduce((sum, w) => sum + w.totalDurationMs, 0);
    const totalTasks = workflows.reduce((sum, w) => sum + w.results.length, 0);

    return {
      totalWorkflows: workflows.length,
      successRate: workflows.length > 0 ? successful / workflows.length : 0,
      averageDuration: workflows.length > 0 ? totalDuration / workflows.length : 0,
      totalTasks,
    };
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

let orchestratorInstance: ClaudeOrchestrator | null = null;

export function getOrchestrator(apiKey?: string): ClaudeOrchestrator {
  if (!orchestratorInstance) {
    orchestratorInstance = new ClaudeOrchestrator(apiKey);
  }
  return orchestratorInstance;
}

export function resetOrchestrator(): void {
  orchestratorInstance = null;
}
