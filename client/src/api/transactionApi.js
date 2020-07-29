import { handleResponse, handleError } from "./apiUtils";
const baseUrl = "http://localhost:3000/api/transactions";

export function getTransaction(chainname, txid) {
  return fetch(baseUrl + `/${chainname}/` + txid)
    .then(handleResponse)
    .catch(handleError);
}
