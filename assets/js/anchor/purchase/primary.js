import {web3} from "@project-serum/anchor";
import {BOSS} from "../config";
import {
    TOKEN_PROGRAM_ID,
    getAssociatedTokenAddress, ASSOCIATED_TOKEN_PROGRAM_ID
} from "@solana/spl-token";

export async function primary(program, provider, recipient, ledger, seed, user) {
    try {
        // fetch auth address
        const _state = await program.account.ledger.fetch(ledger);
        const auth = _state.auth;
        console.log(auth.toString());
        // build recipient pub key
        const recipientPublicKey = new web3.PublicKey(recipient);
        // derive recipient associated token address
        const recipientAta = await getAssociatedTokenAddress(
            auth,
            recipientPublicKey
        );
        console.log(recipientAta.toString());
        // invoke purchase primary
        await program.rpc.purchasePrimary({
            accounts: {
                ledger: ledger,
                auth: auth,
                buyer: provider.wallet.publicKey,
                recipient: recipientPublicKey,
                recipientAta: recipientAta,
                boss: BOSS,
                tokenProgram: TOKEN_PROGRAM_ID,
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
                systemProgram: web3.SystemProgram.programId,
                rent: web3.SYSVAR_RENT_PUBKEY,
            },
            signers: []
        });
        // send state to elm
        app.ports.getCurrentStateListener.send(user);
        // log success
        console.log("primary purchase success");
    } catch (error) {
        // log error
        console.log(error);
        // send error to elm
        app.ports.purchasePrimaryFailureListener.send(error.message)
    }
}
