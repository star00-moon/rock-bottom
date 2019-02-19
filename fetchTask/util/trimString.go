package util

import "strings"

func TrimString(str string) string {
	strWithoutEmpty := strings.Replace(str, " ", "", -1)
	return strings.Replace(strWithoutEmpty, "\n", "", -1)
}
