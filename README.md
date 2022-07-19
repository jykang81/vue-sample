# ui-mobile 

--- 

## Project setup

### 의존성 설치
```
npm install
```

### vue cli 설치
```
npm install @vue/cli@4.2.2
```

### git 설정
```
git config core.ignorecase false
```

### host 설정
[예제](./hosts_sample)

---

## Project Run & Build

### 개발 서버 실행
```
npm run dev:local
```

### 어플리케이션 빌드
```
npm run cicd:build:dev
```

---

## Project Sonarqube Upload

### dev 업로드
##### (https://sonardev.dev-nsmall.com/dashboard?id=ui-mobile-dev)
```
npm run sonar:local
```

### test 업로드
##### (https://sonardev.dev-nsmall.com/dashboard?id=ui-mobile-test)
```
npm run sonar:localtest
```
---

## Project Deploy

### dev 배포
##### (https://devm2.nsmall.com/)
로컬에서 직접 배포하는 것 (20분내 확인 완료)
```
npm run deploy:dev
```

### test 배포
##### (https://testm2.nsmall.com/)
코드빌드 구동으로 배포하는 것 (20분내 확인 완료)
```
npm run deploy:test
```
---

### 관련 문서
* [02.03.02 Node 설치 및 버전관리](http://wiki.nsmall.com:18090/wiki/pages/viewpage.action?pageId=40919014)
* [VS Code 이용 가이드](http://wiki.nsmall.com:18090/wiki/pages/viewpage.action?pageId=40907922)
* [개발표준](http://wiki.nsmall.com:18090/wiki/pages/viewpage.action?pageId=46011461)
* [mfrontend-framework](http://wiki.nsmall.com:18090/wiki/pages/viewpage.action?pageId=43217810)
* [mfrontend-framework-getting-started](http://wiki.nsmall.com:18090/wiki/display/TEST02/02.02+MFrontend+Framework+Getting+Started)
* [테스트 가이드](http://wiki.nsmall.com:18090/wiki/pages/viewpage.action?pageId=44654449)
