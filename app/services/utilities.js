/**
 * Function that determines the current user login state based on the local 
 * storage data.
 * @param {*} storage: local storage data array
 */
export function userIsLoggedIn(keys) {
  const publicKey = keys['publicKey']
  const privateKey = keys['privateKey']

  return (publicKey !== undefined && publicKey !== '' &&
    privateKey !== undefined && privateKey !== '')
}

/**
 * Checks whether a string is a valid URL and trims extra information
 * @param {String} url - the URL you want to filter
 * @return {String} - the filtered URL if valid, else undefined
 */
export function filterUrl(url) {
  var filteredUrl;
  // Regular expression used to filter URLs
  const urlRegExp =
    /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=-]{2,256}\.[a-z]{2,6}\b/;

  if (url !== undefined) {
    var temp = (url.match(urlRegExp) || []).join('');
    if (temp !== '') filteredUrl = temp;
  }

  return filteredUrl;
}
