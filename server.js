// 아까 설치한 라이브러리를 첨부해 주세요
    const express = require('express');

//첨부한 라이브러리 사용해서 새로운 객체 만들어주세요. 이제 app이라고 부를게요
    const app = express();

// .listen() : 내 컴퓨터에서 서버를 열 수 있음(어디에?)
// .listen(서버띄울 포트번호,  function(){서버 띄우고 실행할 코드})
    app.listen(8080, function(){
        console.log('listening on 8080');
    });

// GET요청(/어쩌구 url로 방문하면 요청하는것) 처리하는 코드
// .get()함수 안에 들어가는 파라미터가 2개인 형태임. 하나가 함수.->콜백함수.
// .get('경로', function(요청내용, 응답내용){응답어떻게 할지})
//   *).get('경로', (요청내용, 응답내용) => {응답어떻게 할지}) 화살표함수로도 가능

    // (예시)
    // app.get('/pet', function(요청req, 응답res){
    //     응답res.send('펫용품 쇼핑 페이지입니다.');
    // });

    app.get('/', function(요청req, 응답res){
        // 응답방법으로.파일보내주세요(__디렉션네임 + '파일경로')
        응답res.sendFile(__dirname + '/index.html');
    });
    app.get('/write', function(요청req, 응답res){
        응답res.sendFile(__dirname+'/write.html');
    });

// POST요청 처리하는 코드
    // app.post('경로', function(요청내용, 응답내용){응답어떻게 할지} )
    app.post('/add', function(요청req, 응답res){
        응답res.send('전송완료')
    });

