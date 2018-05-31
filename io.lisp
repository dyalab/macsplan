(in-package :macsplan)


;;; JSON
(defun parse-json (string)
  (jonathan:parse string))

(defun load-json (pathname)
  (parse-catalog (read-file-into-string pathname)))



;;; Course Catalog

(defun normalize-prereq (name)
  (if (eql #\! (aref name 0))
      (values (subseq name 1) t)
      (values name nil)))

(defun parse-prereq (e)
 (tmsmt::exp-and*  (map 'list #'tmsmt::exp-or* e)))


(defun parse-catalog (string)
  (let ((json (parse-json string))
        (catalog (make-hash-table :test #'equal)))
    ;; index catalog
    (dolist (elt json)
      (let* ((id (getf elt :|Id|))
             (course (make-course  :id id
                                   :prereq (parse-prereq (getf elt :|Pre_req|)))))
        (cond ((null id)
               (error "Missing course ID"))
              ((catalog-contains-id catalog id)
               (error "Duplicate course ~A" id))
              (t
               (setf (gethash id catalog) course)))))
    ;; check catalog
    (do-catalog (course catalog)
      (tmsmt::check-exp (lambda (v)
                          (unless (or (tmsmt::smt-true-p v)
                                      (catalog-contains-id catalog (normalize-prereq v)))
                            (error "Course not found `~A'" v)))
                        (course-prereq course)))
    catalog))

(defun load-catalog (pathname)
  (load-json pathname))

(defun ensure-catalog (thing)
  (etypecase thing
    (list thing)
    (string (parse-catalog thing))
    (pathname (load-catalog thing))))



;; Student Data
