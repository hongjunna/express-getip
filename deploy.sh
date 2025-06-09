#!/bin/bash
set -e
CURRENT_TIME=$(date '+%Y-%m-%d %H:%M:%S')
echo "🚀 배포를 시작합니다. at $(date '+%Y-%m-%d %H:%M:%S')"
echo "📦 기존 컨테이너를 잠시 중단합니다. at $(date '+%Y-%m-%d %H:%M:%S')"
/usr/local/bin/docker-compose down -v
echo "🐳 도커 빌드 및 배포를 시작합니다. at $(date '+%Y-%m-%d %H:%M:%S')"
/usr/local/bin/docker-compose up --build -d
echo "✅ 배포 완료되었습니다 at $(date '+%Y-%m-%d %H:%M:%S')"
