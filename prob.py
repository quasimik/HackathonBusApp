#!/usr/bin/env python3
import sys
import matplotlib.pyplot as plt
import urllib.request
from tkinter import *

from poibin import PoiBin
from decimal import Decimal

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
      rawResults.append(result)
      totals.append(total)


   seatsProvided=[]
   for x in range (0,3):
      ques="\n"+schoolNames[x]+ " has "+str(totals[x])+" students asking for transportation.\n"\
            +"How many transportation spots will you provide at "+schoolNames[x]+"? "
      print(ques,end="")
      answer=input()
      seatsProvided.append(answer)

   print("")
   line="\n\t\tTotal\tProvided\t\t%\n"
   for x in range (0,3):
      line+="\t"+schoolNames[x]+ "\t"+str(totals[x])+"\t"+str(seatsProvided[x])+"\t"+str(int(seatsProvided[x])/totals[x])+'\n'
      
   top = Tk()
   top.wm_title("Dashboard")
   text = Text()
   text.insert(INSERT, line)
   text.pack()
   top.mainloop()
      
   for x in range (0,3):
      fig = plt.figure() 
      fig.canvas.set_window_title('Bus Boss')
      plt.plot(range(0,totals[x]),rawResults[x])
      chance=rawResults[x][int(seatsProvided[x])]
      plt.plot([0, seatsProvided[x]],[chance,chance])
      plt.title(schoolNames[x])
      plt.ylabel('% Chance that All Students Get Seats')
      plt.xlabel('Number of Seats Available')
      plt.show()

if (len(sys.argv)==2):

   databaseName="http://localhost:3000/data"
   totals=0
   rawResults=[]
   x=str(sys.argv[1])
   
   counts=[]
   y=1
   while (y<=5):
      counts.append(urllib.request.urlopen(databaseName+"?sentiment="+str(y)+"&location="+x).read())
      y+=1
   counts=list(map(int,counts))
   percentages=[]
   y=1
   while (y<=5):
      went=urllib.request.urlopen(databaseName+"?sentiment="+str(y)+"&location="+x+"&went=true").read()
      total=urllib.request.urlopen(databaseName+"?sentiment="+str(y)+"&location="+x).read()
      percentages.append(float(went)/float(total))
      y+=1

   arr=[]
   total=0
   y=0
   i=0
   while (y < len(counts)):
      i=0
      total+=counts[y]
      while (i < counts[y]):
         arr.append(percentages[y])
         i+=1
      y+=1
   pb = PoiBin(arr)
   result=pb.cdf(range(0, total))
   rawResults=result
   totals=total


   seatsProvided=0

   ques="\n"+x+ " has "+str(totals)+" students asking for transportation.\n"\
         +"How many transportation spots will you provide at "+x+"? "
   print(ques,end="")
   answer=input()
   seatsProvided=answer
   print("")

   line="\n\t\tTotal\tProvided\t\t%\n"
   line+="\t"+x+ "\t"+str(totals)+"\t"+str(seatsProvided)+"\t"+str(int(seatsProvided)/totals)+'\n'
      
   top = Tk()
   top.wm_title("Dashboard")
   text = Text()
   text.insert(INSERT, line)
   text.pack()
   top.mainloop()
      
   fig = plt.figure() 
   fig.canvas.set_window_title('Bus Boss')
   plt.plot(range(0,totals),rawResults)
   chance=rawResults[int(seatsProvided)]
   plt.plot([0, seatsProvided],[chance,chance])
   plt.title(x)
   plt.ylabel('% Chance that All Students Get Seats')
   plt.xlabel('Number of Seats Available')
   plt.show()