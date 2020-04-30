/*
 * This code is copyrighted, for more info go to link:
 * https://github.com/webrtc/samples/blob/gh-pages/src/content/getusermedia/volume/js/soundmeter.js
 */

// Meter class that generates a number correlated to audio volume.
// The meter class itself displays nothing, but it makes the
// instantaneous and time-decaying volumes available for inspection.
// It also reports on the fraction of samples that were at or near
// the top of the measurement range.

export class SoundMeter {
  public instant: number = 0.0;
  public slow: number = 0.0;
  public clip: number = 0.0;

  private mic: MediaStreamAudioSourceNode;
  private script: ScriptProcessorNode;
  private context: AudioContext = new AudioContext();

  constructor() {
    this.script = this.context.createScriptProcessor(2048, 1, 1);

    this.script.onaudioprocess = (event) => {
      const input = event.inputBuffer.getChannelData(0);

      let sum = 0.0;
      let clipcount = 0;

      for (let i = 0; i < input.length; ++i) {
        sum += input[i] * input[i];
        if (Math.abs(input[i]) > 0.99) {
          clipcount += 1;
        }
      }

      this.instant = Math.sqrt(sum / input.length);
      this.slow = 0.95 * this.slow + 0.05 * this.instant;
      this.clip = clipcount / input.length;
    };
  }

  public connectToSource(stream, callback) {
    console.log('SoundMeter connecting');
    try {
      this.mic = this.context.createMediaStreamSource(stream);
      this.mic.connect(this.script);
      // necessary to make sample run, but should not be.
      this.script.connect(this.context.destination);
      if (typeof callback !== 'undefined') {
        callback(null);
      }
    } catch (e) {
      console.error(e);
      if (typeof callback !== 'undefined') {
        callback(e);
      }
    }
  }

  public stop() {
    this.mic.disconnect();
    this.script.disconnect();
  }
}
