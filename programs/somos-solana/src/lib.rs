use anchor_lang::prelude::*;
use anchor_lang::solana_program::program_pack::Pack;
use anchor_spl::token::{
    initialize_mint, mint_to, InitializeMint, Mint, MintTo, Token, TokenAccount, InitializeAccount,
};
// use anchor_spl::associated_token::get_associated_token_address;

pub use spl_token;

declare_id!("u3RjZMD1WsNjPGwsBjwHWr2DpVLxW8PSd3Lku2q4Cek");

#[program]
pub mod somos_solana {
    use anchor_spl::token::initialize_account;
    use super::*;

    pub fn initialize_ledger(
        ctx: Context<InitializeLedger>,
        seed: [u8; 16],
        n: u16,
        price: u64,
        resale: f64,
    ) -> Result<()> {
        // accounts
        let ledger = &mut ctx.accounts.ledger;
        let auth = &ctx.accounts.auth;
        // init ledger
        ledger.price = price;
        ledger.resale = resale;
        ledger.original_supply = n;
        ledger.original_supply_remaining = n;
        ledger.owners = Vec::new();
        ledger.escrow = Vec::new();
        // persist boss for validation
        ledger.boss = ctx.accounts.user.key();
        // pda
        ledger.seed = seed;
        ledger.bump = *ctx.bumps.get("ledger").unwrap();
        ledger.auth_bump = *ctx.bumps.get("auth").unwrap();
        // init mint for auth token
        let cpi_context = InitializeLedger::cpi_context(
            auth.to_account_info(),
            ctx.accounts.rent_program.to_account_info(),
            ctx.accounts.token_program.to_account_info(),
        );
        initialize_mint(cpi_context, 0, &ledger.key(), None)
    }

    pub fn purchase_primary(
        ctx: Context<PurchasePrimary>
    ) -> Result<()> {
        // accounts
        let ledger = &mut ctx.accounts.ledger;
        let auth = &ctx.accounts.auth;
        let buyer = &ctx.accounts.buyer;
        let recipient = &ctx.accounts.recipient;
        let recipient_ata = &ctx.accounts.recipient_ata;
        let boss = &ctx.accounts.boss;
        // invoke purchase-primary
        let msg0 = format!("{}: {}", "ata: ", recipient_ata.key().to_string());
        msg!(&msg0);
        //match Ledger::purchase_primary(
        //    buyer,
        //    recipient,
        //    boss,
        //    ledger,
        //) {
        //    Ok(_) => {
        //        // derive associated token account
        //        // let ata = get_associated_token_address(
        //        //     recipient.key,
        //        //     &auth.key(),
        //        // );
        //        // validate ata
        //        // assert_eq!(recipient_ata.key(), ata);
        //        // build mint context
        //        let mint_cpi_context = PurchasePrimary::mint_cpi_context(
        //            auth.to_account_info(),
        //            recipient_ata.to_account_info(),
        //            ledger.to_account_info(),
        //            ctx.accounts.token_program.to_account_info(),
        //        );
        //        // mint or init then mint
        //        match recipient_ata.0 {
        //            None => {
        //                // built init context
        //                let init_account_cpi_context = PurchasePrimary::init_account_cpi_context(
        //                    recipient_ata.to_account_info(),
        //                    auth.to_account_info(),
        //                    recipient.to_account_info(),
        //                    ctx.accounts.rent_program.to_account_info(),
        //                    ctx.accounts.token_program.to_account_info(),
        //                );
        //                // init
        //                match initialize_account(init_account_cpi_context) {
        //                    Ok(_) => {
        //                        // mint
        //                        mint_to(mint_cpi_context, 1)
        //                    }
        //                    err @ Err(_) => { err }
        //                }
        //            }
        //            Some(_) => {
        //                // mint
        //                mint_to(mint_cpi_context, 1)
        //            }
        //        }
        //    }
        //    err @ Err(_) => { err }
        //}
        Ok(())
    }

    pub fn submit_to_escrow(
        ctx: Context<SubmitToEscrow>,
        price: u64,
    ) -> Result<()> {
        // accounts
        let seller = &ctx.accounts.seller;
        let ledger = &mut ctx.accounts.ledger;
        // invoke submit-to-escrow
        EscrowItem::submit_to_escrow(seller, price, ledger)
    }

    pub fn purchase_secondary(
        ctx: Context<PurchaseSecondary>
    ) -> Result<()> {
        // accounts
        let buyer = &ctx.accounts.buyer;
        let seller = &ctx.accounts.seller;
        let boss = &ctx.accounts.boss;
        let ledger = &mut ctx.accounts.ledger;
        // invoke purchase-secondary
        EscrowItem::purchase_secondary(
            ledger,
            buyer,
            seller,
            boss,
        )
    }

    pub fn remove_from_escrow(
        ctx: Context<SubmitToEscrow>
    ) -> Result<()> {
        // accounts
        let seller = &ctx.accounts.seller;
        let ledger = &mut ctx.accounts.ledger;
        // invoke remove-from-escrow
        EscrowItem::remove_from_escrow(seller, ledger)
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// PRIMARY MARKET //////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
#[derive(Accounts)]
#[instruction(seed: [u8; 16])]
pub struct InitializeLedger<'info> {
    #[account(init, seeds = [& seed], bump, payer = user, space = 10240)]
    pub ledger: Account<'info, Ledger>,
    #[account(
    init,
    seeds = [& seed, & InitializeLedger::AUTH_SEED], bump,
    owner = anchor_spl::token::ID,
    payer = user,
    space = Mint::LEN
    )]
    pub auth: Account<'info, UninitializedMint>,
    #[account(mut)]
    pub user: Signer<'info>,
    // token program
    pub token_program: Program<'info, Token>,
    // rent program
    pub rent_program: Sysvar<'info, Rent>,
    // system program
    pub system_program: Program<'info, System>,
}

#[derive(Clone)]
pub struct UninitializedMint;

impl anchor_lang::AccountDeserialize for UninitializedMint {
    fn try_deserialize_unchecked(_buf: &mut &[u8]) -> anchor_lang::Result<Self> {
        Ok(UninitializedMint)
    }
}

impl anchor_lang::AccountSerialize for UninitializedMint {}

impl anchor_lang::Owner for UninitializedMint {
    fn owner() -> Pubkey {
        anchor_spl::token::ID
    }
}

impl InitializeLedger<'_> {
    const AUTH_SEED: [u8; 16] = *b"authauthauthauth";
    fn cpi_context<'a, 'b, 'c, 'info>(
        mint: AccountInfo<'info>,
        rent_program: AccountInfo<'info>,
        token_program: AccountInfo<'info>,
    ) -> CpiContext<'a, 'b, 'c, 'info, InitializeMint<'info>> {
        let cpi_accounts = InitializeMint {
            mint,
            rent: rent_program,
        };
        CpiContext::new(token_program, cpi_accounts)
    }
}

#[derive(Accounts)]
pub struct PurchasePrimary<'info> {
    #[account(mut, seeds = [& ledger.seed], bump = ledger.bump)]
    pub ledger: Account<'info, Ledger>,
    #[account(
    mut,
    seeds = [& ledger.seed, & InitializeLedger::AUTH_SEED], bump = ledger.auth_bump,
    owner = anchor_spl::token::ID,
    )]
    pub auth: Account<'info, Mint>,
    #[account(mut)]
    pub buyer: Signer<'info>,
    #[account(mut)]
    pub recipient: SystemAccount<'info>,
    #[account(
    init,
    seeds = [recipient.key.as_ref(), anchor_spl::token::ID.as_ref(), auth.key().as_ref()], bump,
    owner = anchor_spl::associated_token::ID,
    payer = buyer,
    space = TokenAccount::LEN
    )]
    pub recipient_ata: Account<'info, MaybeTokenAccount>,
    // used to validate against persisted boss
    #[account(mut)]
    pub boss: SystemAccount<'info>,
    // token program
    pub token_program: Program<'info, Token>,
    // rent program
    pub rent_program: Sysvar<'info, Rent>,
    // system program
    pub system_program: Program<'info, System>,
}

#[derive(Clone)]
pub struct MaybeTokenAccount(Option<spl_token::state::Account>);

impl anchor_lang::AccountDeserialize for MaybeTokenAccount {
    fn try_deserialize_unchecked(buf: &mut &[u8]) -> anchor_lang::Result<Self> {
        match spl_token::state::Account::unpack(buf) {
            Ok(account) => {
                Ok(MaybeTokenAccount(Some(account)))
            }
            Err(error) => {
                match error {
                    ProgramError::UninitializedAccount => {
                        // pass thru for init
                        Ok(MaybeTokenAccount(None))
                    }
                    err => {
                        // propagate
                        Err(err.into())
                    }
                }
            }
        }
    }
}

impl anchor_lang::AccountSerialize for MaybeTokenAccount {}

impl anchor_lang::Owner for MaybeTokenAccount {
    fn owner() -> Pubkey {
        ID
    }
}

impl PurchasePrimary<'_> {
    fn mint_cpi_context<'a, 'b, 'c, 'info>(
        mint: AccountInfo<'info>,
        to: AccountInfo<'info>,
        authority: AccountInfo<'info>,
        token_program: AccountInfo<'info>,
    ) -> CpiContext<'a, 'b, 'c, 'info, MintTo<'info>> {
        let cpi_accounts = MintTo {
            mint,
            to,
            authority,
        };
        CpiContext::new(token_program, cpi_accounts)
    }

    fn init_account_cpi_context<'a, 'b, 'c, 'info>(
        ata: AccountInfo<'info>,
        auth: AccountInfo<'info>,
        recipient: AccountInfo<'info>,
        rent_program: AccountInfo<'info>,
        token_program: AccountInfo<'info>,
    ) -> CpiContext<'a, 'b, 'c, 'info, InitializeAccount<'info>> {
        let cpi_accounts = InitializeAccount {
            account: ata,
            mint: auth,
            authority: recipient,
            rent: rent_program,
        };
        CpiContext::new(token_program, cpi_accounts)
    }
}

#[account]
pub struct Ledger {
    // supply
    pub price: u64,
    pub resale: f64,
    pub original_supply: u16,
    pub original_supply_remaining: u16,
    // owners
    pub owners: Vec<Pubkey>,
    // escrow
    pub escrow: Vec<EscrowItem>,
    // persist boss for validation
    pub boss: Pubkey,
    // pda
    pub seed: [u8; 16],
    pub bump: u8,
    pub auth_bump: u8,
}

#[error_code]
pub enum LedgerErrors {
    #[msg("we've already sold-out. wait for the secondary market to open.")]
    SoldOut,
    #[msg("you can only pay the boss for this track.")]
    BossUp,
    #[msg("your public-key is not on the ledger.")]
    SellerNotOnLedger,
    #[msg("the item you've requested is not for sale in the secondary market.")]
    ItemNotInEscrow,
    #[msg("items still available in primary market.")]
    PrimarySaleStillOn,
    #[msg("you've already purchased this item. don't be greedy.")]
    DontBeGreedy,
    #[msg("you've already submitted this item to escrow.")]
    ItemAlreadyInEscrow,
}

impl Ledger {
    pub fn purchase_primary<'a>(
        buyer: &Signer<'a>,
        recipient: &SystemAccount<'a>,
        boss: &SystemAccount<'a>,
        ledger: &mut Ledger,
    ) -> Result<()> {
        match Ledger::validate(ledger, recipient.key, boss.key) {
            Ok(_) => {
                match Ledger::collect(ledger.price, buyer, boss) {
                    ok @ Ok(_) => {
                        ledger.owners.push(recipient.key());
                        ledger.original_supply_remaining = ledger.original_supply_remaining - 1;
                        ok
                    }
                    err @ Err(_) => { err }
                }
            }
            err @ Err(_) => { err }
        }
    }

    pub fn validate(
        ledger: &Ledger,
        buyer: &Pubkey,
        boss: &Pubkey,
    ) -> Result<()> {
        // validate boss
        match boss == &ledger.boss {
            true => {
                // validate first-time purchase
                match Ledger::validate_first_time_purchase(ledger, buyer) {
                    Ok(_) => {
                        // validate supply remaining
                        match ledger.original_supply_remaining > 0 {
                            true => { Ok(()) }
                            false => { Err(LedgerErrors::SoldOut.into()) }
                        }
                    }
                    err @ Err(_) => { err }
                }
            }
            false => Err(LedgerErrors::BossUp.into())
        }
    }

    pub fn validate_first_time_purchase(ledger: &Ledger, buyer: &Pubkey) -> Result<()> {
        match ledger.owners.contains(buyer) {
            true => {
                Err(LedgerErrors::DontBeGreedy.into())
            }
            false => {
                Ok(())
            }
        }
    }

    pub fn collect<'a>(price: u64, buyer: &Signer<'a>, boss: &SystemAccount<'a>) -> Result<()> {
        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &buyer.key(),
            &boss.key(),
            price,
        );
        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                buyer.to_account_info(),
                boss.to_account_info()
            ],
        ).map_err(Into::into)
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// SECONDARY MARKET ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
#[derive(Accounts)]
pub struct SubmitToEscrow<'info> {
    #[account(mut, seeds = [& ledger.seed], bump = ledger.bump)]
    pub ledger: Account<'info, Ledger>,
    // pubkey on ledger
    pub seller: Signer<'info>,
    // system program
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PurchaseSecondary<'info> {
    #[account(mut, seeds = [& ledger.seed], bump = ledger.bump)]
    pub ledger: Account<'info, Ledger>,
    // buyer
    #[account()]
    pub buyer: Signer<'info>,
    // seller
    #[account(mut)]
    pub seller: SystemAccount<'info>,
    // used to validate against persisted boss
    #[account(mut)]
    pub boss: SystemAccount<'info>,
    // system program
    pub system_program: Program<'info, System>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy)]
pub struct EscrowItem {
    pub price: u64,
    pub seller: Pubkey,
}

impl PartialEq for EscrowItem {
    fn eq(&self, other: &Self) -> bool {
        self.price == other.price && self.seller == other.seller
    }
}

impl EscrowItem {
    pub fn submit_to_escrow(
        seller: &Signer,
        price: u64,
        ledger: &mut Ledger,
    ) -> Result<()> {
        // validate ledger
        match EscrowItem::validate_ledger(ledger) {
            Ok(_) => {
                // validate seller
                match EscrowItem::validate_seller(seller, ledger) {
                    Ok(_) => {
                        // build item
                        let escrow_item = EscrowItem { price, seller: *seller.key };
                        // add item to escrow
                        ledger.escrow.push(escrow_item);
                        Ok(())
                    }
                    err @ Err(_) => { err }
                }
            }
            err @ Err(_) => { err }
        }
    }

    pub fn remove_from_escrow(
        seller: &Signer,
        ledger: &mut Ledger,
    ) -> Result<()> {
        EscrowItem::remove_from_vec(
            &mut ledger.escrow,
            &seller.key(),
            |x| &x.seller,
            LedgerErrors::ItemNotInEscrow,
        ).map(|_| ())
    }

    pub fn purchase_secondary<'a>(
        ledger: &mut Ledger,
        buyer: &Signer<'a>,
        seller: &SystemAccount<'a>,
        boss: &SystemAccount<'a>,
    ) -> Result<()> {
        // validate buyer
        match Ledger::validate_first_time_purchase(ledger, buyer.key) {
            Ok(_) => {
                // pop
                match EscrowItem::pop_escrow_item(seller.key, ledger) {
                    Ok(a) => {
                        // push
                        ledger.owners.push(buyer.key());
                        // collect
                        EscrowItem::collect(a, buyer, seller, boss, ledger.resale)
                    }
                    Err(err) => { Err(err) }
                }
            }
            err @ Err(_) => { err }
        }
    }

    fn validate_seller(seller: &Signer, ledger: &Ledger) -> Result<()> {
        // seller is on ledger as owner
        match ledger.owners.contains(seller.key) {
            true => {
                // seller has not already listed their item on escrow
                let escrow: Vec<Pubkey> = ledger.escrow.iter()
                    .map(|escrow_item| escrow_item.seller).collect();
                match escrow.contains(seller.key) {
                    true => { Err(LedgerErrors::ItemAlreadyInEscrow.into()) }
                    false => { Ok(()) }
                }
            }
            false => { Err(LedgerErrors::SellerNotOnLedger.into()) }
        }
    }

    fn validate_ledger(ledger: &Ledger) -> Result<()> {
        // primary market should be sold out first
        match ledger.original_supply_remaining == 0 {
            true => { Ok(()) }
            false => { Err(LedgerErrors::PrimarySaleStillOn.into()) }
        }
    }

    fn pop_escrow_item(
        escrow_item: &Pubkey,
        ledger: &mut Ledger,
    ) -> Result<EscrowItem> {
        // remove from escrow
        match EscrowItem::remove_from_vec(
            &mut ledger.escrow,
            escrow_item,
            |x| &x.seller,
            LedgerErrors::ItemNotInEscrow,
        ) {
            Ok(a) => {
                // remove from ledger
                match EscrowItem::remove_from_vec(
                    &mut ledger.owners,
                    escrow_item,
                    |x| x,
                    LedgerErrors::SellerNotOnLedger,
                ) {
                    Ok(_) => { Ok(a) }
                    Err(err) => { Err(err) }
                }
            }
            err @ Err(_) => { err }
        }
    }

    fn remove_from_vec<A: std::marker::Copy, B: std::cmp::PartialEq>(
        vec: &mut Vec<A>,
        item: &B,
        with: fn(&A) -> &B,
        err: LedgerErrors,
    ) -> Result<A> {
        let maybe_ix = vec.iter().position(|x| with(x) == item);
        match maybe_ix {
            None => { Err(err.into()) }
            Some(ix) => {
                let a = vec.remove(ix);
                Ok(a)
            }
        }
    }

    fn collect<'a>(
        escrow_item: EscrowItem,
        buyer: &Signer<'a>,
        seller: &SystemAccount<'a>,
        boss: &SystemAccount<'a>,
        resale: f64,
    ) -> Result<()> {
        let seller_split: u64 = EscrowItem::split(1.0 - resale, escrow_item.price);
        let tx_seller = EscrowItem::_collect(seller_split, buyer, seller);
        match tx_seller {
            Ok(_) => {
                let boss_split: u64 = EscrowItem::split(resale, escrow_item.price);
                let boss_tx = EscrowItem::_collect(boss_split, buyer, boss);
                boss_tx
            }
            err @ Err(_) => { err }
        }
    }

    fn _collect<'a>(price: u64, from: &Signer<'a>, to: &SystemAccount<'a>) -> Result<()> {
        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &from.key(),
            &to.key(),
            price,
        );
        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                from.to_account_info(),
                to.to_account_info()
            ],
        ).map_err(Into::into)
    }

    fn split(percentage: f64, price: u64) -> u64 {
        let sol = anchor_lang::solana_program::native_token::lamports_to_sol(price);
        anchor_lang::solana_program::native_token::sol_to_lamports(sol * percentage)
    }
}