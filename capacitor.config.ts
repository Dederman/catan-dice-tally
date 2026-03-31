// capacitor.config.ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.gegemon.catandice', // Твой App ID, который ты выбрал
  appName: 'Catan Dice',       // Твое имя приложения
  webDir: 'out',                     // <-- ИЗМЕНЕНО С 'dist' НА 'out'
  server: {
    androidScheme: 'https'
  }
};

export default config;