import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bulingtree.christmas',
  appName: '圣诞树', 
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
