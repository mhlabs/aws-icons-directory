# aws-icons-directory

Simple library that takes a CloudFormation resource type as input and returns a best guess SVG icon from the [official asset package](https://aws.amazon.com/architecture/icons/).

## Installation
`npm i aws-icon-directory`

## Example

```
const { AWSIconDirectory } = require("aws-icons-directory)

const svg = AWSIconDirectory.getSVG("AWS::DynamoDB::Table")

// Also works with SAM resources
const svg = AWSIconDirectory.getSVG("AWS::Serverless::Function")

```

## Known issues
There's no naming convention between CloudFormation resource type names and how the icons are named. The list is generated using [string-similarity](https://www.npmjs.com/package/string-similarity) and some other tweakng. This code can be found and improved under [tooling](tooling).

I've done some manual testing, but there will be some resource types that are pointing at the wrong icons. Please report these as bugs :-)

It currently only maps on a broad service level and not on feature level. I.e, `AWS::Lambda::Function` and `AWS::Lambda::Permission` will both return the Lambda icon.