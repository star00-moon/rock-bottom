package main

import (
	"./service"
	"fmt"
	"log"
	"time"
)

func init() {
	ticker := time.NewTicker(time.Hour * 12)
	go func() {
		for value := range ticker.C {
			fmt.Println("value =", value)
			updateStudyEasily()
		}
	}()
}

func initStudyEasily() {
	var subject = service.StudyEasily.FetchSubject()
	err := collection.Insert(&MongoSubject{ subject})
	for subject := range subject {
		var classification = service.StudyEasily.FetchClassification(subject)
		err = collection.Insert(&MongoClassification{ subject,classification})
	}
	if nil != err {
		log.Fatal(err)
	}
}

func updateStudyEasily() {
	var subject = service.StudyEasily.FetchSubject()
	err := collection.Update(&MongoSubject{}, &MongoSubject{ subject})
	for subject := range subject {
		var classification = service.StudyEasily.FetchClassification(subject)
		err = collection.Update(&MongoClassification{}, &MongoClassification{ subject,classification})
	}
	if nil != err {
		log.Fatal(err)
	}
}
