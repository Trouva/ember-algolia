import queryString from 'npm:query-string';

/**
 * Updates a url to add/remove a query parameter
 *
 * @param  {String} url         URL that will be updated
 * @param  {String} paramName   Name of query parameter to be updated
 * @param  {Any} paramValue     Value of query parameter being updated
 * @return {String}             Final constructed URL
 */
export function replaceQueryParam(url, paramName, paramValue) {
    const hasQueryParams = url.includes('?');

    // Extract urlPath and queryParams
    const [ urlPath, queryParams ] = url.split('?');

    // Start with empty object, update if there are query params.
    let queryParamsObj = {};
    if (hasQueryParams) {
        queryParamsObj = queryString.parse(queryParams);
    }

    // Parse the query parameters, update the necessary value
    queryParamsObj[paramName] = paramValue;
    // Reconstruct query parameters string, return the complete result
    const newQueryParams = queryString.stringify(queryParamsObj);
    return `${urlPath}?${newQueryParams}`;
}
