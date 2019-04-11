(in-package :macsplan)

(defun course-action (id)
  (concatenate 'string "take-" id))

(defun elective-action (id elective)
  (concatenate 'string
	       (concatenate 'string "take-" elective)
	       (concatenate 'string "-" id)))

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

(defun macsplan-transition (catalog electives add-function)
  (let ((credit-hour-total nil))
    (do-catalog (course catalog)
      (let* ((id (course-id course))
	     (action (course-action id))
	     (course-now (tmsmt::fluent-now id))
	     (action-now (tmsmt::fluent-now action)))

	;; prereq
	(when (and (course-prereq course)
		   (not (tmsmt::smt-true-p (course-prereq course))))
	  (funcall add-function
		   `(tmsmt::transition (=>
					,action-now
					,(macsplan-prereq course)))))
	;; no duplicate
	(funcall add-function
		 `(tmsmt::transition (=> ,action-now (not ,course-now))))
	;; frame/effect
	(funcall add-function
             `(tmsmt::transition (<=> (or ,course-now ,action-now)
				      ,(tmsmt::fluent-next id))))

	;;credit hour totals
	(setf credit-hour-total (cons `(ite ,action-now ,(course-credits course) 0)
				      credit-hour-total))))
    (funcall add-function
	     `(tmsmt::transition (>= 15 ,(cons '+ credit-hour-total))))))

(defun macsplan-add-electives (electives-needed electives add-function)
  (loop for (name . elect) in electives-needed
     do (let ((eligable-courses (gethash elect electives)))
	  ;;add fluents for electives
	  (funcall add-function `(tmsmt::declare-fluent ,name))
	  (dolist (course eligable-courses)
	    (let ((action (elective-action name course)))
	      ;;add elective actions
	      (funcall add-function `(tmsmt::declare-fluent ,action))
	      (funcall add-function `(tmsmt::output ,action))))))) ;;maybe not this....


(defun macsplan-goal (student add-function)
  (funcall add-function `(tmsmt::goal ,(student-degree student))))

(defun convert-degree-requirements (student catalog)
  (let ((electives nil)
	(i 0))
    (labels ((parse-degree (e)
	       (if (atom e)
		   (if (null (gethash e catalog))
		       (let ((req (concatenate 'string (format nil "E~d_" i) e)))
			 (push (cons req e) electives)
			 (incf i)
			 req)
		       e)
		   (destructuring-bind (op &rest args) e
		     (cond ((eq op 'and)
			    (cons 'and (map 'list #'parse-degree args)))
			   ((eq op 'or)
			    (cons 'or (map 'list #'parse-degree args)))
			   ((eq op 'not)
			    (cons 'not (map 'list #'parse-degree args)))
			   (t (loop for exp in e
				 collect (parse-degree exp))))))))
      (setf (student-degree student) (parse-degree (student-degree student)))
      electives)))


(defun macsplan-cpdl (catalog student)
  (let* ((catalog (ensure-catalog catalog))
        (student (ensure-student student))
	(electives (make-hash-table :test 'equal))  ;;elective => list of courses that count
	(electives-needed (convert-degree-requirements student catalog)))
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
              (add `(tmsmt::start (not ,id))))
	  ;; create elective hash table
	  (dolist (elect (course-elective-type course))
	    (setf (gethash elect electives) (cons id (gethash elect electives))))))

      ;;Electives
      (macsplan-add-electives electives-needed electives #'add)
      ;; goal
      (macsplan-goal student #'add)
      ;; transition
      (macsplan-transition catalog electives-needed #'add))))

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
