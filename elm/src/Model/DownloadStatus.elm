module Model.DownloadStatus exposing (DownloadStatus(..))

import Model.Release exposing (Release)
import Model.Wallet exposing (Wallet)


type DownloadStatus
    = InvokedAndWaiting Wallet
    | Done Wallet Release
