import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.yem.trading",
  appName: "Yem",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
};

export default config;
