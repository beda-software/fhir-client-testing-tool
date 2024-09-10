class CustomReporter {
    constructor(globalConfig, options) {
        this._globalConfig = globalConfig;
        this._options = options;
        this.totalSuites = 0;
        this.suitesCount = 0;
        this.testRunId = this._options.TEST_RUN_ID;
        this.testRunService = this._options.TEST_RUN_SERVICE;
    }

    async onRunStart(test) {
        this.totalSuites = test.numTotalTestSuites;
        const testRun = await this.testRunService.findOne(this.testRunId);
        await this.testRunService.update({ ...testRun, ...{ suiteTotal: this.totalSuites, status: 'running' } });
    }

    onTestStart() {
        // Just for the info;
    }

    async onTestResult() {
        this.suitesCount += 1;
        const testRun = await this.testRunService.findOne(this.testRunId);
        await this.testRunService.update({ ...testRun, ...{ suitePassed: this.suitesCount } });
    }

    async onRunComplete() {
        const testRun = await this.testRunService.findOne(this.testRunId);
        await this.testRunService.update({ ...testRun, ...{ status: 'completed' } });
    }
}

module.exports = CustomReporter;
