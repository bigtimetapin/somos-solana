import {web3} from "@project-serum/anchor";
import {AUTH_SEED, BOSS, preflightCommitment, programID} from "../config";
import {TOKEN_PROGRAM_ID, getOrCreateAssociatedTokenAccount} from "@solana/spl-token";
import {connection} from "../util";

export async function primary(program, provider, recipient, ledger, user) {
    try {
        // build recipient pub key
        let recipientPublicKey = new web3.PublicKey(recipient);
        // derive auth address
        let auth, _;
        [auth, _] = await web3.PublicKey.findProgramAddress(
            [seed, AUTH_SEED],
            programID
        );
        // derive recipient associated token address
        let recipientAta = await getOrCreateAssociatedTokenAccount(
            connection,
            provider.wallet,
            auth,
            recipientPublicKey
        )
        // invoke purchase primary
        await program.rpc.purchasePrimary({
            accounts: {
                ledger: ledger,
                auth: auth,
                buyer: provider.wallet.publicKey,
                recipient: recipientPublicKey,
                recipientAta: recipientAta.address,
                boss: BOSS,
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: web3.SystemProgram.programId,
            },
        });
        // send state to elm
        app.ports.getCurrentStateListener.send(user);
        // log success
        console.log("primary purchase success");
    } catch (error) {
        // log error
        console.log(error.toString());
        // send error to elm
        app.ports.purchasePrimaryFailureListener.send(error.message)
    }
}
