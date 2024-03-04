package main

import (
        "os/exec"
	"runtime"
)

func main() {

	if runtime.GOOS == "windows" {
		cmd := exec.Command("cmd.exe", "/c", "go", "run", "windowsmegainit.go")
		err := cmd.Run()
		if err != nil {
			panic(err)
		}
	} else {
		// Linux stuff
	}
}
