import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, EmptyState } from '../components/ui';
import { useApp } from '../store/AppContext';
import { colors } from '../theme/colors';

// Avaliação do encontro: pessoa (pontualidade, respeito) e local (ambiente, segurança).
// Só é publicada depois que o organizador envia, e alimenta a reputação de todos.
function StarRow({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Pressable key={n} onPress={() => onChange(n)} hitSlop={6}>
          <Ionicons name={value >= n ? 'star' : 'star-outline'} size={30} color={colors.gold} />
        </Pressable>
      ))}
    </View>
  );
}

export default function RateMeeting() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { meetings, reviews, saveReview } = useApp();
  const meeting = meetings.find((m) => m.id === id);
  const existing = id ? reviews[id] : undefined;

  const [punctuality, setPunctuality] = useState(existing?.punctuality ?? 0);
  const [respect, setRespect] = useState(existing?.respect ?? 0);
  const [venue, setVenue] = useState(existing?.venue ?? 0);
  const [comment, setComment] = useState(existing?.comment ?? '');

  if (!meeting) {
    return (
      <View style={styles.screen}>
        <Stack.Screen options={{ title: 'Avaliar encontro' }} />
        <EmptyState text="Reunião não encontrada." />
      </View>
    );
  }

  const submit = () => {
    if (!punctuality || !respect || !venue) {
      Alert.alert('Avaliação incompleta', 'Dê uma nota para pontualidade, respeito e local.');
      return;
    }
    saveReview(meeting.id, { punctuality, respect, venue, comment: comment.trim() });
    Alert.alert('Obrigado pela avaliação', 'Sua avaliação ajuda a manter os encontros seguros.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: 'Avaliar encontro' }} />
      <Card>
        <Text style={styles.title}>{meeting.title}</Text>
        <Text style={styles.meta}>{meeting.place} · {meeting.date} às {meeting.time}</Text>
      </Card>

      <Card>
        <Text style={styles.section}>Pontualidade</Text>
        <StarRow value={punctuality} onChange={setPunctuality} />
        <Text style={styles.section}>Respeito e postura</Text>
        <StarRow value={respect} onChange={setRespect} />
        <Text style={styles.section}>Local e ambiente</Text>
        <StarRow value={venue} onChange={setVenue} />
      </Card>

      <Card>
        <Text style={styles.section}>Comentário (opcional)</Text>
        <TextInput
          style={styles.input}
          multiline
          placeholder="Como foi o encontro?"
          placeholderTextColor={colors.muted}
          value={comment}
          onChangeText={setComment}
        />
      </Card>

      <Button title={existing ? 'Atualizar avaliação' : 'Enviar avaliação'} onPress={submit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 16, paddingBottom: 32 },
  title: { color: colors.navy, fontSize: 18, fontWeight: '700' },
  meta: { color: colors.muted, marginTop: 4 },
  section: { color: colors.navy, fontWeight: '700', marginTop: 10, marginBottom: 6 },
  starRow: { flexDirection: 'row', gap: 6 },
  input: {
    backgroundColor: colors.cream,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    minHeight: 90,
    textAlignVertical: 'top',
    fontSize: 15,
    color: colors.text,
  },
});
