# Contributing

:raised_hands::tada: First off, thanks for taking the time to contribute! :tada::raised_hands:

The following is a set of guidelines for contributing to react-datetime. The purpose of these guidelines is to maintain a high quality of code *and* traceability. Please respect these guidelines.

## General
This repository use tests and a linter as automatic tools to maintain the quality of the code. These two tasks are run locally on your machine before every commit (as a pre-commit git hook), if any test fail or the linter gives an error you cannot create the commit. They are also run on a Travis CI machine when you create a pull request, and will not be merged unless Travis says all tests and the linting pass.

## Git Commit Messages
* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
  * Think of it as you are *commanding* what your commit is doing
  * Git itself uses the imperative whenever it creates a commit on your behalf, so it makes sense for you to use it too!
* Use the body to explain *what* and *why*
  * If the commit is non-trivial, please provide more detailed information in the commit body message
  * *How* you made the change is visible in the code and is therefore very rarely necessary to include in the commit body message, but *why* you made the change is often harder to guess and should therefore be included in the commit body message

[Here's a nice blog post](http://chris.beams.io/posts/git-commit/) about how to write great git messages - it's worth a read.

## Pull Requests
* Follow the current code style
* Write tests for your changes
* Add to documentation if it is needed
* End files with a newline
* There's no need to run `npm build` for each pull request, we do this when we release a new version
