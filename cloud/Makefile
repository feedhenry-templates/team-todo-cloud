# Define tasks for running tests

# TEST_FILES=test/integration/authenticate.js test/integration/logout.js test/integration/fetchUsers.js test/integration/fetchToDo.js test/integration/fetchCompletedToDos.js test/integration/fetchToDo.js test/integration/updateToDo.js test/integration/completeToDo.js test/integration/changeToDo.js test/integration/deleteToDo.js
# TEST_FILES= test/integration/logout.js
TEST_FILES = test/unit/endpoints/authenticate.js
DEP = test/dependencies.json
# ACCEPT_TEST=tests/acceptance-tests.js

test: 
	whiskey --tests "${TEST_FILES}" #--only-essential-dependencies --dependencies "${DEP}"

# accept:
# 				whiskey --tests "${ACCEPT_TEST}" --only-essential-dependencies --dependencies "${DEP}"

# test-fast:
# 				whiskey --tests "${TEST_FILES}" --dependencies  "${DEP}" --only-essential-dependencies --failfast

# tap:
# 				whiskey --tests "${TEST_FILES}" --dependencies  "${DEP}" --only-essential-dependencies --test-reporter tap

# coverage:
# 				whiskey --tests "${TEST_FILES}" --dependencies  "${DEP}" --only-essential-dependencies --coverage --coverage-reporter html \
# 					--coverage-dir coverage_html

#  cov:
# 				make coverage

# leaks:
# 				whiskey --tests "${TEST_FILES}" --dependencies  "${DEP}" --only-essential-dependencies --scope-leaks

.PHONY: test tap coverage cov leakss