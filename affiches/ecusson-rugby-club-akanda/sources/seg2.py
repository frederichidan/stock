from PIL import Image; import numpy as np, cv2, sys
src=Image.open('/home/user/stock/affiches/ecusson-rugby-club-akanda/ecusson-original.jpg').convert('RGB')
im=np.array(src).astype(int); r,g,b=im[...,0],im[...,1],im[...,2]
B,G,C=int(sys.argv[1]),int(sys.argv[2]),int(sys.argv[3])
dark=((b<B)&(g<G)&(r<60)).astype(np.uint8)
# limiter à la zone du joueur
roi=np.zeros_like(dark); roi[280:830,205:880]=1; dark&=roi
dark=cv2.morphologyEx(dark,cv2.MORPH_OPEN,np.ones((3,3),np.uint8))
dark=cv2.morphologyEx(dark,cv2.MORPH_CLOSE,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(C,C)))
n,lab=cv2.connectedComponents(dark,connectivity=8)
reg=(lab==lab[420,700]).astype(np.uint8)
# boucher les trous
h,w=reg.shape; ff=reg.copy()*255; mask=np.zeros((h+2,w+2),np.uint8)
cv2.floodFill(ff,mask,(0,0),128); reg=((ff!=128)).astype(np.uint8)
print(reg.sum())
vis=np.array(src); vis[reg>0]=(vis[reg>0]*0.35+np.array([255,0,0])*0.65).astype(np.uint8)
Image.fromarray(vis).crop((200,270,880,830)).save('seg.png')
np.save('reg.npy',reg)
