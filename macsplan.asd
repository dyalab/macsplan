(cl:eval-when (:load-toplevel :execute)
    (asdf:operate 'asdf:load-op 'cffi-grovel))

(asdf:defsystem macsplan
  :description "Mines Automatic Course Schedule Planner"
  :depends-on ("tmsmt" "jonathan" "s-xml-rpc")
  :components (
               (:file "package")
               (:file "type" :depends-on ("package"))
               (:file "io" :depends-on ("type"))
               (:file "planner" :depends-on ("io"))
               (:file "rpc" :depends-on ("planner" "io"))
               (:file "server" :depends-on ("package"))))
