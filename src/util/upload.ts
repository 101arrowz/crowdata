import api, { makeBody } from './api';

const upload = async (type: string, data: Blob, info: string[], id: string): Promise<boolean> => (await api('/submit/' + type, { method: 'POST', body: makeBody({ data, info, id }) })).ok;
export default upload;