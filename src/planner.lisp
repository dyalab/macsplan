(in-package :macsplan)

(defun course-action (id)
  (concatenate 'string "take-" id))

(defun course-action-id (action)
  (subseq action 5))

(defun macsplan-prereq (course)
  (tmsmt::apply-rewrite-exp
   (lambda (e)
     (if (tmsmt::smt-true-p e)
         e
         (multiple-value-bind (id coreq)
             (normalize-prereq e)
           (if coreq
               (tmsmt::fluent-next id)
               (tmsmt::fluent-now id)))))
   (course-prereq course)))

(defun macsplan-transition (catalog add-function)
  (do-catalog (course catalog)
    (let* ((id (course-id course))
           (action (course-action id))
           (course-now (tmsmt::fluent-now id))
           (action-now (tmsmt::fluent-now action)))

    ;; prereq
    (when (and (course-prereq course)
               (not (tmsmt::smt-true-p (course-prereq course))))
      (funcall add-function
               `(tmsmt::transition (tmsmt::=>
                                    ,action-now
                                    ,(macsplan-prereq course)))))
    ;; no duplicate
    (funcall add-function
             `(tmsmt::transition (tmsmt::=> ,action-now (not ,course-now))))
    ;; frame/effect
    (funcall add-function
             `(tmsmt::transition (tmsmt::<=> (or ,course-now ,action-now)
                                             ,(tmsmt::fluent-next id)))))))

(defun macsplan-goal (student add-function)
  (funcall add-function `(tmsmt::goal ,(student-degree student))))

(defun macsplan-cpdl (catalog student)
  (let ((catalog (ensure-catalog catalog))
        (student (ensure-student student)))
    (check-student catalog student)
    (tmsmt::with-collected (add)
      (do-catalog (course catalog)
        (let* ((id (course-id course))
               (action (course-action id)))
          ;; fluents
          (add `(tmsmt::declare-fluent ,id tmsmt::bool))
          (add `(tmsmt::declare-fluent ,action tmsmt::bool))
          (add `(tmsmt::output ,action))
          ;; start
          (if (gethash course (student-taken student))
              (add `(tmsmt::start ,id))
              (add `(tmsmt::start (not ,id))))))
      ;; goal
      (macsplan-goal student #'add)
      ;; transition
      (macsplan-transition catalog #'add)
      )))

(defun macsplan-result (plan)
  (let ((v (make-array 1 :adjustable t :initial-element nil)))
    (loop for ((i a) . value) in plan
       when (tmsmt::smt-true-p value)
       do
         (when (< (length v) (1+ i))
           (adjust-array v (1+ i) :initial-element nil))
         (push (course-action-id a)
               (aref v i)))
    v))


(defun macsplan (catalog student)
    (let* ((cpdl (macsplan-cpdl catalog student))
           (domain (tmsmt::parse-cpdl cpdl)))
     ; domain
      (multiple-value-bind (plan found)
          (tmsmt::cpd-plan domain)
        (when found
          (macsplan-result plan)))
      ;(tmsmt::cpd-smt domain 1)
      ;(tmsmt::cpd-stmts domain)
      ))
