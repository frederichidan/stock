from PIL import Image; import numpy as np, cv2
src=Image.open('/home/user/stock/affiches/ecusson-rugby-club-akanda/ecusson-original.jpg').convert('RGB')
img=cv2.cvtColor(np.array(src),cv2.COLOR_RGB2BGR)
mask=np.zeros(img.shape[:2],np.uint8); mask[:]=cv2.GC_BGD
mask[285:825,205:875]=cv2.GC_PR_BGD
reg=np.load('reg.npy')  # zone sombre sûre du joueur
er=cv2.erode(reg,np.ones((7,7),np.uint8))
mask[er>0]=cv2.GC_FGD
im=img.astype(int); b,g,r=im[...,0],im[...,1],im[...,2]
# pixels à dominante sombre -> probablement joueur
pr=(b<80)&(g<45)&(r<60); mask[(pr)&(mask==cv2.GC_PR_BGD)]=cv2.GC_PR_FGD
bg=np.zeros((1,65),np.float64); fg=np.zeros((1,65),np.float64)
cv2.grabCut(img,mask,None,bg,fg,6,cv2.GC_INIT_WITH_MASK)
m=np.where((mask==1)|(mask==3),1,0).astype(np.uint8)
n,lab,st,_=cv2.connectedComponentsWithStats(m,8)
m=(lab==lab[420,700]).astype(np.uint8)
h,w=m.shape; ff=m*255; fm=np.zeros((h+2,w+2),np.uint8); cv2.floodFill(ff,fm,(0,0),128); m=(ff!=128).astype(np.uint8)
np.save('gc.npy',m)
vis=np.array(src); vis[m==0]=(vis[m==0]*0.25).astype(np.uint8)
Image.fromarray(vis).crop((200,270,880,830)).save('gc.png')
