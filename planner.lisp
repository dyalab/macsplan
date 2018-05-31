(in-package :macsplan)



(defun macsplan (catalog student)
  (let ((catalog (ensure-catalog catalog))
        (student (ensure-student student)))
    (check-student catalog student)
    student))
