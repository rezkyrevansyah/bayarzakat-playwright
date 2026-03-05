import channelsJson from '../fixtures/channels.json';
import type { ChannelConfig } from './types';

export const CHANNELS: ChannelConfig[] = channelsJson as ChannelConfig[];

export function getChannelById(id: string): ChannelConfig | undefined {
  return CHANNELS.find((c) => c.id === id);
}
