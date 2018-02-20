#include <cmath>
#include <iostream>
#include <iomanip>
#include <vector>
#include <cstdlib>
#include <mkl.h>
#include <fstream>
#include <sstream>
#include <string>
#include <stdio.h>
#include <sys/time.h>
using namespace std;

void printMatrix(std::vector< std::vector<double> > & matrix) {
  for (int i = 0; i < matrix.size(); i++) {
    for (int j=0; j < matrix[i].size(); j++) {
      std::cout << matrix[i][j] << " ";
    }
    std::cout << std::endl;
  }
}

void gaussElim(std::vector< std::vector<double> > matrix,bool debug) {
  struct timeval start, finish;
  long int mic_diff;
  gettimeofday(&start,NULL);
  if (debug) {
    std::cout << "Staring System" << std::endl;
    printMatrix(matrix);
  }
  for (int i = 0; i < matrix.size(); i++) {
    for (int j= i+1; j<matrix.size(); j++) {
      if(abs(matrix[i][i]) < abs(matrix[j][i])) {
        for (int k = 0; k <= matrix.size(); k++) {
          double temp = matrix[i][k];
          matrix[i][k] = matrix[j][k];
          matrix[j][k]=temp;
        }
      }
    }
  }
  if (debug) {
    std::cout << "After Pivot" << std::endl;
    printMatrix(matrix);
  }
  for (int i = 0; i < matrix.size() - 1; i++) {
    for (int j = i+1; j < matrix.size(); j++) {
      double coeff = matrix[j][i]/matrix[i][i];
      for (int k = 0; k <= matrix.size(); k++) {
        matrix[j][k]=matrix[j][k] - coeff*matrix[i][k];
      }
    }
    if (debug) {
      std::cout << "Row: " << i << std::endl;
      printMatrix(matrix);
    }
  }
  if (debug) {
    std::cout << "After gaussElim" << std::endl;
    printMatrix(matrix);
  }
  std::vector<double> sol;
  sol.resize(matrix.size());
  for (int i = matrix.size() - 1; i >= 0; i--) {
    sol[i] = matrix[i][matrix.size()];
    for (int j = i + 1; j <= matrix.size(); j++) {
      if (j != i) {
        sol[i] = sol[i]-matrix[i][j]*sol[j];
      }
    }
   sol[i] = sol[i]/matrix[i][i];
  }
  std::cout << "Solution Vector" << endl;
  for (int i = 0; i < sol.size(); i++) {
    std::cout << sol[i] << " ";
  }
  std::cout << endl;
  gettimeofday(&finish,NULL);
  mic_diff = finish.tv_usec-start.tv_usec;
  std::cout << "Time for my function: " << mic_diff << std::endl;
}

void print_matrix( char* desc, MKL_INT m, MKL_INT n, double* a, MKL_INT lda ) {
        MKL_INT i, j;
        printf( "\n %s\n", desc );
        for( i = 0; i < m; i++ ) {
                for( j = 0; j < n; j++ ) printf( " %6.2f", a[i+j*lda] );
                printf( "\n" );
        }
}

void thirdParty(std::vector< std::vector<double> > matrix) {
  double lhs[matrix.size()*(matrix[0].size()-1)];
  double rhs[matrix.size()];
  int lhsCounter = 0;
  for (int i = 0; i < matrix.size(); i++) {
    for (int j = 0; j < matrix.size(); j++) {
      lhs[lhsCounter] = matrix[i][j];
      lhsCounter++;
    }
    rhs[i]=matrix[i][matrix.size()];
  }
  MKL_INT n = matrix.size();
  MKL_INT nrhs = 1;
  MKL_INT lda = n;
  MKL_INT ldb = nrhs;
  MKL_INT ipiv[n];
  struct timeval start,finish;
  long int mic_diff;
  gettimeofday(&start, NULL);
  MKL_INT info = LAPACKE_dgesv(LAPACK_ROW_MAJOR,n,nrhs,lhs,lda,ipiv, rhs, ldb);
  gettimeofday(&finish, NULL);
  if( info > 0 ) {
                printf( "The diagonal element of the triangular factor of A,\n" );
                printf( "U(%i,%i) is zero, so that A is singular;\n", info, info );
                printf( "the solution could not be computed.\n" );
                exit( 1 );
        }
  print_matrix("Solution",n,nrhs,rhs,ldb);
  mic_diff = finish.tv_usec - start.tv_usec;
  std::cout << "Time for third party: " << mic_diff << std::endl;
}


int main(int argc, const char* argv[]) {

  std::vector<int> settings;
  std::ifstream infile("simpleSettings.txt");
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

  int size = settings[0];
  int rows = size;
  int cols = size + 1;

  bool debug = false;
  for (int i = 0; i < argc; i++) {
    if (std::string(argv[i]) == "debug") {
      debug = true;
    }
  }

  std::vector< std::vector<double> > testSystem;
  testSystem.resize(rows);
  for (int i=0;i<rows;i++) {
    testSystem[i].resize(cols);
  }
  for (int i = 0; i < rows; i++) {
    for (int j = 0; j < cols; j++) {
      testSystem[i][j] = rand() %10;
    }
  }

  gaussElim(testSystem,debug);
  thirdParty(testSystem);

  return 0;
}
