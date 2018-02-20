# README #
For the final project I choose to do regression. 
### Simple System of Equations ###
For the simple system of equations I made a function simpleSystem.C 
that creates a system of linear equations of size determined by 
simpleSettings.txt and allows debugging by writing debug as a flag 
for the program. 
### Polynomial Regression of air quality dataset ###
For the polynomial regression I made a function polyRegression.C 
that reads the CSV file AirQualityUCI.csv and finds the coeffiecients
to a polynomial to model the data. The direct method writes the coefficients
it finds for a given power to the file directN.txt where N is the power. The
data is graphed by the function makeplot.py. I was unable to get an iterative
solver to work after trying both gsl_mutimin and petsc KSP. 