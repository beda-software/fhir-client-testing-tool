export class CreateRequestDto {
  request_method: string;
  fhir_action: string;
  request_uri: string;
  remote_addr: string;
  user_agent: string;
  headers: string;
  data: string;
}
