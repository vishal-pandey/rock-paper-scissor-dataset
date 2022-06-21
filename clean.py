from cmath import exp
from os import listdir
from os.path import isfile, join
import os
from PIL import Image

mypaths = ["rock", "paper", "scissors"]

for mypath in mypaths:
    onlyfiles = [f for f in listdir(mypath) if isfile(join(mypath, f))]



    for i, file in enumerate(onlyfiles):
        # print(i+".png")
        sourcepath = mypath+"/"+file
        finalpath = mypath+"/"+str(i)+".png"
        os.rename(sourcepath, finalpath)

        for j in range(1, 8):
            im = Image.open(finalpath)
            angle = 45*j
            rotated = im.rotate(angle, expand=True)
            rotated.save(mypath+"/"+str(i)+"_"+str(angle)+".png")
