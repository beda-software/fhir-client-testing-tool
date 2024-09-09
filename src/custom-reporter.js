class CustomReporter {
    constructor(globalConfig, options) {
        this._globalConfig = globalConfig;
        this._options = options;
        this.totalSuites = 0;
        this.suitesCount = 0;
    }

    onRunStart(test) {
        this.totalSuites = test.numTotalTestSuites;
        console.log('Total test suites:', this.totalSuites);
    }

    onTestResult() {
        this.suitesCount += 1;
        console.log(`Progress: ${this.suitesCount}/${this.totalSuites}`);
    }
}

module.exports = CustomReporter;
