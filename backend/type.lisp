(in-package :macsplan)

(defstruct course
  id
  prereq
  credits
  elective-type
  semester)

(defstruct offering
  course
  semester
  teacher
  time)

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
                                  (catalog-contains-id catalog (normalize-prereq v))
				  (find #\X v))
                        (error "Course not found `~A'" v)))
                    exp))

(defun check-catalog (catalog)
  (do-catalog (course catalog)
    (check-catalog-exp catalog (course-prereq course))))

(defstruct student
  (taken (make-hash-table :test #'equal))
  degree)


(defun check-student (catalog student)
  (loop for c being the hash-keys of (student-taken student)
     do
       (check-catalog-exp catalog c))
  (check-catalog-exp catalog (student-degree student)))
