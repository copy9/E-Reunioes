import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Badge, Card, EmptyState, Stars } from '../components/ui';
import { people } from '../data/trust';
import { colors } from '../theme/colors';

// Reputação de uma pessoa: o que o outro participante vê antes de encontrar.
export default function PersonProfile() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const person = people.find((p) => p.name === name);

  if (!person) {
    return (
      <View style={styles.screen}>
        <Stack.Screen options={{ title: 'Perfil' }} />
        <EmptyState text="Perfil não encontrado." />
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: person.name }} />
      <Card>
        <View style={styles.header}>
          <Text style={styles.name}>{person.name}</Text>
          {person.verified ? <Badge label="Identidade verificada" /> : <Badge label="Não verificado" tone="navy" />}
        </View>
        <Text style={styles.meta}>Na plataforma desde {person.since}</Text>
        <View style={styles.stats}>
          <View>
            <Text style={styles.statValue}>{person.meetingsDone}</Text>
            <Text style={styles.statLabel}>encontros concluídos</Text>
          </View>
          <View>
            <Stars value={person.rating} />
            <Text style={styles.statLabel}>avaliação média</Text>
          </View>
        </View>
      </Card>

      <Card>
        <Text style={styles.section}>Selos de comportamento</Text>
        {person.badges.length === 0 ? (
          <Text style={styles.meta}>Ainda sem selos. Os selos aparecem conforme os encontros são avaliados.</Text>
        ) : (
          <View style={styles.badges}>
            {person.badges.map((b) => (
              <Badge key={b} label={b} tone="navy" />
            ))}
          </View>
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 16, paddingBottom: 32 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  name: { color: colors.navy, fontSize: 20, fontWeight: '700' },
  meta: { color: colors.muted, marginTop: 6 },
  stats: { flexDirection: 'row', gap: 28, marginTop: 16 },
  statValue: { color: colors.navy, fontSize: 22, fontWeight: '700' },
  statLabel: { color: colors.muted, fontSize: 13, marginTop: 2 },
  section: { color: colors.navy, fontWeight: '700', marginBottom: 10 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
