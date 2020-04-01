import { createDialogQueue } from '@rmwc/dialog';

const { dialogs, alert, confirm, prompt } = createDialogQueue();

export { dialogs, alert, confirm, prompt };