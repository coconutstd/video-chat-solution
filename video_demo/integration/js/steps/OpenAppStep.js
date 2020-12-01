const AppTestStep = require('../utils/AppTestStep');

class OpenAppStep extends AppTestStep {
  constructor(kiteBaseTest, sessionInfo) {
    super(kiteBaseTest, sessionInfo);
  }

  static async executeStep(KiteBaseTest, sessionInfo) {
    const step = new OpenAppStep(KiteBaseTest, sessionInfo);
    await step.execute(KiteBaseTest);
  }

  stepDescription() {
    return 'Open app';
  }

  async run() {
    this.logger(`Opening : ${this.url}`);
    await this.page.open(this);
  }
}

module.exports = OpenAppStep;
