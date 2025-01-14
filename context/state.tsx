// Copyright (c) ZeroC, Inc.

import { baseUrls } from 'data/side-bar-data';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { Mode, Platform } from 'types';

type ModeContextType = {
  mode: Mode;
  setMode: (mode: Mode) => void;
};
type PlatformContextType = {
  platform: Platform;
  setPlatform: (platform: Platform) => void;
};

const ModeContext = createContext<ModeContextType>({
  mode: Mode.Slice2,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setMode: () => {}
});
const PlatformContext = createContext<PlatformContextType>({
  platform: Platform.csharp,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setPlatform: () => {}
});

type Props = {
  children: ReactNode;
};

const getModeFromPath = (path: string) => {
  const pathSegments = path.split('/');
  const modeSegmentWithoutFragment = pathSegments[1].split('#')[0];

  const baseUrl =
    baseUrls.find((item) => item === `/${modeSegmentWithoutFragment}`) ?? '';
  if (baseUrl === '/slice1') {
    return Mode.Slice1;
  } else if (baseUrl === '/slice2') {
    return Mode.Slice2;
  } else {
    return null;
  }
};

export function AppWrapper({ children }: Props) {
  const [mode, setMode] = useState<Mode>(Mode.Slice2);
  const [platform, setPlatform] = useState<Platform>(Platform.csharp);
  const { asPath, isReady } = useRouter();

  useEffect(() => {
    // If the router is not ready, we can't determine if we should ignore
    // the current mode.
    if (!isReady) return;

    // Get the mode from the path
    const pathMode = getModeFromPath(asPath);

    // Get the platform and mode strings from local storage if it exists
    const localPlatformString = localStorage.getItem('platform');
    const localModeString = localStorage.getItem('mode');

    // If the platform and mode exist in local storage, parse them and set them as the current platform and mode
    const localPlatform: Platform | null = localPlatformString
      ? JSON.parse(localPlatformString)
      : null;
    const localMode: Mode | null = localModeString
      ? JSON.parse(localModeString)
      : null;

    localPlatform && setPlatform(localPlatform);

    // If the path mode exists, set the mode to the path mode
    // Otherwise, if the local mode exists, set the mode to the local mode
    pathMode ? setMode(pathMode) : localMode && setMode(localMode);
  }, [asPath, isReady]);

  useEffect(() => {
    // Set the platform and mode in local storage when they change
    localStorage.setItem('mode', JSON.stringify(mode));
    localStorage.setItem('platform', JSON.stringify(platform));
  }, [mode, platform]);

  return (
    <ModeContext.Provider value={{ mode: mode, setMode: setMode }}>
      <PlatformContext.Provider value={{ platform, setPlatform }}>
        {children}
      </PlatformContext.Provider>
    </ModeContext.Provider>
  );
}

// Custom hook to handle setting and observing the mode
export const useMode = (): ModeContextType => {
  return useContext(ModeContext);
};

// Custom hook to handle setting and observing the platform
export const usePlatform = (): PlatformContextType => {
  return useContext(PlatformContext);
};

// Custom hook to handle component mounting
export const useMounted = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
};
