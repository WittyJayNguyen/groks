import { backendBaseFromWindow } from "../helpers/apiDocsHelpers";
import { listPartnerEndpoints } from "../services/apiDocsService";

export function useApiDocs() {
  return {
    base: backendBaseFromWindow(),
    endpoints: listPartnerEndpoints(),
  };
}
