(in-package :macsplan)


;;; JSON
(defun parse-json (string)
  (jonathan:parse string))

(defun load-json (pathname)
  (parse-json (read-file-into-string pathname)))

(defun  plan-json (plan)
  (jonathan:to-json plan))


(defun parse-json-cnf (e)
  (tmsmt::exp-and*
   (map 'list (lambda (e)
                (if (atom e)
                    e
                    (tmsmt::exp-or* e)))
        e)))

(defun parse-json-exp (e)
  (if (atom e)
      e
      (destructuring-bind (op &rest args) e
        (cond ((string= op "and")
               (cons 'and (map 'list #'parse-json-exp args)))
              ((string= op "or")
               (cons 'or (map 'list #'parse-json-exp args)))
              ((string= op "not")
               (cons 'not (map 'list #'parse-json-exp args)))
              (t e)))))



;;; Course Catalog


(defun parse-prereq (e)
  (parse-json-cnf e))


(defun parse-catalog (string)
  (let ((json (parse-json string))
        (catalog (make-hash-table :test #'equal)))
    ;; index catalog
    (dolist (elt json)
      (let* ((id (getf elt :|Id|))
             (course (make-course  :id id
                                   :prereq (parse-prereq (getf elt :|Pre_req|))
				   :credits (or (getf elt :|Credits|) (getf elt :|Max_Credits|))
				   :semester (getf elt :|Semesters|)
				   :elective-type (getf elt :|Elective|)
				   :teacher (getf elt :|Teacher|))))
        (if (stringp (course-credits course))
            (setf (course-credits course) (read-from-string (course-credits course))))
        (cond ((null id)
               (error "Missing course ID"))
              ((catalog-contains-id catalog id)
               (error "Duplicate course ~A" id))
              (t
               (setf (gethash id catalog) course)))))
    (check-catalog catalog)
    catalog))

(defun load-catalog (pathname)
  (parse-catalog (read-file-into-string pathname)))

(defun ensure-catalog (thing)
  (etypecase thing
    (list thing)
    (string (parse-catalog thing))
    (pathname (load-catalog thing))))



;;; Student Data

(defun parse-student (string)
  (let* ((json (parse-json string))
         (student (make-student ;:taken (getf json :|taken|)
                   :degree (parse-json-exp (getf json :|degree|))
		   :pref-teach (getf json :|teacher|))))
    (dolist (c (getf json :|taken|))
      (setf (gethash c (student-taken student)) t))
    student))


(defun load-student (pathname)
  (parse-student (read-file-into-string pathname)))

(defun ensure-student (thing)
  (etypecase thing
    (list thing)
    (string (parse-student thing))
    (pathname (load-student thing))))
