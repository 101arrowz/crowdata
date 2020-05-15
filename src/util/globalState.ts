import { useState } from 'react';

const globalState: { [k: string]: unknown } = JSON.parse(
  localStorage.getItem('globalState') || '{}'
);

const persistGlobalState = (): void =>
  localStorage.setItem('globalState', JSON.stringify(globalState));
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden')
    persistGlobalState();
})

type GlobalSetState<T> = React.Dispatch<React.SetStateAction<T>>;
type GlobalStateHook<T> = () => [T, GlobalSetState<T>];
const createGlobalStateHook = <T>(name: string, defaultValue: T): GlobalStateHook<T> => {
  const updateStateFor = new Set<GlobalSetState<T>>();
  if (typeof globalState[name] === 'undefined') globalState[name] = defaultValue;
  return () => {
    const [state, setState] = useState(globalState[name] as T);
    updateStateFor.add(setState);
    return [
      state,
      val => {
        globalState[name] = val;
        const it = new Set(updateStateFor);
        updateStateFor.clear();
        for (const f of it) f(val);
      }
    ];
  };
};

const useID = createGlobalStateHook<string>('id', null);
const useCompleted = createGlobalStateHook<string[][]>('completed', []);
const useRequestedAudioPermission = createGlobalStateHook<boolean>('audioPermission', false);
export { useID, useCompleted, useRequestedAudioPermission };
