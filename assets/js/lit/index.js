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
        "this is a secret message that should be encrypted"
    );

    console.log("key: " + symmetricKey.toString())
    const solRpcConditions = [
        {
            method: "getAccountInfo",
            params: [
                "EbaHyMB1KiPLouoCmtuKmQunytGuwRfx8EvbaaVtwb19",
                {
                    "encoding": "base64"
                }
            ],
            chain: chain,
            returnValueTest: {
                key: "$.result.value.data[0]",
                comparator: "=",
                value: "fn/w4RwfwigB",
            },
        },
    ];

    console.log("pushing key to network")
    const encryptedSymmetricKey = await client.saveEncryptionKey({
        solRpcConditions: solRpcConditions,
        chain: chain,
        authSig: authSig,
        symmetricKey: symmetricKey,
        permanent: false
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

