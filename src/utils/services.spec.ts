import axios from 'axios';
import { validateResource } from './services';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('validateResource', () => {
    it('should return validation data', async () => {
        const ig = 'some-ig';
        const version = '1.0.0';
        const txServer = 'http://tx-server';
        const resource = '{"resourceType": "Patient"}';

        const mockResponse = {
            data: {
                outcomes: [
                    {
                        fileInfo: [
                            {
                                fileName: 'manually_entered_file.json',
                                fileContent: '{"resourceType": "Patient"}',
                                fileType: 'json',
                            },
                        ],
                        issues: [],
                    },
                ],
                sessionId: '32fc25cf-020e-4492-ace5-03fe904d22e0',
            },
        };

        mockedAxios.post.mockResolvedValue(mockResponse);

        const result = await validateResource(ig, version, txServer, resource);

        expect(result).toEqual(mockResponse.data);
        expect(mockedAxios.post).toHaveBeenCalledWith(
            expect.stringContaining('/validate'),
            expect.objectContaining({
                cliContext: {
                    sv: '4.0.1',
                    ig: [`${ig}#${version}`],
                    locale: 'en',
                    txServer: txServer,
                },
                filesToValidate: [
                    {
                        fileName: 'manually_entered_file.json',
                        fileContent: resource,
                        fileType: 'json',
                    },
                ],
                sessionId: '32fc25cf-020e-4492-ace5-03fe904d22e0',
            }),
        );
    });
});
