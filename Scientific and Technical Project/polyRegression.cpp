#include <cmath>
#include <iostream>
#include <iomanip>
#include <vector>
#include <cstdlib>
#include <fstream>
#include <sstream>
#include <string>
#include <boost/tokenizer.hpp>
#include <boost/lexical_cast.hpp>
#include <gsl/gsl_multifit.h>
#include <gsl/gsl_blas.h>

void readCSV(std::vector<double> & rhs,bool debug) {
  using namespace std;
  using namespace boost;
  string data("AirQualityUCI.csv");
  if(debug) {
    cout<<"Time to read"<<endl;
  }
  ifstream in(data.c_str());

  typedef tokenizer<escaped_list_separator<char> > Tokenizer;

  escaped_list_separator<char> sep('\\', ';' ,'\"');

  vector<string> vec;
  string line;
  getline(in,line);

  while(getline(in,line)) {
    Tokenizer tok(line,sep);
    vec.assign(tok.begin(),tok.end());
    double value = lexical_cast<double>(vec[14]);
    if (value != -200) {
      rhs.push_back(value);
    }
  }
  if(debug) {
    cout<<"Read " << rhs.size() << " values" <<endl;
  }
  ofstream outputFile;
  outputFile.open("datapoints.txt");
  for (int i = 0; i < rhs.size(); i++) {
    outputFile << rhs[i] << "\t";
  }
  outputFile.close();
}

void directFit(int power, std::vector<double> rhs, bool debug) {
  //intialize parameters
  int i, n;
  double xi, yi, ei, chisq;
  gsl_matrix *X, *cov;
  gsl_vector *y, *w, *c;

  n = rhs.size();

  X = gsl_matrix_alloc(n,power);
  y = gsl_vector_alloc(n);
  w = gsl_vector_alloc(n);

  c = gsl_vector_alloc(power);
  cov = gsl_matrix_alloc(power,power);
  //insert values into matrix and vectors
  for(int i = 0; i < rhs.size(); i++) {
    for(int j = 0; j < power; j++) {
      if (i != 0) {
        gsl_matrix_set(X, i, j, pow((rhs.size()/i), j));
      } else {
        gsl_matrix_set(X, j, j, 0);
      }
    }
    gsl_vector_set(y, i, rhs[i]);
    gsl_vector_set(w, i , 1);
  }
  //find least squares fit
  gsl_multifit_linear_workspace * work = gsl_multifit_linear_alloc(n,power);
  gsl_multifit_wlinear(X,w,y,c,cov,&chisq,work);
  gsl_multifit_linear_free(work);

  if (debug) {
    std::cout << "# best fit: Y = " << gsl_vector_get(c,0);
    for(int i = 1; i < power; i++) {
      std::cout << " + " << gsl_vector_get(c,i) << " X^" << i;
    }
    std::cout << std::endl;
  }
  //save coefficents of solution to file
  std::ofstream outputFile;
  std::ostringstream oss;
  oss << "directPower" << power << ".txt";
  std::string savefile = oss.str();
  outputFile.open(savefile.c_str());
  for(int i = 0; i < power; i++) {
    double value = gsl_vector_get(c,i);
    outputFile << value << "\t";
  }
  outputFile.close();

  gsl_matrix_free (X);
  gsl_vector_free (y);
  gsl_vector_free (w);
  gsl_vector_free (c);
  gsl_matrix_free (cov);
}


int main(int argc, const char* argv[]) {
  //get powers of functions to create from settings
  std::vector<int> settings;
  std::ifstream infile("polySettings.txt");
  std::string line;
  while (std::getline(infile, line)) {
    std::vector<std::string> result;
    std::istringstream iss(line);
    for(std::string line; iss >> line;) {
      result.push_back(line);
    }
    int value = 0;
    std::stringstream number(result[1]);
    number >> value;
    settings.push_back(value);
  }
  //check if debug flag is given
  bool debug = false;
  for (int i = 0; i < argc; i++) {
    if (std::string(argv[i]) == "debug") {
      debug = true;
    }
  }
  std::vector<double> rhs;
  readCSV(rhs,debug);
  //run direct solving method for each power
  for(int i = 0; i < settings.size(); i++) {
    directFit(settings[i], rhs, debug);
  }

}
