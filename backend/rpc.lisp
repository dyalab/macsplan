(cl:in-package :macsplan)


(defun handle-plan (catalog student)
  (plan-json (macsplan catalog student)))


(cl:in-package :s-xml-rpc-exports)

(cl:defun |echo| (arg)
  arg)

(cl:defun |plan| (catalog student)
  (macsplan::handle-plan catalog student))
