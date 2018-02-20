FLAGS   = -Wall -Wextra
CPPFLAGS1 = -I$(TACC_MKL_INC)
LDFLAGS1  = -L$(TACC_MKL_LIB)
LIBS1     = -mkl
CXX1      = icpc
CXX2      = icpc
CPPFLAGS2 = -I$(TACC_BOOST_INC) -I$(TACC_GSL_INC) -I$(TACC_PETSC_DIR)
LDFLAGS2  = -L$(TACC_BOOST_LIB) -L$(TACC_GSL_LIB) -L$(TACC_PETSC_LIB)
LIBS2     = -lgsl -lgslcblas -lm

simple: simpleSystem.C
	$(CXX1) $(CPPFLAGS1) $(CFLAGS) $(LDFLAGS1) $< -o $@ $(LIBS1)

poly: polyRegression.C
	$(CXX2) $(CPPFLAGS2) $(FLAGS) $(LDFLAGS2) $< -o $@ $(LIBS2)
