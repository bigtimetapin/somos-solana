import LitJsSdk from 'lit-js-sdk'
import {chain} from "./config";


export async function encrypt() {
    // build client
    const client = new LitJsSdk.LitNodeClient()
    // await for connection
    console.log("connecting to LIT network")
    await client.connect()

    document.addEventListener('lit-ready', function (e) {
        console.log('LIT network is ready')
        // replace this line with your own code that tells your app the network is ready
    }, false)

    console.log("invoking signature request")
    const authSig = await LitJsSdk.checkAndSignAuthMessage({chain: chain})

    console.log("encrypting string")
    const {encryptedString, symmetricKey} = await LitJsSdk.encryptString(
        "this is a secret message"
    );

    console.log("key: " + symmetricKey.toString())
    const solRpcConditions = [
        {
            method: "",
            params: [":userAddress"],
            chain: chain,
            returnValueTest: {
                key: "",
                comparator: "=",
                value: "3XEuQQzBCZam4EfhLjF6sACBovq6VxR4PgB8ekk1enNQ",
            },
        },
    ];

    console.log("pushing key to network")
    const encryptedSymmetricKey = await client.saveEncryptionKey({
        solRpcConditions: solRpcConditions,
        chain: chain,
        authSig: authSig,
        symmetricKey: symmetricKey,
        permanent: true
    });

    console.log("getting key from networking")
    const retrievedSymmetricKey = await client.getEncryptionKey({
        solRpcConditions,
        // Note, below we convert the encryptedSymmetricKey from a UInt8Array to a hex string.
        // This is because we obtained the encryptedSymmetricKey from "saveEncryptionKey" which returns a UInt8Array.
        // But the getEncryptionKey method expects a hex string.
        toDecrypt: LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16"),
        chain,
        authSig
    });
    console.log("retrieved key: " + retrievedSymmetricKey.toString())

    console.log("decrypting string")
    const decryptedString = await LitJsSdk.decryptString(
        encryptedString,
        retrievedSymmetricKey
    );

    console.log(decryptedString);
}

