Rise Vision Dashboard [![Build Status](http://devtools1.risevision.com:8080/job/Dashboard-Client-Master-Prod/badge/icon)](http://devtools1.risevision.com:8080/job/Dashboard-Client-Master-Prod/)[![Code Climate](https://codeclimate.com/github/Rise-Vision/Dashboard.png)](https://codeclimate.com/github/Rise-Vision/Dashboard)
=====

First Timer?
----
* Checkout the project from git repository.
* run
```bash
npm run dev-install # install dependencies
npm run dev         # run static server on port 8000 & open default web browser
```

Testing
----

For unit testing (with file watching), run

```bash
gulp test
```

To run unit test for a single run, do
```bash
gulp test-ci
```

To run E2E testing, do
```bash
gulp test-e2e
```

Continuous Deployment
----
### Monitoring CI Builds

The Jenkins CI portal is located at
- [http://devtools1.risevision.com:8080](http://devtools1.risevision.com:8080)

Two projects are present:
- RiseVisionDashboardPR, which builds commits to all branches, including forks specificed in the configuration.
- RiseVisionDashboardProd, wich builds all commits to the master and generate a distrubiton(or artifact) specific to production environment


Miscellaneous
