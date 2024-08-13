import { getFHIRAction } from './helpers';

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
  ])(
    'should return correct FHIR action for %s',
    (expectedAction, method, url) => {
      expect(getFHIRAction(method, url)).toBe(expectedAction);
    },
  );
});
