import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, type Href } from 'expo-router';
import { colors } from '../theme/colors';

// Dashboard: hub com os atalhos principais, conforme o mockup.
const tiles: { label: string; route: Href }[] = [
  { label: 'Minhas Reuniões', route: '/my-meetings' },
  { label: 'Locais Sugeridos', route: '/partner-spaces' },
  { label: 'Criar Evento', route: '/create-meeting' },
  { label: 'Networking Empresarial', route: '/networking' },
  { label: 'Espaços Parceiros', route: '/partner-spaces' },
  { label: 'Feed de Eventos', route: '/events' },
];

export default function Home() {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {tiles.map((tile) => (
          <Pressable
            key={tile.label}
            style={styles.tile}
            onPress={() => router.push(tile.route)}
          >
            <Text style={styles.tileText}>{tile.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream, padding: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tile: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileText: { color: colors.navy, fontSize: 16, fontWeight: '600', textAlign: 'center' },
});
