(in-package :macsplan)




(s-xml-rpc:xml-rpc-call (s-xml-rpc:encode-xml-rpc-call "echo" "foo")
                        :host "localhost"
                        :port 8080)
