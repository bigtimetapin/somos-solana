module Msg.Msg exposing (Msg(..), resetViewport)

import Browser
import Browser.Dom as Dom
import Msg.Admin exposing (FromAdminMsg)
import Msg.Anchor exposing (FromAnchorMsg, ToAnchorMsg)
import Msg.Generic exposing (FromJsMsg, ToJsMsg)
import Msg.Phantom exposing (FromPhantomMsg, ToPhantomMsg)
import Msg.Seller exposing (FromSellerMsg)
import Task
import Url


type
    Msg
    -- system
    = NoOp
    | UrlChanged Url.Url
    | LinkClicked Browser.UrlRequest
      -- phantom sub
    | ToPhantom ToPhantomMsg
    | FromPhantom FromPhantomMsg
      -- anchor sub
    | ToAnchor ToAnchorMsg
    | FromAnchor FromAnchorMsg
      -- generic js sub
    | ToJs ToJsMsg
    | FromJs FromJsMsg
      -- user forms
    | FromSeller FromSellerMsg
      -- admin
    | FromAdmin FromAdminMsg


resetViewport : Cmd Msg
resetViewport =
    Task.perform (\_ -> NoOp) (Dom.setViewport 0 0)
