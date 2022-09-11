프로젝트 실행법

- 사전에 준비 할 것 : node.js(v12 또는 v16 권장), AWS 계정

프론트엔드 빌드
- npm install 또는 yarn install 
- npm run serve
- 정상적으로 로그인 화면 나오는지 확인
- 여기까지는 잘 될 것이지만 로그인이 기능이 잘 동작하지 않을 것입니다. 이는 AWS Amplify 기능을 설치하지 않아 생긴 문제입니다.

AWS Amplify 설치 및 배포
- 
https://docs.amplify.aws/cli/start/install/ 
- 위 문서를 참고하여 amplify configure 작업 까지 마쳐주세요
- 중요) AWS IAM에서 위에서 생성한 사용자에 AdministratorAccess 권한을 추가해주세요, 추후 AWS Chime 서버 배포를 용이하게 하기 위함입니다.
- 설정을 마치셨으면 프로젝트 루트에서 amplify init을 수행한 후 amplify push로 백엔드 기능들을 배포해 주세요 (Cloud Formation, API Gateway, DynamoDB, Lambda 등이 자동생성 됩니다.)
- 여전히 로그인은 잘 동작하지 않을 것인데, 알아본 결과 amplify 버전이 업그레이드 됨에 따라 코드와 라이브러리를 일부 수정해야했습니다. 따라서, 제가 새롭게 올린 커밋을 참고하여 main.js를 바꾸어 주시고, package.json의 @aws-amplify/ui-components @aws-amplify/ui-vue aws-amplify <- 세 가지 라이브러리 버전을 참고해주세요
- 여기까지 아무 문제 없이 잘 되셨다면, 로그인까지는 잘 되실 겁니다.

마지막으로 가장 복잡한 화상채팅 백엔드 구성입니다.

프로젝트루트/video_demo/demos/serverless/README.md 를 봐주시기 바랍니다.

- AWS CLI, AWS SAM CLI 두 개 모두 설치해야합니다. 왜냐하면 serverless 폴더에서 npm run deploy 명령을 수행해야 하는데 두 CLI가 설치가 안되어있으면 실행되지 않습니다.
- AWS CLI는 버전 2를 설치하십시오. https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
- AWS SAM은 https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install-mac.html 을 참고해주세요.
- AWS SAM은 Step 3까지는 건너뛰고 Step 4 brew 설치부터 진행하셔도 됩니다.
- 설치 다 되셨으면, npm install 한 번 더 해줍니다.
- 그리고 template.yaml 에서 두 군데를 바꾸어 주어야 합니다. 18 라인과 115 라인을 둘 다 Runtime: nodejs16.x 로 바꾸어주세요
- 그 다음 npm run deploy -- -r ap-northeast-2 -b 버킷이름 -s 스택이름 -a 앱이름
- 버킷이름, 스택이름, 앱이름에 적절한 이름을 넣으신 후 실행해주세요 단, 버킷이름은 전 세계에서 고유하게 작성해야 하므로 잘 작성해주세요 예)demomeeting123456
- 혹시, npm run deploy가 잘 안된다면 node 버전 문제 일 수 있습니다. 또는 CloudFormation 에서 실패 원인을 봐야할 수도 있습니다.
- 성공적으로 수행하였다면 , https://hd7fvh3m00.execute-api.ap-northeast-2.amazonaws.com/Prod/ <- 주소 하나가 터미널에 나올 것입니다. 복사해서 보관해주세요.

여기까지 오셨다면, 본인만의 서버리스 기반의 서비스와 화상채팅 백엔드가 구성된 것입니다. AWS 청구비용은 서버리스라서 거의 부과되지 않지만 프로젝트 끝내시고 걱정되시면 리소스를 모두 지우시면 됩니다.

이제 프론트엔드 코드에 바뀐 백엔드 URL을 몇 개 바꿔주기만 하면 됩니다.

- S3 주소부터 바꾸겠습니다.  프로젝트 루트/src/face_module/js/bundle.js 104512 라인의
  predictor = await blinkModel.load('https://amplify-videochatsolution-dev-141403-deployment.s3.ap-northeast-2.amazonaws.com/models/model.json');
- amplify-videochatsolution-dev-141403-deployment를 Amplify가 자동으로 생성한 S3 버킷이름으로 바꾸어 주세요
- 같은 경로에 loader.js의 10라인의 S3_URL도 마찬가지로 바꾸어주세요
- 그리고 위에서 npm run deploy 결과로 나온 화상채팅 주소를 프로젝트 루트/src/demomeeting.js 1890라인의 주소와 바꾸어주세요.

지금부터는 AWS Console 상에서 수행하셔야 합니다.
- Amplify가 자동으로 생성한 S3 버킷에 models 폴더를 생성하고 그 아래 프로젝트루트/src/face_module/models 아래 모든 파일들을 업로드해주세요. 이 때 권한 -> 퍼블릭 읽기 액세스 권한 부여를 체크 해주신 뒤 업로드 해주세요. 당연히 버킷도 퍼블릭 액세스를 차단하면 안됩니다.
- 그리고, S3 버킷 루트레벨로 다시 와서 labeled_images 폴더를 만들고 본인 이름의 폴더(URL 인코딩 문제때문에 콘솔에서 직접 만드는 것 권장)를 만든 뒤 그 아래 최소 사진 2장을 1.jpg 2.jpg 형식으로 업로드 해주세요. 위와 마찬가지로 퍼블릭 읽기 액세스 권한 부여 체크해주세요.
- 위에서 만든 폴더 이름과 화상채팅 어플리케이션 로그인 후 우측 상단 개인정보 탭에서 이름 인풋박스에서 넣는 부분이 서로 매칭되는 부분이므로 유의하셔야 합니다.
- DynamoDB로 이동하여 scoreTable 에 userId-index 이름의 인덱스를 생성해주세요 파티션 키는 userId(String) 입니다.


여기까지가 사전준비해야 할 부분입니다. 이후 화상채팅방 새로 생성하시어 faceApi 버튼을 누르신뒤 약간의 딜레이 후에 파란색 박스가 보이면 성공입니다.





