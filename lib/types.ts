export type ChannelType = 'redirect' | 'iframe' | 'modal' | 'form';

export type ChannelStatus = 'operational' | 'issue' | 'down' | 'pending';

export type WorkflowStatus = 'idle' | 'running' | 'completed';

export interface ChannelConfig {
  id: string;
  name: string;
  type: ChannelType;
  target: string;
  category: string;
}

export interface ChannelResult {
  id: string;
  name: string;
  category: string;
  status: ChannelStatus;
  latency: string;
  uptime: string;
  checkedAt: string | null;
}

export interface StatusSummary {
  total: number;
  passed: number;
  failed: number;
}

export interface StatusPayload {
  lastUpdated: string | null;
  lastReset: string | null;
  summary: StatusSummary;
  channels: ChannelResult[];
}

export type SSEEventType = 'log' | 'result' | 'complete' | 'error';

export interface SSELogEvent {
  type: 'log';
  message: string;
  timestamp: string;
}

export interface SSEResultEvent {
  type: 'result';
  channelId: string;
  status: ChannelStatus;
  latency: string;
  checkedAt: string;
}

export interface SSECompleteEvent {
  type: 'complete';
  summary: StatusSummary;
}

export interface SSEErrorEvent {
  type: 'error';
  message: string;
}

export type SSEEvent = SSELogEvent | SSEResultEvent | SSECompleteEvent | SSEErrorEvent;
