package main

import (
	"fmt"
	"net/http"
	"os/exec"
	"io/ioutil"
)

type process struct{
	args []string
	proc *exec.Cmd
	id string
}
func (p *process) start(x http.ResponseWriter, req *http.Request) {
	if p.proc != nil {
		fmt.Fprintln(x, "RESTART: attempting to restart already running process | process name : " + p.id)
		err := p.proc.Process.Kill()
		if err != nil {
			panic(err)
		}
	}
	p.proc = exec.Command(p.args[0], p.args[1:]...)
	err := p.proc.Start()
	if err != nil {
		panic(err)
	}
	fmt.Fprintln(x, "exec done | process name : " + p.id)
}

func (p *process) kill(x http.ResponseWriter, req *http.Request) {
	if p.proc == nil {
		fmt.Fprintln(x, "ERROR: tried to kill non-running process | process name : " + p.id)
	}
	err := p.proc.Process.Kill()
	p.proc = nil
	if err != nil {
		fmt.Fprintln(x, "ERROR: failed to kill | Internal error:" + "____" + " | process name : " + p.id) //TODO replace "____" with err.toString() equivalent
		panic(err)
	}
	fmt.Fprintf(x, "\nkill done | process name : " + p.id + "\n")
}

func (p *process) status(x http.ResponseWriter, req *http.Request) {
	if p.proc != nil {
		fmt.Fprintln(x, "RUNNING | process name : " + p.id)
	}
	if p.proc == nil {
		fmt.Fprintln(x, "NOT RUNNING | process name : " + p.id)
	}
}

func (p *process) setUp(){
	http.HandleFunc("/r/" + p.id, p.start)
	http.HandleFunc("/k/" + p.id, p.kill)
	http.HandleFunc("/s/" + p.id, p.status)
}

func main() {
	var processArray []process

	files, _ := ioutil.ReadDir("scripts")

	for _, file := range files{
		processArray = append(processArray, process{[]string{"scripts/"+file.Name()}, nil, file.Name()[:len(file.Name())-3]})
	}

	processArray = append(processArray , process{[]string{"feh", "dog.jpg"}, nil, "dog"})

	for i := 0; i < len(processArray); i++ {
		processArray[i].setUp()
	}

	http.ListenAndServe(":8090", nil)
}
