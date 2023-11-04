package main

import (
	"fmt"
	"net/http"
	"os/exec"
	"io/ioutil"
	"syscall"
)

var m = make(map[string]*exec.Cmd)

func start(nm string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if m[nm] != nil {
			fmt.Fprintln(w, "FAILED: attempting to run already running process | process name : " + nm)
		} else {
			m[nm] = exec.Command("scripts/"+nm)
			m[nm].SysProcAttr = &syscall.SysProcAttr{Setpgid: true}
			err := m[nm].Start()
			if err != nil {
				panic(err)
			}
			fmt.Fprintln(w, "exec done | process name : " + nm)
		}
	}
}

func kill(nm string) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
		cmd := m[nm]
		if cmd == nil {
			fmt.Fprintln(w, "ERROR: tried to kill non-running process | process name : " + nm)
		} else {
			pgid, err := syscall.Getpgid(cmd.Process.Pid)
			if err == nil {
				syscall.Kill(-pgid, 15)  // note the minus sign
			}
			cmd.Wait()
			m[nm] = nil
			fmt.Fprintf(w, "kill done | process name : " + nm + "\n")
		}
	}
}

func status(nm string) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
		if m[nm] != nil {
			fmt.Fprintln(w, "RUNNING | process name : " + nm)
		} else {
			fmt.Fprintln(w, "NOT RUNNING | process name : " + nm)
		}
		//fmt.Printf("State %+v\n", m)
	}
}

func setUp(p string){
	http.HandleFunc("/r/"+p, start(p))
	http.HandleFunc("/k/"+p, kill(p))
	http.HandleFunc("/s/"+p, status(p))
}

func main() {
	files, _ := ioutil.ReadDir("scripts")
	for _, file := range files{
		fd := file.Name()
		m[fd] = nil
		setUp(fd)
	}
	//fmt.Printf("%+v\n", m)
	http.ListenAndServe(":8090", nil)
}
