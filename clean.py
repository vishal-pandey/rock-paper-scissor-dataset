from os import listdir
from os.path import isfile, join
import os

mypaths = ["rock", "paper", "scissors"]

for mypath in mypaths:
    onlyfiles = [f for f in listdir(mypath) if isfile(join(mypath, f))]



    for i, file in enumerate(onlyfiles):
        # print(i+".png")
        sourcepath = mypath+"/"+file
        finalpath = mypath+"/"+str(i)+".png"
        os.rename(sourcepath, finalpath)
