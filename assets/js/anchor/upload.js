import {encrypt} from "../lit/encrypt";

export async function upload(program, provider, ledger) {
    try {
        // fetch mint for encryption auth
        const _state = await program.account.ledger.fetch(ledger);
        const mint = _state.auth.toString();
        // invoke encryption
        const encrypted = await encrypt(mint);
        // invoke rpc
        await program.rpc.publishAssets(Buffer.from(encrypted.encryptedHexKey), {
            accounts: {
                ledger: ledger,
                boss: provider.wallet.publicKey,
            }
        });
        console.log("assets uploaded to solana program");
        // or catch error
    } catch (error) {
        console.log(error)
        app.ports.genericErrorListener.send(error.toString());
    }
}
