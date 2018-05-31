(cl:eval-when (:load-toplevel :execute)
    (asdf:operate 'asdf:load-op 'cffi-grovel))

(asdf:defsystem macsplan
  :description "Mines Automatic Course Schedule Planner"
  :depends-on ("tmsmt" "jonathan")
  :components (
               (:file "package")
               (:file "type" :depends-on ("package"))
               (:file "io" :depends-on ("type"))
               ))
