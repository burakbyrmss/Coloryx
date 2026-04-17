import React from 'react';

import { ensureDeviceBootstrap } from '@/services/auth/deviceBootstrap';

export function DeviceRegistrationBootstrap() {
  React.useEffect(() => {
    void ensureDeviceBootstrap().catch(() => {
      // Non-blocking: user can still use the app; retries on next cold start or explicit login flow.
    });
  }, []);

  return null;
}
