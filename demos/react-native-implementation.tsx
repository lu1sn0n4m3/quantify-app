// NeoBrutal Finance — React Native scaffold (TypeScript)
// Minimal but production-ready structure showing: drag sorting with a handle, fully clickable expansions, and a neo‑brutal style.
// -----------------------------------------------------------------------------
// package.json (for reference)
// -----------------------------------------------------------------------------
// {
//   "name": "neobrutal-finance",
//   "private": true,
//   "version": "0.1.0",
//   "main": "index.js",
//   "scripts": { "start": "react-native start", "android": "react-native run-android", "ios": "react-native run-ios" },
//   "dependencies": {
//     "react": "18.x",
//     "react-native": "0.7x.x",
//     "react-native-gesture-handler": "^2.16.2",
//     "react-native-reanimated": "^3.10.1",
//     "react-native-draggable-flatlist": "^4.0.1",
//     "react-native-svg": "^15.2.0",
//     "zustand": "^4.5.2"
//   }
// }

// -----------------------------------------------------------------------------
// babel.config.js (remember to enable reanimated plugin LAST)
// -----------------------------------------------------------------------------
// module.exports = {
//   presets: ['module:metro-react-native-babel-preset'],
//   plugins: ['react-native-reanimated/plugin'],
// };

// -----------------------------------------------------------------------------
// src/theme/colors.ts
// -----------------------------------------------------------------------------
export const colors = {
    canvas: '#0f172a', // outside bg (not the phone)
    screenBg: '#fef08a',
    screenText: '#111827',
    cardBg: '#fef3c7',
    ink: '#111827',
    accent: '#0b0f1a',
    warning: '#ef4444',
    overlayDim: 'rgba(17,24,39,0.45)'
  };
  
  // -----------------------------------------------------------------------------
  // src/utils/format.ts
  // -----------------------------------------------------------------------------
  export const currency = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
  
  // -----------------------------------------------------------------------------
  // src/store/useWidgetsStore.ts (Zustand store for order + expansion)
  // -----------------------------------------------------------------------------
  import { create } from 'zustand';
  
  export type WidgetKind = 'totalBalance' | 'performance' | 'marketNews';
  
  export type Widget = {
    id: string;
    kind: WidgetKind;
    title: string;
    summary?: string;
  };
  
  interface State {
    widgets: Widget[];
    setWidgets: (widgets: Widget[]) => void;
    expandedId: string | null;
    open: (id: string) => void;
    close: () => void;
  }
  
  export const useWidgetsStore = create<State>((set) => ({
    widgets: [
      { id: 'w1', kind: 'totalBalance', title: 'Total Balance', summary: 'Steady monthly growth driven by tech and energy sectors.' },
      { id: 'w2', kind: 'performance', title: 'Performance (30d)', summary: 'Equities up 5%, bonds slightly down, stable risk profile.' },
      { id: 'w3', kind: 'marketNews', title: 'Market News', summary: 'Fed speech boosts tech; oil declines; earnings strong.' }
    ],
    setWidgets: (widgets) => set({ widgets }),
    expandedId: null,
    open: (id) => set({ expandedId: id }),
    close: () => set({ expandedId: null }),
  }));
  
  // -----------------------------------------------------------------------------
  // src/components/NeoButton.tsx (dots button)
  // -----------------------------------------------------------------------------
  import React from 'react';
  import { Pressable, View } from 'react-native';
  import { colors } from '../theme/colors';
  
  type Props = { onPress?: () => void; size?: number; horizontal?: boolean; style?: any; testID?: string };
  export const NeoDotsButton: React.FC<Props> = ({ onPress, size = 4, horizontal = true, style, testID }) => {
    return (
      <Pressable onPress={onPress} hitSlop={10} testID={testID}
        style={[{ backgroundColor: colors.ink, borderRadius: 6, paddingVertical: 4, paddingHorizontal: 6 }, style]}
      >
        <View style={{ flexDirection: horizontal ? 'row' : 'column', gap: 4 }}>
          {[0,1,2].map(i => (
            <View key={i} style={{ width: size, height: size, borderRadius: size/2, backgroundColor: colors.screenBg }} />
          ))}
        </View>
      </Pressable>
    );
  };
  
  // -----------------------------------------------------------------------------
  // src/components/NeoCard.tsx (base card styling with handle and expand button)
  // -----------------------------------------------------------------------------
  import React, { PropsWithChildren } from 'react';
  import { View, Text, StyleSheet } from 'react-native';
  import { colors } from '../theme/colors';
  import { NeoDotsButton } from './NeoButton';
  
  export const CARD_RADIUS = 18;
  
  export type NeoCardProps = PropsWithChildren<{
    title?: string;
    subtitleRight?: string;
    onExpand?: () => void;
    renderHandle?: () => React.ReactNode; // supplied by DraggableFlatList
  }>;
  
  export const NeoCard: React.FC<NeoCardProps> = ({ title, subtitleRight, onExpand, renderHandle, children }) => {
    return (
      <View style={styles.card}>
        <View style={styles.handle}>{renderHandle?.()}</View>
        <NeoDotsButton onPress={onExpand} style={styles.expand} testID="expand-btn" />
        {title ? (
          <View style={{ marginBottom: 8 }}>
            <Text style={styles.title}>{title}</Text>
            {subtitleRight ? <Text style={styles.subtitleRight}>{subtitleRight}</Text> : null}
          </View>
        ) : null}
        {children}
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.cardBg,
      borderWidth: 4,
      borderColor: colors.ink,
      borderRadius: CARD_RADIUS,
      padding: 14,
      marginHorizontal: 18,
      marginVertical: 9,
      shadowColor: '#000', shadowOffset: { width: 8, height: 8 }, shadowOpacity: 0.3, shadowRadius: 0,
    },
    title: { fontWeight: '800', fontSize: 16, color: colors.ink },
    subtitleRight: { position: 'absolute', right: 0, top: 0, color: colors.ink },
    handle: { position: 'absolute', top: 10, left: 10, zIndex: 2 },
    expand: { position: 'absolute', top: 10, right: 10, zIndex: 2 },
  });
  
  // -----------------------------------------------------------------------------
  // src/components/OverlayModal.tsx (center overlay with dim + scroll lock)
  // -----------------------------------------------------------------------------
  import React from 'react';
  import { Modal, Pressable, View, StyleSheet, ScrollView } from 'react-native';
  import { colors } from '../theme/colors';
  import { NeoDotsButton } from './NeoButton';
  
  export const OverlayModal: React.FC<{ visible: boolean; onClose: () => void; } & React.PropsWithChildren> = ({ visible, onClose, children }) => {
    return (
      <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <Pressable style={styles.dim} onPress={onClose}>
          {/* Stop propagation into the dimmer */}
          <Pressable onPress={() => {}} style={styles.card}>
            <NeoDotsButton onPress={onClose} style={{ position: 'absolute', top: 10, right: 10 }} />
            <ScrollView contentContainerStyle={{ padding: 20 }}>
              {children}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    );
  };
  
  const styles = StyleSheet.create({
    dim: { flex: 1, backgroundColor: colors.overlayDim, alignItems: 'center', justifyContent: 'center', padding: 12 },
    card: { width: 340, height: 620, backgroundColor: colors.cardBg, borderColor: colors.ink, borderWidth: 4, borderRadius: 24 },
  });
  
  // -----------------------------------------------------------------------------
  // src/widgets/TotalBalanceCard.tsx
  // -----------------------------------------------------------------------------
  import React from 'react';
  import { View, Text } from 'react-native';
  import Svg, { Path } from 'react-native-svg';
  import { NeoCard } from '../components/NeoCard';
  import { useWidgetsStore } from '../store/useWidgetsStore';
  import { colors } from '../theme/colors';
  import { currency } from '../utils/format';
  
  export const TotalBalanceCard: React.FC<{ renderHandle?: () => React.ReactNode; }>=({ renderHandle })=>{
    const open = useWidgetsStore(s=>s.open);
    return (
      <NeoCard title="Total Balance" onExpand={() => open('w1')} renderHandle={renderHandle}>
        <Text style={{ fontWeight: '800', fontSize: 24, color: colors.ink }}>{currency(128450)}</Text>
        <Svg viewBox="0 0 300 140" style={{ height: 120, width: '100%' }}>
          <Path d="M0,100 C60,70 120,110 180,80 240,50 300,100 300,100" stroke={colors.ink} strokeWidth={3} fill="none" />
        </Svg>
      </NeoCard>
    );
  };
  
  // -----------------------------------------------------------------------------
  // src/widgets/PerformanceCard.tsx
  // -----------------------------------------------------------------------------
  import React from 'react';
  import { View } from 'react-native';
  import Svg, { Rect } from 'react-native-svg';
  import { NeoCard } from '../components/NeoCard';
  import { useWidgetsStore } from '../store/useWidgetsStore';
  import { colors } from '../theme/colors';
  
  export const PerformanceCard: React.FC<{ renderHandle?: () => React.ReactNode; }>=({ renderHandle })=>{
    const open = useWidgetsStore(s=>s.open);
    return (
      <NeoCard title="Performance (30d)" onExpand={() => open('w2')} renderHandle={renderHandle}>
        <Svg viewBox="0 0 300 140" style={{ height: 120, width: '100%' }}>
          <Rect x={10} y={90} width={20} height={50} fill={colors.ink} />
          <Rect x={40} y={70} width={20} height={70} fill={colors.ink} />
          <Rect x={70} y={110} width={20} height={30} fill={colors.warning} />
          <Rect x={100} y={60} width={20} height={80} fill={colors.ink} />
          <Rect x={130} y={85} width={20} height={55} fill={colors.ink} />
          <Rect x={160} y={40} width={20} height={100} fill={colors.ink} />
        </Svg>
      </NeoCard>
    );
  };
  
  // -----------------------------------------------------------------------------
  // src/widgets/MarketNewsCard.tsx
  // -----------------------------------------------------------------------------
  import React from 'react';
  import { View, Text, Image, StyleSheet } from 'react-native';
  import { NeoCard } from '../components/NeoCard';
  import { useWidgetsStore } from '../store/useWidgetsStore';
  import { colors } from '../theme/colors';
  
  const NewsRow: React.FC<{ title: string; meta?: string; }>=({ title, meta })=> (
    <View style={styles.newsItem}>
      <View style={styles.thumb} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: '700', color: colors.ink }}>{title}</Text>
        {!!meta && <Text style={{ color: '#6b7280' }}>{meta}</Text>}
      </View>
    </View>
  );
  
  export const MarketNewsCard: React.FC<{ renderHandle?: () => React.ReactNode; }>=({ renderHandle })=>{
    const open = useWidgetsStore(s=>s.open);
    return (
      <NeoCard title="Market News" onExpand={() => open('w3')} renderHandle={renderHandle}>
        <NewsRow title="Markets Rally After Fed Speech" meta="Dow +1.2% | 20m ago" />
        <NewsRow title="Oil Prices Fall Again" meta="Energy sector slides 3%" />
      </NeoCard>
    );
  };
  
  const styles = StyleSheet.create({
    newsItem: { flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: colors.cardBg, borderWidth: 4, borderColor: colors.ink, borderRadius: 18, padding: 10, marginBottom: 10 },
    thumb: { width: 64, height: 64, backgroundColor: colors.ink, borderRadius: 10 },
  });
  
  // -----------------------------------------------------------------------------
  // src/screens/DashboardScreen.tsx (draggable list + overlay)
  // -----------------------------------------------------------------------------
  import React, { useCallback } from 'react';
  import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
  import DraggableFlatList, { RenderItemParams, ScaleDecorator, OpacityDecorator } from 'react-native-draggable-flatlist';
  import { colors } from '../theme/colors';
  import { useWidgetsStore, Widget } from '../store/useWidgetsStore';
  import { TotalBalanceCard } from '../widgets/TotalBalanceCard';
  import { PerformanceCard } from '../widgets/PerformanceCard';
  import { MarketNewsCard } from '../widgets/MarketNewsCard';
  import { OverlayModal } from '../components/OverlayModal';
  
  const Header = () => (
    <View style={styles.header}> 
      <Text style={styles.h2}>NeoBrutal Finance</Text>
      <Text style={styles.pct}>▲ 9.8%</Text>
    </View>
  );
  
  export const DashboardScreen: React.FC = () => {
    const { widgets, setWidgets, expandedId, close } = useWidgetsStore();
  
    const renderItem = useCallback(({ item, drag, isActive }: RenderItemParams<Widget>) => {
      const handle = () => (
        <View accessible accessibilityRole="button" accessibilityLabel="Drag to reorder" style={styles.handleBox}>
          {/* vertical dots */}
          {[0,1,2].map(i => (
            <View key={i} style={styles.dotV} />
          ))}
        </View>
      );
  
      const render = () => {
        switch (item.kind) {
          case 'totalBalance': return <TotalBalanceCard renderHandle={handle} />
          case 'performance': return <PerformanceCard renderHandle={handle} />
          case 'marketNews': return <MarketNewsCard renderHandle={handle} />
        }
      };
  
      return (
        <ScaleDecorator>
          <OpacityDecorator>
            {render()}
          </OpacityDecorator>
        </ScaleDecorator>
      );
    }, []);
  
    return (
      <SafeAreaView style={styles.root}>
        <Header />
        <View style={styles.divider} />
        <DraggableFlatList
          containerStyle={{ paddingBottom: 100 }}
          data={widgets}
          keyExtractor={(it) => it.id}
          onDragEnd={({ data }) => setWidgets(data)}
          renderItem={renderItem}
          activationDistance={0} // we use explicit handle; the card remains fully tappable
        />
  
        <OverlayModal visible={!!expandedId} onClose={close}>
          {/* Expanded content; real app would branch on expandedId */}
          {/* Title */}
          <Text style={{ fontSize: 18, fontWeight: '800', marginBottom: 6, color: colors.ink }}>
            {widgets.find(w => w.id === expandedId)?.title}
          </Text>
          {/* Summary */}
          <Text style={{ color: colors.ink, marginBottom: 12 }}>
            {widgets.find(w => w.id === expandedId)?.summary}
          </Text>
          {/* Placeholder long copy */}
          <Text style={{ color: colors.ink, lineHeight: 20 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vel dolor eget massa viverra convallis. Integer ac lacinia nisl. Nulla facilisi. Cras imperdiet nunc a nibh tristique, vitae tempus magna consequat. Morbi id gravida nibh. Aliquam erat volutpat.
          </Text>
        </OverlayModal>
      </SafeAreaView>
    );
  };
  
  const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.screenBg },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 18, borderBottomWidth: 4, borderBottomColor: colors.ink },
    h2: { fontSize: 20, fontWeight: '800', color: colors.ink },
    pct: { color: colors.ink, fontWeight: '700' },
    divider: { height: 4, backgroundColor: colors.ink },
    handleBox: { backgroundColor: colors.ink, borderRadius: 6, paddingVertical: 4, paddingHorizontal: 6, position: 'absolute', left: 10, top: 10 },
    dotV: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.screenBg, marginVertical: 2 },
  });
  
  // -----------------------------------------------------------------------------
  // src/App.tsx
  // -----------------------------------------------------------------------------
  import React from 'react';
  import { StatusBar, View, StyleSheet } from 'react-native';
  import { colors } from './theme/colors';
  import { DashboardScreen } from './screens/DashboardScreen';
  import 'react-native-gesture-handler';
  import 'react-native-reanimated';
  
  const App: React.FC = () => {
    return (
      <View style={styles.canvas}> 
        <StatusBar barStyle="dark-content" />
        <View style={styles.phone}> 
          {/* Notch purely cosmetic – optional */}
          <View style={styles.notch} />
          <View style={styles.screen}> 
            <DashboardScreen />
          </View>
        </View>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    canvas: { flex: 1, backgroundColor: colors.canvas, alignItems: 'center', justifyContent: 'center', padding: 24 },
    phone: { width: 375, height: 812, borderRadius: 42, backgroundColor: colors.accent, shadowColor: '#000', shadowOpacity: 0.6, shadowRadius: 50 },
    notch: { position: 'absolute', top: 10, left: (375-180)/2, width: 180, height: 30, backgroundColor: '#000', borderBottomLeftRadius: 18, borderBottomRightRadius: 18, zIndex: 10 },
    screen: { position: 'absolute', top: 10, left: 10, right: 10, bottom: 10, borderRadius: 34, overflow: 'hidden', backgroundColor: colors.screenBg },
  });
  
  export default App;
  