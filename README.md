<h1 align="center"> 옴니프로젝트 </h1> <br>
<p align="center">
    <img alt="omniproject" title="omni" src="https://user-images.githubusercontent.com/25981278/103296428-6ac7c380-4a39-11eb-966c-dbc715510099.jpg" width="450">
</p>

<p align="center">
<a href="https://omnichat.site" style="color:black; text-decoration:none;">omnichat.site</a> 
</p>



## 목차

- [프로젝트 제안 배경](#프로젝트-제안-배경)

- [주요기능](#주요기능)

- [프로젝트 수행](#프로젝트-수행)

  
## 프로젝트 제안 배경

코로나19 상황에서 **비대면 수업**이 많이 활성화 되었습니다. 대면 수업에 비해 학생들의 **집중도가 떨어질 수 밖에 없는 환경을 개선**하고자 인공지능, 빅데이터, 클라우드, IoT 기술들을 활용하여 온라인 화상환경을 구축하고 얼굴 인식을 통해 집중도를 분석했습니다. 그리고 개인의 집중도 정보를 점수화 및 시각화 함으로써 **모니터링 환경**을 구축했습니다.

![1](https://user-images.githubusercontent.com/25981278/103293334-073a9780-4a33-11eb-99f7-b91ce46db870.gif)

## 주요기능

omnichat.site의 주요 기능은 다음과 같습니다.

- [메인화면](#메인화면)
- [자동 출석체크](#자동출석기능)
- [학습자 모니터링](#학습자-모니터링)
- [인공지능 기술을 통한 얼굴 감정분석 및 눈 깜빡임 분석](#인공지능-기술을-통한-얼굴-감정분석-및-눈-깜빡임-분석)
- [로그인 회원가입 시각화](#로그인-회원가입-시각화)

------

### 메인화면

> Vue와 Vuetify 라이브러리를 활용하여 구현했습니다.
>

![7](https://user-images.githubusercontent.com/25981278/103296278-250afb00-4a39-11eb-9f27-39acec25d467.PNG)

------

### 자동출석기능

> 스토리라인 : 출석부 생성 -> 수업 진행 -> 출석부 확인
>

1. 출석부 생성![13](https://j.gifs.com/xnRmD9.gif)

2. 수업 진행 후.....![4](https://user-images.githubusercontent.com/25981278/103294745-cb550180-4a35-11eb-9dbb-f9bdd3b5ff17.gif)

   

3. 출석부 확인![12](https://user-images.githubusercontent.com/25981278/103296293-2b00dc00-4a39-11eb-95bf-78c63e2c73fa.gif)

------

### 학습자 모니터링

> 집중도 점수에 따른 강의자 화면(3단계 피드백)
>
> 70 점 이상: 녹색 <= 집중을 잘하고 있음. 터치할 필요 x
>
> 70 ~ 50 점: 파란색<= 가끔 딴 짓을 하거나, 산만할 수 있지만 양호
>
> 50점 이하: 빨간색 <= 졸거나, 매우 산만하거나 화면에 나타나지 않는 경우. 케어가 필요함

![1](https://user-images.githubusercontent.com/25981278/103293334-073a9780-4a33-11eb-99f7-b91ce46db870.gif)

------

### 인공지능 기술을 통한 얼굴 감정분석 및 눈 깜빡임 분석

> **오픈소스**라이브러리인 
>
> https://github.com/justadudewhohacks/face-api.js/ (얼굴 표정, 인물 인식)과
>
>  https://github.com/mirrory-dev/eyeblink (눈 깜빡임)을 
>
> 화상채팅과 통합시켜 **초당 2회** 얼굴 감정, 눈 깜빡임, 자동 출석을 위한 인물 인식을 수행했습니다. 그리고 **10초에 한 번**씩 얼굴 데이터들로 집중 점수 +,- 를 결정합니다.
>

![3](https://user-images.githubusercontent.com/25981278/103294404-29351980-4a35-11eb-9afb-588389d91722.PNG)

------

### 로그인 회원가입 시각화

> 로그인, 회원가입은 AWS Amplify와 AWS Cognito로 안전한 회원 데이터베이스와 인증 및 토큰을 구현했고 시각화는 학생 개인의 집중도 일별 추이를 그리기 위해 vue-chartjs 플러그인을 활용했습니다.
>

![1230024642503730](https://user-images.githubusercontent.com/25981278/103303437-4ffd4b00-4a49-11eb-96ce-43aca419ece6.jpg)

## 프로젝트 수행

> 프로젝트 수행 기간 : 2020년 11월 19일 ~ 2020년 12월 24일 (6주)
>
> 프로젝트 진행 주체 : 멀티캠퍼스 4차산업선도인력 양성 과정(융복합 프로젝트형)
>
> 기여 인원 : 5명











