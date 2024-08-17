import axios from 'axios';
import e from 'express';
import { FhirResource } from 'fhir/r4';

export async function validateResource(ig: string, version: string, txServer: string, resource: string) {
    const { VALIDATOR_URL } = process.env;

    const requestConfig = {
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
    };

    return axios.post(`${VALIDATOR_URL}/validate`, requestConfig);
}

export async function isResourceValid(resource: FhirResource): Promise<boolean> {
    const { IG, IG_VERSION, TX_SERVER } = process.env;
    try {
        const result = await validateResource(IG, IG_VERSION, TX_SERVER, JSON.stringify(resource));
        return result.data.outcomes?.[0]?.issues.length === 0;
    } catch (error) {
        console.error('Error validating resource', error);
        return false;
    }
}

export async function initialValidateResource() {
    const { IG, IG_VERSION, TX_SERVER } = process.env;
    const resourceToValidate = '"{"resourceType": "Patient"}"';
    console.log('Initialization validator with specific config');
    console.log('IG is: ', IG);
    console.log('IG version is: ', IG_VERSION);
    console.log('TX server is: ', TX_SERVER);

    try {
        await validateResource(IG, IG_VERSION, TX_SERVER, resourceToValidate);
        console.log('Initialization validator with specific config done');
    } catch (error) {
        console.error('Error initializing validator with specific config', error);
        return;
    }
}
