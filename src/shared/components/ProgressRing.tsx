import React from 'react';
import { View, StyleSheet } from 'react-native';

interface ProgressRingProps {
  size: number;
  strokeWidth: number;
  progress: number;
  color: string;
  trackColor: string;
  children?: React.ReactNode;
}

const clampProgress = (value: number) => Math.min(100, Math.max(0, value));

export function ProgressRing({
  size,
  strokeWidth,
  progress,
  color,
  trackColor,
  children,
}: ProgressRingProps) {
  const clamped = clampProgress(progress);
  const half = size / 2;
  const rightRotation = clamped <= 50 ? (clamped / 50) * 180 : 180;
  const leftRotation = clamped > 50 ? ((clamped - 50) / 50) * 180 : 0;

  return (
    <View style={{ width: size, height: size }}>
      <View
        style={[
          styles.track,
          {
            width: size,
            height: size,
            borderRadius: half,
            borderWidth: strokeWidth,
            borderColor: trackColor,
          },
        ]}
      />

      {clamped > 0 && (
        <View style={[styles.rightWrap, { width: half, height: size }]}>
          <View
            style={[
              styles.halfCircle,
              {
                width: size,
                height: size,
                borderRadius: half,
                borderWidth: strokeWidth,
                borderColor: color,
                left: -half,
                transform: [{ rotateZ: `${rightRotation}deg` }],
              },
            ]}
          />
        </View>
      )}

      {clamped > 50 && (
        <View style={[styles.leftWrap, { width: half, height: size }]}>
          <View
            style={[
              styles.halfCircle,
              {
                width: size,
                height: size,
                borderRadius: half,
                borderWidth: strokeWidth,
                borderColor: color,
                transform: [{ rotateZ: `${leftRotation}deg` }],
              },
            ]}
          />
        </View>
      )}

      {children ? <View style={styles.center}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  leftWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
  },
  rightWrap: {
    position: 'absolute',
    top: 0,
    right: 0,
    overflow: 'hidden',
  },
  halfCircle: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
