import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Badge, Button, Card, EmptyState } from '../components/ui';
import { useApp } from '../store/AppContext';
import { colors } from '../theme/colors';

export default function MeetingDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { meetings, toggleConfirm, removeMeeting } = useApp();
  const meeting = meetings.find((m) => m.id === id);

  if (!meeting) {
    return (
      <View style={styles.screen}>
        <Stack.Screen options={{ title: 'Detalhes da Reunião' }} />
        <EmptyState text="Esta reunião não existe mais." />
      </View>
    );
  }

  const cancel = () => {
    Alert.alert('Cancelar reunião', 'Tem certeza que quer cancelar esta reunião?', [
      { text: 'Voltar', style: 'cancel' },
      {
        text: 'Cancelar reunião',
        style: 'destructive',
        onPress: () => {
          removeMeeting(meeting.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Card>
        <Text style={styles.title}>{meeting.title}</Text>
        <View style={styles.badges}>
          <Badge label={meeting.type} tone="navy" />
          {meeting.confirmed && <Badge label="Presença confirmada" />}
        </View>
        <Text style={styles.line}>Data: {meeting.date}</Text>
        <Text style={styles.line}>Horário: {meeting.time}</Text>
        <Text style={styles.line}>Local: {meeting.place}</Text>
      </Card>

      <Card>
        <Text style={styles.section}>Participantes</Text>
        {meeting.participants.map((p) => (
          <Text key={p} style={styles.line}>
            • {p}
          </Text>
        ))}
      </Card>

      <Button
        title={meeting.confirmed ? 'Cancelar confirmação' : 'Confirmar Presença'}
        variant={meeting.confirmed ? 'outline' : 'primary'}
        onPress={() => toggleConfirm(meeting.id)}
      />
      <Button title="Cancelar reunião" variant="outline" style={styles.cancel} onPress={cancel} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 16, paddingBottom: 32 },
  title: { color: colors.navy, fontSize: 20, fontWeight: '700' },
  badges: { flexDirection: 'row', gap: 8, marginVertical: 10 },
  section: { color: colors.navy, fontWeight: '700', marginBottom: 8 },
  line: { color: colors.text, fontSize: 15, marginBottom: 6 },
  cancel: { marginTop: 12 },
});
