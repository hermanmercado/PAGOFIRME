import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center gap-6 px-6">
        <View className="rounded-full bg-brand-50 px-4 py-1">
          <Text className="text-sm font-medium text-brand-700">🇧🇴 Hecho en Bolivia</Text>
        </View>

        <Text className="text-center text-3xl font-bold text-ink">
          Pagos QR con{'\n'}
          <Text className="text-brand-500">cero comisiones</Text>
        </Text>

        <Text className="text-center text-base text-ink-muted">
          Cobrá por QR interoperable, billeteras y transferencias internas, sin pagar comisión.
        </Text>

        <Pressable className="mt-2 h-12 items-center justify-center rounded-lg bg-brand-500 px-8 active:bg-brand-600">
          <Text className="text-base font-semibold text-white">Crear cuenta</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
