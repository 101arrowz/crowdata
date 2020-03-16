import config from '../../config';
function* cartesian<T>(head?: T[], ...tail: T[][]): Generator<T[]> {
  for (const r of tail.length ? cartesian(...tail) : [([] as unknown) as T])
    for (const h of head) yield [h, ...r];
}
const { suggestedRatio = 1, idOptions = [], infoPhrase = '', instructions } = config;
const conf = [...cartesian(...instructions.map(c => Object.keys(c[1])))];

export default conf;
export { suggestedRatio as desiredRatio, instructions as sourceConfigs, infoPhrase, idOptions }