import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { BottomNav, Button, Card, EmptyState } from '../components/ui';
import { type MeetingGroup, type Meeting } from '../data/seed';
import { useApp } from '../store/AppContext';
import { colors } from '../theme/colors';

const groups: { key: MeetingGroup; label: string }[] = [
  { key: 'hoje', label: 'HOJE' },
  { key: 'semana', label: 'ESTA SEMANA' },
  { key: 'proximas', label: 'PRÓXIMAS' },
];

export default function MyMeetings() {
  const { meetings, toggleConfirm } = useApp();

  const openDetails = (id: string) => router.push({ pathname: '/meeting-details', params: { id } });

  // Na semana, o botão principal é confirmar presença; nas demais, ver detalhes.
  const renderAction = (meeting: Meeting) => {
    if (meeting.group === 'semana' && !meeting.confirmed) {
      return <Button title="Confirmar Presença" onPress={() => toggleConfirm(meeting.id)} />;
    }
    return <Button title="Ver Detalhes" variant="outline" onPress={() => openDetails(meeting.id)} />;
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        {meetings.length === 0 && (
          <EmptyState text="Você não tem reuniões. Crie uma no botão + da barra inferior." />
        )}
        {groups.map((group) => {
          const items = meetings.filter((m) => m.group === group.key);
          if (items.length === 0) return null;
          return (
            <View key={group.key}>
              <Text style={styles.groupLabel}>{group.label}</Text>
              {items.map((meeting) => (
                <Card key={meeting.id} style={styles.card}>
                  <Pressable style={styles.row} onPress={() => openDetails(meeting.id)}>
                    <View style={styles.dateBox}>
                      <Text style={styles.day}>{meeting.date}</Text>
                      <Text style={styles.time}>{meeting.time}</Text>
                    </View>
                    <View style={styles.info}>
                      <Text style={styles.title}>{meeting.title}</Text>
                      <Text style={styles.place}>{meeting.place}</Text>
                      {meeting.confirmed && <Text style={styles.confirmed}>Presença confirmada</Text>}
                    </View>
                  </Pressable>
                  {renderAction(meeting)}
                </Card>
              ))}
            </View>
          );
        })}
      </ScrollView>
      <BottomNav active="meetings" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 16, paddingBottom: 24 },
  groupLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 8,
    marginBottom: 8,
  },
  card: { padding: 14 },
  row: { flexDirection: 'row', gap: 14, marginBottom: 12 },
  dateBox: { alignItems: 'center', minWidth: 56 },
  day: { color: colors.gold, fontSize: 18, fontWeight: '700' },
  time: { color: colors.text, fontSize: 13, marginTop: 2 },
  info: { flex: 1 },
  title: { color: colors.navy, fontSize: 16, fontWeight: '700' },
  place: { color: colors.muted, marginTop: 2 },
  confirmed: { color: colors.gold, fontWeight: '600', marginTop: 4, fontSize: 13 },
});
