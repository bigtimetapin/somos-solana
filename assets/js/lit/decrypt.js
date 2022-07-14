import {solRpcConditions} from "./util";
import LitJsSdk from "lit-js-sdk";
import {chain} from "./config";

export async function decrypt(mint, encryptedHexKey, encryptedString) {
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
        toDecrypt: encryptedHexKey,
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
