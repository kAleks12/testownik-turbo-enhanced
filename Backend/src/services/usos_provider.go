package services

import (
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gofrs/uuid"
	"io"
	"net/http"
	"os"
	"src/dal"
	"src/model"
	"time"
)

type ServiceResponse struct {
	ID        string    `json:"Id"`
	Name      string    `json:"Name"`
	StartDate time.Time `json:"StartDate"`
	EndDate   time.Time `json:"EndDate"`
	Courses   []struct {
		ID      string `json:"Id"`
		Name    string `json:"Name"`
		UsosURL string `json:"UsosUrl"`
		Groups  []struct {
			ID       string `json:"Id"`
			Type     string `json:"Type"`
			Lecturer struct {
				ID        string `json:"Id"`
				FirstName string `json:"FirstName"`
				LastName  string `json:"LastName"`
			} `json:"Lecturer"`
		} `json:"Groups"`
	} `json:"Courses"`
}

type CacheEntry struct {
	CoursesMap   map[uuid.UUID]bool
	CoursesList  []uuid.UUID
	ValidThrough time.Time
}

// cache active courses along with user id and validThrough date
var coursesCache = make(map[string]CacheEntry)
var cacheInitialized = false
var cacheFile = "cache.json"

func GetActiveUserCourses(ctx *gin.Context) (map[uuid.UUID]bool, []uuid.UUID) {
	if !cacheInitialized {
		loadCache()
		cacheInitialized = true
	}
	user, exists := ctx.Get("user")
	if !exists {
		fmt.Println("User not found in context")
		return nil, nil
	}
	entry, exists := coursesCache[user.(string)]
	if exists && entry.ValidThrough.After(time.Now()) {
		return entry.CoursesMap, entry.CoursesList
	}

	token, exists := ctx.Get("token")
	if !exists {
		fmt.Println("Token not found in context")
		return nil, nil
	}
	usosService := os.Getenv("USER_COURSES_ENDPOINT")
	if usosService == "" {
		fmt.Println("USER_COURSES_ENDPOINT env var not set")
		return nil, nil
	}
	response := fetchServiceData(token.(string), usosService)
	if response == nil {
		return nil, nil
	}
	return updateDbData(response, user.(string))
}

func fetchServiceData(token string, endpoint string) *ServiceResponse {
	req, _ := http.NewRequest("GET", endpoint, nil)
	req.Header.Add("Authorization", token)

	// Send req using http Client
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error while sending the request.\n[ERROR] -", err)
		return nil
	}

	// Read the response body
	body, _ := io.ReadAll(resp.Body)
	err = resp.Body.Close()

	if resp.StatusCode != 200 {
		fmt.Println("Error while fetching data from service.\n[ERROR] -", err)
		return nil
	}
	var result ServiceResponse
	if err := json.Unmarshal(body, &result); err != nil { // Parse []byte to go struct pointer
		fmt.Println("Can not unmarshal JSON")
		return nil
	}
	return &result
}

func updateDbData(response *ServiceResponse, user string) (map[uuid.UUID]bool, []uuid.UUID) {
	coursesMap := make(map[uuid.UUID]bool)
	coursesList := make([]uuid.UUID, 0)
	groupsNumber := 0
	for _, course := range response.Courses {
		courseName := course.Name
		usosId := course.ID
		for _, group := range course.Groups {
			groupsNumber++
			id := upsertTeacher(group.Lecturer.FirstName, group.Lecturer.LastName)
			if id == nil {
				continue
			}
			courseId := upsertCourse(courseName, usosId, group.Type, *id)
			if courseId != nil {
				coursesMap[*courseId] = true
				coursesList = append(coursesList, *courseId)
			}
		}
	}
	if groupsNumber != len(coursesList) {
		fmt.Println("Some courses were not added to the database")
		return nil, nil
	}
	validThrough := response.EndDate
	updateCache(user, validThrough, coursesMap, coursesList)
	return coursesMap, coursesList
}

func upsertCourse(courseName string, usosId string, courseType string, teacherId uuid.UUID) *uuid.UUID {
	id, _ := uuid.NewV4()
	course := model.Course{
		Id:         id,
		Name:       courseName,
		UsosId:     usosId,
		CourseType: courseType,
		TeacherId:  teacherId,
	}
	err := dal.AddCourseToDB(&course)
	if err != nil {
		course, _ := dal.GetCourseByUniqueKey(usosId, teacherId, courseType)
		if course != nil {
			return &course.Id
		}
		fmt.Println(fmt.Sprintf("Error while processing course: %s %s %s", courseName, usosId, courseType))
		return nil
	}
	return &id
}

func upsertTeacher(firstName string, lastName string) *uuid.UUID {
	id, _ := uuid.NewV4()
	teacher := model.Teacher{
		Id:         id,
		Name:       firstName,
		Surname:    lastName,
		SecondName: "",
	}
	err := dal.AddTeacherToDB(&teacher)
	if err != nil {
		teacher, _ := dal.GetTeacherByUniqueKey(firstName, lastName, "")
		if teacher != nil {
			return &teacher.Id
		}
		fmt.Println(fmt.Sprintf("Error while processing teacher: %s %s", firstName, lastName))
		return nil
	}
	return &id
}

func updateCache(userId string, validThrough time.Time, coursesMap map[uuid.UUID]bool, coursesList []uuid.UUID) {
	coursesCache[userId] = CacheEntry{
		CoursesMap:   coursesMap,
		CoursesList:  coursesList,
		ValidThrough: validThrough,
	}

	// Save cache to filesystem
	cacheData, err := json.Marshal(coursesCache)
	if err != nil {
		fmt.Println("Error while marshalling cache data:", err)
	}

	err = os.WriteFile(cacheFile, cacheData, os.ModePerm)
	if err != nil {
		fmt.Println("Error while writing cache data to file:", err)
	}
}

func loadCache() {
	// Load cache from filesystem
	cacheData, err := os.ReadFile(cacheFile)
	if err != nil {
		fmt.Println("Error while reading cache data from file:", err)
		return
	}
	//bind cache data to cache map
	err = json.Unmarshal(cacheData, &coursesCache)
	if err != nil {
		fmt.Println("Error while unmarshalling cache data:", err)
	} else {
		fmt.Println("Cache loaded successfully")
	}
}
