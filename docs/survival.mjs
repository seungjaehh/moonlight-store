import {catastrophes,gear,eventIds,opening,makeEvent,consequence,specialChoices,finale} from './events.mjs';
export {catastrophes,gear};
export const VERSION=2;
export const MAX_TURNS=10;
export const statsMeta=[{key:'hp',label:'체력',icon:'♡',max:12},{key:'cash',label:'동전',icon:'◈',max:12},{key:'wit',label:'잔머리',icon:'✦',max:12},{key:'trust',label:'신뢰',icon:'♧',max:10}];
export function hash(text){let h=2166136261;for(const c of String(text)){h^=c.codePointAt(0);h=Math.imul(h,16777619);}return h>>>0;}
const pick=(array,key)=>array[hash(key)%array.length];
const finalConsonant=word=>{const n=word.codePointAt(word.length-1)-0xac00;return n>=0&&n<=11171&&n%28!==0;};
const subject=word=>word+(finalConsonant(word)?'이':'가');
const object=word=>word+(finalConsonant(word)?'을':'를');
const cities=['제3신도시','어쩌다광역시','구독해지구','신규가입동','출근특별시','내일없음시','월급보류동','반차광역시'];
const people=[{id:'intern',name:'무급 인턴 민수',role:'위급할수록 침착한 척합니다'},{id:'hero',name:'휴직 중인 용사',role:'검 대신 사직서를 들었습니다'},{id:'accountant',name:'경리팀 박 대리',role:'모든 일의 영수증을 챙깁니다'},{id:'robot',name:'구형 청소 로봇',role:'인류보다 먼지에 관심이 많습니다'},{id:'retired',name:'전직 최종 보스',role:'요즘은 텃밭을 가꿉니다'},{id:'pigeon',name:'배달 비둘기 철수',role:'지도는 없지만 자신감은 있습니다'}];
export function context(s){const disaster=catastrophes[hash(s.seed)%catastrophes.length],person=pick(people,s.seed+'person');return {disaster,person:person.name,actor:person,city:pick(cities,s.seed+'city'),place:pick(['폐업한 백화점','중앙역 3번 출구','구청 뒷골목','출근길 육교','이름 없는 교차로','비상계단'],s.seed+s.step+'place')};}
export function createRun(seed){if(!/^[a-f0-9]{16}$/.test(seed))throw new Error('Invalid seed');return {version:VERSION,seed,step:0,hp:10,cash:4,wit:2,trust:0,heat:0,items:[],companions:[],departed:[],marks:[],queue:[],scheduled:[],history:[],moves:[],routeHash:hash(seed),route:null,exitUsed:null,ending:null};}
export function getScene(s){if(s.ending)return null;const x=context(s);let sc;if(s.step===0)sc=opening(s,x);else if(s.step===9)sc=finale(s,x);else{const due=s.queue.find(q=>q.after<=s.step);if(due){sc=consequence(due.type,s,x);sc.queueType=due.type;}else{const visited=new Set(s.history.map(h=>h.event));const available=eventIds.filter(id=>!visited.has(id));sc=makeEvent(pick(available,`${s.seed}:${s.routeHash}:${s.step}`),s,x);}}sc.choices=sc.choices.map(ch=>({...ch,disabled:(ch.cost||0)>s.cash,disabledReason:(ch.cost||0)>s.cash?`동전 ${ch.cost}개 필요`:null}));if(sc.id!=='opening'&&sc.id!=='finale')sc.choices.push(...specialChoices(sc,s,x));return sc;}
const limits={hp:[0,12],cash:[0,999],wit:[0,20],trust:[-20,20],heat:[0,20]};
function change(s,delta){for(const [key,value]of Object.entries(delta||{})){if(!limits[key])throw new Error('Unknown stat');s[key]=Math.max(limits[key][0],Math.min(limits[key][1],s[key]+value));}}
function flag(s,f){if(f&&!s.marks.includes(f))s.marks.push(f);}
export function applyChoice(s,index){const sc=getScene(s),ch=sc?.choices[index];if(!ch||ch.disabled)throw new Error('Invalid or unavailable choice');const next=structuredClone(s),before=Object.fromEntries(Object.keys(limits).map(k=>[k,s[k]]));let reply=ch.reply,checkPassed=null,duplicates=0;change(next,ch.delta);if(ch.check){checkPassed=s[ch.check.stat]>=ch.check.min;change(next,checkPassed?ch.check.pass:ch.check.fail);reply=checkPassed?ch.passReply:ch.failReply;}
  for(const id of ch.consume||[])next.items=next.items.filter(i=>i!==id);
  for(const id of [...ch.add||[],...(checkPassed?ch.addOnPass||[]:[])]){if(!gear[id])throw new Error('Unknown gear');if(!next.items.includes(id))next.items.push(id);else{change(next,{cash:1});duplicates++;}}
  if(duplicates)reply+=` 중복 물품 ${duplicates}개는 동전으로 바꿨습니다.`;
  if(ch.recruit){const ally=ch.recruit==='snail'?{id:'snail',name:'달팽이 회계사',role:'엄청 느리지만 정산은 빠릅니다'}:context(s).actor;if(!next.companions.some(a=>a.id===ally.id))next.companions.push({...ally});}
  if(ch.betray||next.trust<=-4){if(next.companions.length){next.departed.push(...next.companions.map(a=>a.name));next.companions=[];if(!ch.betray)reply+=' 동료는 더는 당신을 따라오지 않습니다.';}if(ch.betray)flag(next,'betrayed');}
  flag(next,ch.mark);
  if(sc.queueType)next.queue=next.queue.filter(q=>q.type!==sc.queueType);
  if(ch.schedule&&!next.scheduled.includes(ch.schedule)&&s.step<6){next.queue.push({type:ch.schedule,after:s.step+3});next.scheduled.push(ch.schedule);}
  if(ch.route){next.route=ch.route;if(ch.route==='escape'){const item=['ticket','fuel'].find(id=>next.items.includes(id));if(item){next.exitUsed=item;next.items=next.items.filter(i=>i!==item);}else if(next.cash>=6){next.exitUsed='cash';change(next,{cash:-6});}else{change(next,{hp:-2});next.exitUsed='feet';}}if(ch.route==='bunker'&&next.trust<4&&(!next.items.includes('permit')||next.heat>=8))change(next,{hp:-3,heat:1});}
  const delta=Object.fromEntries(Object.keys(limits).map(k=>[k,next[k]-before[k]]).filter(([,n])=>n));
  next.history.push({turn:s.step+1,event:sc.id,tag:sc.tag,title:sc.title.replaceAll('\n',' '),choice:ch.title,choiceId:ch.id,reply,delta,checkPassed,gained:next.items.filter(i=>!s.items.includes(i)),lost:s.items.filter(i=>!next.items.includes(i))});next.moves.push(index);next.step++;next.routeHash=hash(`${s.routeHash}.${sc.id}.${ch.id}`);
  if(next.hp===0||next.step>=MAX_TURNS)next.ending=makeEnding(next);
  return next;
}
export function replay(seed,moves){if(!Array.isArray(moves)||moves.length>MAX_TURNS||!moves.every(m=>Number.isInteger(m)&&m>=0&&m<=3))throw new Error('Invalid choices');return moves.reduce((s,m)=>applyChoice(s,m),createRun(seed));}
export function encodeRun(s){return `2.${s.seed}.${s.moves.join('')}`;}
export function decodeRun(code){if(typeof code!=='string'||!/^2\.[a-f0-9]{16}\.[0-3]{0,10}$/.test(code))throw new Error('Invalid run code');const [,seed,path]=code.split('.');return replay(seed,[...path].map(Number));}
export function effectPreview(s,ch){
  const delta={...ch.delta};
  const passed=ch.check&&s[ch.check.stat]>=ch.check.min;
  if(ch.check){const d=passed?ch.check.pass:ch.check.fail;for(const[k,v]of Object.entries(d))delta[k]=(delta[k]||0)+v;}
  const gained=[...ch.add||[],...(passed?ch.addOnPass||[]:[])];
  const duplicates=gained.filter(id=>s.items.includes(id)&&!ch.consume?.includes(id)).length;
  if(duplicates)delta.cash=(delta.cash||0)+duplicates;
  if(ch.route==='bunker'&&s.trust<4&&(!s.items.includes('permit')||s.heat>=8)){delta.hp=-3;delta.heat=1;}
  if(ch.route==='escape'&&!s.items.includes('ticket')&&!s.items.includes('fuel')){if(s.cash>=6)delta.cash=-6;else delta.hp=-2;}
  return Object.fromEntries(Object.entries(delta).map(([k,v])=>[k,Math.max(limits[k][0],Math.min(limits[k][1],s[k]+v))-s[k]]).filter(([,v])=>v));
}

function makeEnding(s){const x=context(s),has=m=>s.marks.includes(m),knows=s.items.includes('radio')&&s.wit>=5;let outcome,headline,lead,grade,tone;
  if(s.hp===0){outcome='생존 실패';headline=pick(['종말보다 먼저 지친 사람','최후의 무리수','명예로운 조기 퇴근'],s.routeHash);lead=`${x.city}의 ${s.history.at(-1).title} 앞에서 당신의 체력이 먼저 바닥났습니다. 마지막으로 한 일은 「${s.history.at(-1).choice}」. 구조 방송은 계속됐지만, 이번 탈출 기록은 여기까지였습니다.`;grade='LOST';tone='lost';}
  else if(s.route==='broadcast'&&knows){outcome='재난 협상 성공';headline={moon:'달의 미지급 급여를 정산한 사람',cat:'고양이 내각의 인간 대표',server:'지구 서버의 임시 관리자',monday:'주말을 되찾은 비정규직'}[x.disaster.id];lead={moon:'당신은 달의 급여 명세서를 생중계했습니다. 밀린 야근 수당이 입금되자 달이 슬그머니 궤도로 돌아갔습니다. 인류는 처음으로 노동 문제를 제때 해결했습니다.',cat:'당신은 무전기로 고양이 의회에 협상을 제안했습니다. 주 4일 집사제와 인간 낮잠권을 맞바꿨습니다. 세상은 바뀌었지만 적어도 당신의 무릎은 공휴일에 쉽니다.',server:'당신은 숨겨진 관리자 채널로 들어가 서비스 종료를 「점검 중」으로 바꿨습니다. 지구는 살아남았습니다. 이제 모든 오류 신고가 당신에게 옵니다.',monday:'당신은 전 세계 출근 알람의 관리자 권한을 끊었습니다. 달력에 토요일이 다시 생겼습니다. 월요일은 집요하게 재부팅을 시도하지만, 이번에는 당신도 비밀번호를 압니다.'}[x.disaster.id];grade='REWRITE';tone='good';}
  else if(s.route==='broadcast'){outcome='뜻밖의 방송 사고';headline=s.items.includes('radio')?'종말 방송의 뜻밖의 스타':'주파수 없는 마지막 DJ';lead=s.items.includes('radio')?`무전기는 켜졌지만 잔머리 ${s.wit}로 재난의 약관을 해독하기는 어려웠습니다. 대신 당신의 한숨이 ${x.city} 전역에 생중계됐습니다. 재난은 멈추지 않았지만 사람들은 같은 박자로 도망치기 시작했습니다.`:`켜지지 않는 마이크 앞에서 당신은 끝까지 말했습니다. 무전기를 챙길 기회는 이미 지나갔습니다. 근처 사람들이 소리를 대신 전했고, ${x.city}에는 이상하게도 입에서 입으로 이어지는 방송국이 생겼습니다.`;grade='SIGNAL';tone='mixed';}
  else if(s.route==='bunker'){const admitted=(s.items.includes('permit')||s.trust>=4)&&!(s.heat>=8&&s.trust<4);outcome=admitted?'방공호 입장 성공':'지하의 뜻밖의 신입';headline=admitted?(s.trust>=4?'사람들이 문을 열어 준 생존자':'VIP석에 앉은 보통 사람'):'방공호 뒷문을 연 사람';lead=admitted?(s.trust>=4?`입구에서 여러 사람이 당신을 알아봤습니다. 신뢰 ${s.trust}. 종이 허가증보다 그 이름들이 빨랐습니다. ${object(x.disaster.ending)} 두꺼운 문 너머로 밀어내고, 당신은 처음으로 긴 숨을 쉬었습니다.`:'당신은 모서리가 구겨진 VIP 허가증을 내밀었습니다. 이름을 묻지도 않고 문이 열렸습니다. 객실에는 생수와 「업그레이드 요금 별도」라는 안내가 있었습니다.'):`정문은 ${s.heat>=8?'당신의 수배 사진을 보고':'허가증 없는 당신을 보고'} 닫혔습니다. 체력을 깎아 가며 연 뒷문은 시설 관리실로 이어졌습니다. 당신은 살아남았고, 뜻하지 않게 새 일자리도 얻었습니다.`;grade=admitted?'SHELTER':'OVERTIME';tone=admitted?'good':'mixed';}
  else if(s.route==='escape'){const safe=s.exitUsed!=='feet';outcome=safe?'도시 탈출 성공':'아슬아슬한 도보 탈출';headline=s.exitUsed==='ticket'?'목적지를 모르는 승객':s.exitUsed==='fuel'?'종말 도로의 마지막 운전자':s.exitUsed==='cash'?'마지막 좌석을 산 승객':'두 발로 다음 세계에 도착한 사람';lead=`${subject(x.city)} 뒤로 멀어졌습니다. ${s.exitUsed==='ticket'?'어딘가행 승차권이 진짜 통했습니다. 목적지는 여전히 인쇄되지 않았습니다.':s.exitUsed==='fuel'?'종말용 연료를 채우자 오래된 차가 기침 끝에 움직였습니다.':s.exitUsed==='cash'?'모아 둔 동전 여섯 개로 마지막 좌석을 샀습니다. 기사님은 잔돈을 세어 보고서야 출발했습니다.':`차도, 표도, 요금도 없었습니다. 체력 두 칸을 길 위에 두고, 당신은 걸어서 도시 경계를 넘었습니다.`} ${x.disaster.weather} 하늘 아래에도 아직 다음 길은 있었습니다.`;grade=safe?'ESCAPED':'BARELY';tone=safe?'good':'mixed';}
  else if(s.route==='duck'){outcome='오리 중심 세계 질서';headline=has('duckMiracle')?'두 번의 기적을 본 오리 대변인':'삑, 하고 세계가 바뀌었다';lead=`당신이 고무 오리를 들어 올리자 ${x.disaster.ending}이 잠시 멈췄습니다. ${x.disaster.id==='cat'?'고양이 내각은 오리를 명예 고양이로 인정했습니다.':x.disaster.id==='server'?'현실 서버는 오리를 새로운 루트 사용자로 인식했습니다.':x.disaster.id==='moon'?'달은 오리의 중력을 새로운 계약 조건으로 받아들였습니다.':'모든 달력의 월요일이 오리요일로 바뀌었습니다.'} 당신의 공식 직함은 대변인. 주요 업무는 하루 두 번 삑 소리를 내는 것입니다.`;grade='QUACK';tone='weird';}
  else {const power=s.heat>=6;outcome=power?'혼돈의 지도자':'뜻밖의 주민 대표';headline=power?'망한 세상에도 사장은 있다':'아무도 손을 안 들어서 맡은 사람';lead=power?`악명 ${s.heat}. 당신이 「따라와」라고 하자 사람들이 먼저 길을 비켰습니다. ${x.city}의 새 질서는 그렇게 시작됐습니다. 첫 번째 공약은 생존, 두 번째는 당신에게 묻지 말 것. 지지율 조사는 실시하지 않았습니다.`:`세계를 접수하겠다는 선언은 ${x.city} 임시 주민 회의 안건이 됐습니다. 마침 자원자가 없어 당신이 대표가 됐습니다. 종말은 아직 진행 중이고, 회의록을 쓸 사람도 당신뿐입니다.`;grade=power?'BOSS':'CHAIR';tone=power?'dark':'mixed';}
  const moral=has('betrayed')?`동료를 미끼로 삼아 챙긴 보급품은 끝까지 당신의 것이었습니다. ${s.departed.join(', ')||'떠난 사람들'}의 이름은 구조 명단에서 다시 확인하지 못했습니다. 계산은 맞았지만 마음은 잔돈을 돌려주지 않았습니다.`:has('returned')?`훔친 가방의 배터리를 돌려줬던 일은 사라지지 않았습니다. 종말 속에서도 사과가 제때 도착할 수 있다는 걸, ${x.city}의 두 사람이 기억합니다.`:has('paidback')?'미래의 나에게 빌려 준 돈은 이자까지 돌아왔습니다. 시간 여행이 실존한다는 사실보다, 내가 약속을 지켰다는 사실이 조금 더 놀라웠습니다.':has('helpReturned')?'당신이 먼저 내민 손은 나중에 비상 가방의 모양으로 돌아왔습니다. 이번 종말의 가장 좋은 투자는 그런 것이었습니다.':s.trust>=5?`당신이 남긴 신뢰 ${s.trust}는 숫자보다 많은 얼굴을 가졌습니다. 식사 한 그릇, 들것 한쪽, 짧은 안내. 대단한 일이 아니어서 더 오래 남을지도 모릅니다.`:s.trust<0?`신뢰 ${s.trust}. 사람들은 당신의 이름보다 당신이 가져간 물건을 먼저 기억합니다. 혼자가 편하다고 말할 수는 있어도, 빈자리까지 조용해지는 건 아니었습니다.`:'당신은 모든 사람을 구하지도, 모든 기회를 잡지도 않았습니다. 그때그때 고른 작은 타협들이 모여 지금의 당신이 됐습니다.';
  const company=s.companions.length?`${s.companions.map(c=>c.name).join(', ')}도 곁에 있습니다. ${pick(['누군가 마지막 동전을 세고, 누군가는 다음 길을 봅니다.','「다음 종말에는 좀 더 일찍 준비하죠.」 아무도 반대하지 않습니다.','동행 계약서는 없습니다. 그래도 아직 함께 걷고 있습니다.'],s.routeHash+'ally')}`:s.departed.length?`${s.departed.join(', ')}이 서 있던 자리는 비어 있습니다. 이번 선택의 경로에는 다시 만나는 장면이 없었습니다.`:'당신은 혼자 마지막 장면에 도착했습니다. 대답을 기다리는 사람이 없다는 것은 자유롭기도, 조금 무겁기도 했습니다.';
  const leftovers=s.items.length?`마지막 주머니에는 ${s.items.map(id=>gear[id].name).join(', ')}${s.items.length===1?' 하나가':' 등이'} 남았습니다. ${s.items.includes('noodles')?'컵라면은 아직 뜨겁습니다. 이 세계에도 식사 시간은 필요합니다.':s.items.includes('coupon')?'쓰지 않은 현실 수정권은 접어서 넣었습니다. 다음에는 다른 선택을 할 수 있을까요.':'어느 것도 처음 주웠을 때와 똑같은 물건처럼 보이지 않습니다.'}`:'주머니는 비었습니다. 마지막까지 쓸 수 있는 것은 남기지 않았거나, 애초에 쥐지 않았습니다.';
  const echo=s.history.filter(h=>h.event!=='finale'&&h.turn>1);const turning=pick(echo.length?echo:[s.history[0]],s.seed+'turning');
  const closing=`이 기록이 시작된 선택은 「${s.history[0].choice}」. 돌아보면 「${turning.choice}」도 이 결말을 만드는 데 한몫했습니다. ${s.step}번의 선택, 남은 체력 ${s.hp}, 동전 ${s.cash}. ${pick(['세상이 끝나도 정산은 남습니다.','아직 살아 있는 누군가가 이 기록에 별점 하나를 남겼습니다.','이번 결말의 작성자는 당신입니다. 환불은 어렵습니다.','다음 재난이 오기 전에는, 일단 밥부터 먹읍시다.'],s.routeHash+'closing')}`;
  return {title:headline,outcome,grade,tone,paragraphs:[lead,moral,company,leftovers,closing],id:encodeRun(s),world:x.disaster.name,city:x.city,score:s.hp*8+s.cash*3+s.wit*4+s.trust*3-s.heat+Math.max(0,s.companions.length)*12};
}
