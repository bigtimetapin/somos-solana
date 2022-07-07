import {solRpcConditions} from "./util";
import LitJsSdk from "lit-js-sdk";
import {chain} from "./config";

export async function decrypt(mint, encryptedSymmetricKey, encryptedString) {
    // build client
    const client = new LitJsSdk.LitNodeClient()
    // await for connection
    console.log("connecting to LIT network")
    await client.connect()

    console.log("invoking signature request")
    const authSig = await LitJsSdk.checkAndSignAuthMessage({chain: chain})

    console.log("getting key from networking")
    const retrievedSymmetricKey = await client.getEncryptionKey({
        solRpcConditions: solRpcConditions(mint),
        // Note, below we convert the encryptedSymmetricKey from a UInt8Array to a hex string.
        // This is because we obtained the encryptedSymmetricKey from "saveEncryptionKey" which returns a UInt8Array.
        // But the getEncryptionKey method expects a hex string.
        toDecrypt: LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16"),
        chain,
        authSig
    });
    console.log("retrieved key: " + retrievedSymmetricKey.toString())

    console.log("decrypting string")
    return await LitJsSdk.decryptString(
        encryptedString,
        retrievedSymmetricKey
    )
}
