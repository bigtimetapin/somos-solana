module View.Market.Buy.Primary exposing (body)

import Html exposing (Html)
import Html.Attributes exposing (class, href, style, target)
import Html.Events exposing (onClick)
import Model.Anchor.Anchor exposing (Anchor(..))
import Model.Anchor.DownloadStatus as DownloadStatus
import Model.Anchor.Ownership as Ownership
import Model.State as State exposing (State(..))
import Msg.Anchor exposing (ToAnchorMsg(..))
import Msg.Msg exposing (Msg(..))
import Msg.Phantom exposing (ToPhantomMsg(..))


body : Anchor -> Html Msg
body anchor =
    let
        html =
            case anchor of
                WaitingForWallet ->
                    let
                        button : Html Msg
                        button =
                            Html.button
                                [ class "is-button-1"
                                , onClick (ToPhantom Connect)
                                ]
                                [ Html.text "Connect"
                                ]
                    in
                    Html.div
                        []
                        [ Html.div
                            [ style "float" "right"
                            , class "mr-2"
                            ]
                            [ button
                            ]
                        , Html.div
                            []
                            [ Html.p
                                [ class "has-font-1 ml-2 mt-2"
                                ]
                                [ Html.div
                                    [ class "mb-6"
                                    ]
                                    [ Html.text "welcome to store.somos.*"
                                    ]
                                , Html.div
                                    [ class "mb-6"
                                    ]
                                    [ Html.text "a decentralized market place built on the "
                                    , Html.a
                                        [ class "has-sky-blue-text"
                                        , href "https://solana.com/"
                                        , target "_blank"
                                        ]
                                        [ Html.text "solana blockchain"
                                        ]
                                    ]
                                , Html.div
                                    [ class "mb-6"
                                    ]
                                    [ button
                                    , Html.text " your wallet to sign-in & begin interacting with the market place"
                                    ]
                                , Html.div
                                    [ class "mb-6"
                                    ]
                                    [ Html.text
                                        """
                                        where you can buy & sell the
                                        """
                                    , Html.a
                                        [ class "has-sky-blue-text"
                                        , State.href About
                                        ]
                                        [ Html.text "right-to-download"
                                        ]
                                    , Html.text
                                        """
                                         of exclusive content from some of your
                                        """
                                    , Html.a
                                        [ class "has-sky-blue-text"
                                        , href "https://www.somos.world/"
                                        , target "_blank"
                                        ]
                                        [ Html.text "favorite creatives"
                                        ]
                                    ]
                                ]
                            ]
                        ]

                JustHasWallet publicKey ->
                    Html.div
                        []
                        [ Html.div
                            []
                            [ Html.text publicKey
                            ]
                        , Html.div
                            []
                            [ Html.text "what next?"
                            ]
                        ]

                WaitingForProgramInit publicKey ->
                    Html.div
                        []
                        [ Html.div
                            []
                            [ Html.text publicKey
                            ]
                        , Html.div
                            []
                            [ Html.button
                                [ onClick (ToAnchor (InitProgram publicKey))
                                ]
                                [ Html.text "Init"
                                ]
                            ]
                        ]

                UserWithNoOwnership anchorState ->
                    Html.div
                        []
                        [ Html.div
                            [ class "columns is-mobile"
                            ]
                            [ Html.div
                                [ class "column"
                                ]
                                [ Html.text
                                    (String.join
                                        ": "
                                        [ "Original Supply Remaining"
                                        , String.fromInt anchorState.originalSupplyRemaining
                                        ]
                                    )
                                ]
                            ]
                        , Html.div
                            []
                            [ Html.button
                                [ onClick (ToAnchor (PurchasePrimary anchorState.user))
                                ]
                                [ Html.text "Purchase"
                                ]
                            ]
                        ]

                UserWithOwnership ownership ->
                    case ownership of
                        Ownership.Console anchorState count ->
                            Html.div
                                []
                                [ Html.div
                                    [ class "columns is-mobile"
                                    ]
                                    [ Html.div
                                        [ class "column"
                                        ]
                                        [ Html.text
                                            (String.join
                                                ": "
                                                [ "Original Supply Remaining"
                                                , String.fromInt anchorState.originalSupplyRemaining
                                                ]
                                            )
                                        ]
                                    , Html.div
                                        [ class "column"
                                        ]
                                        [ Html.text
                                            (String.join
                                                ": "
                                                [ "Your Ownership"
                                                , String.fromInt count
                                                ]
                                            )
                                        ]
                                    , Html.div
                                        []
                                        [ Html.button
                                            [ onClick (ToPhantom (SignMessage anchorState.user))
                                            ]
                                            [ Html.text "Download"
                                            ]
                                        ]
                                    ]
                                , Html.div
                                    []
                                    [ Html.button
                                        [ onClick (ToAnchor (PurchasePrimary anchorState.user))
                                        ]
                                        [ Html.text "Purchase More"
                                        ]
                                    ]
                                ]

                        Ownership.Download downloadStatus ->
                            case downloadStatus of
                                DownloadStatus.InvokedAndWaiting phantomSignature ->
                                    Html.div
                                        []
                                        [ Html.div
                                            []
                                            [ Html.text phantomSignature.userDecoded
                                            ]
                                        , Html.div
                                            []
                                            [ Html.text "waiting for pre-signed url"
                                            ]
                                        ]

                                DownloadStatus.Done response ->
                                    Html.div
                                        []
                                        [ Html.div
                                            []
                                            [ Html.text response.user
                                            ]
                                        , Html.div
                                            []
                                            [ Html.text "downloaded"
                                            ]
                                        ]
    in
    Html.div
        [ class "container has-border-2"
        ]
        [ html
        ]