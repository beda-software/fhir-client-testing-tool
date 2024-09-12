import { createTestListObject, getFHIRAction } from './data';

describe('getFHIRAction', () => {
    test.each([
        ['READ', 'GET', '/Patient/123'],
        ['VREAD', 'GET', '/Patient/123/_history/1'],
        ['CREATE', 'POST', '/Patient'],
        ['UPDATE', 'PUT', '/Patient/123'],
        ['DELETE', 'DELETE', '/Patient/123'],
        ['SEARCH', 'GET', '/Patient?name=Smith'],
        ['SEARCH', 'POST', '/Patient/_search'],
        ['HISTORY', 'GET', '/Patient/_history'],
        ['PATCH', 'PATCH', '/Patient/123'],
    ])('should return correct FHIR action for %s', (expectedAction, method, url) => {
        expect(getFHIRAction(method, url)).toBe(expectedAction);
    });
});

describe('Data utilities', () => {
    it('Should return correct test list from test result object', async () => {
        const testRunResult = {
            results: {
                numFailedTestSuites: 0,
                numFailedTests: 0,
                numPassedTestSuites: 1,
                numPassedTests: 4,
                numPendingTestSuites: 0,
                numPendingTests: 0,
                numRuntimeErrorTestSuites: 0,
                numTodoTests: 0,
                numTotalTestSuites: 1,
                numTotalTests: 4,
                openHandles: [],
                snapshot: {
                    added: 0,
                    didUpdate: false,
                    failure: false,
                    filesAdded: 0,
                    filesRemoved: 0,
                    filesRemovedList: [],
                    filesUnmatched: 0,
                    filesUpdated: 0,
                    matched: 0,
                    total: 0,
                    unchecked: 0,
                    uncheckedKeysByFile: [],
                    unmatched: 0,
                    updated: 0,
                },
                startTime: 1725776846607,
                success: true,
                testResults: [
                    {
                        leaks: false,
                        numFailingTests: 0,
                        numPassingTests: 4,
                        numPendingTests: 0,
                        numTodoTests: 0,
                        openHandles: [],
                        perfStats: {
                            end: 1725776847159,
                            runtime: 524,
                            slow: false,
                            start: 1725776846635,
                        },
                        skipped: false,
                        snapshot: {
                            added: 0,
                            fileDeleted: false,
                            matched: 0,
                            unchecked: 0,
                            uncheckedKeys: [],
                            unmatched: 0,
                            updated: 0,
                        },
                        testFilePath: '/app/src/suites/1.0.0-ballot/Patient/patients.spec.ts',
                        testResults: [
                            {
                                ancestorTitles: ['Patients test'],
                                duration: 3,
                                failureDetails: [],
                                failureMessages: [],
                                fullName: 'Patients test Should only have available interactions',
                                invocations: 1,
                                location: null,
                                numPassingAsserts: 1,
                                retryReasons: [],
                                status: 'passed',
                                title: 'Should only have available interactions',
                            },
                            {
                                ancestorTitles: ['Patients test'],
                                duration: 1,
                                failureDetails: [],
                                failureMessages: [],
                                fullName: 'Patients test Should only have available search params',
                                invocations: 1,
                                location: null,
                                numPassingAsserts: 1,
                                retryReasons: [],
                                status: 'passed',
                                title: 'Should only have available search params',
                            },
                            {
                                ancestorTitles: ['Patients test'],
                                duration: 1,
                                failureDetails: [],
                                failureMessages: [],
                                fullName: 'Patients test Should only have available combo search params',
                                invocations: 1,
                                location: null,
                                numPassingAsserts: 1,
                                retryReasons: [],
                                status: 'passed',
                                title: 'Should only have available combo search params',
                            },
                            {
                                ancestorTitles: ['Patients test'],
                                duration: 0,
                                failureDetails: [],
                                failureMessages: [],
                                fullName: 'Patients test Should only have valid resources in CREATE action',
                                invocations: 1,
                                location: null,
                                numPassingAsserts: 1,
                                retryReasons: [],
                                status: 'passed',
                                title: 'Should only have valid resources in CREATE action',
                            },
                        ],
                        failureMessage: null,
                    },
                ],
                wasInterrupted: false,
            },
        };

        expect(createTestListObject(testRunResult)).toEqual([
            {
                suiteId: 'suites',
                groups: [
                    {
                        groupName: 'Patients test',
                        tests: [
                            'Patients test Should only have available interactions',
                            'Patients test Should only have available search params',
                            'Patients test Should only have available combo search params',
                            'Patients test Should only have valid resources in CREATE action',
                        ],
                    },
                ],
            },
        ]);
    });
});
