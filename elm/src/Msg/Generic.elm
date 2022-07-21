module Msg.Generic exposing (FromJsMsg(..), ToJsMsg(..))

import Model.Release exposing (Release)
import Model.Wallet exposing (Wallet)


type ToJsMsg
    = Download Wallet Release


type FromJsMsg
    = DownloadSuccess Json
    | Error String


type alias Json =
    String
