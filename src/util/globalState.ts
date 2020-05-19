import { createGlobalStateHook, LocalStorageBackend } from 'react-universal-state';

const backend = new LocalStorageBackend<{
  id: string,
  completed: string[][],
  audioPermission: boolean
}>('globalState');

const useGlobal = createGlobalStateHook({
  id: null,
  completed: [],
  audioPermission: false
}, backend);

export { useGlobal };
