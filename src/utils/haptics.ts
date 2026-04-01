import { Vibration } from 'react-native';

export function triggerLightHaptic(enabled: boolean) {
  if (!enabled) {
    return;
  }
  Vibration.vibrate(12);
}

export function triggerErrorHaptic(enabled: boolean) {
  if (!enabled) {
    return;
  }
  Vibration.vibrate([0, 30, 40, 30]);
}
