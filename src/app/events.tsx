import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomNav, Button, Card } from '../components/ui';
import { events, type EventItem } from '../data/seed';
import { useApp } from '../store/AppContext';
import { colors } from '../theme/colors';

export default function Events() {
  const { eventStatus, joinEvent } = useApp();

  const renderAction = (event: EventItem) => {
    const status = eventStatus[event.id] ?? 'none';
    if (status === 'requested') {
      return <Button title="Pedido enviado" variant="disabled" />;
    }
    if (status === 'joined') {
      return <Button title="Inscrito" variant="success" />;
    }
    return (
      <Button
        title={event.mode === 'request' ? 'Pedir Participação' : 'Ingressar'}
        onPress={() => joinEvent(event.id, event.mode)}
      />
    );
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        {events.map((event) => (
          <Card key={event.id}>
            <View style={styles.row}>
              <View style={styles.iconCircle}>
                <Ionicons name={event.icon} size={26} color={colors.navy} />
              </View>
              <View style={styles.info}>
                <Text style={styles.title}>{event.title}</Text>
                <Text style={styles.meta}>{event.place}</Text>
                <Text style={styles.meta}>{event.date}</Text>
              </View>
            </View>
            {renderAction(event)}
          </Card>
        ))}
      </ScrollView>
      <BottomNav active="events" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 16, paddingBottom: 24 },
  row: { flexDirection: 'row', gap: 14, marginBottom: 12 },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1 },
  title: { color: colors.navy, fontSize: 16, fontWeight: '700' },
  meta: { color: colors.muted, marginTop: 2 },
});
