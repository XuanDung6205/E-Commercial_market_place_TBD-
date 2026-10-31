import * as Linking from "expo-linking";
import { Link, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import EyeOffIcon from "@/assets/images/figma/auth-login/eye-off.svg";
import PlusIcon from "@/assets/images/figma/auth-login/plus.svg";
import ShoppingBagIcon from "@/assets/images/figma/auth-login/shopping-bag.svg";
import { signInWithEmail } from "@/src/services/auth.service";
import { supabase } from "@/src/services/supabase";

type SocialProvider = "google" | "facebook";

const colors = {
  ink: "#2B2F3A",
  muted: "#8A8F9C",
  border: "#E3E5EA",
  cyan: "#00BCD4",
  paleCyan: "#E6F9FC",
  violet: "#7C5CE0",
  white: "#FFFFFF",
  danger: "#D92D20",
};

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialProvider, setSocialProvider] = useState<SocialProvider | null>(null);

  const handleLogin = async () => {
    setErrorMessage("");
    const normalizedEmail = email.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setErrorMessage("Vui lòng nhập địa chỉ email hợp lệ.");
      return;
    }

    if (!password) {
      setErrorMessage("Vui lòng nhập mật khẩu.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await signInWithEmail(normalizedEmail, password);
      if (error) {
        setErrorMessage(
          error.message,
        );
        return;
      }

      router.replace("/(tabs)/home");
    } catch {
      setErrorMessage("Không thể kết nối. Vui lòng kiểm tra mạng và thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = async (provider: SocialProvider) => {
    setErrorMessage("");
    setSocialProvider(provider);

    try {
      const redirectTo = Linking.createURL("auth/callback");
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo, skipBrowserRedirect: true },
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }
      if (!data.url) {
        setErrorMessage("Không thể mở trang đăng nhập. Vui lòng thử lại.");
        return;
      }

      if (Platform.OS === "web") {
        window.location.assign(data.url);
        return;
      }

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
      if (result.type !== "success") return;

      const callback = Linking.parse(result.url);
      const code = callback.queryParams?.code;
      const oauthError = callback.queryParams?.error_description;
      if (typeof oauthError === "string") {
        setErrorMessage(oauthError);
        return;
      }
      if (typeof code !== "string") {
        setErrorMessage("Không nhận được kết quả đăng nhập. Vui lòng thử lại.");
        return;
      }

      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      if (exchangeError) {
        setErrorMessage(exchangeError.message);
        return;
      }
      router.replace("/(tabs)/home");
    } catch {
      setErrorMessage("Đăng nhập bằng mạng xã hội thất bại. Vui lòng thử lại.");
    } finally {
      setSocialProvider(null);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.brandBlock}>
            <View style={styles.brandMark}>
              <ShoppingBagIcon width={29} height={29} />
              <View style={styles.brandBadge}>
                <PlusIcon width={10} height={10} />
              </View>
            </View>
            <View style={styles.brandCopy}>
              <Text style={styles.brandName}>Chợ Mây</Text>
              <Text style={styles.brandTagline}>MUA SẮM DỄ DÀNG</Text>
            </View>
          </View>

          <View style={styles.welcomeBlock}>
            <Text style={styles.eyebrow}>TÀI KHOẢN CỦA BẠN</Text>
            <Text style={styles.title}>Chào mừng trở lại</Text>
            <Text style={styles.subtitle}>Đăng nhập để tiếp tục mua sắm</Text>
          </View>

          <View style={styles.formCard}>
            <View style={styles.form}>
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  accessibilityLabel="Email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  keyboardType="email-address"
                  onChangeText={setEmail}
                  onSubmitEditing={handleLogin}
                  placeholder="Nhập địa chỉ email"
                  placeholderTextColor={colors.muted}
                  returnKeyType="next"
                  style={styles.input}
                  textContentType="emailAddress"
                  value={email}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Mật khẩu</Text>
                <View style={styles.passwordInputWrap}>
                  <TextInput
                    accessibilityLabel="Mật khẩu"
                    autoCapitalize="none"
                    autoComplete="password"
                    onChangeText={setPassword}
                    onSubmitEditing={handleLogin}
                    placeholder="Nhập mật khẩu"
                    placeholderTextColor={colors.muted}
                    returnKeyType="done"
                    secureTextEntry
                    style={[styles.input, styles.passwordInput]}
                    textContentType="password"
                    value={password}
                  />
                  <View accessible={false} style={styles.passwordIcon}>
                    <EyeOffIcon width={18} height={18} />
                  </View>
                </View>
              </View>

              <View style={styles.forgotPasswordRow}>
                <Link href="/(auth)/forgot-password" asChild>
                  <Pressable accessibilityRole="link" hitSlop={8}>
                    <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
                  </Pressable>
                </Link>
              </View>

              {errorMessage ? (
                <Text accessibilityRole="alert" style={styles.errorMessage}>
                  {errorMessage}
                </Text>
              ) : null}

              <Pressable
                accessibilityRole="button"
                disabled={isSubmitting || socialProvider !== null}
                onPress={handleLogin}
                style={({ pressed }) => [
                  styles.submitButton,
                  pressed && !isSubmitting ? styles.submitButtonPressed : null,
                  isSubmitting ? styles.submitButtonDisabled : null,
                ]}
              >
                {isSubmitting ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.submitButtonText}>Đăng nhập</Text>
                )}
              </Pressable>

              <View style={styles.socialDivider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Hoặc đăng nhập với</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialButtons}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Đăng nhập bằng Google"
                  disabled={isSubmitting || socialProvider !== null}
                  onPress={() => handleSocialLogin("google")}
                  style={({ pressed }) => [
                    styles.socialButton,
                    pressed && styles.socialButtonPressed,
                    (isSubmitting || socialProvider !== null) && styles.socialButtonDisabled,
                  ]}
                >
                  {socialProvider === "google" ? (
                    <ActivityIndicator color="#4285F4" size="small" />
                  ) : (
                    <Text style={styles.googleMark}>G</Text>
                  )}
                  <Text style={styles.socialButtonText}>Google</Text>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Đăng nhập bằng Facebook"
                  disabled={isSubmitting || socialProvider !== null}
                  onPress={() => handleSocialLogin("facebook")}
                  style={({ pressed }) => [
                    styles.socialButton,
                    pressed && styles.socialButtonPressed,
                    (isSubmitting || socialProvider !== null) && styles.socialButtonDisabled,
                  ]}
                >
                  {socialProvider === "facebook" ? (
                    <ActivityIndicator color="#1877F2" size="small" />
                  ) : (
                    <Text style={styles.facebookMark}>f</Text>
                  )}
                  <Text style={styles.socialButtonText}>Facebook</Text>
                </Pressable>
              </View>

            </View>
          </View>

          <View style={styles.registerRow}>
            <Text style={styles.registerPrompt}>Chưa có tài khoản? </Text>
            <Link href="/(auth)/register" asChild>
              <Pressable accessibilityRole="link" hitSlop={8}>
                <Text style={styles.registerLink}>Đăng ký</Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F8FA",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 18,
    paddingHorizontal: 22,
    paddingBottom: 28,
  },
  brandBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 36,
  },
  brandMark: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: colors.paleCyan,
    alignItems: "center",
    justifyContent: "center",
  },
  brandBadge: {
    position: "absolute",
    top: 5,
    right: 3,
    width: 16,
    height: 16,
    borderRadius: 5,
    backgroundColor: colors.violet,
    alignItems: "center",
    justifyContent: "center",
  },
  brandCopy: {
    gap: 2,
  },
  brandName: {
    color: colors.ink,
    fontSize: 18,
    lineHeight: 23,
    fontWeight: "800",
  },
  brandTagline: {
    color: colors.muted,
    fontSize: 9,
    lineHeight: 13,
    fontWeight: "700",
    letterSpacing: 1.1,
  },
  welcomeBlock: {
    alignItems: "flex-start",
    marginBottom: 22,
  },
  eyebrow: {
    color: colors.cyan,
    fontSize: 10,
    lineHeight: 15,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 7,
  },
  title: {
    width: "100%",
    color: colors.ink,
    fontSize: 27,
    lineHeight: 34,
    fontWeight: "700",
    textAlign: "left",
    marginBottom: 5,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "400",
    textAlign: "left",
  },
  formCard: {
    width: "100%",
    padding: 17,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EDF1F3",
    shadowColor: "#162B36",
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  form: {
    width: "100%",
  },
  fieldGroup: {
    marginBottom: 17,
  },
  label: {
    color: colors.ink,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
    marginBottom: 7,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 12,
    color: colors.ink,
    fontSize: 14,
    lineHeight: 20,
    backgroundColor: "#FBFCFD",
  },
  passwordInputWrap: {
    position: "relative",
    justifyContent: "center",
  },
  passwordInput: {
    paddingRight: 40,
  },
  passwordIcon: {
    position: "absolute",
    right: 12,
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  forgotPasswordRow: {
    alignItems: "flex-end",
    marginTop: -2,
    marginBottom: 15,
  },
  forgotPassword: {
    color: colors.cyan,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
  },
  errorMessage: {
    color: colors.danger,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 0,
    marginBottom: 12,
  },
  submitButton: {
    height: 52,
    width: "100%",
    borderRadius: 10,
    backgroundColor: colors.cyan,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonPressed: {
    opacity: 0.86,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "700",
  },
  socialDivider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 18,
    marginBottom: 13,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
  },
  socialButtons: {
    flexDirection: "row",
    gap: 10,
  },
  socialButton: {
    minHeight: 48,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
  },
  socialButtonPressed: {
    backgroundColor: "#F7FAFC",
  },
  socialButtonDisabled: {
    opacity: 0.6,
  },
  socialButtonText: {
    color: colors.ink,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
  googleMark: {
    color: "#4285F4",
    fontSize: 19,
    lineHeight: 22,
    fontWeight: "800",
  },
  facebookMark: {
    color: "#1877F2",
    fontSize: 22,
    lineHeight: 24,
    fontWeight: "800",
  },
  registerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 23,
  },
  registerPrompt: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400",
  },
  registerLink: {
    color: colors.cyan,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
});
