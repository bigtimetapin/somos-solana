import {encrypt} from "../lit/encrypt";
import {shdw} from "../shdw";

export async function upload(program, provider, ledger) {
    try {
        // fetch mint for encryption auth
        // const _state = await program.account.ledger.fetch(ledger);
        // const mint = _state.auth.toString();
        // // select files
        // const files = document.getElementById("gg-sd-zip").files;
        // // invoke encryption
        // const encrypted = await encrypt(mint, files);
        // //const file = new File([encrypted.encryptedZip], "encrypted.zip")
        // // upload blob to shdw drive
        const fileName = "hello_world.txt"
        const file = new File(['hello', ' ', 'world'], fileName, {type: 'text/plain'});
        const url = await shdw(provider.wallet, file);
        const prefix = url.replace(fileName, "");
        console.log(prefix);
        console.log(url);
        // invoke rpc
        // await program.rpc.publishAssets(Buffer.from(encrypted.encryptedHexKey), {
        //     accounts: {
        //         ledger: ledger,
        //         boss: provider.wallet.publicKey,
        //     }
        // });
        // // or catch error
    } catch (error) {
        console.log(error)
        app.ports.genericErrorListener.send(error.toString());
    }
}
