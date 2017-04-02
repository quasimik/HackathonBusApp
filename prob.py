#!/usr/bin/env python3
import sys
import matplotlib.pyplot as plt
import urllib.request
from tkinter import *

from poibin import PoiBin
from decimal import Decimal

def multiply(x):
   return float(int(x*10000))/100

if(len(sys.argv)==1):
   totals=[]
   rawResults=[]
   databaseName="http://localhost:3000/data"
   schoolNames=['UCLA', 'USC', 'UCSD']
   for school in schoolNames:
      counts=[]
      x=1
      while (x<=5):
         counts.append(urllib.request.urlopen(databaseName+"?sentiment="+str(x)+"&location="+school).read())
         x+=1
      counts=list(map(int,counts))
      percentages=[]
      x=1
      while (x<=5):
         went=urllib.request.urlopen(databaseName+"?sentiment="+str(x)+"&location="+school+"&went=true").read()
         total=urllib.request.urlopen(databaseName+"?sentiment="+str(x)+"&location="+school).read()
         percentages.append(float(went)/float(total))
         x+=1

      arr=[]
      total=0
      x=0
      i=0
      while (x < len(counts)):
         i=0
         total+=counts[x]
         while (i < counts[x]):
            arr.append(percentages[x])
            i+=1
         x+=1
      pb = PoiBin(arr)
      result=pb.cdf(range(0, total))
      result=list(map(multiply,result))
      result.append(100)
      rawResults.append(result)
      totals.append(total)


   seatsProvided=[]
   for x in range (0,3):
      ques="\n"+schoolNames[x]+ " has "+str(totals[x])+" students asking for transportation.\n"\
            +"How many transportation spots will you provide at "+schoolNames[x]+"? "
      print(ques,end="")
      answer=int(input())
      if(answer<0):
         answer=0
      if (answer>totals[x]):
         answer=totals[x]
      seatsProvided.append(str(answer))

   print("")
   line="\n\t\tTotal\tProvided\tChance\n"
   for x in range (0,3):
      line+="\t"+schoolNames[x]+ "\t"+str(totals[x])+"\t"+str(seatsProvided[x])+"\t"+str(rawResults[x][int(seatsProvided[x])])+'\n'
      
   top = Tk()
   top.wm_title("Dashboard")
   text = Text()
   text.insert(INSERT, line)
   text.pack()
   top.mainloop()
      
   for x in range (0,3):
      fig = plt.figure() 
      fig.canvas.set_window_title('Bus Boss')
      plt.plot(range(0,totals[x]+1),rawResults[x])
      chance=rawResults[x][int(seatsProvided[x])]
      plt.plot([0, seatsProvided[x]],[chance,chance])
      plt.plot([seatsProvided[x], seatsProvided[x]],[0,chance])
      plt.title(schoolNames[x])
      plt.ylabel('Chance that All Students Get Seats')
      plt.xlabel('Number of Seats Available')
      ax=plt.gca()
      ax.set_xbound([0,totals[x]])
      ax.set_ybound([0,100])
      plt.show()
