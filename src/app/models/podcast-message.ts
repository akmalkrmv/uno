export interface IPodcastMessage {
  id?: string;
  created?: number;
  notifier: string;
  action: string;
  payload: any;
}
