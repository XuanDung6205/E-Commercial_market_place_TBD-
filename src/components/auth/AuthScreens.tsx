import { SymbolView } from 'expo-symbols';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const colors = {
  accent: '#00BCD4',
  text: '#2B2F3A',
  muted: '#8A8F9C',
  border: '#E3E5EA',
  danger: '#E5484D',
  white: '#FFFFFF',
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

type AuthPageProps = {
  children: ReactNode;
  onBack?: () => void;
  title?: string;
};

function AuthPage({ children, onBack, title }: AuthPageProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {title ? (
            <View style={styles.header}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Quay lại"
                hitSlop={10}
                onPress={onBack}
                style={styles.backButton}
              >
                <SymbolView
                  name={{ ios: 'chevron.left', android: 'arrow_back_ios_new', web: 'arrow_back_ios_new' }}
                  tintColor={colors.text}
                  size={22}
                />
              </Pressable>
              <Text style={styles.headerTitle}>{title}</Text>
            </View>
          ) : null}
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type FieldProps = {
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: 'email' | 'name' | 'current-password' | 'new-password' | 'off';
  error?: string;
  trailingIcon?: 'mail';
  keyboardType?: 'default' | 'email-address';
  onChangeText: (value: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  value: string;
};

function AuthField({
  autoCapitalize = 'none',
  autoComplete = 'off',
  error,
  keyboardType = 'default',
  onChangeText,
  placeholder,
  secureTextEntry = false,
  trailingIcon,
  value,
}: FieldProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const hasVisibilityControl = secureTextEntry;

  return (
    <View style={styles.fieldBlock}>
      <View style={[styles.inputShell, error ? styles.inputShellError : null]}>
        <TextInput
          accessibilityLabel={placeholder}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          autoCorrect={false}
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          returnKeyType="next"
          secureTextEntry={secureTextEntry && !passwordVisible}
          selectionColor={colors.accent}
          style={styles.input}
          value={value}
        />
        {hasVisibilityControl ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={passwordVisible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            hitSlop={8}
            onPress={() => setPasswordVisible((visible) => !visible)}
            style={styles.trailingIcon}
          >
            <SymbolView
              name={{
                ios: passwordVisible ? 'eye' : 'eye.slash',
                android: passwordVisible ? 'visibility' : 'visibility_off',
                web: passwordVisible ? 'visibility' : 'visibility_off',
              }}
              tintColor={colors.muted}
              size={18}
            />
          </Pressable>
        ) : trailingIcon ? (
          <View style={styles.trailingIcon}>
            <SymbolView
              name={{ ios: 'envelope', android: 'mail', web: 'mail' }}
              tintColor={colors.muted}
              size={18}
            />
          </View>
        ) : null}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

function PrimaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.primaryButton, pressed ? styles.pressed : null]}
    >
      <Text style={styles.primaryButtonText}>{label}</Text>
    </Pressable>
  );
}

function InlineLink({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable accessibilityRole="link" hitSlop={8} onPress={onPress}>
      <Text style={styles.linkText}>{label}</Text>
    </Pressable>
  );
}

function BrandMark() {
  return (
    <View style={styles.brandMark}>
      <SymbolView
        name={{ ios: 'bag', android: 'shopping_bag', web: 'shopping_bag' }}
        tintColor={colors.accent}
        size={38}
      />
      <View style={styles.brandPlus}><Text style={styles.brandPlusText}>+</Text></View>
    </View>
  );
}

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const submit = () => {
    const nextEmailError = emailPattern.test(email.trim()) ? '' : 'Vui lòng nhập email hợp lệ';
    const nextPasswordError = password ? '' : 'Vui lòng nhập mật khẩu';
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    if (!nextEmailError && !nextPasswordError) router.replace('/home');
  };

  return (
    <AuthPage>
      <View style={styles.loginIntro}>
        <BrandMark />
        <Text style={styles.title}>Đăng nhập</Text>
        <Text style={styles.description}>Đăng nhập để tiếp tục</Text>
      </View>
      <View style={styles.form}>
        <AuthField
          autoComplete="email"
          keyboardType="email-address"
          onChangeText={(value) => { setEmail(value); setEmailError(''); }}
          placeholder="Nhập địa chỉ email"
          error={emailError}
          value={email}
        />
        <View style={styles.fieldGap} />
        <AuthField
          autoComplete="current-password"
          onChangeText={(value) => { setPassword(value); setPasswordError(''); }}
          placeholder="Nhập mật khẩu"
          error={passwordError}
          secureTextEntry
          value={password}
        />
        <View style={styles.forgotLinkRow}>
          <InlineLink label="Quên mật khẩu?" onPress={() => router.push('/forgot-password')} />
        </View>
        <PrimaryButton label="Đăng nhập" onPress={submit} />
        <View style={styles.accountPrompt}>
          <Text style={styles.promptText}>Chưa có tài khoản? </Text>
          <InlineLink label="Đăng ký" onPress={() => router.push('/register')} />
        </View>
      </View>
    </AuthPage>
  );
}

export function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmationError, setConfirmationError] = useState('');

  const submit = () => {
    const nextNameError = name.trim() ? '' : 'Vui lòng nhập họ và tên';
    const nextEmailError = emailPattern.test(email.trim()) ? '' : 'Email không hợp lệ';
    const nextPasswordError = password.length >= 8 ? '' : 'Mật khẩu cần có ít nhất 8 ký tự';
    const nextConfirmationError = confirmation === password && password ? '' : 'Mật khẩu xác nhận không khớp';
    setNameError(nextNameError);
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    setConfirmationError(nextConfirmationError);

    if (!nextNameError && !nextEmailError && !nextPasswordError && !nextConfirmationError) {
      router.replace('/login');
    }
  };

  return (
    <AuthPage title="Đăng ký" onBack={() => router.replace('/login')}>
      <View style={styles.authContent}>
        <View style={styles.authIntroCopy}>
          <Text style={styles.title}>Tạo tài khoản</Text>
          <Text style={styles.description}>Điền thông tin để bắt đầu</Text>
        </View>
        <View style={styles.form}>
          <AuthField
            autoCapitalize="words"
            autoComplete="name"
            onChangeText={(value) => { setName(value); setNameError(''); }}
            placeholder="Họ và tên"
            value={name}
          />
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
          <AuthField
            autoComplete="email"
            keyboardType="email-address"
            onChangeText={(value) => { setEmail(value); setEmailError(''); }}
            placeholder="Nhập địa chỉ email"
            error={emailError}
            value={email}
          />
          <AuthField
            autoComplete="new-password"
            onChangeText={(value) => { setPassword(value); setPasswordError(''); }}
            placeholder="Nhập mật khẩu"
            error={passwordError}
            secureTextEntry
            value={password}
          />
          <AuthField
            autoComplete="new-password"
            onChangeText={(value) => { setConfirmation(value); setConfirmationError(''); }}
            placeholder="Xác nhận mật khẩu"
            error={confirmationError}
            secureTextEntry
            value={confirmation}
          />
          <PrimaryButton label="Đăng ký" onPress={submit} />
          <View style={styles.accountPrompt}>
            <Text style={styles.promptText}>Đã có tài khoản? </Text>
            <InlineLink label="Đăng nhập" onPress={() => router.replace('/login')} />
          </View>
        </View>
      </View>
    </AuthPage>
  );
}

export function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const submit = () => {
    if (!emailPattern.test(email.trim())) {
      setEmailError('Vui lòng nhập email hợp lệ');
      return;
    }
    setEmailSent(true);
  };

  return (
    <AuthPage title="Quên mật khẩu" onBack={() => router.replace('/login')}>
      {emailSent ? (
        <View style={styles.successContent}>
          <View style={styles.successIcon}>
            <SymbolView
              name={{ ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }}
              tintColor={colors.accent}
              size={56}
            />
          </View>
          <Text style={styles.title}>Gửi email thành công</Text>
          <Text style={styles.description}>
            Hướng dẫn đặt lại mật khẩu đã được gửi đến {email.trim()}.
          </Text>
          <PrimaryButton label="Đăng nhập" onPress={() => router.replace('/login')} />
        </View>
      ) : (
        <View style={styles.authContent}>
          <View style={styles.authIntroCopy}>
            <Text style={styles.title}>Đặt lại mật khẩu</Text>
            <Text style={styles.description}>Nhập địa chỉ email đã đăng ký để nhận hướng dẫn đặt lại mật khẩu.</Text>
          </View>
          <View style={styles.form}>
            <AuthField
              autoComplete="email"
              keyboardType="email-address"
              onChangeText={(value) => { setEmail(value); setEmailError(''); }}
              placeholder="Nhập địa chỉ email"
              error={emailError}
              trailingIcon="mail"
              value={email}
            />
            <PrimaryButton label="Gửi email" onPress={submit} />
          </View>
        </View>
      )}
    </AuthPage>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 28 },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 12,
  },
  backButton: { width: 22, height: 36, justifyContent: 'center' },
  headerTitle: { color: colors.text, fontSize: 20, fontWeight: '600', lineHeight: 28 },
  loginIntro: { alignItems: 'center', paddingTop: 36, paddingBottom: 30 },
  brandMark: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: '#E8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  brandPlus: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: 23,
    height: 23,
    borderRadius: 12,
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandPlusText: { color: colors.white, fontSize: 17, fontWeight: '600', lineHeight: 20 },
  authContent: { paddingTop: 28 },
  authIntroCopy: { paddingHorizontal: 36 },
  title: { color: colors.text, fontSize: 22, fontWeight: '600', lineHeight: 30 },
  description: { color: colors.muted, fontSize: 14, lineHeight: 20, marginTop: 8 },
  form: { paddingHorizontal: 36, marginTop: 22 },
  fieldBlock: { marginBottom: 14 },
  fieldGap: { height: 0 },
  inputShell: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.white,
  },
  inputShellError: { borderColor: colors.danger },
  input: { flex: 1, minWidth: 0, height: '100%', color: colors.text, fontSize: 14, paddingVertical: 0 },
  trailingIcon: { width: 24, height: 32, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  errorText: { color: colors.danger, fontSize: 12, lineHeight: 16, marginTop: 5 },
  forgotLinkRow: { alignItems: 'flex-end', marginTop: 2, marginBottom: 20 },
  primaryButton: {
    minHeight: 48,
    width: 129,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    borderRadius: 6,
    paddingHorizontal: 16,
    marginTop: 4,
  },
  primaryButtonText: { color: colors.white, fontSize: 14, lineHeight: 20, fontWeight: '600' },
  pressed: { opacity: 0.82 },
  accountPrompt: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24 },
  promptText: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  linkText: { color: colors.accent, fontSize: 14, lineHeight: 20, fontWeight: '600' },
  successContent: { alignItems: 'center', paddingHorizontal: 36, paddingTop: 90 },
  successIcon: { marginBottom: 24 },
});
