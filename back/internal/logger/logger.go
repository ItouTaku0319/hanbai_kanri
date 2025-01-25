package logger

import (
	"fmt"
	"log"
	"os"
	"time"
)

// 日付ごとのログファイルを作成
func InitLogger() {
	// 現在の日付を取得
	currentDate := time.Now().Format("2006-01-02")                // YYYY-MM-DD 形式
	logFilePath := fmt.Sprintf("logs/server-%s.log", currentDate) // logs/server-YYYY-MM-DD.log

	// logs/ ディレクトリが存在しない場合は作成
	if _, err := os.Stat("logs"); os.IsNotExist(err) {
		os.MkdirAll("logs", 0755) // ディレクトリを作成（親ディレクトリも含め）
	}

	// ログファイルを開く（なければ作成、追記モード）
	logFile, err := os.OpenFile(logFilePath, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		log.Fatal("Failed to open log file:", err)
	}

	// ロガーを作成（標準出力にも出力する場合は log.MultiWriter を使用）
	InfoLogger = log.New(logFile, "INFO: ", log.Ldate|log.Ltime|log.Lshortfile)
	ErrorLogger = log.New(logFile, "ERROR: ", log.Ldate|log.Ltime|log.Lshortfile)

	// 初期化ログを記録
	InfoLogger.Println("Logger initialized. Logs are stored in:", logFilePath)
}

var (
	InfoLogger  *log.Logger
	ErrorLogger *log.Logger
)
