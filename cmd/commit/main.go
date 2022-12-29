package main

import (
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
)

func main() {
	if len(os.Args) < 2 {
		log.Fatal("No arg given")
	}
	arr := strings.Split(os.Args[1], "|")
	if len(arr) < 2 {
		log.Fatalf("Bad arg format: %s", os.Args[1])
	}
	side := arr[1]
	user := os.Getenv("EVENT_USER_LOGIN")
	if user == "" {
		log.Fatal("EVENT_USER_LOGIN is blank")
	}
	if side == "new" {
		fmt.Printf("@%s started a new game", user)
	} else if side == "ai" {
		fmt.Printf("Computer played a turn on behalf of @%s", user)
	} else {
		if len(arr) < 3 {
			log.Fatalf("Bad arg format: %s", os.Args[1])
		}
		idx, err := strconv.Atoi(arr[2])
		if err != nil {
			log.Fatal(err)
		}
		fmt.Printf("@%s moved %s's shells from pit %d", user, side, idx)
	}
}
