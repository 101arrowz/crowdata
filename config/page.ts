import { DataPage } from '../src/util/types';
import Record from '../src/pages/record';
/**
 * This is the type of data to gather from your participants. You need to
 * import the component associated with that type, then set the type to that
 * component. In this example, we use the recording page.
 * 
 * If you are planning on designing your own, make sure to call onComplete
 * (which is a prop) after extracting the user's response, and make sure that
 * the component resets to its original state after onComplete resolves.
 */
const type: DataPage = Record;
export default type;