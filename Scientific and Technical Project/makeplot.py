#!/usr/bin/python

import numpy as np
import matplotlib as mp
mp.use('pdf')
from matplotlib import pyplot as plt
import csv

def readValues(filename) :
  data = []
  buf = []

  with open(filename, "r") as f:
	reader=csv.reader(f,delimiter='\t')
	for point in reader:
		buf.append(point)
  for i in xrange(0,len(buf[0])):
	if buf[0][i] != "" :
		data.append(float(buf[0][i]))
  return data

datapoints = readValues("datapoints.txt");
coeff1 = readValues("directPower5.txt");
coeff2 = readValues("directPower10.txt");
coeff3 = readValues("directPower15.txt");
coeff4 = readValues("directPower20.txt");
coeffArray = [coeff1, coeff2, coeff3, coeff4];

def polyFunc(x, coeff) :
    y = 0;
    for i in range(0,len(coeff)):
        y += coeff[i] * pow(x,i)
    return y;

x = np.linspace(0,1,len(datapoints), endpoint=True)
ylist = []
for i in xrange(0,len(coeffArray)):
    values = []
    for j in xrange(0,len(x)):
        values.append(polyFunc(x[j],coeffArray[i]))
    ylist.append(values)

for i in xrange(0,len(coeffArray)):
    fig = plt.figure()
    ax = fig.add_subplot(1,1,1)
    ax.plot(x,ylist[i])
    ax.set_ylabel("Humidity")
    ax.set_xlabel("Time")
    ax.set_xlim(0,1)
    name = "Direct " + str(i) + ".pdf"
    fig.savefig(name)
