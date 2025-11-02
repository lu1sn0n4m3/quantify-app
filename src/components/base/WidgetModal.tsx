/**
 * WidgetModal Component
 * 
 * Reusable modal overlay for expanded widgets.
 * Handles animations, blur, and scroll behavior.
 */

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ScrollView, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { colors } from '../../theme/colors';

type WidgetModalProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export const WidgetModal: React.FC<WidgetModalProps> = ({ visible, onClose, children }) => {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const blurAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      slideAnim.setValue(300);
      opacityAnim.setValue(0);
      blurAnim.setValue(0);
      
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 9,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(blurAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [visible]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (visible) {
        onClose();
        return true;
      }
      return false;
    });
    return () => backHandler.remove();
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <>
      {/* Blur overlay */}
      <Animated.View 
        style={[styles.overlay, { opacity: blurAnim }]}
        pointerEvents="none"
      >
        <BlurView intensity={20} style={StyleSheet.absoluteFill} />
      </Animated.View>

      {/* Content */}
      <Animated.View 
        style={[
          styles.content,
          { 
            transform: [{ translateY: slideAnim }],
            opacity: opacityAnim,
          }
        ]}
      >
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            {children}
          </ScrollView>
        </SafeAreaView>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 120,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  content: {
    position: 'absolute',
    top: 120,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1001,
    backgroundColor: colors.screenBg,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 40,
  },
});

