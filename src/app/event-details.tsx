import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, EmptyState } from '../components/ui';
import { events } from '../data/seed';
import { useApp } from '../store/AppContext';
import { colors } from '../theme/colors';

export default function EventDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { eventStatus, joinEvent } = useApp();
  const event = events.find((e) => e.id === id);

  if (!event) {
    return (
      <View style={styles.screen}>
        <Stack.Screen options={{ title: 'Evento' }} />
        <EmptyState text="Evento não encontrado." />
      </View>
    );
  }

  const status = eventStatus[event.id] ?? 'none';

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: event.title }} />
      <Card>
        <View style={styles.iconCircle}>
          <Ionicons name={event.icon} size={30} color={colors.navy} />
        </View>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.line}>Local: {event.place}</Text>
        <Text style={styles.line}>Data: {event.date}</Text>
        <Text style={styles.description}>{event.description}</Text>
        <Text style={styles.mode}>
          {event.mode === 'request'
            ? 'Participação sob aprovação do organizador.'
            : 'Entrada direta, sem aprovação.'}
        </Text>
      </Card>

      {status === 'requested' && <Button title="Pedido enviado" variant="disabled" />}
      {status === 'joined' && <Button title="Inscrito" variant="success" />}
      {status === 'none' && (
        <Button
          title={event.mode === 'request' ? 'Pedir Participação' : 'Ingressar'}
          onPress={() => joinEvent(event.id, event.mode)}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 16, paddingBottom: 32 },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: { color: colors.navy, fontSize: 20, fontWeight: '700' },
  line: { color: colors.text, marginTop: 6, fontSize: 15 },
  description: { color: colors.text, marginTop: 12, fontSize: 15, lineHeight: 21 },
  mode: { color: colors.muted, marginTop: 12, fontSize: 13 },
});
