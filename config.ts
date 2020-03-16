type Options = [
  string,
  { [k: number]: string } | { [k: string]: string }
][];

const config: { suggestedRatio?: number, idOptions?: Options, instructions: Options, infoPhrase: string } = {
  suggestedRatio: 0.5,
  idOptions: [
    [
      'Gender',
      ['Male', 'Female', 'Neither / Prefer not to say']
    ],
  ],
  instructions: [
    [
      'Say the phrase',
      ['Kids are talking by the door', 'Dogs are sitting by the door']
    ],
    [
      'Emulate emotion',
      ['Neutral', 'Calm', 'Happy', 'Sad', 'Angry', 'Fearful', 'Disgusted', 'Surprised']
    ]
  ],
  infoPhrase: 
`Hello! We'll ask you to say one of two phrases with one of eight emotions. For example, "Kids are talking by the door" in a happy tone.
After you upload your voice sample for one phrase-emotion pairing, you'll get the next one. You can stop whenever you'd like, but we'd appreciate if you did 4 or optimally 8.
If you don't like a certain phrase or emotion, refresh the page to get a new one. To start, select one of the following:`
}
export default config;