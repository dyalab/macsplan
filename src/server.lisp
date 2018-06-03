(in-package :macsplan)

(defvar *server* nil)

(defun serve (&key (port 8080))
  (unless *server*
    (setq *server*
          (s-xml-rpc:start-xml-rpc-server :port port))))

(defun stop ()
  (when *server*
    (s-xml-rpc:stop-server *server*)
    (setq *server* nil)))




;; (s-xml-rpc:xml-rpc-call (s-xml-rpc:encode-xml-rpc-call "echo" "foo")
;;                         :host "localhost"
;;                         :port 8080)
