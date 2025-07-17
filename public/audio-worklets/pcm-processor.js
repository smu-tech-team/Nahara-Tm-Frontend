class PCMProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffer = [];
    this.port.onmessage = (e) => {
      if (e.data.type === 'pcm') {
        this.buffer.push(...e.data.chunk);
      }
    };
  }

  process(inputs, outputs) {
    const output = outputs[0];
    const channel = output[0];
    for (let i = 0; i < channel.length; i++) {
      channel[i] = this.buffer.length > 0 ? this.buffer.shift() : 0;
    }
    return true;
  }
}

registerProcessor('pcm-processor', PCMProcessor);
