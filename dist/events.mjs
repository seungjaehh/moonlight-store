// All events are original. Each choice carries real resource, relationship or story effects.
export const catastrophes = [
  {id:'moon', name:'달이 퇴근 중입니다', badge:'달 충돌 경보', symbol:'moon', color:'#f2a549', intro:'달이 궤도를 이탈했습니다. 사유는 「야근 수당 미지급」. 충돌까지 10분. 정부는 창문을 닫으라고 권고합니다.', ending:'달의 퇴근길', weather:'달 조각이 떨어지는'},
  {id:'cat', name:'고양이가 정권을 잡았습니다', badge:'인류 집사화 경보', symbol:'cat', color:'#b0d2a1', intro:'전 세계 고양이가 동시에 일어섰습니다. 10분 뒤 모든 인간은 정규직 집사가 됩니다. 단, 복지는 고양이에게만 적용됩니다.', ending:'제1고양이 공화국', weather:'고양이 드론이 순찰하는'},
  {id:'server', name:'지구 서비스가 종료됩니다', badge:'현실 서버 종료', symbol:'server', color:'#9bbcd8', intro:'하늘에 공지가 떴습니다. 「지구 서비스 종료까지 10분. 미사용 포인트는 환불되지 않습니다.」 고객센터는 점심시간입니다.', ending:'서비스가 끝난 세계', weather:'하늘이 버퍼링하는'},
  {id:'monday', name:'월요일이 복제되고 있습니다', badge:'무한 출근 경보', symbol:'clock', color:'#c5b1dd', intro:'내일도 월요일. 모레도 월요일. 10분 뒤 주말이라는 개념이 삭제됩니다. 부장님은 벌써 「오히려 좋아」라고 하셨습니다.', ending:'끝나지 않는 월요일', weather:'출근 알람이 울리는'}
];

export const gear = {
  battery:{name:'미개봉 배터리', icon:'▰', hint:'기계가 있는 곳에서 특별한 선택'},
  ticket:{name:'어딘가행 승차권', icon:'↗', hint:'마지막 탈출에 사용 가능'},
  permit:{name:'VIP 대피 허가증', icon:'▤', hint:'방공호 입장 자격'},
  radio:{name:'수상한 무전기', icon:'⌁', hint:'마지막 방송에 사용 가능'},
  coupon:{name:'현실 수정권', icon:'✦', hint:'특정 난관을 한 번 건너뛸 수 있음'},
  noodles:{name:'최후의 컵라면', icon:'♧', hint:'배고픈 상대와 협상'},
  umbrella:{name:'튼튼한 우산', icon:'⌂', hint:'낙하물과 검문에 특별한 선택'},
  duck:{name:'고무 오리', icon:'◉', hint:'쓸모없어 보이지만…'},
  stamp:{name:'승인 도장', icon:'▣', hint:'서류와 방송에 특별한 선택'},
  fuel:{name:'종말용 연료', icon:'◈', hint:'마지막 탈출에 사용 가능'},
};
const c=(id,title,desc,delta={},extra={})=>({id,title,desc,delta,...extra});

export function opening(s,x){return {id:'opening',tag:'속보 / 첫 번째 선택',title:'방금, 세상이\n망하기 시작했다.',text:`${x.disaster.intro} 엘리베이터 앞에서는 ${x.person}의 손이 떨리고, 바닥에는 누군가의 비상 가방이 있습니다.`,art:'alert',choices:[
  c('rescue','옆 사람의 손을 잡는다','종말에도 일단 사람부터. 동료가 생깁니다.',{trust:2},{recruit:true,mark:'rescued',reply:`${x.person}의 손이 당신을 꼭 붙잡습니다. 「저 쓸모 있어요. 아마도요.」`}),
  c('bag','비상 가방을 챙긴다','남의 가방이지만, 인류 공용이라고 치자.',{cash:2,heat:1},{add:['battery'],mark:'stole',schedule:'owner',reply:'생수는 없고 배터리와 동전뿐. 가방 주인의 이름표도 달려 있습니다.'}),
  c('observe','일단 상황을 분석한다','공포에도 매뉴얼이 필요하다.',{wit:2},{add:['radio'],mark:'analyst',reply:'재난 방송의 주파수를 잡았습니다. 진행자도 당황한 건 비슷해 보입니다.'})
]};}

const events = [
  {id:'vending',tags:['machine'],build:(s,x)=>({tag:'자동판매기의 반란',title:'자판기가\n면접을 보자고 한다.',text:`${x.place}의 자판기가 물 대신 질문을 뱉습니다. 「본인이 꼭 살아남아야 하는 이유를 세 가지 대세요.」 경력직 우대라는 스티커도 붙어 있습니다.`,art:'machine',choices:[
    c('pitch','말로 자판기를 설득한다','잔머리 5 이상이면 물품 획득. 부족하면 체력 -2.',{}, {check:{stat:'wit',min:5,pass:{cash:2},fail:{hp:-2}},addOnPass:['ticket'],reply:'자판기가 당신의 생존 역량을 심사했습니다.',passReply:'「수평적인 종말 문화를 지향합니다.」 합격입니다. 승차권도 나왔습니다.',failReply:'「좋은 분이지만 저희가 찾는 인재와는…」 캔 하나가 발등에 떨어졌습니다.'}),
    c('pay','정가를 내고 배터리를 산다','동전 -2 · 배터리 획득',{cash:-2},{cost:2,add:['battery'],reply:'멸망 직전에도 정가 판매. 자판기는 원칙을 지켰습니다.'}),
    c('walk','면접을 거절하고 옆길로 간다','아끼는 것도 능력. 잔머리 +1',{wit:1},{reply:'「퇴사 사유가 뭔가요?」 뒤에서 외치는 소리가 들립니다.'})
  ]})},
  {id:'toll',tags:['authority','danger'],build:(s,x)=>({tag:'민영화된 골목',title:'골목에\n유료 구간이 생겼다.',text:`형광 조끼를 입은 사람이 줄을 막았습니다. 「대피 통행료 3개. 카드, 계좌이체, 인류애는 안 받습니다.」 뒤에는 ${x.disaster.weather} 하늘이 보입니다.`,art:'gate',choices:[
    c('pay','동전을 내고 조용히 통과한다','동전 -3 · 체력 보존',{cash:-3},{cost:3,mark:'payer',reply:'영수증에는 「통행 0원, 긴급 수수료 3원」이라고 적혀 있습니다.'}),
    c('fight','통행료의 근거를 따진다','체력 -2 · 악명 +2 · 잔머리 +1',{hp:-2,heat:2,wit:1},{schedule:'inspection',mark:'rebel',reply:'관리인이 무전기에 당신의 인상착의를 불러 줍니다. 통행에는 성공했습니다.'}),
    c('detour','옆 건물 계단으로 돌아간다','체력 -1 · 잔머리 +1',{hp:-1,wit:1},{reply:'통행료보다 계단이 정직합니다. 무릎에는 조금 덜 친절합니다.'})
  ]})},
  {id:'cult',tags:['hungry','social'],build:(s,x)=>({tag:'유사 종교 / 현장 가입',title:'고무 오리를 믿으면\n살 수 있다고 한다.',text:'노란 비옷을 입은 사람들이 오리 앞에서 절하고 있습니다. 「우리는 종말을 예언했습니다. 정확한 날짜는 조금 달랐지만요.」 가입 사은품이 생각보다 괜찮습니다.',art:'duck',choices:[
    c('join','일단 가입하고 사은품을 받는다','신뢰 -1 · 고무 오리 획득',{trust:-1},{add:['duck'],mark:'duckclub',reply:'당신은 오리교 준회원이 되었습니다. 회비는 다음 생에 청구됩니다.'}),
    c('soup','남은 돈으로 식사를 나눈다','동전 -2 · 체력 +2 · 신뢰 +2',{cash:-2,hp:2,trust:2},{cost:2,mark:'fed',reply:'뜨거운 국물 앞에서는 종교도 잠깐 조용해집니다.'}),
    c('question','예언의 근거를 물어본다','잔머리 +2 · 악명 +1',{wit:2,heat:1},{reply:'교주가 휴대폰을 숨깁니다. 검색 기록: 「종말 날짜 대충」.'})
  ]})},
  {id:'drone',tags:['machine','danger'],build:(s,x)=>({tag:'인공지능의 마지막 업무',title:'구조 드론이\n별점부터 요구한다.',text:'구조용 드론이 내려왔습니다. 「탑승 전 별점 5점을 부탁드립니다. 4점 이하는 비상 탈출구를 이용해 주세요.」 비상 탈출구는 허공입니다.',art:'drone',choices:[
    c('rating','별점 5개를 누르고 탄다','동전 -2 · 탈출 승차권 획득',{cash:-2},{cost:2,add:['ticket'],mark:'reviewer',reply:'「고객님의 소중한 리뷰는 생존에 큰 힘이 됩니다.」 일단 탑승권은 받았습니다.'}),
    c('hack','평가 시스템을 뜯어고친다','잔머리 6 이상이면 수정권. 실패하면 체력 -2.',{}, {check:{stat:'wit',min:6,pass:{heat:2},fail:{hp:-2,heat:1}},addOnPass:['coupon'],reply:'드론 아래쪽의 「관리자용」 포트를 열었습니다.',passReply:'별점이 6개가 되었습니다. 현실 수정권이 관리자 보상으로 지급됩니다.',failReply:'관리자 비밀번호가 「비밀번호」가 아니었습니다. 경보가 울립니다.'}),
    c('duck','별점 대신 손을 흔든다','체력 -1 · 신뢰 +1',{hp:-1,trust:1},{reply:'드론은 떠났습니다. 당신의 솔직함만 지상에 남았습니다.'})
  ]})},
  {id:'future',tags:['social','weird'],build:(s,x)=>({tag:'본인 확인 실패',title:'미래의 내가\n돈을 빌려 달란다.',text:`익숙한 얼굴이 ${x.place} 뒤에서 나옵니다. 「나야. 설명할 시간 없어. 동전 3개만.」 미래에도 그 말투는 고쳐지지 않았나 봅니다.`,art:'mirror',choices:[
    c('lend','미래의 나를 믿고 빌려준다','동전 -3 · 2번의 선택 뒤에 결과가 돌아옵니다.',{cash:-3,trust:1},{cost:3,schedule:'futurepay',mark:'lent',reply:'미래의 당신이 새끼손가락을 겁니다. 손톱 상태까지 똑같습니다.'}),
    c('password','나만 아는 질문을 던진다','잔머리 +2 · 현실 수정권 획득',{wit:2},{add:['coupon'],mark:'paradox',reply:'「지난달 구독 해지했어?」 미래의 내가 울기 시작합니다. 대신 수정권을 내밉니다.'}),
    c('ignore','미래의 나도 각자도생이다','악명 +1 · 동전 +1',{heat:1,cash:1},{mark:'selfish',reply:'헤어지는 순간 주머니에 동전이 하나 생겼습니다. 어디선가 미래의 내가 욕합니다.'})
  ]})},
  {id:'raffle',tags:['authority','social'],build:(s,x)=>({tag:'공정한 대피 추첨',title:'방공호가\n응모권을 팔고 있다.',text:'입구에 「생존은 공정하게」라는 현수막이 걸려 있습니다. VIP는 옆문을 이용합니다. 일반 응모 마감까지 30초. 청약 통장은 인정되지 않습니다.',art:'bunker',choices:[
    c('vip','VIP 허가증을 정가에 산다','동전 -4 · 대피 허가증 획득',{cash:-4},{cost:4,add:['permit'],mark:'vip',reply:'허가증 뒷면: 「재난 규모에 따라 입장이 거절될 수 있습니다.」 그래도 없는 것보다는 낫습니다.'}),
    c('volunteer','봉사자 명단에 이름을 적는다','체력 -1 · 신뢰 +3',{hp:-1,trust:3},{mark:'volunteer',schedule:'grateful',reply:'상자를 몇 개 나릅니다. 관리자가 당신의 이름을 기억해 둡니다.'}),
    c('fake','직원인 척 당당하게 걷는다','잔머리 6 이상이면 허가증. 실패하면 악명 +2.',{}, {check:{stat:'wit',min:6,pass:{},fail:{heat:2}},addOnPass:['permit'],reply:'목에 아무 카드나 걸고 중요한 표정을 지었습니다.',passReply:'「고생 많으십니다.」 직원용 허가증까지 받았습니다.',failReply:'카드에 적힌 「쿠폰 10개 적립」을 들켰습니다.'})
  ]})},
  {id:'pharmacy',tags:['social','hungry'],build:(s,x)=>({tag:'마지막 약국',title:'약사가 가격표에\n「종말 할증」을 썼다.',text:'「진통제 3개. 물은 별도. 마음이 아픈 건 보험 안 됩니다.」 약사가 철제 셔터를 절반쯤 내립니다. 옆에는 유통기한이 어제인 컵라면도 보입니다.',art:'medical',choices:[
    c('medicine','진통제를 산다','동전 -3 · 체력 +4',{cash:-3,hp:4},{cost:3,reply:'「식후에 드세요.」 식후가 보장되는 시대가 아니라는 말은 삼켰습니다.'}),
    c('ask','남는 컵라면이라도 부탁한다','신뢰 +1 · 컵라면 획득',{trust:1},{add:['noodles'],reply:'약사는 한숨을 쉬며 컵라면을 건넵니다. 뜨거운 물도 넣어 줍니다.'}),
    c('steal','셔터 아래로 약을 빼낸다','체력 +2 · 악명 +3 · 추후 검문',{hp:2,heat:3},{schedule:'inspection',mark:'thief',reply:'약은 챙겼습니다. 약국 CCTV도 당신을 챙겼습니다.'})
  ]})},
  {id:'snail',tags:['social','hungry'],build:(s,x)=>({tag:'길 위의 동료',title:'달팽이가\n택시를 잡고 있다.',text:'서류 가방을 든 달팽이가 인도 끝에 있습니다. 「도보로는 늦을 것 같군요. 제가 회계는 좀 합니다.」 말하는 속도까지 느린 것은 아닙니다.',art:'snail',choices:[
    c('recruit','같이 가자고 한다','신뢰 +1 · 동료와 승인 도장 획득',{trust:1},{recruit:'snail',add:['stamp'],reply:'달팽이가 어깨에 올라옵니다. 「교통비는 경비 처리해 드리죠.」'}),
    c('sell','길을 알려주고 상담료를 받는다','동전 +3 · 신뢰 -2',{cash:3,trust:-2},{mark:'grifter',reply:'달팽이가 영수증을 요구합니다. 당신은 자리를 떴습니다.'}),
    c('cheer','응원만 보내고 떠난다','잔머리 +1',{wit:1},{reply:'「파이팅!」 달팽이는 그 말에 세금을 매길 수 있는지 계산합니다.'})
  ]})},
  {id:'influencer',tags:['machine','social'],build:(s,x)=>({tag:'라이브 / 광고 포함',title:'종말 생중계가\n협찬을 받았다.',text:'스트리머가 카메라를 들이밉니다. 「살고 싶은 분들 좋아요와 구독 부탁드립니다!」 후원 목표를 채우면 대피 차량이 온다고 합니다.',art:'camera',choices:[
    c('perform','카메라 앞에서 제품을 찬양한다','동전 +3 · 신뢰 -1',{cash:3,trust:-1},{mark:'ad',reply:'「종말에도 산뜻하게!」 평생 인터넷에 남을 만한 장면입니다. 인터넷이 남는다면요.'}),
    c('warn','카메라를 빌려 진짜 대피로를 알린다','신뢰 +2 · 악명 +1',{trust:2,heat:1},{mark:'broadcast',schedule:'grateful',reply:'조회수는 떨어졌지만, 화면 밖 누군가는 길을 찾았을 겁니다.'}),
    c('pass','마지막까지 광고는 넘긴다','잔머리 +1',{wit:1},{reply:'광고 건너뛰기를 누릅니다. 직접 출연 중이라 그런 버튼은 없었지만, 그냥 걸었습니다.'})
  ]})},
  {id:'time',tags:['weird','social'],build:(s,x)=>({tag:'재난 경제 / 시간 거래',title:'시간 상인이\n1분을 사고 있다.',text:'「수명 1분에 동전 4개. 어차피 얼마 안 남으셨잖아요.」 정장 차림의 상인이 모래시계를 탁자에 놓습니다. 말하는 방식이 몹시 기분 나쁩니다.',art:'clock',choices:[
    c('sell','체력을 담보로 계약한다','체력 -3 · 동전 +4',{hp:-3,cash:4},{mark:'timeDebt',reply:'상인이 당신의 어깨를 만지자 무릎에 힘이 빠집니다. 돈은 정확히 줍니다.'}),
    c('reverse','계약서의 허점을 찾는다','잔머리 7 이상이면 동전 +5. 실패하면 체력 -1.',{}, {check:{stat:'wit',min:7,pass:{cash:5},fail:{hp:-1}},mark:'lawyer',reply:'작은 글씨에 밑줄을 그었습니다.',passReply:'「매수자와 매도자는 상호 변경 가능」. 상인의 1분을 대신 팔아 드렸습니다.',failReply:'계약서를 읽는 동안 현기증이 납니다. 상인은 기다리는 데 익숙합니다.'}),
    c('refuse','시간은 그냥 내 것으로 둔다','신뢰 +1',{trust:1},{reply:'상인이 아쉬운 표정을 짓습니다. 남은 몇 분은 여전히 당신의 것입니다.'})
  ]})},
  {id:'atm',tags:['machine'],build:(s,x)=>({tag:'은행 / 정상 영업',title:'ATM이\n자기소개를 시작했다.',text:'「저는 2009년생입니다. 사람들은 돈만 가져가고 제 이야기는 듣지 않죠.」 돈을 뽑으러 왔는데 상담을 하게 생겼습니다.',art:'machine',choices:[
    c('listen','긴 이야기를 끝까지 들어준다','신뢰 +2 · 동전 +2',{trust:2,cash:2},{mark:'listener',reply:'ATM이 수수료를 환급해 줍니다. 「이건 제 사비입니다.」 사비가 어디 있는지는 묻지 않았습니다.'}),
    c('withdraw','출금 한도를 강제로 올린다','악명 +2 · 동전 +4',{heat:2,cash:4},{schedule:'inspection',reply:'보안 카메라가 당신을 선명하게 찍었습니다. 덕분에 영정 사진 걱정은 덜었습니다.'}),
    c('repair','고장 난 마이크를 고쳐 준다','잔머리 +2 · 배터리 획득',{wit:2},{add:['battery'],reply:'말이 더 잘 들립니다. 고친 게 실수였을지도 모르지만, 예비 배터리는 받았습니다.'})
  ]})},
  {id:'union',tags:['social','authority'],build:(s,x)=>({tag:'최후의 노사 협상',title:'구조대가\n파업 중이다.',text:'피켓에는 「종말 수당 보장하라」. 구조대장은 헬멧에 기대 앉아 있습니다. 요구 사항에는 「이번에는 진짜 정시 퇴근」도 적혀 있습니다.',art:'gate',choices:[
    c('support','비상 자금을 파업 기금으로 낸다','동전 -2 · 신뢰 +3',{cash:-2,trust:3},{cost:2,mark:'union',schedule:'grateful',reply:'구조대장이 주먹 인사를 건넵니다. 「누군가는 알아주는군요.」'}),
    c('argue','종말 수당 지급 유예안을 만든다','잔머리 +2 · 신뢰 -1',{wit:2,trust:-1},{mark:'manager',reply:'문구는 그럴싸했습니다. 구조대장의 표정은 아니었습니다.'}),
    c('carry','말없이 들것 한쪽을 든다','체력 -2 · 신뢰 +2',{hp:-2,trust:2},{mark:'rescuer',reply:'협상은 계속되지만, 구조대원 한 명은 당신과 함께 움직입니다.'})
  ]})},
  {id:'rain',tags:['danger'],build:(s,x)=>({tag:'기상 특보',title:'하늘에서\n사직서가 내린다.',text:`${x.disaster.weather} 하늘에서 A4 용지가 쏟아집니다. 모서리가 매우 날카롭습니다. 사직 사유는 전부 「개인 사정」. 저기 떨어지는 냉장고도 개인 사정일까요.`,art:'storm',choices:[
    c('shelter','버스 정류장 아래로 몸을 숨긴다','체력 -1 · 잔머리 +1',{hp:-1,wit:1},{reply:'광고판 속 모델도 우산을 쓰고 있습니다. 꽤 부럽습니다.'}),
    c('loot','빗속의 비상 보급품을 줍는다','체력 -3 · 연료와 동전 +2',{hp:-3,cash:2},{add:['fuel'],reply:'종이에 몇 번 베였지만 연료는 건졌습니다. 재난용이라는 글자가 믿음직합니다.'}),
    c('help','남의 머리 위에 가방을 씌워 준다','체력 -2 · 신뢰 +3',{hp:-2,trust:3},{mark:'shield',reply:'낯선 사람이 가방을 꼭 잡습니다. 「돌려드릴게요. 살아서.」'})
  ]})},
  {id:'shop',tags:['hungry','social'],build:(s,x)=>({tag:'재고 정리 / 인류 한정',title:'폐업 세일이\n진짜 마지막이다.',text:'가판대에 「오늘만 이 가격」이라고 적혀 있습니다. 오늘만 있는 세상이니 거짓말은 아닙니다. 사장님은 슬리퍼 차림으로 상품을 정리합니다.',art:'market',choices:[
    c('umbrella','튼튼한 우산을 산다','동전 -2 · 우산 획득',{cash:-2},{cost:2,add:['umbrella'],reply:'사장님이 보증 기간을 평생으로 써 줬습니다. 평소보다 짧아 보입니다.'}),
    c('fuel','비상 연료를 산다','동전 -3 · 연료 획득',{cash:-3},{cost:3,add:['fuel'],reply:'「운전은 하시죠?」 당신이 답하기 전에 결제가 끝납니다.'}),
    c('work','마지막 정리를 도와준다','체력 -1 · 동전 +2 · 신뢰 +1',{hp:-1,cash:2,trust:1},{reply:'최후의 아르바이트. 사장님은 시급을 반올림해서 줬습니다.'})
  ]})},
  {id:'door',tags:['authority','machine'],build:(s,x)=>({tag:'보안은 철저하게',title:'대피소 비밀번호가\n퇴사한 직원에게 있다.',text:'「담당자에게 문의하세요.」 담당자는 퇴사했습니다. 대체 담당자는 휴가 중입니다. 건물 안에서는 물이 끓는 소리가 들립니다.',art:'bunker',choices:[
    c('guess','팀장님의 생일을 추리한다','잔머리 5 이상이면 허가증. 실패하면 체력 -1.',{}, {check:{stat:'wit',min:5,pass:{},fail:{hp:-1}},addOnPass:['permit'],reply:'숫자 네 자리를 눌렀습니다.',passReply:'비밀번호는 0000. 생일 추리는 의미가 없었지만 입장 허가증은 찾았습니다.',failReply:'「비밀번호 3회 오류. 담당자에게 문의하세요.」 문이 한층 더 굳게 닫혔습니다.'}),
    c('bribe','경비 아저씨에게 커피값을 낸다','동전 -2 · 체력 +2',{cash:-2,hp:2},{cost:2,reply:'경비 아저씨는 비밀번호를 몰랐지만 따뜻한 물과 의자는 내어 줬습니다.'}),
    c('leave','이 조직의 미래를 믿지 않는다','잔머리 +1',{wit:1},{reply:'이런 곳이 미래에도 운영된다면 그것도 재난입니다.'})
  ]})},
  {id:'offer',tags:['social','danger'],build:(s,x)=>({tag:'채용 / 즉시 출근',title:'악당이\n정규직을 제안했다.',text:'검은 망토의 사람이 명함을 내밉니다. 「세계 정복 후 복지 보장. 일단 오늘만 같이 일하죠.」 복리후생에 생존이 적혀 있습니다.',art:'villain',choices:[
    c('accept','연봉부터 협상한다','동전 +4 · 신뢰 -2 · 악명 +2',{cash:4,trust:-2,heat:2},{mark:'villain',reply:'계약서에는 포괄임금제. 종말보다 무서운 단어가 따로 있었습니다.'}),
    c('refuse','명함을 돌려주고 거절한다','신뢰 +2 · 잔머리 +1',{trust:2,wit:1},{mark:'principled',reply:'악당이 섭섭해합니다. 「요즘 사람들 워라밸만 따져요.」'}),
    c('double','일단 명함의 도장만 가져간다','악명 +1 · 승인 도장 획득',{heat:1},{add:['stamp'],reply:'인류 멸망 위원회 승인 도장. 어디에 쓸지는 모르겠지만 잉크는 충분합니다.'})
  ]})},
  {id:'interview',tags:['social','authority'],build:(s,x)=>({tag:'공영방송 / 마지막 인터뷰',title:'방송국이\n마지막 시민을 찾는다.',text:'기자가 마이크를 내밉니다. 「마지막으로 하고 싶은 말씀이요? 8초 안에 부탁드립니다. 뒤에 광고가 있어서요.」 빨간 불이 켜집니다.',art:'camera',choices:[
    c('truth','알고 있는 대피 정보를 말한다','신뢰 +3 · 무전기 획득',{trust:3},{add:['radio'],mark:'broadcast',reply:'기자가 조용히 메모합니다. 「이건 광고 뒤로 미루지 맙시다.」'}),
    c('panic','정부를 비난하고 모금을 시작한다','동전 +3 · 악명 +2',{cash:3,heat:2},{mark:'grifter',schedule:'inspection',reply:'동전이 모입니다. 당신을 찾는 사람도 늘었습니다.'}),
    c('joke','「구독 취소는 지금 해도 되나요?」','잔머리 +2',{wit:2},{mark:'comedian',reply:'카메라 뒤에서 누군가 웃습니다. 8초가 조금 길어졌습니다.'})
  ]})}
];

export const eventIds=events.map(e=>e.id);
export function makeEvent(id,s,x){const entry=events.find(e=>e.id===id);if(!entry)throw new Error('Unknown event');return {...entry.build(s,x),id:entry.id,tags:entry.tags};}

export function consequence(type,s,x){const table={
  owner:()=>({tag:'이전 선택이 돌아왔습니다',title:'가방 주인이\n당신을 찾았다.',text:'비상 가방의 이름표 주인이 숨을 헐떡이며 섰습니다. 「그 가방, 제 건데요. 안에 아버지 보청기 배터리가…」 당신의 주머니가 유난히 무겁습니다.',art:'mirror',choices:[
    c('return','배터리가 있으면 돌려주고 사과한다','배터리 또는 동전 -2 · 신뢰 +3',s.items.includes('battery')?{trust:3}:{cash:-2,trust:3},{cost:s.items.includes('battery')?0:2,consume:s.items.includes('battery')?['battery']:[],mark:'returned',reply:'주인이 고개를 끄덕입니다. 늦은 사과도 일단은 도착했습니다.'}),
    c('deny','그런 가방 처음 본다고 한다','신뢰 -3 · 악명 +2',{trust:-3,heat:2},{mark:'liar',reply:'같은 이름표가 손에 들려 있습니다. 거짓말의 완성도는 낮았습니다.'}),
    c('compensate','내 비상금 전부를 보상으로 건넨다','현재 동전 전부 · 신뢰 +4 · 동료 합류',{cash:-s.cash,trust:4},{mark:'compensated',recruit:true,reply:'당신은 빈 주머니를 뒤집습니다. 주인은 한참 뒤 「같이 갑시다」라고 말합니다.'})
  ]}),
  futurepay:()=>({tag:'과거의 선택 / 정산 시간',title:'미래의 내가\n약속을 지켰다.',text:'아까 돈을 빌려 간 내가 돌아왔습니다. 「덕분에 살았어. 이자는 좀 쳤어.」 미래의 당신 뒤로 또 다른 당신이 영수증을 들고 쫓아옵니다.',art:'clock',choices:[
    c('interest','원금과 이자를 받는다','동전 +6',{cash:6},{mark:'paidback',reply:'미래의 당신은 금융 감각이 있었습니다. 뒤에서 쫓아오는 당신은 의견이 다른 모양입니다.'}),
    c('hint','돈 대신 미래의 정보를 받는다','잔머리 +3 · 대피 허가증 획득',{wit:3},{add:['permit'],mark:'forewarned',reply:'「오른쪽 문은 열지 마. 그리고 커피 줄여.」 허가증은 더 유용해 보입니다.'}),
    c('forgive','나중에 갚으라고 한다','체력 +2 · 신뢰 +3',{hp:2,trust:3},{reply:'미래의 내가 안아 줍니다. 생각보다 따뜻하고, 등이 조금 굽어 있습니다.'})
  ]}),
  inspection:()=>({tag:'악명에는 영수증이 따라옵니다',title:'검문소 화면에\n내 얼굴이 떴다.',text:`당신의 악명은 현재 ${s.heat}. 검문 드론이 빨간 불을 비춥니다. 「현상금은 동전 두 개입니다.」 생각보다 낮게 책정된 점도 기분 나쁩니다.`,art:'drone',choices:[
    c('fine','벌금을 내고 기록을 지운다','동전 -3 · 악명 -3',{cash:-3,heat:-3},{cost:3,reply:'「수납 완료. 선량한 시민으로 복귀하셨습니다.」 전산은 빠릅니다.'}),
    c('run','숨을 크게 들이마시고 달린다','체력 -3 · 악명 +1',{hp:-3,heat:1},{mark:'fugitive',reply:'당신은 현상금 두 개짜리 속도로는 설명하기 힘들 만큼 빨랐습니다.'}),
    c('explain','근처 사람들에게 도움을 청한다','신뢰 3 이상이면 무사 통과. 부족하면 체력 -2.',{}, {check:{stat:'trust',min:3,pass:{heat:-1},fail:{hp:-2}},reply:'당신은 지금까지 쌓은 관계를 돌아봅니다.',passReply:'사람들이 시선을 가립니다. 누군가 낮게 말합니다. 「이번에는 우리가.」',failReply:'모두 자기 신발을 봅니다. 드론이 어깨를 한 번 세게 밀칩니다.'})
  ]}),
  grateful:()=>({tag:'기억해 둔 사람이 있습니다',title:'누군가\n당신의 이름을 불렀다.',text:'아까 도움을 받았던 사람이 뒤따라왔습니다. 「그냥 가면 마음에 걸릴 것 같아서요.」 손에 든 비상 가방을 당신 앞에 펼칩니다.',art:'snail',choices:[
    c('heal','붕대와 물을 받는다','체력 +3',{hp:3},{mark:'helpReturned',reply:'조금 전 당신이 건넨 도움이 다른 모양으로 돌아왔습니다.'}),
    c('pass','허가증을 나눠 받는다','대피 허가증 획득',{}, {add:['permit'],mark:'helpReturned',reply:'「같이 살아남아요.」 허가증은 아직 따뜻한 손의 모양으로 접혀 있습니다.'}),
    c('share','그 사람의 몫도 남겨 준다','신뢰 +3 · 동전 +1',{trust:3,cash:1},{reply:'둘이 나눈 몫이, 혼자 챙긴 것보다 적게 느껴지지 않습니다.'})
  ]})
};return table[type]?{...table[type](),id:`consequence-${type}`,tags:['consequence']}:null;}

export function specialChoices(event,s,x){const result=[];
  let assistance=null;
  if(s.companions.length&&s.trust>=3&&!s.marks.includes('allyHelp')&&!event.tags.includes('consequence')){
    const ally=s.companions[0].name;
    assistance=event.tags.includes('authority')?c('ally-help',`${ally}에게 보증을 부탁한다`,'동료 도움 1회 소진 · 대피 허가증 획득',{}, {add:['permit'],mark:'allyHelp',reply:`${ally}의 설명이 뜻밖에 통했습니다. 「다음에는 네가 해 줘.」`,special:true}):event.tags.includes('machine')?c('ally-help',`${ally}에게 뒷일을 맡긴다`,'동료 도움 1회 소진 · 배터리와 잔머리 +1',{wit:1},{add:['battery'],mark:'allyHelp',reply:`당신이 앞을 보는 동안 ${ally}은 뒤쪽 배선을 정리했습니다. 혼자라면 못 봤을 길입니다.`,special:true}):c('ally-help','동료와 역할을 나눠 해결한다','동료 도움 1회 소진 · 체력 +2 · 신뢰 +1',{hp:2,trust:1},{mark:'allyHelp',reply:`${ally}이 고개를 끄덕입니다. 두 사람이 나눈 위험은 한 사람의 짐보다 작았습니다.`,special:true});
  }
  if(event.tags.includes('machine')&&s.items.includes('battery'))result.push(c('gear-battery','배터리로 관리자 모드를 켠다','배터리 소모 · 잔머리 +1 · 동전 +3',{wit:1,cash:3},{consume:['battery'],reply:'화면에 「업무 종료」가 떴습니다. 세상 모든 기계가 바라던 비밀번호였습니다.',special:true}));
  else if(event.tags.includes('authority')&&s.items.includes('stamp'))result.push(c('gear-stamp','승인 도장으로 일단 통과한다','도장 소모 · 허가증 획득',{}, {consume:['stamp'],add:['permit'],reply:'아무도 도장의 내용을 읽지 않았습니다. 빨간 잉크의 권위가 또 한 번 승리합니다.',special:true}));
  else if(event.tags.includes('danger')&&s.items.includes('umbrella'))result.push(c('gear-umbrella','튼튼한 우산을 방패로 쓴다','우산 소모 · 체력 +1 · 신뢰 +1',{hp:1,trust:1},{consume:['umbrella'],reply:'우산은 제 수명을 다했습니다. 덕분에 당신의 수명은 아직 남았습니다.',special:true}));
  else if(event.tags.includes('hungry')&&s.items.includes('noodles'))result.push(c('gear-noodles','최후의 컵라면으로 협상한다','컵라면 소모 · 체력 +2 · 신뢰 +2',{hp:2,trust:2},{consume:['noodles'],reply:'뜨거운 국물과 면발 앞에서 이해관계가 재정렬되었습니다.',special:true}));
  else if(event.tags.includes('weird')&&s.items.includes('duck'))result.push(c('gear-duck','고무 오리를 눌러 본다','고무 오리 소모 · 현실 수정권 획득',{}, {consume:['duck'],add:['coupon'],mark:'duckMiracle',reply:'삑. 누군가 현실의 오류를 보고하고 수정권을 보내 줬습니다. 오리는 QA 담당자였습니다.',special:true}));
  else if(assistance)result.push(assistance);
  else if(s.items.includes('coupon')&&!event.tags.includes('consequence'))result.push(c('gear-coupon','현실 수정권을 긁는다','수정권 소모 · 체력 +3 · 악명 -2',{hp:3,heat:-2},{consume:['coupon'],mark:'edited',reply:'불편한 장면이 통째로 편집되었습니다. 당신에게만 유리한 재방송입니다.',special:true}));
  if(!result.length&&s.companions.length&&s.trust<=1&&!event.tags.includes('consequence'))result.push(c('betray','동료를 미끼로 쓰고 보급품을 챙긴다','동료 전원 이탈 · 동전 +4 · 신뢰 -4 · 악명 +2',{cash:4,trust:-4,heat:2},{betray:true,mark:'betrayed',reply:'등 뒤에서 이름을 부르는 소리가 났습니다. 당신은 대답하지 않았습니다.',special:true}));
  return result.slice(0,1);
}

export function finale(s,x){return {id:'finale',tag:'마지막 1분 / 선택이 결말이 됩니다',title:'끝이 온다.\n이제, 누구로 남을까.',text:`${x.disaster.ending}… 이제 눈앞입니다. 남은 체력 ${s.hp}, 동전 ${s.cash}, 신뢰 ${s.trust}. ${s.companions.length?`동료 ${s.companions.map(c=>c.name).join(', ')}의 시선이 당신에게 향합니다.`:'이번에는 혼자 결정해야 합니다.'} 지금까지의 선택이 마지막 문을 바꿉니다.`,art:'finale',choices:[
  c('bunker','방공호로 간다','허가증 또는 신뢰 4 이상이면 입장. 악명 8 이상은 검문. 무허가·낮은 신뢰는 체력 -3.',{}, {route:'bunker',reply:'당신은 방공호 쪽으로 발을 돌렸습니다.'}),
  c('broadcast','마지막 방송으로 재난에 맞선다','무전기와 잔머리 5 이상이면 재난 협상. 부족하면 뜻밖의 방송 사고.',{}, {route:'broadcast',reply:'당신이 주파수를 맞춥니다. 마이크에 불이 들어옵니다.'}),
  c('escape','도시 밖으로 탈출한다','승차권·연료·동전 6 중 하나를 사용합니다. 아무것도 없으면 체력 -2.',{}, {route:'escape',reply:'도시를 등지고, 아직 끝나지 않은 길로 나섰습니다.'}),
  s.items.includes('duck')?c('duck-throne','고무 오리를 왕좌에 올린다','고무 오리 보유 · 아주 이상한 방법으로 세계를 바꿉니다.',{}, {route:'duck',reply:'당신은 오리를 번쩍 들었습니다. 삑. 세상이 잠깐 조용해졌습니다.',special:true}):c('takeover','어차피 망한 세상, 내가 접수한다','악명 6 이상이면 추종자가 생깁니다. 부족하면 주민 회의부터.',{}, {route:'takeover',reply:'누군가 책임져야 한다면, 그게 당신이어도 될 것 같았습니다.',special:true})
]};}
