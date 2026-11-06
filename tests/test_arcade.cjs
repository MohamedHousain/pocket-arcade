// Test tooling only. Tests the actual HTML handlers and runtime scripts.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const fixture=JSON.parse(fs.readFileSync(path.join(__dirname,'arcade-dom.json'),'utf8'));
let cases=0,clicks=0;
function load(){
 const nodes={};
 function make(tag,attrs={},initial=''){
  let text=initial,id='',value=attrs.value||'';
  const el={tag,attrs:{...attrs},className:attrs.class||'',disabled:'disabled'in attrs,style:{},children:[],parentNode:null,
   get id(){return id;},set id(v){if(id)delete nodes[id];id=String(v);if(id)nodes[id]=this;},
   get textContent(){return text+this.children.map(c=>c.textContent).join('');},set textContent(v){text=String(v);this.children=[];},
   get value(){return value;},set value(v){value=String(v);},
   get firstChild(){return this.children[0]||null;},
   setAttribute(k,v){this.attrs[k]=String(v);},
   appendChild(c){this.children.push(c);c.parentNode=this;return c;},
   removeChild(c){this.children.splice(this.children.indexOf(c),1);if(c.id)delete nodes[c.id];c.parentNode=null;return c;},
   scrollIntoView(){}};
  el.id=attrs.id||'';return el;
 }
 for(const item of Object.values(fixture.nodes))make(item.tag,item.attrs,item.text);
 const ctx={document:{title:'',getElementById:id=>nodes[id]||null,createElement:tag=>make(tag)},window:{location:{hash:'#minesweeper'}}};
 vm.createContext(ctx);
 for(const src of fixture.scripts)vm.runInContext(fs.readFileSync(path.join(root,'dist',src),'utf8'),ctx,{timeout:3000});
 return {ctx,nodes,click(id){const n=nodes[id];assert.ok(n,'No '+id);if(!n.disabled){assert.ok(n.attrs.onclick,'Handler '+id);vm.runInContext(n.attrs.onclick,ctx,{timeout:2000});clicks++;}},route(name){ctx.window.location.hash='#'+name;ctx.window.onhashchange();}};
}
function test(name,fn){fn();cases++;console.log('PASS '+name);}
const games=['minesweeper','memory','tictactoe','dots','lights','sliding','codebreaker'];
test('All game initialization, tab switching and unknown route fallback',()=>{
 const g=load();for(const game of [...games,'sessions']){g.route(game);assert.equal(g.nodes['pane-'+game].style.display,'block');for(const other of [...games,'sessions'].filter(x=>x!==game))assert.equal(g.nodes['pane-'+other].style.display,'none');}
 g.click('card-0');g.route('minesweeper');g.route('memory');assert.equal(g.ctx.memoryFirst,0);
 g.route('invalid');assert.equal(g.nodes['pane-minesweeper'].style.display,'block');
});
for(let layout=1;layout<=3;layout++){
 test('Minesweeper '+layout+' independent clues, complete round and saved win',()=>{
  const g=load();g.ctx.mineLayout=layout;g.ctx.resetMines();const mines=[];
  for(let i=0;i<36;i++)if(g.ctx.isMine(i))mines.push(i);assert.equal(mines.length,6);assert.ok(!mines.includes(0));
  for(let i=0;i<36;i++)if(!mines.includes(i)){
   assert.equal(g.ctx.adjacentMines(i),mines.filter(m=>Math.abs(Math.floor(m/6)-Math.floor(i/6))<=1&&Math.abs(m%6-i%6)<=1).length);g.click('mine-'+i);
  }
  assert.equal(g.ctx.mineSafe,30);assert.ok(g.ctx.mineEnded);g.click('save-minesweeper');assert.equal(g.ctx.sessionState('minesweeper'),'Won');
 });
 test('Minesweeper '+layout+' loss and reset',()=>{
  const g=load();g.ctx.mineLayout=layout;g.ctx.resetMines();let mine=0;while(!g.ctx.isMine(mine))mine++;
  g.click('mine-'+mine);assert.equal(g.ctx.sessionState('minesweeper'),'Lost');g.ctx.resetMines();assert.ok(!g.ctx.mineEnded);
 });
}
test('Flags: limit, protected reveal, removal and fresh layout',()=>{
 const g=load();g.click('flag-mode');const covered=Object.keys(g.nodes).filter(k=>/^mine-\d+$/.test(k)&&g.nodes[k].value==='covered');
 covered.slice(0,7).forEach(id=>g.click(id));assert.equal(g.ctx.mineFlags,6);g.click('reveal-mode');let safe=g.ctx.mineSafe;g.click(covered[0]);assert.equal(g.ctx.mineSafe,safe);
 g.click('flag-mode');g.click(covered[0]);assert.equal(g.ctx.mineFlags,5);g.ctx.nextMineBoard();assert.ok(g.ctx.mineSafe>1);assert.equal(g.ctx.mineFlags,0);
});
function finishMemory(g){for(let p=1;p<=8;p++){const ids=Object.keys(g.nodes).filter(k=>/^card-\d+$/.test(k)&&g.nodes[k].value==p);assert.equal(ids.length,2);ids.forEach(id=>g.click(id));}}
for(let deal=1;deal<=3;deal++)test('Memory deal '+deal+' pairs and complete game',()=>{const g=load();for(let i=1;i<deal;i++)g.ctx.newMemoryDeal();finishMemory(g);assert.equal(g.ctx.memoryPairs,8);assert.equal(g.ctx.memoryMoves,8);assert.equal(g.ctx.memoryBest,8);});
test('Memory mismatch, repeated click, blocked third card and manual hiding',()=>{
 const g=load(),a='card-0',b=Object.keys(g.nodes).find(k=>/^card-\d+$/.test(k)&&g.nodes[k].value!==g.nodes[a].value);
 g.click(a);g.click(a);assert.equal(g.ctx.memoryMoves,0);g.click(b);
 const c=Object.keys(g.nodes).find(k=>/^card-\d+$/.test(k)&&k!==a&&k!==b);g.click(c);assert.match(g.nodes[c].className,/face-down/);
 g.click('memory-hide');finishMemory(g);assert.equal(g.ctx.memoryBest,9);g.ctx.newMemoryDeal();finishMemory(g);assert.equal(g.ctx.memoryBest,8);
});
for(const line of [[1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]])test('Tic-tac-toe line '+line,()=>{
 const g=load(),other=[1,2,3,4,5,6,7,8,9].filter(i=>!line.includes(i));
 [line[0],other[0],line[1],other[1],line[2]].forEach(i=>g.click('ttt-'+i));assert.equal(g.ctx.xWins,1);assert.equal(g.ctx.sessionState('tictactoe'),'X won');g.click('ttt-'+other[2]);assert.equal(g.ctx.ticMoves,5);
});
test('Tic-tac-toe draw, occupied square, alternating starter and reset',()=>{
 const g=load();g.click('ttt-1');g.click('ttt-1');assert.equal(g.ctx.ticMoves,1);[2,3,5,4,6,8,7,9].forEach(i=>g.click('ttt-'+i));assert.equal(g.ctx.sessionState('tictactoe'),'Draw');
 g.ctx.newTicRound();assert.equal(g.ctx.ticPlayer,'O');[1,4,2,5,3].forEach(i=>g.click('ttt-'+i));assert.equal(g.ctx.sessionState('tictactoe'),'O won');g.ctx.resetTicMatch();assert.equal(g.ctx.oWins,0);
});
const paths=[
 [0,5,10,15,20,21,16,11,6,1,2,7,12,17,22,23,24,19,18,13,14,9,8,3,4],
 [12,7,2,1,0,5,6,11,10,15,20,21,16,17,22,23,24,19,18,13,8,3,4,9,14],
 [20,15,10,5,0,1,2,3,4,9,8,7,6,11,12,13,14,19,18,17,16,21,22,23,24]];
paths.forEach((path,p)=>test('Path puzzle '+(p+1)+' independently supplied full solution',()=>{
 const g=load();g.ctx.pathPuzzle=p+1;g.ctx.resetPath();path.slice(1).forEach(i=>g.click('path-'+i));assert.equal(g.ctx.pathCount,25);assert.ok(g.ctx.pathWon);assert.equal(g.ctx.pathNext,6);g.click('path-0');assert.equal(g.ctx.pathCount,25);
}));
test('Path rejects jumps, crossing, checkpoint skipping and early finish; undo restores checkpoint',()=>{
 const g=load();g.click('path-24');assert.equal(g.ctx.pathCount,1);[5,6,11].forEach(i=>g.click('path-'+i));assert.equal(g.ctx.pathNext,3);
 g.click('path-13');assert.equal(g.ctx.pathCurrent,11);g.click('path-5');assert.equal(g.ctx.pathCount,4);
 g.ctx.undoPath();assert.equal(g.ctx.pathNext,2);g.click('path-11');[16,17,12,13,8,3].forEach(i=>g.click('path-'+i));
 const before=g.ctx.pathCount;g.click('path-4');assert.equal(g.ctx.pathCount,before);assert.match(g.nodes['path-status'].textContent,/every other/);
 g.ctx.resetPath();assert.equal(g.ctx.pathUndos,0);assert.equal(g.ctx.pathCount,1);
});
const lightSolutions=[[6,8,12,16,18],[0,3,7,11,14,18,22],[1,2,5,9,12,15,17,20,23]];
lightSolutions.forEach((solution,p)=>test('Lights puzzle '+(p+1)+' solves and locks',()=>{
 const g=load();g.ctx.lightLevel=p+1;g.ctx.resetLights();assert.ok(g.ctx.lightCount>0);solution.forEach(i=>g.click('light-'+i));assert.ok(g.ctx.lightWon);assert.equal(g.ctx.lightCount,0);const moves=g.ctx.lightMoves;g.click('light-0');assert.equal(g.ctx.lightMoves,moves);
}));
test('Lights corner changes exactly three squares and is reversible',()=>{
 const g=load(),before=Array.from({length:25},(_,i)=>g.nodes['light-'+i].value);g.click('light-0');assert.equal(before.filter((v,i)=>v!==g.nodes['light-'+i].value).length,3);g.click('light-0');before.forEach((v,i)=>assert.equal(g.nodes['light-'+i].value,v));
});
function board(g){return Array.from({length:9},(_,i)=>+g.nodes['tile-'+i].value);}
function solveSliding(start){
 const first=start.join(''),goal='123456780',queue=[first],parents=new Map([[first,null]]);let cursor=0;
 while(cursor<queue.length){const state=queue[cursor++];if(state===goal)break;const blank=state.indexOf('0');
  for(let n=0;n<9;n++)if(Math.abs(Math.floor(n/3)-Math.floor(blank/3))+Math.abs(n%3-blank%3)===1){const a=state.split('');[a[n],a[blank]]=[a[blank],a[n]];const next=a.join('');if(!parents.has(next)){parents.set(next,[state,n]);queue.push(next);}}
 }
 assert.ok(parents.has(goal),'Unsolvable board');let state=goal,moves=[];while(state!==first){const [prev,n]=parents.get(state);moves.push(n);state=prev;}return moves.reverse();
}
test('Sliding puzzle solved by an independent breadth-first solver',()=>{
 const g=load();const route=solveSliding(board(g));assert.ok(route.length>0);route.forEach(i=>g.click('tile-'+i));assert.ok(g.ctx.slideWon);assert.equal(g.ctx.slideMoves,route.length);assert.deepEqual(board(g),[1,2,3,4,5,6,7,8,0]);
});
test('Thirty sliding deals are unique-tile solvable states; invalid moves ignored',()=>{
 const g=load();for(let d=0;d<30;d++){if(d)g.ctx.shuffleSlides();const b=board(g);assert.deepEqual([...b].sort(),[0,1,2,3,4,5,6,7,8]);let inv=0;for(let i=0;i<9;i++)for(let j=i+1;j<9;j++)if(b[i]&&b[j]&&b[i]>b[j])inv++;assert.equal(inv%2,0);assert.ok(!g.ctx.solvedTiles());}
 const bad=board(g).findIndex((n,i)=>n&&Math.abs(Math.floor(i/3)-Math.floor(g.ctx.slideBlank/3))+Math.abs(i%3-g.ctx.slideBlank%3)>1);g.click('tile-'+bad);assert.equal(g.ctx.slideMoves,0);
});
function selectCode(g,values){values.forEach((n,i)=>{let guard=0;while(g.nodes['guess-'+i].value!=n){g.click('guess-'+i);assert.ok(++guard<=6);}});}
for(let d=1;d<=3;d++)test('Codebreaker '+d+' misplaced feedback and exact solution',()=>{
 const g=load();for(let i=1;i<d;i++)g.ctx.newCode();const secret=[0,1,2,3].map(i=>g.ctx.secretColour(i));selectCode(g,[secret[1],secret[2],secret[3],secret[0]]);g.click('code-check');assert.match(g.nodes['code-status'].textContent,/0 in the right place, 4 in the wrong/);
 selectCode(g,secret);g.click('code-check');assert.ok(g.ctx.codeWon);assert.equal(g.ctx.codeTurns,2);g.click('code-check');assert.equal(g.ctx.codeTurns,2);
});
test('Codebreaker validates missing/duplicate colours, loses after eight and clears history',()=>{
 const g=load();g.click('code-check');assert.equal(g.ctx.codeTurns,0);selectCode(g,[0,0,0,0]);g.click('code-check');assert.equal(g.ctx.codeTurns,0);selectCode(g,[0,1,2,3]);for(let i=0;i<8;i++)g.click('code-check');assert.ok(g.ctx.codeEnded);assert.ok(!g.ctx.codeWon);assert.equal(g.nodes['code-history'].children.length,8);g.ctx.newCode();assert.equal(g.nodes['code-history'].children.length,0);
});
test('Session saves all games, updates in place, keeps snapshots across reset, removes and clears on reload',()=>{
 const g=load();for(const game of games)g.click('save-'+game);assert.equal(g.ctx.savedSessionCount,7);assert.equal(g.nodes['session-rows'].children.length,7);
 g.click('save-memory');assert.equal(g.ctx.savedSessionCount,7);const old=g.nodes['saved-memory-1'].textContent;
 g.click('card-0');g.route('sessions');g.route('memory');assert.equal(g.ctx.memoryFirst,0);assert.equal(g.nodes['saved-memory-1'].textContent,old);
 g.ctx.newMemoryDeal();g.click('save-memory');assert.equal(g.ctx.savedSessionCount,8);g.ctx.removeSession('saved-memory-1');assert.equal(g.ctx.savedSessionCount,7);assert.ok(!g.nodes['saved-memory-1']);
 const fresh=load();assert.equal(fresh.ctx.savedSessionCount,0);assert.equal(fresh.nodes['session-rows'].children.length,0);
});
test('Saving progress updates the same round and deleting the last row restores empty state',()=>{
 const g=load();g.click('save-dots');g.click('path-5');g.click('save-dots');assert.equal(g.ctx.savedSessionCount,1);assert.match(g.nodes['saved-dots-1'].textContent,/2\/25/);g.ctx.removeSession('saved-dots-1');assert.equal(g.nodes['session-empty'].style.display,'block');assert.equal(g.nodes['session-table'].style.display,'none');
});
console.log('\n'+cases+' scenario groups passed; '+clicks+' HTML click-handler executions in simulated DOM.');
