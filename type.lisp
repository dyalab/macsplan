(in-package :macsplan)

(defstruct course
  id
  prereq)

(defun catalog-contains-id (catalog id)
  (gethash id catalog))

(defmacro do-catalog ((var catalog) &body body)
  `(loop for ,var being the hash-values of ,catalog
      do ,@body))


(defun normalize-prereq (name)
  (if (eql #\! (aref name 0))
      (values (subseq name 1) t)
      (values name nil)))

(defun check-catalog-exp (catalog exp)
  (tmsmt::check-exp (lambda (v)
                      (unless (or (tmsmt::smt-true-p v)
                                  (catalog-contains-id catalog (normalize-prereq v)))
                        (error "Course not found `~A'" v)))
                    exp))

(defun check-catalog (catalog)
  (do-catalog (course catalog)
    (check-catalog-exp catalog (course-prereq course))))

(defstruct student
  taken
  degree)


(defun check-student (catalog student)
  (dolist (c (student-taken student))
    (check-catalog-exp catalog c))
  (check-catalog-exp catalog (student-degree student)))
