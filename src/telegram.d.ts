// src/telegram.d.ts
interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string; // Add this line
  language_code?: string;
}

interface TelegramWebApp {
  initData?: string;
  initDataUnsafe?: {
    user?: TelegramUser;
  };
  ready: () => void;
}

interface Window {
  Telegram?: {
    WebApp: TelegramWebApp;
  };
}
