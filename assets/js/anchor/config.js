import {web3} from "@project-serum/anchor";

export const preflightCommitment = "processed";
export const programID = new web3.PublicKey("HGfrweUKP7gEE7bGwvZaAEFHhQLAjpd4ZK1nTQKN6CKW");
export const ACCOUNT_SEED_01 = Buffer.from("shortershortersp");
export const ACCOUNT_SEED_02 = Buffer.from("robsonrobsonrobs");
export const BOSS = new web3.PublicKey("DEuG4JnzvMVxMFPoBVvf2GH38mn3ybunMxtfmVU3ms86")
// const localnet = "http://127.0.0.1:8899";
// const devnet = web3.clusterApiUrl("devnet");
const mainnet = web3.clusterApiUrl("mainnet-beta");
export const network = mainnet;
