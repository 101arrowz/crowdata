import { DataPage } from '../util/types';
import Record from '../pages/record';

/**
 * This is the type of data to gather from your participants. You need to
 * import the component associated with that type, then set the type to that
 * component. In this example, we use the recording page.
 */
const type: DataPage = Record;

export default type;
