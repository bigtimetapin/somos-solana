module Msg.Phantom exposing (FromPhantomMsg(..), ToPhantomMsg(..))

import Model.Role exposing (Role)


type
    ToPhantomMsg
    -- connection attempt
    = Connect Role


type
    FromPhantomMsg
    -- connection attempt
    = ErrorOnConnection Error


type alias Json =
    String


type alias Error =
    String
