module Model.Release exposing (Release(..), WithWallet, decode, encode, fromInt, toInt)

import Json.Decode as Decode
import Json.Encode as Encode
import Model.Wallet exposing (Wallet)


type Release
    = One
    | Two
    | Nil


type alias WithWallet =
    { release : Int
    , wallet : Wallet
    }


encode : Wallet -> Release -> String
encode wallet release =
    let
        encoder =
            Encode.object
                [ ( "wallet", Encode.string wallet )
                , ( "release", Encode.int <| toInt release )
                ]
    in
    Encode.encode 0 encoder


decode : String -> Result String WithWallet
decode json =
    let
        decoder =
            Decode.map2 WithWallet
                (Decode.field "release" Decode.int)
                (Decode.field "wallet" Decode.string)
    in
    case Decode.decodeString decoder json of
        Ok value ->
            Ok value

        Err error ->
            Err (Decode.errorToString error)


toInt : Release -> Int
toInt release =
    case release of
        One ->
            1

        Two ->
            2

        Nil ->
            -1


fromInt : Int -> Release
fromInt int =
    case int of
        1 ->
            One

        2 ->
            Two

        _ ->
            Nil
