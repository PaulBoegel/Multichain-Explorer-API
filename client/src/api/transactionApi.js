import { handleResponse, handleError } from "./apiUtils";
const baseUrl = process.env.API_URL + "/transactions/";

export function getTransaction(chainname, txid) {
  return fetch(baseUrl + `/${chainname}/` + txid)
    .then(handleResponse)
    .catch(handleError);
}
