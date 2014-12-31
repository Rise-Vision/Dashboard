#!/bin/bash

server=$1
job_id=$2
token=$3
argString=$4


curl -o /tmp/curl.output.xml --data-urlencode "argString=${argString}" http://${server}/api/11/job/${job_id}/run?authtoken=${token}
execution_id=`xmllint --xpath 'string(//execution/@id)' /tmp/curl.output.xml`
echo "Execution ID: $execution_id"

completed=false
while [ "$completed" != "true" ]
do
	sleep 20
	curl -o /tmp/curl.execution.status.xml --header "Accept: text/xml" http://${server}/api/11/execution/${execution_id}/state?authtoken=${token}
	completed=`xmllint --xpath 'string(//completed)' /tmp/curl.execution.status.xml`
done

status=`xmllint --xpath 'string(//executionState/executionState)' /tmp/curl.execution.status.xml`

if [ "$status" = "FAILED" ]
then
	echo "RUNDECK job has FAILED!!!"
	exit 1
elif [ "$status" = "SUCCEEDED" ]
then
	echo "RUNDECK job has SUCCEEDED!!!"
	exit 0
fi