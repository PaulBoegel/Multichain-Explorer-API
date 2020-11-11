import { handleResponse, handleError } from "./apiUtils";
const baseUrl = "http://localhost:3000/api/transactions";

export function getTransaction(chainname, txid) {
  return fetch(baseUrl + `/${chainname}/` + txid)
    .then(handleResponse)
    .catch(handleError);
}

export function getOutputTransactions(chainname, txid) {
  return fetch(baseUrl + `/output/${chainname}/${txid}`)
    .then(handleResponse)
    .catch(handleError);
}
