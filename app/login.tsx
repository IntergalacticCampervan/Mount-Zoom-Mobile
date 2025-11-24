// app/login.tsx
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useRef } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import { TText } from "../components/ui/TText";
import { theme } from "../lib/theme";

export default function LoginScreen() {
  const router = useRouter();
  const webViewRef = useRef(null);

  const AUTH_URL = "https://mountzoom.cloudflareaccess.com/"; // TODO

  async function handleMessage(event: any) {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.token) {
        await SecureStore.setItemAsync("authToken", data.token);
        router.replace("/(tabs)");
      }
    } catch (e) {
      console.log("Login message parse error", e);
    }
  }

  return (
    <View style={styles.root}>
      <WebView
        ref={webViewRef}
        source={{ uri: AUTH_URL }}
        onMessage={handleMessage}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loader}>
            <ActivityIndicator color={theme.colors.goldBright} />
            <TText variant="caption" muted style={{ marginTop: 8 }}>
              Opening the gates of Minas Tirith…
            </TText>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  loader: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    justifyContent: "center",
    alignItems: "center",
  },
});
