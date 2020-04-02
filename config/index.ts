import { Options } from '../src/util/types';
/**
 * This is the configuration file for Crowdata. You shouldn't need to touch the
 * code at all if you configure your Crowdata properly.
 * 
 * Make sure to see the page config on the
 *
 * Your IDE or the app builder will warn you if you configure something with an
 * incorrect type.
 */

/**
 * This is extra polyfills to include. Useful if you write a custom data page,
 * and still mandatory if you use an existing data page (just import 
 * 'pagelocation/polyfills').
 * 
 * Each key should be a polyfill name, and values should be whether to include
 * them mandatorily.
 * 
 * Keep in mind that only the polyfills supported by `polyfill-library` (same
 * as polyfill.io) can be used here. If one isn't supported, add it directly
 * in the data page file.
 * 
 * See below for example.
 */
import recordPolyfills from '../src/pages/record/polyfills';
const polyfills: { [k: string]: boolean } = recordPolyfills;

/**
 * These are the options for the generated ID that is associated with each
 * anonymous data contributor.
 *
 * Each element of the array represents one feature of the ID.
 *
 * The first value is the prompt for the question and should be a string.
 *
 * The second is a "map" of possible answers to that question, with keys being
 * what becomes a part of the ID if that answer is picked and values being the
 * answers as they appear for the participant. (Well, it's not exactly a map.
 * If you pass an array, the index of each answer will be used in the ID. If
 * you pass an object, it will be interpreted as a map.)
 *
 * Note that you can just make it an empty array if you don't need any extra
 * information about your participants.
 *
 * See below for examples.
 */
const idOptions: Options = [
  ['Sex', ['Male', 'Female', 'Neither / Prefer not to say']]
  /* These are possible additions into idOptions, as examples.
  ['Favorite color', { r: 'Red', g: 'Green', b: 'Blue' }],
  ['Which number is luckier', { 3: 'Three', 7: 'Seven' }]
  */
];

/**
 * This is the information you will give to the participant before they begin
 * and should be a string. It will appear above the ID options.
 */
const info = `Hello! We'll ask you to say one of two phrases with one of eight emotions. For example, we might ask that you say "Kids are talking by the door" in a happy tone.
After you upload your voice sample for one phrase-emotion pairing, you'll get the next one. You can stop whenever you'd like, but we'd appreciate if you did 4 or optimally 8 recordings.
If you don't like a certain phrase or emotion, refresh the page to get a new one. To start, select one of the following:`;

/**
 * These are the options for the instructions given to each particpant when
 * they begin submitting their data.
 *
 * Each element of the array represents one part of the instruction.
 *
 * The first value is the type of information that the instruction is referring
 * to and should be a string
 *
 * The second is a "map" of possible values to show the user, with keys being
 * what becomes a part of the server-side storage if that value is picked and
 * values being the information as they appear to the participant. (Same
 * disclaimer as idOptions applies.)
 *
 * See below for examples.
 */
const instructions: Options = [
  ['Say the phrase', ['Kids are talking by the door', 'Dogs are sitting by the door']],
  [
    'Emulate emotion',
    ['Neutral', 'Calm', 'Happy', 'Sad', 'Angry', 'Fearful', 'Disgusted', 'Surprised']
  ]
];

/**
 * This is the ratio of samples you would like from each user to total possible
 * samples you can get from the user. It relates to when you'll thank the
 * participant for their help the first time.
 */
const suggestedRatio = 0.5;

export { idOptions, instructions, suggestedRatio, info, polyfills };
