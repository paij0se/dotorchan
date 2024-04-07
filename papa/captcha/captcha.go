package captcha

import (
	"encoding/json"
	"errors"
	"fmt"
	"image/color"
	"net"
	"net/http"
	"strings"

	"github.com/paij0se/doctorchan/web/aws/captcha/db"
	"github.com/steambap/captcha"
)

func GetIP(r *http.Request) (string, error) {
	ips := r.Header.Get("X-Forwarded-For")
	splitIps := strings.Split(ips, ",")

	if len(splitIps) > 0 {
		// get last IP in list since ELB prepends other user defined IPs, meaning the last one is the actual client IP.
		netIP := net.ParseIP(splitIps[len(splitIps)-1])
		if netIP != nil {
			return netIP.String(), nil
		}
	}

	ip, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return "", err
	}

	netIP := net.ParseIP(ip)
	if netIP != nil {
		ip := netIP.String()
		if ip == "::1" {
			return "127.0.0.1", nil
		}
		return ip, nil
	}

	return "", errors.New("IP not found")
}
func CaptchaHandle(w http.ResponseWriter, r *http.Request) {
	img, err := captcha.New(300, 100, captcha.SetOption(func(o *captcha.Options) {
		o.TextLength = 6
		o.Noise = 0.5
		o.CharPreset = "AEi123456789NadD"
		o.BackgroundColor = color.White

	}))
	if err != nil {
		fmt.Fprint(w, nil)
		fmt.Println(err.Error())
		return
	}
	img.WriteImage(w)
	ip, err := GetIP(r)
	if err != nil {
		fmt.Fprintf(w, "Error getting IP address")
	}
	fmt.Println("IP address: ", ip)
	// connect to mongodb
	// store the ip and image text in the database
	client := db.ConnectToDB()
	db.DbInsert(client, ip, img.Text)
}

func CaptchaVerify(w http.ResponseWriter, r *http.Request) {
	ip, err := GetIP(r)
	fmt.Println("[MONDA] IP address: ", ip)
	if err != nil {
		fmt.Fprintf(w, "Error getting IP address")
	}
	client := db.ConnectToDB()
	// curl -X POST http://192.168.1.6:5000/captcha/verify\?text\=g0qBef
	text := r.URL.Query().Get("text")
	fmt.Println("Text: ", text)
	dbText := db.DbGet(client, ip)
	fmt.Println("DB Text: ", dbText)
	if text == dbText {
		json.NewEncoder(w).Encode(true)
		db.ChangeVerified(client, ip)
	} else {
		json.NewEncoder(w).Encode(false)
		db.DeleteDocument(client, ip)
	}
}
