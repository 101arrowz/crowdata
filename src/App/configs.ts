const sourceConfigs: [string, { [k: number]: string }][] = [
  [
    'Say the phrase',
    {
      0: 'Kids are talking by the door',
      1: 'Dogs are sitting by the door'
    }
  ],
  [
    'Emulate emotion',
    {
      0: 'Neutral',
      1: 'Calm',
      2: 'Happy',
      3: 'Sad',
      4: 'Angry',
      5: 'Fearful',
      6: 'Disgusted',
      7: 'Suprised'
    }
  ]
];
function* cartesian<T>(head?: T[], ...tail: T[][]): Generator<T[]> {
  for (const r of tail.length ? cartesian(...tail) : [([] as unknown) as T])
    for (const h of head) yield [h, ...r];
}
const infoPhrase = 
`Hello! We'll ask you to say one of two phrases with one of eight emotions. For example, "Kids are talking by the door" in a happy tone.
After you upload your voice sample for one phrase-emotion pairing, you'll get the next one. You can stop whenever you'd like, but we'd appreciate if you did 4 or optimally 8.
If you don't like a certain phrase or emotion, refresh the page to get a new one. To start, select one of the following:`
const desiredRatio = 0.5;
const conf = [...cartesian(...sourceConfigs.map(c => Object.keys(c[1]).map(e => +e)))];
export default conf;
export { sourceConfigs, infoPhrase, desiredRatio };
