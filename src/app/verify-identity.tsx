import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Badge, Button, Card } from '../components/ui';
import { verificationSteps } from '../data/trust';
import { useApp } from '../store/AppContext';
import { colors } from '../theme/colors';

// Verificação de identidade. No protótipo, cada etapa é confirmada pelo próprio usuário.
// Na versão final, a checagem de documento e selfie é feita por um serviço de verificação.
export default function VerifyIdentity() {
  const { verification, verify, isVerified } = useApp();
  const done = Object.values(verification).filter(Boolean).length;

  const confirm = (step: (typeof verificationSteps)[number]['key']) => {
    verify(step);
    Alert.alert('Etapa concluída', 'Continue com as próximas etapas para ficar verificado.');
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: 'Verificação' }} />
      <Card>
        <Text style={styles.title}>
          {isVerified ? 'Você está verificado' : 'Verifique sua identidade'}
        </Text>
        <Text style={styles.text}>
          Perfis verificados passam mais confiança nos encontros. Sem verificação, não é possível reservar espaços parceiros.
        </Text>
        <Text style={styles.progress}>{done} de {verificationSteps.length} etapas concluídas</Text>
      </Card>

      {verificationSteps.map((step) => {
        const ok = verification[step.key];
        return (
          <Card key={step.key}>
            <View style={styles.row}>
              <Ionicons
                name={ok ? 'checkmark-circle' : 'ellipse-outline'}
                size={26}
                color={ok ? colors.gold : colors.muted}
              />
              <View style={styles.flex}>
                <Text style={styles.stepTitle}>{step.label}</Text>
                <Text style={styles.hint}>{step.hint}</Text>
              </View>
              {ok && <Badge label="Feito" tone="navy" />}
            </View>
            {!ok && (
              <Button title="Concluir etapa" variant="outline" style={styles.action} onPress={() => confirm(step.key)} />
            )}
          </Card>
        );
      })}

      {isVerified && <Button title="Voltar" onPress={() => router.back()} style={styles.action} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  content: { padding: 16, paddingBottom: 32 },
  title: { color: colors.navy, fontSize: 18, fontWeight: '700' },
  text: { color: colors.text, marginTop: 6, lineHeight: 21 },
  progress: { color: colors.gold, fontWeight: '700', marginTop: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  flex: { flex: 1 },
  stepTitle: { color: colors.navy, fontWeight: '700', fontSize: 15 },
  hint: { color: colors.muted, marginTop: 2, fontSize: 13 },
  action: { marginTop: 12 },
});
