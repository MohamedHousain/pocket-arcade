from pathlib import Path
from html.parser import HTMLParser
import json,re
base=Path(__file__).resolve().parents[1]/'dist'
games=['minesweeper','memory','tictactoe','dots','lights','sliding','codebreaker']
class Scan(HTMLParser):
    def __init__(self):
        super().__init__();self.ids={};self.links=[];self.h1=0;self.scripts=[];self.stack=[];self.handlers=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='h1':self.h1+=1
        if 'id' in a:
            assert a['id'] not in self.ids,'duplicate '+a['id']
            self.ids[a['id']]={'tag':tag,'attrs':a,'text':''}
        if tag=='img':assert a.get('alt'),'missing alt'
        if tag=='script':self.scripts.append(a['src'])
        if 'onclick' in a:self.handlers.append(a['onclick'])
        for k in ['href','src']:
            if k in a:self.links.append(a[k])
        if tag not in ['input','meta','link','img','br','hr','source']:
            self.stack.append((tag,a.get('id')))
    def handle_endtag(self,tag):
        if self.stack:
            assert self.stack[-1][0]==tag,f'Unbalanced {tag} after {self.stack[-1]}'
            self.stack.pop()
    def handle_data(self,data):
        for tag,id in self.stack:
            if id:self.ids[id]['text']+=data
pages={}
for file in base.glob('*.html'):
    s=Scan();s.feed(file.read_text(encoding='utf-8-sig'));pages[file.name]=s
    assert s.h1==1,(file,s.h1)
    assert not s.stack,file
for name,s in pages.items():
    for link in s.links:
        assert not re.match('https?:|//',link),'External dependency'
        path,sep,anchor=link.partition('#');dest=base/(path or name)
        assert dest.is_file(),dest
        if anchor:
            if dest.name=='arcade.html' and anchor in games+['sessions']:continue
            assert anchor in pages[dest.name].ids,(name,link)
s=pages['arcade.html']
scripts='\n'.join((base/f).read_text(encoding='utf-8-sig') for f in s.scripts)
for handler in s.handlers:assert 'function '+handler.split('(')[0]+'(' in scripts,handler
clean=re.sub(r'/\*.*?\*/|//[^\n]*','',scripts,flags=re.S)
assert not re.search(r'\b(prompt|alert|confirm|setTimeout|setInterval|localStorage|sessionStorage|fetch|XMLHttpRequest|canvas)\b',clean)
assert '[' not in clean,'runtime array syntax'
for game in games:assert 'save-'+game in s.ids,game
(Path(__file__).parent/'arcade-dom.json').write_text(json.dumps({'nodes':s.ids,'scripts':s.scripts}),encoding='utf-8')
print(f'PASS: {len(pages)} HTML pages, {len(s.ids)} arcade IDs, all local links and click targets, and no storage/dialog/timer/network APIs.')
