import { useState } from 'react';

const globalState: { [k: string]: unknown } = JSON.parse(
  localStorage.getItem('globalState') || '{}'
);

const persistGlobalState = (): void =>
  localStorage.setItem('globalState', JSON.stringify(globalState));
window.addEventListener('beforeunload', persistGlobalState);

type GlobalSetState<T> = (val: T) => void;
type GlobalStateHook<T> = () => [T, GlobalSetState<T>];
const createGlobalStateHook = <T>(name: string, defaultValue: T): GlobalStateHook<T> => {
  const updateStateFor = new Set<GlobalSetState<T>>();
  let selectedState: T = globalState[name] as T;
  if (typeof selectedState === 'undefined') globalState[name] = selectedState = defaultValue;
  return () => {
    const [state, setState] = useState(selectedState);
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
export default {
  id: useID,
  completed: useCompleted
};
export { useID, useCompleted };
