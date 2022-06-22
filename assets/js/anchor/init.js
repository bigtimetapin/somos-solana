import {web3, BN} from "@project-serum/anchor";
import {TOKEN_PROGRAM_ID} from "@solana/spl-token";

export async function init(program, provider, ledger, seed, user, n, price, resale) {
    try {
        const priceInLamports = price * web3.LAMPORTS_PER_SOL
        const mint = new web3.Keypair();
        console.log(mint);
        await program.rpc.initializeLedger(seed, new BN(n), new BN(priceInLamports), resale, {
            accounts: {
                user: provider.wallet.publicKey,
                ledger: ledger,
                mint: mint.publicKey,
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: web3.SystemProgram.programId,
            },
        });
        // send state to elm
        app.ports.getCurrentStateListener.send(user);
        // log success
        console.log("program init success");
    } catch (error) {
        // log error
        console.log(error.toString());
        // send error to elm
        app.ports.initProgramFailureListener.send(error.message)
    }
}
