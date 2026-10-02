import { useFonts as useFredoka, Fredoka_500Medium, Fredoka_600SemiBold, Fredoka_700Bold } from '@expo-google-fonts/fredoka';
import { useFonts as useNunito, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack, usePathname, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { AuthProvider, useAuth } from '@/state/auth';
import { ErrorBoundary } from '@/components/error-boundary';
import { ToastProvider } from '@/components/toast';

// Custom hook to handle role-based navigation
function useRoleBasedNavigation() {
  const { me } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!me) return;

    // Redirect to appropriate role-based screen
    if (me.role === 'student' && !pathname.startsWith('/(student)')) {
      router.replace('/(student)');
    } else if (me.role === 'teacher' && !pathname.startsWith('/(teacher)')) {
      router.replace('/(teacher)');
    }
  }, [me, pathname, router]);
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fredokaLoaded] = useFredoka({
    Fredoka_500Medium,
    Fredoka_600SemiBold,
    Fredoka_700Bold,
  });
  const [nunitoLoaded] = useNunito({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  if (!fredokaLoaded || !nunitoLoaded) {
    return null; // keep the native splash screen until fonts are ready
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ErrorBoundary>
        <AuthProvider>
          <ToastProvider>
            <RoleBasedNavigationWrapper />
          </ToastProvider>
        </AuthProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

function RoleBasedNavigationWrapper() {
  useRoleBasedNavigation();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="(student)" />
      <Stack.Screen name="(teacher)" />
      <Stack.Screen name="(self-study)" />
    </Stack>
  );
}
