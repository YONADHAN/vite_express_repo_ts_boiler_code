import { Platform } from 'react-native';

// Android Emulator uses 10.0.2.2 to access host localhost
// iOS Simulator uses localhost
export const API_URL = Platform.select({
    android: 'http://10.0.2.2:4000', // Update port to 4000
    ios: 'http://localhost:4000',
    default: 'http://192.168.1.5:4000', // Update with your machine's local IP for physical devices
});
