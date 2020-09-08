const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient({ host: 'localhost', port: 5001, protocol: 'http' });

import { IPNS_ADDRESS, IPNS_KEY } from './constants.js';

const decoder = new TextDecoder('utf-8');

/**
 * Gets the Ethereum public key from our IPFS database
 * @param {String} domainName - The domain that you want the public key of  
 * @return {String} - The corresponding public key if successful or undefined
 * 
 */
export async function getPublicKey(domainName) {
    // Retrieve the entire database as a string
    const database = await getDatabse();
    // console.log(database)
    const domainData = database[domainName]
    // console.log(database[domainName])
    return domainData
}

/**
 * Retrieves the most recent revision of the database using IPNS
 * @return {Object} - the database object
 */
export async function getDatabse() {
    // Retrieve the address of the most recent database version
    var ipfsAddress;
    for await (const name of ipfs.name.resolve(IPNS_ADDRESS)) {
        ipfsAddress = name;
    }

    // Retrieve the database from IPFS
    const source = await ipfs.cat(ipfsAddress);
    var data = '';
    for await (const chunk of source) {
        data += decoder.decode(chunk, { stream: true });
    }

    // Return the data as a JSON object.
    return JSON.parse(data);
}

/**
 * Adds a new domain to the IPFS database
 */
export async function addDomain(domainName, publicKey, privateKey) {
    // Retrieve the entire database as a string
    var database = await getDatabse();
    // Add the domain data to the database and stringify
    database[domainName] = {
        "publicKey": publicKey,
        "privateKey": privateKey,
        "cpv": 0.25
    }
    const databaseString = JSON.stringify(database);

    updateDatabase(databaseString);
}

/**
 * Updates the cost per page view for a specific domain
 */
export async function updateCost(domainName, cost) {

}

export async function updateDatabase(databaseString) {
    // Wait for the data to be added to IPFS and store the returned hash address
    const newIpfsAddress = await ipfs.add(databaseString)

    // Publish the address to IPNS to update the pointer to the latest data
    const ipnsOptions = { 'allowOffline': true, 'key': IPNS_KEY };
    await ipfs.name.publish(newIpfsAddress.path, ipnsOptions)
}
