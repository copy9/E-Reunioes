import { useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, Card, EmptyState } from '../components/ui';
import { spaces, type Space } from '../data/seed';
import { googleReviewUrl } from '../data/trust';
import { useApp } from '../store/AppContext';
import { colors } from '../theme/colors';

// Avaliação do encontro: pessoa (pontualidade, respeito) e local (ambiente, segurança).
// Depois de avaliar um local parceiro bem avaliado, convida a pessoa a avaliar o local no Google.
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
  const [googleSpace, setGoogleSpace] = useState<Space | null>(null);

  if (!meeting) {
    return (
      <View style={styles.screen}>
        <Stack.Screen options={{ title: 'Avaliar encontro' }} />
        <EmptyState text="Reunião não encontrada." />
      </View>
    );
  }

  // Só convida para o Google quando o encontro foi em um espaço parceiro e o local foi bem avaliado.
  const partnerSpace = spaces.find((s) => s.name === meeting.place);

  const submit = () => {
    if (!punctuality || !respect || !venue) {
      Alert.alert('Avaliação incompleta', 'Dê uma nota para pontualidade, respeito e local.');
      return;
    }
    saveReview(meeting.id, { punctuality, respect, venue, comment: comment.trim() });

    if (partnerSpace && venue >= 4) {
      setGoogleSpace(partnerSpace);
      return;
    }
    Alert.alert('Obrigado pela avaliação', 'Sua avaliação ajuda a manter os encontros seguros.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const openGoogle = async (space: Space) => {
    const url = googleReviewUrl(space.name, space.address);
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Não foi possível abrir', 'Tente novamente pelo Google Maps.');
    }
  };

  // Tela de convite para avaliar o local no Google, depois da avaliação do encontro.
  if (googleSpace) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Stack.Screen options={{ title: 'Obrigado!' }} />
        <Card style={styles.googleCard}>
          <Ionicons name="star" size={34} color={colors.gold} />
          <Text style={styles.googleTitle}>Avalie {googleSpace.name} no Google</Text>
          <Text style={styles.googleText}>
            Sua avaliação ajuda outras pessoas a encontrarem um lugar bom e seguro para se reunir. Leva menos de um minuto.
          </Text>
          <Button title="Avaliar no Google" onPress={() => openGoogle(googleSpace)} style={styles.action} />
          <Button title="Agora não" variant="outline" style={styles.action} onPress={() => router.back()} />
        </Card>
      </ScrollView>
    );
  }

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
  googleCard: { alignItems: 'center', padding: 24, marginTop: 8 },
  googleTitle: { color: colors.navy, fontSize: 19, fontWeight: '700', marginTop: 12, textAlign: 'center' },
  googleText: { color: colors.text, marginTop: 8, textAlign: 'center', lineHeight: 21 },
  action: { marginTop: 12, alignSelf: 'stretch' },
});
