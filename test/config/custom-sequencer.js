/* eslint-disable @typescript-eslint/no-var-requires */
const Sequencer = require('@jest/test-sequencer').default;

class CustomSequencer extends Sequencer {
  sort(tests) {
    const order = [
      'auth.e2e-spec.ts',
      'users.e2e-spec.ts',
      'banks.e2e-spec.ts',
      'flags.e2e-spec.ts',
      'credit-cards.e2e-spec.ts',
    ];

    return tests.sort((testA, testB) => {
      const indexA = order.findIndex((file) => testA.path.includes(file));
      const indexB = order.findIndex((file) => testB.path.includes(file));
      return indexA - indexB;
    });
  }
}

module.exports = CustomSequencer;
