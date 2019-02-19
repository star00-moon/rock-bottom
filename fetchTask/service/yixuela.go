package service

import (
	"../util"
	"github.com/PuerkitoBio/goquery"
	"log"
	"math/rand"
	"net/http"
	"strconv"
	"strings"
)

type Yixuela struct {
	RockBottomFetch
	TestBaseUrl           string
	Subject               map[string]string
	Classifications       map[string]Classification
	ClassificationBaseUrl string
}

func (rbf *Yixuela) FetchSubject() Subject {
	subject := make(map[string]string)

	const baseUrl string = "https://tiku.yixuela.com"

	response, err := http.Get(baseUrl)
	if err != nil {
		log.Fatal(err)
	}
	defer response.Body.Close()

	doc, err := goquery.NewDocumentFromReader(response.Body)
	if err != nil {
		log.Fatal(err)
	}

	doc.Find(".kemu-list").Each(func(index int, s *goquery.Selection) {
		s.Find("img").Each(func(index int, a *goquery.Selection) {
			name := a.AttrOr("alt", "")
			link := a.Parent().AttrOr("href", "")
			subject[name] = baseUrl + link
		})
	})

	rbf.Subject = subject
	return subject
}

func (rbf *Yixuela) FetchClassification(subject string) Classification {
	response, err := http.Get(rbf.Subject[subject])
	if err != nil {
		log.Fatal(err)
	}
	defer response.Body.Close()

	doc, err := goquery.NewDocumentFromReader(response.Body)
	if err != nil {
		log.Fatal(err)
	}

	firstClassification := make(Classification)
	doc.Find("#notes-list > li").Each(func(index int, s *goquery.Selection) {
		firstTitleWaitTrim := s.ChildrenFiltered("a").Text()
		firstTitle := util.TrimString(firstTitleWaitTrim)
		secondClassification := make(map[string]map[string]string)
		s.ChildrenFiltered("ul").Each(func(i int, selection *goquery.Selection) {
			secondTitleWaitTrim := selection.ChildrenFiltered("li").ChildrenFiltered("a").Text()
			secondLink := selection.ChildrenFiltered("li").ChildrenFiltered("a").AttrOr("href", "")
			secondTitle := util.TrimString(secondTitleWaitTrim)
			thirdClassification := make(map[string]string)
			selection.ChildrenFiltered("li").ChildrenFiltered("ul").Find("li > a").Each(func(i int, selection *goquery.Selection) {
				thirdTitle := util.TrimString(selection.Text())
				thirdLink := selection.AttrOr("href", "")
				thirdClassification[thirdTitle] = thirdLink
			})
			if len(thirdClassification) == 0 {
				secondClassification[secondTitle] = map[string]string{"null": secondLink}
			} else {
				secondClassification[secondTitle] = thirdClassification
			}
		})
		firstClassification[firstTitle] = secondClassification
	})

	if rbf.Classifications == nil {
		rbf.Classifications = make(map[string]Classification)
	}
	rbf.Classifications[subject] = firstClassification
	return firstClassification
}

func (rbf *Yixuela) FetchTest(testId string) Test {
	var result Test

	response, err := http.Get(rbf.TestBaseUrl + testId + ".html")
	if err != nil {
		log.Fatal(err)
	}
	defer response.Body.Close()

	doc, err := goquery.NewDocumentFromReader(response.Body)
	if err != nil {
		log.Fatal(err)
	}

	doc.Find(".question").Eq(0).Each(func(index int, s *goquery.Selection) {
		propositionHtml, err := s.Html()
		if nil != err {
			log.Fatal(err)
		}
		result.proposition = propositionHtml
	})

	doc.Find(".question").Eq(1).Each(func(index int, s *goquery.Selection) {
		answerHtml, err := s.Html()
		if nil != err {
			log.Fatal(err)
		}
		result.answer = answerHtml
	})

	doc.Find(".question").Eq(2).Each(func(index int, s *goquery.Selection) {
		analysisHtml, err := s.Html()
		if nil != err {
			log.Fatal(err)
		}
		result.analysis = analysisHtml
	})

	doc.Find(".question").Eq(3).Each(func(index int, s *goquery.Selection) {
		testPointHtml, err := s.Html()
		if nil != err {
			log.Fatal(err)
		}
		result.others = testPointHtml
	})

	return result
}

func (rbf *Yixuela) GetRange(subject string, classification []string, length int, without []string) []string {
	result := make([]string, 0)

	requireClassification := rbf.Classifications[subject]
	selectClassificationUrl := requireClassification[classification[0]][classification[1]][classification[2]]
	selectId := strings.Split(selectClassificationUrl, "/")[3]
	urlId, err := strconv.Atoi(selectId)
	if nil != err {
		log.Fatal(err)
	}
	selectClassificationUrl = rbf.ClassificationBaseUrl + selectClassificationUrl
	nextUrl := strings.Split(selectClassificationUrl, selectId)[0] + strconv.Itoa(urlId+1)
	startTestId := getStart(selectClassificationUrl)
	endTestId := getStart(nextUrl)
	startNumber, err := strconv.Atoi(startTestId)
	if nil != err {
		log.Fatal(err)
	}
	for i := 0; i < length; i ++ {
		randomNumber := rand.Intn(util.GetIntSubFromString(startTestId, endTestId)) + startNumber
		result = append(result, strconv.Itoa(randomNumber))
	}

	return result
}

func getStart(classificationUrl string) string {
	var result string

	response, err := http.Get(classificationUrl)
	if err != nil {
		log.Fatal(err)
	}
	defer response.Body.Close()

	doc, err := goquery.NewDocumentFromReader(response.Body)
	if err != nil {
		log.Fatal(err)
	}

	doc.Find(".view-answer > a").Eq(0).Each(func(index int, a *goquery.Selection) {
		link := a.AttrOr("href", "")
		resultWithoutMore := strings.Split(link, "/")[2]
		result = strings.Split(resultWithoutMore, ".")[0]
	})

	return result
}
