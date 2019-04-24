(in-package :macsplan)

(defun course-action (id)
  (concatenate 'string "take-" id))

(defun teach-course (teacher id)
  (concatenate 'string teacher id))

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
  (let ((credit-hour-total nil)
	(elect-hash (make-hash-table :test 'equal))) ;;CPDL elective => actions that can modify it
    (do-catalog (course catalog)
      (let* ((id (course-id course))
	     (action (course-action id))
	     (course-now (tmsmt::fluent-now id))
	     (action-now (tmsmt::fluent-now action))
	     (semesters (course-semester course)))

	;; prereq
	(if (and (course-prereq course)
		   (not (tmsmt::smt-true-p (course-prereq course))))
	  (funcall add-function
		   `(tmsmt::transition (=>
					,action-now
					(AND ,(macsplan-prereq course)
					     ,(cons 'OR
						    (map 'list #'tmsmt::fluent-now semesters))))))
	  (funcall add-function
		   `(tmsmt::transition (=>
					,action-now
					,(cons 'or
					       (map 'list #'tmsmt::fluent-now semesters))))))

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
    ;;Credit Hours
    (funcall add-function
	     `(tmsmt::transition (>= 15 ,(cons '+ credit-hour-total))))

    ;;Semester
    (funcall add-function
	     `(tmsmt::transition (<=> (tmsmt::now "Fall") (tmsmt::next "Winter") )))
    (funcall add-function
	     `(tmsmt::transition (<=> (tmsmt::now "Winter") (tmsmt::next "Spring") )))
    (funcall add-function
	     `(tmsmt::transition (<=> (tmsmt::now "Spring") (tmsmt::next "Summer") )))
    (funcall add-function
	     `(tmsmt::transition (<=> (tmsmt::now "Summer") (tmsmt::next "Fall") )))


    (loop for course being the hash-keys of electives
       using (hash-value elect-list)
       do (let ((action-electives (map 'list (lambda (x)
					  (elective-action course x))
				  elect-list)))
	    (dolist (elect elect-list)
	      (let* ((course-action (tmsmt::fluent-now (course-action course)))
		     (elect-now (tmsmt::fluent-now elect))
		     (action (elective-action course elect))
		     (elect-action (tmsmt::fluent-now action))
		     (mutex-elect (map 'list (lambda (x)
					       (tmsmt::fluent-now x))
				       (remove action action-electives :test 'equal))))

		;; no duplicates
		(funcall add-function
			 `(tmsmt::transition (=>
					      ,elect-action
					      (not ,elect-now))))

		;; prereqs (just that we are taking the action to do the course)
		(funcall add-function
			 `(tmsmt::transition (=>
					      ,elect-action
					      ,course-action)))

		;; mutex with other possible electives
		(funcall add-function
			 `(tmsmt::transition (=>
					      ,elect-action
					      (not ,(cons 'or mutex-elect)))))

		(setf (gethash elect elect-hash)
		      (cons elect-action (gethash elect elect-hash)))))))

    (loop for elect being the hash-keys of elect-hash
       using (hash-value action-list)
	 do ;;frame
	 (funcall add-function
		  `(tmsmt::transition (<=> (or ,(tmsmt::fluent-now elect) ,(cons 'or action-list))
					   ,(tmsmt::fluent-next elect)))))))


(defun macsplan-add-elective-actions (elective-hash add-function)
  (loop for course being the hash-keys of elective-hash
     do (let ((electives (gethash course elective-hash)))
	  (loop for name in electives
	       do (progn
		    (let ((action (elective-action course name)))
		      ;;add elective actions
		      (funcall add-function `(tmsmt::declare-fluent ,action))))))))


(defun macsplan-goal (student add-function)
  (funcall add-function `(tmsmt::goal ,(student-degree student))))

(defun convert-degree-requirements (student catalog)
  (let ((electives (make-hash-table :test 'equal))
	(i 0))
    (labels ((parse-degree (e)
	       (if (atom e)
		   (if (null (gethash e catalog))
		       (let ((req (concatenate 'string (format nil "E~d_" i) e)))
			 (setf (gethash e electives) (cons req (gethash e electives)))
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
	 (electives (make-hash-table :test 'equal)) ;;id => list of CPDLelectives that count
	 (electives-needed (convert-degree-requirements student catalog));;elective => CPDL electives
	 (teach-want (student-pref-teach student)))
    (check-student catalog student)
    (tmsmt::with-collected (add)
      (do-catalog (course catalog)
        (let* ((id (course-id course))
               (action (course-action id))
	       (teacher-list (course-teacher course)))

          ;; fluents
          (add `(tmsmt::declare-fluent ,id tmsmt::bool))
          (add `(tmsmt::declare-fluent ,action tmsmt::bool))
          (add `(tmsmt::output ,action))

	  ;;perfer plans where we take these courses
	  (loop for teach in (intersection teacher-list teach-want :test 'equal)
	     do (let ((teach-fluent (teach-course teach id)))
		  (add `(tmsmt::declare-fluent ,teach-fluent tmsmt::bool))
		  (add `(tmsmt::start (not ,teach-fluent)))
		  (add `(tmsmt::transition (<=> (or ,(tmsmt::fluent-now teach-fluent)
						     ,(tmsmt::fluent-now action))
						,(tmsmt::fluent-next teach-fluent))))
		  (add `(tmsmt::assert-soft ,(teach-course teach id) 1))))

          ;; start
          (if (gethash id (student-taken student))
              (add `(tmsmt::start ,id))
	      (add `(tmsmt::start (not ,id))))

	  ;; create elective hash table
	  (dolist (elect (course-elective-type course))
	    (setf (gethash id electives) (append (gethash elect electives-needed)
						 (gethash id electives))))))

      ;;Semester List
      (add `(tmsmt::declare-fluent "Fall" tmsmt::bool))
      (add `(tmsmt::declare-fluent "Spring" tmsmt::bool))
      (add `(tmsmt::declare-fluent "Winter" tmsmt::bool))
      (add `(tmsmt::declare-fluent "Summer" tmsmt::bool))

      (add `(tmsmt::start "Fall"))
      (add `(tmsmt::start (not "Spring")))
      (add `(tmsmt::start (not "Winter")))
      (add `(tmsmt::start (not "Summer")))


      ;;Elective fluents
      (loop for elect being the hash-keys of electives-needed
	 using (hash-value elect-list)
	 do (dolist (cpdl-elect elect-list)
	      (add `(tmsmt::declare-fluent ,cpdl-elect tmsmt::bool))
	      (add `(tmsmt::start (not ,cpdl-elect)))))

      ;;Electives actions
      (macsplan-add-elective-actions electives #'add)

      ;; goal
      (macsplan-goal student #'add)
      ;; transition
      (macsplan-transition catalog electives #'add))))

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
          (tmsmt::cpd-plan domain '((:max-steps . 20)(:trace . nil)))
        (when found
          (macsplan-result plan)))))
