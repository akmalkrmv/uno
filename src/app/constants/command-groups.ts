import { CommandGroup, Command } from '@models/command';

export const VideoChatCommandGroup = new CommandGroup(
  'video_chat',
  'Видео чат',
  [
    new Command('call', 'Подключится', 'phone'),
    // new Command('retryCall', 'Переподключить', 'swap_calls'),
    new Command('hangup', 'Отключить', 'call_end'),
    new Command('shareLink', 'Поделиться ссылкой', 'share'),
    new Command('copyLink', 'Скопировать ссылку', 'link'),
    // new Command('requestMedia', 'Включить камеру/микрофон', 'perm_camera_mic'),
    new Command('leaveRoom', 'Покинуть комнату', 'power_settings_new'),
  ]
);
