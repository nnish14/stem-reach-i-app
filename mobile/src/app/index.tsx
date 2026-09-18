import { router } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/state/auth';

export default function Index() {
  const { session, me, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#88c0d0" />
      </View>
    );
  }

  // Handle direct navigation to authenticated spaces
  const handlePortalAccess = () => {
    if (!session || !me) {
      router.push('/login');
      return;
    }
    router.push(me.profile.role === 'teacher' ? '/(teacher)' : '/(student)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>STEM Reach</Text>
        <Text style={styles.subtitle}>Select workspace to continue</Text>
      </View>

      <View style={styles.cardContainer}>
        {/* Offline Self-Study Workspace */}
        <Pressable 
          style={({ pressed }) => [styles.card, styles.selfStudyCard, pressed && styles.pressed]} 
          onPress={() => router.push('/(self-study)')}
        >
          <Text style={styles.cardIcon}>🧠</Text>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>Local Self-Study</Text>
            <Text style={styles.cardDescription}>Offline SM-2 Flashcards & Zettelkasten Notes</Text>
          </View>
        </Pressable>

        {/* Authenticated Cloud Hub */}
        <Pressable 
          style={({ pressed }) => [styles.card, styles.portalCard, pressed && styles.pressed]} 
          onPress={handlePortalAccess}
        >
          <Text style={styles.cardIcon}>🌐</Text>
          <View style={styles.cardTextContainer}>
            <Text style={styles.cardTitle}>
              {session && me ? `Continue as ${me.profile.role}` : 'Classroom Portal'}
            </Text>
            <Text style={styles.cardDescription}>
              {session && me ? 'Access assigned daily streams' : 'Sign in to sync with school network'}
            </Text>
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2e3440', padding: 24, justifyContent: 'center' },
  loadingContainer: { flex: 1, backgroundColor: '#2e3440', alignItems: 'center', justifyContent: 'center' },
  header: { marginBottom: 32 },
  title: { fontSize: 32, fontWeight: '800', color: '#eceff4', letterSpacing: -0.5 },
  subtitle: { fontSize: 16, color: '#d8dee9', marginTop: 4 },
  cardContainer: { gap: 16 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    gap: 16,
  },
  selfStudyCard: { backgroundColor: '#3b4252', borderColor: '#88c0d0' },
  portalCard: { backgroundColor: '#434c5e', borderColor: '#4c566a' },
  pressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
  cardIcon: { fontSize: 28 },
  cardTextContainer: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#eceff4' },
  cardDescription: { fontSize: 13, color: '#e5e9f0', marginTop: 2 },
});
