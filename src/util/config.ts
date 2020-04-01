import {
  idOptions,
  info as infoPhrase,
  instructions as sourceConfigs,
  suggestedRatio as desiredRatio,
} from '../../config';
import CollectionPage from '../../config/page';
function* cartesian<T>(head?: T[], ...tail: T[][]): Generator<T[]> {
  for (const r of tail.length ? cartesian(...tail) : [([] as unknown) as T])
    for (const h of head) yield [h, ...r];
}
const conf = [...cartesian(...sourceConfigs.map(c => Object.keys(c[1])))];

export default conf;
export { desiredRatio, sourceConfigs, infoPhrase, idOptions, CollectionPage };
