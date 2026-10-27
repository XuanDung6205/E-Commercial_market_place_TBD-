import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { supabase } from "@/src/services/supabase";

export default function AuthCallbackScreen() {
  const routeParams = useLocalSearchParams<{
    code?: string;
    error_description?: string;
  }>();
  const browserParams =
    Platform.OS === "web" && typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;
  const browserHashParams =
    Platform.OS === "web" && typeof window !== "undefined"
      ? new URLSearchParams(window.location.hash.replace(/^#/, ""))
      : null;
  const code =
    (typeof routeParams.code === "string" && routeParams.code) ||
    browserParams?.get("code") ||
    browserHashParams?.get("code") ||
    null;
  const errorDescription =
    (typeof routeParams.error_description === "string" && routeParams.error_description) ||
    browserParams?.get("error_description") ||
    browserHashParams?.get("error_description") ||
    null;
  const [message, setMessage] = useState<string | null>(null);
  const handledCode = useRef<string | null>(null);

  useEffect(() => {
    if (Platform.OS !== "web") {
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_IN" && session) router.replace("/(tabs)/home");
      });
      return () => data.subscription.unsubscribe();
    }

    if (errorDescription || !code || handledCode.current === code) return;

    handledCode.current = code;
    let active = true;
    const timeout = setTimeout(() => {
      if (active) setMessage("Xác thực đang bị chậm. Hãy thử đăng nhập lại.");
    }, 15000);

    void supabase.auth
      .exchangeCodeForSession(code)
      .then(({ error }) => {
        clearTimeout(timeout);
        if (!active) return;
        if (error) {
          setMessage(error.message);
          return;
        }
        router.replace("/(tabs)/home");
      })
      .catch((error: unknown) => {
        clearTimeout(timeout);
        if (!active) return;
        setMessage(error instanceof Error ? error.message : "Không thể hoàn tất đăng nhập.");
      });

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [code, errorDescription]);

  const displayError =
    (errorDescription?.includes("Error getting user email from external provider")
      ? "Facebook không cung cấp email cho Supabase. Hãy bật quyền email trong ứng dụng Facebook và dùng tài khoản Facebook có email đã xác nhận."
      : errorDescription?.includes("Unable to exchange external code")
        ? "Supabase không hoàn tất xác thực với Facebook. Hãy kiểm tra Facebook Client ID, Client Secret và callback URL. Chi tiết lỗi nằm trong Authentication Logs."
        : errorDescription) ||
    message ||
    (!code && Platform.OS === "web"
      ? "Không nhận được mã từ Google/Facebook. Hãy kiểm tra URL chuyển hướng trong Supabase."
      : null);

  return (
    <View style={styles.container}>
      {displayError ? null : <ActivityIndicator color="#00BCD4" size="large" />}
      <Text accessibilityRole="alert" style={styles.message}>
        {displayError ?? "Đang hoàn tất đăng nhập..."}
      </Text>
      {displayError ? (
        <Pressable onPress={() => router.replace("/(auth)/login")}>
          <Text style={styles.backLink}>Quay lại đăng nhập</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#F5F8FA",
  },
  message: {
    marginTop: 16,
    color: "#2B2F3A",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
  backLink: {
    marginTop: 18,
    color: "#00AFC5",
    fontSize: 14,
    fontWeight: "600",
  },
});
