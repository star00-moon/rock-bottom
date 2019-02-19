package util

import (
	"log"
	"strconv"
)

func GetIntSubFromString(s1 string, s2 string) int {
	n1, err := strconv.Atoi(s1)
	if nil != err {
		log.Fatal(err)
	}

	n2, err := strconv.Atoi(s2)
	if nil != err {
		log.Fatal(err)
	}

	return n2 - n1
}
