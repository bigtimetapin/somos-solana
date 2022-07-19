import {encrypt} from "../lit/encrypt";
import {shdw} from "../shdw";

export async function upload(program, provider, ledger) {
    try {
        // fetch mint for encryption auth
        const _state = await program.account.ledger.fetch(ledger);
        const mint = _state.auth.toString();
        // select files
        const files = document.getElementById("gg-sd-zip").files;
        // invoke encryption
        const encrypted = await encrypt(mint, files);
        // upload blob to shdw drive
        const fileName = "encrypted.zip"
        const file = new File([encrypted.encryptedZip], fileName)
        //const file = new File(['hello', ' ', 'world'], fileName, {type: 'text/plain'});
        const url = await shdw(provider.wallet, file);
        const prefix = url.replace(fileName, "");
        console.log(prefix);
        console.log(url);
        // invoke rpc
        await program.rpc.publishAssets(Buffer.from(encrypted.encryptedHexKey), Buffer.from(prefix), {
            accounts: {
                ledger: ledger,
                boss: provider.wallet.publicKey,
            }
        });
        const __state = await program.account.ledger.fetch(ledger);
        console.log(__state);
        // // // or catch error
    } catch (error) {
        console.log(error)
        app.ports.genericErrorListener.send(error.toString());
    }
}
