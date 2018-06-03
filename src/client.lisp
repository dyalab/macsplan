(in-package :macsplan)

 ;; (call-planner
 ;;  #P"/home/ntd/git/macsplan/data/catalog.json"
 ;;  #P"/home/ntd/git/macsplan/data/student.json")


(defun call-planner (catalog-pathname student-pathname)
  (let ((catalog (read-file-into-string catalog-pathname))
        (student (read-file-into-string student-pathname)))
    (s-xml-rpc:xml-rpc-call (s-xml-rpc:encode-xml-rpc-call "plan" catalog student)
                            :host "localhost"
                            :port 8080)))
