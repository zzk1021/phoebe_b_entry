import json, time, hashlib, urllib.parse, urllib.request, datetime, os
ROOT=os.path.dirname(os.path.dirname(__file__))
HEADERS={'User-Agent':'Mozilla/5.0','Referer':'https://www.bilibili.com/'}
def get_json(url):
 req=urllib.request.Request(url,headers=HEADERS); return json.load(urllib.request.urlopen(req,timeout=20))
def nav_keys():
 j=get_json('https://api.bilibili.com/x/web-interface/nav'); w=j['data']['wbi_img'];
 return w['img_url'].rsplit('/',1)[-1].split('.')[0],w['sub_url'].rsplit('/',1)[-1].split('.')[0]
MIXIN=[46,47,18,2,53,8,23,32,15,50,10,31,58,3,45,35,27,43,5,49,33,9,42,19,29,28,14,39,12,38,41,13,37,48,7,16,24,55,40,61,26,17,0,1,60,51,30,4,22,25,54,21,56,59,6,63,57,62,11,36,20,34,44,52]
def sign(params,img,sub):
 key=''.join((img+sub)[i] for i in MIXIN)[:32]; params['wts']=int(time.time());
 params={k:str(v).translate(str.maketrans('','','!\'()*')) for k,v in params.items()}; q=urllib.parse.urlencode(sorted(params.items())); return q+'&w_rid='+hashlib.md5((q+key).encode()).hexdigest()
def videos(mid,limit):
 img,sub=nav_keys(); q=sign({'mid':mid,'pn':1,'ps':min(limit,50),'order':'pubdate'},img,sub); j=get_json('https://api.bilibili.com/x/space/wbi/arc/search?'+q)
 if j.get('code')!=0: raise RuntimeError(f"Bilibili API error for {mid}: {j}")
 out=[]
 for v in j['data']['list']['vlist'][:limit]:
  pic=v.get('pic',''); pic=('https:'+pic if pic.startswith('//') else pic)
  out.append({'bvid':v['bvid'],'title':v['title'],'pic':pic,'date':datetime.datetime.fromtimestamp(v['created']).strftime('%Y-%m-%d')})
 return out
cfg=json.load(open(ROOT+'/config.json',encoding='utf8')); result={'updatedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'channels':[]}
for c in cfg['channels']:
 result['channels'].append({**c,'videos':videos(c['mid'],cfg['maxVideosPerChannel'])}); time.sleep(2)
os.makedirs(ROOT+'/data',exist_ok=True); json.dump(result,open(ROOT+'/data/videos.json','w',encoding='utf8'),ensure_ascii=False,indent=2)
