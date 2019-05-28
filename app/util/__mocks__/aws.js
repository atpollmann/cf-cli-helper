const bucketObjects = [
  {
    Bucket: "bucket",
    Key: "global/VPC/1.0/main.yml",
    ETag: "6805f2cfc46c0f04559748bb039d69ae"
  },
  {
    Bucket: "bucket",
    Key: "global/VPC/1.0/more_nested/classfile.js",
    ETag: "6805f2cfc46c0f04559748bb039d69ae"
  },
  {
    Bucket: "bucket",
    Key: "global/VPC/1.0/more_nested/utils/utils.js",
    ETag: "6805f2cfc46c0f04559748bb039d69ae"
  },
  {
    Bucket: "bucket",
    Key: "global/VPC/1.0/nested/nestedFile.js",
    ETag: "6805f2cfc46c0f04559748bb039d69ae"
  }
];

class CloudFormation {
  describeStacks(props, callback) {
    const stacks = {
      deployedStack: {
        Stacks: [
          {
            StackId:
              "arn:aws:cloudformation:us-east-1:000000000000:stack/deployedStack/deployedStack7f0caa81-3057-11e9-bf04-0e8cdcc47538",
            Description:
              "Three AZ VPC infrastructure. One public and private subnet in each AZ",
            Parameters: [
              {
                ParameterValue: "10.0.96.0/20",
                ParameterKey: "PublicSubnetAZ2CIDR"
              },
              {
                ParameterValue: "10.0.128.0/19",
                ParameterKey: "PrivateSubnetAZ3CIDR"
              }
            ],
            Tags: [],
            Outputs: [
              {
                Description: "Public subnet AZ3 ID",
                ExportName: "Test-VPC-PublicSubnetAZ3ID",
                OutputKey: "PublicSubnetAZ3ID",
                OutputValue: "subnet-07913c84789c7ec08"
              },
              {
                Description: "Public subnet AZ2 ID",
                ExportName: "Test-VPC-PublicSubnetAZ2ID",
                OutputKey: "PublicSubnetAZ2ID",
                OutputValue: "subnet-0ab26cd900ae2b3a3"
              }
            ],
            CreationTime: "2019-02-14T12:53:11.377Z",
            StackName: "deployedStack",
            NotificationARNs: [],
            StackStatus: "CREATE_COMPLETE",
            DisableRollback: false,
            RollbackConfiguration: {
              RollbackTriggers: []
            }
          }
        ]
      },
      createInProgress: {
        Stacks: [
          {
            StackId:
              "arn:aws:cloudformation:us-east-1:000000000000:stack/createInProgress/createInProgress7f0caa81-3057-11e9-bf04-0e8cdcc47538",
            Description:
              "Three AZ VPC infrastructure. One public and private subnet in each AZ",
            StackName: "createInProgress",
            StackStatus: "CREATE_IN_PROGRESS"
          }
        ]
      },
      deleteInProgress: {
        Stacks: [
          {
            StackId:
              "arn:aws:cloudformation:us-east-1:000000000000:stack/deleteInProgress/deleteInProgress7f0caa81-3057-11e9-bf04-0e8cdcc47538",
            Description:
              "Three AZ VPC infrastructure. One public and private subnet in each AZ",
            StackName: "deleteInProgress",
            StackStatus: "DELETE_IN_PROGRESS"
          }
        ]
      },
      updateInProgress: {
        Stacks: [
          {
            StackId:
              "arn:aws:cloudformation:us-east-1:000000000000:stack/updateInProgress/updateInProgress7f0caa81-3057-11e9-bf04-0e8cdcc47538",
            Description:
              "Three AZ VPC infrastructure. One public and private subnet in each AZ",
            StackName: "updateInProgress",
            StackStatus: "UPDATE_IN_PROGRESS"
          }
        ]
      },
      rollbackInProgress: {
        Stacks: [
          {
            StackId:
              "arn:aws:cloudformation:us-east-1:000000000000:stack/rollbackInProgress/rollbackInProgress7f0caa81-3057-11e9-bf04-0e8cdcc47538",
            Description:
              "Three AZ VPC infrastructure. One public and private subnet in each AZ",
            StackName: "rollbackInProgress",
            StackStatus: "ROLLBACK_IN_PROGRESS"
          }
        ]
      }
    };
    process.nextTick(() =>
      stacks[props.StackName]
        ? callback(undefined, stacks[props.StackName])
        : callback("No stack named " + props.StackName, undefined)
    );
  }

  describeStackEvents(params, callback) {
    const stackEvents = {
      deployedStack: {
        StackEvents: [
          {
            StackId:
              "arn:aws:cloudformation:us-east-1:000000000000:stack/Test-VPC/7f0caa81-3057-11e9-bf04-0e8cdcc47538",
            EventId: "VPC-CREATE_IN_PROGRESS-2019-02-14T12:53:18.871Z",
            ResourceStatus: "CREATE_IN_PROGRESS",
            ResourceType: "AWS::EC2::VPC",
            Timestamp: "2019-02-14T12:53:18.871Z",
            StackName: "Test-VPC",
            ResourceProperties:
              '{"InstanceTenancy":"default","CidrBlock":"10.0.0.0/16","EnableDnsSupport":"true","EnableDnsHostnames":"true","Tags":[{"Value":"Test-VPC","Key":"Name"}]}',
            PhysicalResourceId: "",
            ClientRequestToken:
              "Console-CreateStack-230fef00-5d4a-300d-6d6a-f3b73a050f49",
            LogicalResourceId: "VPC"
          },
          {
            StackId:
              "arn:aws:cloudformation:us-east-1:000000000000:stack/Test-VPC/7f0caa81-3057-11e9-bf04-0e8cdcc47538",
            EventId:
              "PrivateSubnetAZ3-CREATE_COMPLETE-2019-02-14T12:53:55.830Z",
            ResourceStatus: "CREATE_COMPLETE",
            ResourceType: "AWS::EC2::Subnet",
            Timestamp: "2019-02-14T12:53:55.830Z",
            StackName: "Test-VPC",
            ResourceProperties:
              '{"VpcId":"vpc-07ca9d97c9dabc03e","MapPublicIpOnLaunch":"false","CidrBlock":"10.0.128.0/19","AvailabilityZone":"us-east-1c","Tags":[{"Value":"Private AZ3 Test-VPC","Key":"Name"}]}',
            PhysicalResourceId: "subnet-0457a56a7ec006702",
            ClientRequestToken:
              "Console-CreateStack-230fef00-5d4a-300d-6d6a-f3b73a050f49",
            LogicalResourceId: "PrivateSubnetAZ3"
          },
          {
            StackId:
              "arn:aws:cloudformation:us-east-1:000000000000:stack/Test-VPC/7f0caa81-3057-11e9-bf04-0e8cdcc47538",
            EventId: "NAT1EIP-CREATE_IN_PROGRESS-2019-02-14T12:53:58.003Z",
            ResourceStatus: "CREATE_IN_PROGRESS",
            ResourceType: "AWS::EC2::EIP",
            Timestamp: "2019-02-14T12:53:58.003Z",
            StackName: "Test-VPC",
            ResourceProperties: '{"Domain":"vpc"}',
            PhysicalResourceId: "",
            ClientRequestToken:
              "Console-CreateStack-230fef00-5d4a-300d-6d6a-f3b73a050f49",
            LogicalResourceId: "NAT1EIP"
          },
          {
            StackId:
              "arn:aws:cloudformation:us-east-1:000000000000:stack/Test-VPC/7f0caa81-3057-11e9-bf04-0e8cdcc47538",
            EventId:
              "PublicSubnetAZ1RouteTableAssociation-CREATE_IN_PROGRESS-2019-02-14T12:54:00.120Z",
            ResourceStatus: "CREATE_IN_PROGRESS",
            ResourceType: "AWS::EC2::SubnetRouteTableAssociation",
            Timestamp: "2019-02-14T12:54:00.120Z",
            StackName: "Test-VPC",
            ResourceProperties:
              '{"RouteTableId":"rtb-06d160c0c9e07b034","SubnetId":"subnet-0f26e227735b6215f"}',
            PhysicalResourceId: "",
            ClientRequestToken:
              "Console-CreateStack-230fef00-5d4a-300d-6d6a-f3b73a050f49",
            LogicalResourceId: "PublicSubnetAZ1RouteTableAssociation"
          }
        ]
      }
    };
    process.nextTick(() =>
      stackEvents[params.StackName]
        ? callback(undefined, stackEvents[params.StackName])
        : callback("No stack named " + params.StackName, undefined)
    );
  }

  validateTemplate(params, cb) {
    const { TemplateURL } = params;

    process.nextTick(() => {
      if (TemplateURL === "valid_template_url") {
        cb(null, {
          Description: "Template description",
          Parameters: []
        });
      } else if (TemplateURL === "invalid_template_url") {
        cb(
          "An error occurred (ValidationError) when calling the ValidateTemplate operation: T" +
            "emplate format error: At least one Resources member must be defined.",
          null
        );
      } else {
        cb(
          "An error occurred (ValidationError) when calling the ValidateTemplate operation: S3 error: Access Denied\n" +
            "For more information check http://docs.aws.amazon.com/AmazonS3/latest/API/ErrorResponses.html",
          null
        );
      }
    });
  }

  createStack(params, cb) {
    const { StackName } = params;

    if (StackName === "cantCreateInAWS") {
      cb(`MOCK AWS: cant create stack ${StackName} because of reasons`, null);
    } else if (StackName === "canCreateInAWS") {
      cb(null, {
        StackId:
          "arn:aws:cloudformation:us-east-1:000000000000:stack/aStack/aStack7f0caa81-3057-11e9-bf04-0e8cdcc47538"
      });
    }
  }
}

class S3 {
  headObject(params, callback) {
    process.nextTick(() => {
      for (let i = 0; i < bucketObjects.length; i++) {
        let bo = bucketObjects[i];
        if (bo.Bucket === params.Bucket && bo.Key === params.Key) {
          callback(undefined, true);
          break;
        }
      }
      callback("No object in bucket");
    });
  }

  putObject(params, callback) {
    process.nextTick(() => {
      for (let i = 0; i < bucketObjects.length; i++) {
        let bo = bucketObjects[i];
        if (bo.Bucket === params.Bucket && bo.Key === params.Key) {
          callback(undefined, { ETag: bo.ETag });
          break;
        }
      }
      callback(`Cant write to bucket: ${params.Bucket} ${params.Key}`);
    });
  }
}

exports.CloudFormation = CloudFormation;
exports.S3 = S3;
