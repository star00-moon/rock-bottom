package main

import (
	"./service"
	"github.com/fatih/color"
	"gopkg.in/mgo.v2"
	"log"
	"time"
)

type MongoSubject struct {
	Subject service.Subject
}

type MongoClassification struct {
	SubjectName string
	Classification service.Classification
}

var collection *mgo.Collection

func main() {
	session, err := mgo.Dial("localhost:27017")
	if nil != err {
		log.Fatal(err)
	}
	defer session.Close()
	session.SetMode(mgo.Monotonic, true)
	collection = session.DB("rock_bottom").C("yi_xue_la")

	initStudyEasily()
	color.Green("init successful!!")
	time.Sleep(time.Hour * 12 + time.Minute * 5)
}
