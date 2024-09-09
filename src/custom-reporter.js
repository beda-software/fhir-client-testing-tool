class CustomReporter {
    constructor(globalConfig, options) {
        this._globalConfig = globalConfig;
        this._options = options;
        this.totalTests = 0;
        this.testCount = 0;
    }

    onRunStart(test, testSuiteResults) {
        testSuiteResults.testResults.forEach((suite) => {
            this.totalTests += suite.numPassingTests + suite.numFailingTests + suite.numPendingTests;
        });
        console.log(`Total tests found: ${this.totalTests}`);
    }

    onTestResult(test, testResult, aggregatedResult) {
        this.testCount += testResult.numPassingTests + testResult.numFailingTests + testResult.numPendingTests;
        console.log(`Progress: ${this.testCount}/${this.totalTests}`);
    }
}

module.exports = CustomReporter;
