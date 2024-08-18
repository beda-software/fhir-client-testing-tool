import axios from 'axios';
import { FhirResource } from 'fhir/r4';

function getValidatorEnvs() {
    const { VALIDATOR_URL, IG, IG_VERSION, TX_SERVER, VALIDATOR_SENSITIVITY } = process.env;

    if (!VALIDATOR_URL || !IG || !IG_VERSION || !TX_SERVER || !VALIDATOR_SENSITIVITY) {
        console.warn('Missing validator variables');

        return {
            VALIDATOR_URL: 'http://validator-api:3500',
            IG: 'hl7.fhir.au.core',
            IG_VERSION: '1.0.0-ballot',
            TX_SERVER: 'https://tx.dev.hl7.org.au/fhir',
            VALIDATOR_SENSITIVITY: ['ERROR'],
        };
    }

    return { VALIDATOR_URL, IG, IG_VERSION, TX_SERVER, VALIDATOR_SENSITIVITY: VALIDATOR_SENSITIVITY.split(',') };
}

export async function validateResource(ig: string, version: string, txServer: string, resource: string) {
    const { VALIDATOR_URL } = getValidatorEnvs();

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

    const response = await axios.post(`${VALIDATOR_URL}/validate`, requestConfig, { timeout: 30000 });

    return response.data;
}

export async function isResourceValid(resource: FhirResource): Promise<boolean> {
    const { IG, IG_VERSION, TX_SERVER, VALIDATOR_SENSITIVITY } = getValidatorEnvs();
    try {
        const result = await validateResource(IG, IG_VERSION, TX_SERVER, JSON.stringify(resource));
        return result.outcomes?.[0]?.issues.filter((issue) => VALIDATOR_SENSITIVITY.includes(issue.level)).length === 0;
    } catch (error) {
        console.error('Error validating resource', error);
        return false;
    }
}

export async function initialValidateResource() {
    const { IG, IG_VERSION, TX_SERVER } = getValidatorEnvs();
    const resourceToValidate = '"{"resourceType": "Patient"}"';
    console.info('Initialization validator with specific config');
    console.info('IG is: ', IG);
    console.info('IG version is: ', IG_VERSION);
    console.info('TX server is: ', TX_SERVER);

    try {
        await validateResource(IG, IG_VERSION, TX_SERVER, resourceToValidate);
        console.info('Initialization validator with specific config done');
    } catch (error) {
        console.error('Error initializing validator with specific config', error);
        return;
    }
}
