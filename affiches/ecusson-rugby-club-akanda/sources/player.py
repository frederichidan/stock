from PIL import Image; import numpy as np, cv2, subprocess, re, base64, json
src=np.array(Image.open('/home/user/stock/affiches/ecusson-rugby-club-akanda/ecusson-original.jpg').convert('RGB'))
m=np.load('gc.npy')
# lissage du masque
m=cv2.morphologyEx(m,cv2.MORPH_OPEN,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(5,5)))
ys,xs=np.where(m>0); x0,y0,x1,y1=xs.min()-12,ys.min()-12,xs.max()+13,ys.max()+13
S=4
crop=src[y0:y1,x0:x1]; mc=m[y0:y1,x0:x1].astype(np.float32)
big=cv2.resize(crop,None,fx=S,fy=S,interpolation=cv2.INTER_LANCZOS4)
# léger renforcement de netteté
blur=cv2.GaussianBlur(big,(0,0),2); big=cv2.addWeighted(big,1.5,blur,-0.5,0)
mb=cv2.resize(mc,None,fx=S,fy=S,interpolation=cv2.INTER_CUBIC)
mb=cv2.GaussianBlur(mb,(0,0),2.5)
alpha=np.clip((mb-0.5)*6+0.5,0,1)
rgba=np.dstack([big,(alpha*255).astype(np.uint8)])
Image.fromarray(rgba).save('player.png',optimize=True)
# contour blanc : masque dilaté, vectorisé par potrace
d=cv2.dilate((mb>0.5).astype(np.uint8),cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(int(13*S),int(13*S))))
d=cv2.GaussianBlur(d.astype(np.float32),(0,0),6)>0.5
Image.fromarray(((~d)*255).astype(np.uint8)).convert('1').save('outline.pbm')
subprocess.check_call(['potrace','-s','-a','1.2','-O','0.4','outline.pbm','-o','outline.svg'])
svg=open('outline.svg').read()
tr=re.search(r'<g transform="([^"]+)"',svg).group(1)
paths=re.findall(r'<path d="([^"]+)"',svg,re.S)
json.dump({'box':[int(x0),int(y0),int(x1),int(y1)],'S':S,'w':big.shape[1],'h':big.shape[0],'tr':tr,'paths':paths},open('player.json','w'))
print(x0,y0,x1,y1,big.shape,len(paths))
