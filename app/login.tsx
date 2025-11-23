import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useRef } from "react";
import { ActivityIndicator, View } from "react-native";
import { WebView } from "react-native-webview";

export default function LoginScreen() {
  const router = useRouter();
  const webviewRef = useRef(null);

  // Update this with **your Cloudflare Worker mobile-auth URL**
  const AUTH_URL = "  https://mountzoom.cloudflareaccess.com/";

  const handleMessage = async (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.token) {
        await SecureStore.setItemAsync("authToken", data.token);
        router.replace("/"); // Go to dashboard
      }
    } catch (e) {
      console.log("Message parse error", e);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webviewRef}
        source={{ uri: AUTH_URL }}
        onMessage={handleMessage}
        startInLoadingState
        renderLoading={() => (
          <View style={{ flex: 1, justifyContent: "center" }}>
            <ActivityIndicator size="large" />
          </View>
        )}
      />
    </View>
  );
}
