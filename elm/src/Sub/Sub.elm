module Sub.Sub exposing (subs)

import Msg.Anchor exposing (FromAnchorMsg(..))
import Msg.Generic as GenericMsg
import Msg.Msg exposing (Msg(..))
import Msg.Phantom exposing (FromPhantomMsg(..))
import Sub.Anchor exposing (..)
import Sub.Generic exposing (..)
import Sub.Phantom exposing (..)



-- TODO; drop specific failures


subs : Sub Msg
subs =
    Sub.batch
        [ -- phantom connect
          connectFailureListener
            (\error ->
                FromPhantom (ErrorOnConnection error)
            )

        -- anchor get current state
        , getCurrentStateListener
            (\pubKey ->
                FromAnchor (GetCurrentState pubKey)
            )

        -- anchor get current state attempt
        , getCurrentStateSuccessListener
            (\jsonString ->
                FromAnchor (SuccessOnStateLookup jsonString)
            )
        , getCurrentStateFailureListener
            (\error ->
                FromAnchor (FailureOnStateLookup error)
            )

        -- anchor init program
        , initProgramFailureListener
            (\error ->
                FromAnchor (FailureOnInitProgram error)
            )

        -- anchor purchase primary
        , purchasePrimaryFailureListener
            (\error ->
                FromAnchor (FailureOnPurchasePrimary error)
            )

        -- anchor submit to escrow
        , submitToEscrowFailureListener
            (\error ->
                FromAnchor (FailureOnSubmitToEscrow error)
            )

        -- anchor purchase secondary
        , purchaseSecondaryFailureListener
            (\error ->
                FromAnchor (FailureOnPurchaseSecondary error)
            )

        -- generic download success
        , downloadSuccessListener
            (\jsonString ->
                FromJs <| GenericMsg.DownloadSuccess jsonString
            )

        -- generic error
        , genericErrorListener
            (\error ->
                FromJs <| GenericMsg.Error error
            )
        ]
