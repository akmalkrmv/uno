import { CommandGroup, Command } from '@models/command';

export const VideoChatCommandGroup = new CommandGroup(
  'video_chat',
  'Video chat',
  [
    new Command('call', 'Call', 'phone'),
    // new Command('retryCall', 'Retry call', 'swap_calls'),
    new Command('hangup', 'Hang up', 'call_end'),
    new Command('shareLink', 'Share link', 'share'),
    new Command('copyLink', 'Copy link', 'link'),
    // new Command('requestMedia', 'Turn on camera/mic', 'perm_camera_mic'),
    new Command('leaveRoom', 'Leave this room', 'power_settings_new'),
  ]
);
