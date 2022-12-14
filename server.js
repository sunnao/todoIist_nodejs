// 아까 설치한 라이브러리를 첨부해 주세요
    const express = require('express');

//첨부한 라이브러리 사용해서 새로운 객체 만들어주세요. 이제 app이라고 부를게요
    const app = express();

// 몽고DB연결. MongoClient라고 부를게요
    const MongoClient = require('mongodb').MongoClient;

//환경변수 사용한다. 
    require('dotenv').config()

// bodyParser을 사용한다.
    app.use(express.urlencoded({extended: true})) 

// EJS 를 사용한다. ejs로 쓴 html을 node.js가 렌더링해줌
    app.set('view engine', 'ejs')

    let db;
// 몽고DB 계정 연결
    MongoClient.connect(process.env.MONGO_URI, (error, client) => {
        if(error) return console.log(error);
        
        // 몽고db의 todoapp이라는 database를 할당
        db = client.db('todoapp');

        // 데이터 저장
        // db.collection('post').insertOne({이름:"John", 나이: 20},function(err,결과){
        //     console.log('저장완료');
        // });
        
        // .listen() : 내 컴퓨터에서 서버를 열 수 있음(어디에?)
        // .listen(서버띄울 포트번호,  function(){서버 띄우고 실행할 코드})
        app.listen(8080, function(){
            console.log('listening on 8080');
        });
    })

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
        응답res.send('전송완료');
        // 게시글 번호 고유하게 부여하기
        db.collection('counter').findOne({name : '게시물갯수'},(err,result)=>{
            console.log(result.totalPost);
            let 총게시글수 = result.totalPost;

            db.collection('post').insertOne({_id : 총게시글수+1 ,제목 : 요청req.body.title, 날짜 : 요청req.body.date}, function(err,결과){
                console.log('저장완료');
                // counter 콜렉션의 totalPost도 1 증가시켜야함(수정) operater연산자사용
                db.collection('counter').updateOne({name:'게시물갯수'},{$inc:{totalPost:1}},function(err,result){
                    if(err) return console.log(err)
                })
            });
        })
        
        console.log(`제목 : ${요청req.body.title}`);
        console.log(`날짜 : ${요청req.body.date}`);

    });

// /list로 GET요청 접속하면 실제DB에 저장된 데이터 들어간 리스트html 보여주기
    app.get('/list',(req,res) =>{
        // db에서 자료 찾아서 다 가지고 오기. 
        db.collection('post').find().toArray(function(err, 결과){
            console.log(결과);

            // 찾은거 ejs파일에 post라는 이름으로 결과를 넣어주기. 위치 주의!
            res.render('list.ejs', { posts : 결과 });
        });
        
    });

// /delete에 접속해오면 담겨온 게시물 번호에 따라 DB삭제.
    app.delete('/delete', (req,res)=>{
        console.log(req.body); //req.body -- 요청시 보낸 데이더가 담겨있음.
        // _id는 숫자형이므로 변환필요.
        req.body._id = Number(req.body._id); //req인것 주의
        console.log(req.body);
        // req.body에 담겨온 게시물번호와 일치하는 글을 DB에서 찾아서 삭제
        db.collection('post').deleteOne(req.body, function(err, 결과){
            console.log("삭제완료");
            res.status(200).send({ message : '성공했습니다' });  //요청성공
            //서버는 꼭 응답을 무언가 보내주어야 한다.
        });
    });

