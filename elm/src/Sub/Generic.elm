port module Sub.Generic exposing (..)

-- listeners


port genericErrorListener : (String -> msg) -> Sub msg
