const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient({ host: 'localhost', port: 5001, protocol: 'http' });

import { IPNS_ADDRESS, IPNS_KEY } from './constants.js';

const decoder = new TextDecoder('utf-8');


export function test() {
    // console.log("Hello, World")
}

export async function getAddress(domainName) {
    // Retrieve hash based on domain
    const targetHash = await retrieveHash(domainName);

    // Retrieve and decode data from retrieved hash
    const source = await ipfs.cat(targetHash);
    var data;
    for await (const chunk of source) {
        data += decoder.decode(chunk, { stream: true });
    }

    console.log('Retrieved address for domain: %s', domainName);

    // Return the public key of the data
    return JSON.parse(data).publicKey;
}

export async function addDomain(domainName, publicKey, privateKey) {
    // Create domain data as JSON string
    const domainData = JSON.stringify({ "domainName": domainName, "publicKey": publicKey, "privateKey": privateKey });

    // Wait for the data to be added to ipfs and store the returned hash address
    const hashAddress = await ipfs.add(domainData)
        .catch(console.error)
        .then(hash => hash.path);

    console.log('Generated hash: %s', hashAddress);

    // Afterwards store the hash address in IPNS
    updateDatabase(domainName, hashAddress);
}

export async function retrieveHash(domainName) {
    // Retrieve the entire database as a string
    const existingData = await retrieveDatabse();

    // Retrieve all hash data for all domains as an array
    const allDomains = existingData.addresses;

    // Iterate over the array until the target domain is found
    for (let step = 0; step < allDomains.length; step++) {
        // If found return the hash address
        if (allDomains[step].domainName == domainName) {
            return allDomains[step].hashAddress;
        }
    }

    // If nothing is found, then throw an error
    throw "No record found for domain: " + domainName;
}

// Function retrieves the most recent revision of the domain hash data using IPNS
export async function retrieveDatabse() {
    // Retrieve the address of the most recent file version
    var ipfsAddress;
    for await (const name of ipfs.name.resolve(IPNS_ADDRESS)) {
        ipfsAddress = name;
    }

    // Retreive data from IPFS
    const source = await ipfs.cat(ipfsAddress);
    var data = '';
    for await (const chunk of source) {
        data += decoder.decode(chunk, { stream: true });
    }

    console.log('Retrieved latests hash data: %s', data);

    // Return the data as a JSON object.
    return JSON.parse(data);
}

export async function updateDatabase(domainName, hashAddress) {
    // New hash entry
    const newHashData = { "domainName": domainName, "hashAddress": hashAddress };

    // Retrieve the existing domain hash data as a JSON object
    const hashData = await retrieveDatabse();

    // Append new data to the existing data
    hashData.addresses.push(newHashData);

    // Convert the data to a JSON string and add it to IPFS
    const latestAddress = await ipfs.add(JSON.stringify(hashData))
        .catch(console.error)
        .then(hash => hash.path)

    console.log('Appended new data to address: %s', latestAddress)

    // Publish the address to IPNS to update the pointer to the latest data
    const ipfsAddress = '/ipfs/' + latestAddress;
    const ipnsOptions = { 'allowOffline': true, 'key': IPNS_KEY };
    await ipfs.name.publish(ipfsAddress, ipnsOptions).catch(console).then(res => console.log('Published to IPNS: /ipns/%s', res.name));
}
