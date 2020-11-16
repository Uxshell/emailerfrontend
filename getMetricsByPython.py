import json
import boto3 #pip install boto3

from botocore.exceptions import ClientError

def lambda_handler(event, context):
    # TODO implement
    print(event)
    
    startTime = event["startTime"]
    endTime = event["endTime"]
    metricName = event["metricName"]
    
    print(startTime)
    print(endTime)
    print(metricName)
    
    cloudwatch = boto3.resource('cloudwatch')
    events = ["Click", "Open", "Bounce", "Delivery", "Reject", "Send", "Enviar"]
    i = 0
    data = {}
    for event in events:
        print(event)
    
        metric = cloudwatch.Metric('AWS/SES',event)
        try:
            response = metric.get_statistics(
                Dimensions=[{
                    'Name': metricName,
                    'Value': 'Custom'
                }],
                StartTime=startTime,
                EndTime=endTime,
                Period=3600, #Por dia
                
                Statistics=[
                    'SampleCount',
                ]
                #ExtendedStatistics=['string'],
                #Unit='Seconds'|'Microseconds'|'Milliseconds'|'Bytes'|'Kilobytes'|'Megabytes'|'Gigabytes'|'Terabytes'|'Bits'|'Kilobits'|'Megabits'|'Gigabits'|'Terabits'|'Percent'|'Count'|'Bytes/Second'|'Kilobytes/Second'|'Megabytes/Second'|'Gigabytes/Second'|'Terabytes/Second'|'Bits/Second'|'Kilobits/Second'|'Megabits/Second'|'Gigabits/Second'|'Terabits/Second'|'Count/Second'|'None'
            )
        except ClientError as e:
            print(e.response['Error']['Message'])
            data["error"] = e.response['Error']['Message']
            break
        else:
            #print(json.loads(json.dumps(response, indent=4, sort_keys=True, default=str)))
            y = json.loads(json.dumps(response, indent=4, sort_keys=True, default=str))
            parsed_json = (json.loads(json.dumps(response, indent=4, sort_keys=True, default=str)))
            print(parsed_json)
            data[event] = parsed_json
            i = ++i
        
    return {
        'headers': { 'Content-Type': 'application/json' },
        'statusCode': 200,
        'body': data
        #'body': parsed_json
        #'body': json.loads(y)

    }
    




