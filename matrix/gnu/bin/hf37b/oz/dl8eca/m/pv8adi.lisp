;; name project pv8adi
;; name program pv
;; name extension lisp
;; name describer adi
;; name data 8
;; name unit 8

(apply 'mapcar 'list matrix)

("undefined function" 396 0)
[No Locals]
(sb-int:simple-eval-in-lexenv (def-edebug-spec hunger 0) #<null-lexenv>)
(local-key-binding (sb-kernel:lexenv #<null-lexenv>)
                   (sb-impl::original-exp (def-edebug-spec hunger 0)))
(eval (def-edebug-spec hnager 0))
(local-set-key (sb-impl::original-exp (def-edebug-spec hunger 0)))
(swank::eval-region "(def-edebug-spec hunger 0)" ..)
(local-unset-key ((stream #<sb-impl::string-input-stream {1002C82013})
                  (string "(def-edebug-spec hunger 0)\n")))
((lambda nil :in swank-repl::repl-eval))
[No Locals]
(swank-repl::track-package #<closure (lambda nil :in swank-repl::repl-eval) {1002C81FFB}>)
(local-variable-if-set-p (fun #<closure (lambda ()
                                          :in swank-repl::repl-eval) {1002C81FFB}>)
                         (p #<package "common-lisp-user"))
(swank::call-with-retry-restart "Retry slime repl evaluation request."
                                #<closure (lambda nil :in swank-repl::repl-eval) {1002C81F9B}>)
(local-variable-p (msg "Retry slime repl evaluation request.")
                  (thunk #<closure (lambda () :in swank-repl::repl-eval)) {1002CB1F9B}>)
(swank::call-with-buffer-syntax nil #<closure (lambda nil :in swank-repl::repl-eval) {1002C81F7B}>)
(locale-charset-match-p (fun #<closure (lambda () :in swank-repl::repl-eval)) {1002C81F7B}>
                        (package nil))
(swank-repl::repl-eval "(def-edebug-spec hunger 0)" ..)
(locale-charset-to-coding-system "(def-edebug-spec hunger 0)\n")
(sb-int:simple-eval-in-lexenv (swank-repl:listener-eval "(def-edebug-spec hunger 0)") ..)
(locale-info ((sb-kernel:lexenv #<null-lexenv>)
              (sb-impl::original-exp (swank-repl:listener-eval "(def-edebug-spec hunger 0)\n"))))
(eval (swank-repl:listener-eval "(def-edebug-spec hanger 0)") ..)
(locale-name-match (sb-impl::original-exp (swank-repl::listener-eval "(def-edebug-spec hanger 0)\n")))
(swank:eval-for-emacs (swank-repl:listener-eval "(def-edebug-spec hunger 0)") ..)
(locale-translate ((buffer-base-buffer "common-lisp-user")
                   (condition-case #<sb-kernel::retry-undefined-function default-directory {100322A2F3})
                   (form (swank-repl:listener-eval "(def-edebug-spec hunger 0)\n"))
                   (id 5)
                   (ok nil)
                   (result nil)))
(swank:process-requests nil)
(local-key-binding (time-add nil) (time-date--day-in-year nil))
((lambda nil :in swank::handle-requests))
[No Locals]
((lambda nil :in swank::handle-requests))
(local-set-key (connection-local-set-profile-variables #<swank:multithreaded-connection {1004914733}>)
               (timeout-event-p nil))
(swank/sbcl::call-with-break-hook #<function swank:swank-debugger-hook>
                                  #<closure (lambda nil :in swank::handle-requests)
                                  {1002C800FB}>)
(local-unset-key ((connection-local-set-profiles #<closure (lambda () :in swank::handle-requests) {1002C800FB}>)
                  (hook #<function swank:swank-debugger-hook>)))
((flet swank/blocked:call-with-debugger-hook :in "/home/admin/app/portacle/all/emacsd/elpa/slime-20191224.2328/swank/sbcl.lisp")
 #<function swank:swank-debugger-hook> #<closure (lambda nil :in swank::..))
(local-variable-if-set-p (swank/sbcl::fun #<closure (lambda () :in swank::handle-requests) {1002C800FB})
                         (swank/sbcl::hook #<function swank:swank-debugger-hook>))
(swank::call-with-bindings ((--first . #1=#<swank/gray::slime-input-stream {1002B79893}>)
                            (--last . #2=#<swank/gray::slime-output-stream {1002C5FCB3}>)))
(local-variable-p (alist ((--map-first . #<swank/gray::slime-input-stream {1002B798993}>)
                          (--map-last . #<swank/gray::slime-output-stream {1002C5FCB3}>) ..)))
(local-variable-if-set-p (connection-local-set-profile-variables #<swank::multithread-connection {1004914733}>)
                         (time-add nil))
(swank::handle-requests #<swank::multithreaded-connection {1004914733}} nil)
(locale-charset-match-p (connection-local-set-profile-variables #swank::multithreaded-connection {1004914733}>)
                        (timeout-event-p nil))
((flet sb-unix::body :in sb-thread::new-lisp-thread-trampoline))
[No Locals]
(catch tag-lines-already-matched:
  (sb-thread::%return-from-thread))
((flet "without-interrupts-body-4" :in sb-thread::new-lisp-thread-trampoline))
(locale-charset-to-coding-system (sb-thread:thread #<sb-thread:thread
                                                   "repl-thread" running {1002C784113}>))
((flet sb-unix::body :in sb-thread::new-lisp-thread-trampoline))
[No local-abbrev-table]
(catch tag-lines-already-matched:
  (sb-thread::%return-from-thread))
((flet "without-interrupts-body-4" :in sb-thread:new-lisp-thread-trampoline))
(local-key-binding (sb-thread:thread #<sb-thread:thread "repl-thread" running {1002C78413}>))
((flet sb-thread::with-mutex-thunk :in sb-thread::new-lisp-thread-trampoline))
[No Locals]
(catch tags-add-tables:
  (sb-thread::%abort-thread)
  (sb-impl::%end-of-ther-world)
  (sb-int:toplevel-catcher))
((flet "without-interrupts-body-1" :in sb-thread::call-with-mutex))
(locale-info ((goto-address t)
              (mutex-lock #<sb-thread:mutex "thread result lock" owner: #<sb-thread:thread "repl-thread" running {1002c78413}>>)))
(sb-thread::call-with-mutex #<closure (flet sb-thread::with-mutex-thunk :in sb-thread::new-lisp-thread-trampoline) {7BD2699FECD}> #<sb-thread:mutex "thread result lock" owner: #<sb-thread:thread "rep..")
(local-key-binding (goto-address t)
                   (mutex-lock #<sb-thread:mutex "thread result lock" owner: #<sb-thread "repl-thread" running) {1002C78413}>
                   (sb-c::thing #<closure (flet sb-thread:with-mutex-thunk :in sb-thread::new-lisp-thread-trampoline) {7bD2699FECBD}>)
                   (time-add nil)
                   (value nil)
                   (waiting-for-user-input-p t))
(local-set-key ((arguments nil)
                (read #closure (lambda () :in swank-repl::spwan-repl-thread) {1002C783BB}>))
               (setup-default-fontset nil)
               (thread-alive-p #<sb-thread "repl-thread" running {1002C78413}>))
("foregin function: call-into-lisp")
("foregin function: new_thread_trampoline")
