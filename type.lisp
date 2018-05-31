(in-package :macsplan)

(defstruct course
  id
  prereq)

(defun catalog-contains-id (catalog id)
  (gethash id catalog))

(defmacro do-catalog ((var catalog) &body body)
  `(loop for ,var being the hash-values of ,catalog
      do ,@body))

;; (defun map-catalog (function catalog)
;;   (gethash id catalog))
