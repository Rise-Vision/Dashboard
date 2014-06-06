Rise Vision Dashboard [![Build Status](http://107.170.20.223:8080/job/Dashboard-Client-Master-Prod/badge/icon)](http://107.170.20.223:8080/job/Dashboard-Client-Master-Prod/)
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
- [http://107.170.20.223:8080/](http://107.170.20.223:8080/)

Three projects are present:
- RiseVisionDashboardPR, which builds commits to all branches, including forks specificed in the configuration.
- RiseVisionDashboardProd, wich builds all commits to the master and generate a distrubiton(or artifact) specific to production environment

### Manual Deploy to Production and Staging Server

Open Rundeck via the following address:
- [***REMOVED***/project/rv-dashboard/jobs](***REMOVED***/project/rv-dashboard/jobs)
Credentials: ***REMOVED***

Click on one of the tasks:
- Deploy to FTP - PR
- Deploy to FTp - Staging

In the "Run Job" view, pick one of the Jenkins builds from the drop-down box, and click "Run Job". The selected build will be deployed to its corresponding server, specified by environment.

Miscellaneous