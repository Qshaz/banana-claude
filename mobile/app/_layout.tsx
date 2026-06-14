import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';

const queryClient = new QueryClient();

function AuthGate() {
  const { session, loading } = useAuth();
  const { profile, loading: profileLoading } = useProfile(session?.user?.id ?? null);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading || profileLoading) return;
    const inAuth = segments[0] === '(auth)';
    const inOnboarding = segments[0] === '(onboarding)';

    if (!session) {
      if (!inAuth) router.replace('/(auth)/login');
    } else if (!profile?.onboarding_complete) {
      if (!inOnboarding) router.replace('/(onboarding)/');
    } else {
      if (inAuth || inOnboarding) router.replace('/(tabs)/');
    }
  }, [session, loading, profile, profileLoading]);

  return null;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthGate />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="session" options={{ presentation: 'modal', headerShown: true, title: 'Tadabur Session' }} />
      </Stack>
    </QueryClientProvider>
  );
}
