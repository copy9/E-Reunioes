import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

type Props = {
  title: string;
  description?: string;
};

// Tela provisória para as rotas ainda não implementadas.
export function PlaceholderScreen({ title, description }: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{title}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.description}>
          {description ?? 'Tela em construção.'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  header: {
    backgroundColor: colors.navy,
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerText: { color: colors.white, fontSize: 20, fontWeight: '700' },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  description: { color: colors.muted, fontSize: 16, textAlign: 'center' },
});
