import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, type Href } from 'expo-router';
import { BottomNav } from '../components/ui';
import type { IconName } from '../data/seed';
import { colors } from '../theme/colors';

// Dashboard: hub com os atalhos principais, conforme o mockup.
const tiles: { label: string; icon: IconName; route: Href }[] = [
  { label: 'Minhas Reuniões', icon: 'calendar-outline', route: '/my-meetings' },
  { label: 'Locais Sugeridos', icon: 'location-outline', route: '/partner-spaces' },
  { label: 'Criar Evento', icon: 'add-circle-outline', route: '/create-meeting' },
  { label: 'Networking Empresarial', icon: 'people-outline', route: '/networking' },
  { label: 'Espaços Parceiros', icon: 'storefront-outline', route: '/partner-spaces' },
  { label: 'Feed de Eventos', icon: 'newspaper-outline', route: '/events' },
];

export default function Home() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.grid}>
        {tiles.map((tile) => (
          <Pressable
            key={tile.label}
            style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
            onPress={() => router.push(tile.route)}
          >
            <Ionicons name={tile.icon} size={40} color={colors.navy} />
            <Text style={styles.tileText}>{tile.label}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <BottomNav active="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 24,
  },
  tile: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  tileText: { color: colors.navy, fontSize: 15, fontWeight: '600', textAlign: 'center' },
  pressed: { opacity: 0.8 },
});
