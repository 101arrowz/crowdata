import { createGlobalStateHook, createLocalStorageBackend } from 'react-universal-state';

const backend = createLocalStorageBackend<{
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
