package service

type Test struct {
	proposition string
	answer string
	analysis string
	others interface{}
}

type Classification map[string] map[string] map[string] string
type Subject map[string] string

type RockBottomFetcher interface {
	FetchSubject() Subject
	FetchClassification(subject string) Classification
	FetchTest(testId string) Test
	GetRange(subject string, classification []string, length int, without []string) []string
}

type RockBottomFetch struct {
	Name string
	Host string
}

func (rbf *RockBottomFetch) FetchSubject() Subject {
	return nil
}

func (rbf *RockBottomFetch) FetchClassification(subject string) Classification  {
	return nil
}

func (rbf *RockBottomFetch) FetchTest(testId string) Test  {
	return Test{}
}

func (rbf *RockBottomFetch) GetRange(subject string, classification []string, length int, without []string) []string  {
	return nil
}