const fs = require("fs");
const cfnSchema = require("./schema/cloudformation.json");
const path = require("path");
const glob = require("glob");
const stringSimilarity = require("string-similarity");
let icons;
let template = { Resources: {} };
function generate(cfnType, type = "svg", size = "64", brightness = "Light") {
  const split = cfnType.split("::");
  const resource = samTranslator(split) || split[1];
  const resourceType = split[2];
  template.Resources["AWS::"+resource + "::" + resourceType] = {
    Type: cfnType,
    Properties: {}
  };
  if (!icons) {
    icons = glob.sync(path.join("../", "icons", `**/${size}/*.${type}`));
    icons = [
      ...icons,
      ...glob.sync(path.join("../", "icons", `**/Arch_${size}/*.${type}`)),
      //      ...glob.sync(path.join("icons", `**/Res_48_${brightness}/*.${type}`)),
    ];
  }

  let resourceMatches = icons.filter((p) =>
    p.toLowerCase().replace(/-/g, " ").includes(abbreviationTranslate(resource))
  );

  let filteredArchIcons = icons.filter((p) =>
    p.startsWith("../icons/Architecture")
  );

  let fullMatch = true;
  if (resourceMatches.length) {
    filteredArchIcons = resourceMatches.filter((p) =>
      p.startsWith("../icons/Architecture")
    );
    fullMatch = false;
  }
  const best = stringSimilarity.findBestMatch(
    `${abbreviationTranslate(resource)}`.toLowerCase(),
    filteredArchIcons.map((p) =>
      p
        .split("/")
        .slice(-1)[0]
        .replace("Arch_", "")
        .replace(`_${size}.${type}`, "")
        .replace("AWS-", "")
        .replace("Amazon-", "")
        .toLowerCase()
    )
  );
  //console.log(best);
  return {
    icon: filteredArchIcons[best.bestMatchIndex]
      .replace(size, "{size}")
      .replace(size, "{size}")
      .replace(`.${type}`, ".{type}")
      .replace("../", "./"),
    fullMatch,
  };
}

function abbreviationTranslate(resourceType) {
  switch (resourceType) {
    case "SES":
      return "simple email service";
    case "SNS":
      return "simple notification service";
    case "EFS":
      return "elastic file system";
    case "SQS":
      return "simple queue service";
    case "ECS":
      return "elastic container service";
    case "IAM":
      return "identity access management";
    case "Events":
      return "eventbridge";
    case "ACMPCA":
      return "amazon certificate management";
    case "WAFRegional":
      return "waf";
    case "SSM":
      return "systems manager";
    case "FIS":
      return "fault injection simulator";
    case "KMS":
      return "key managemnet service";
    case "S3":
      return "simple storage service";
    case "DAX":
      return "dynamodb"; // no proper icon
    case "IVS":
      return "interactive video service";
    case "Logs":
      return "cloudwatchlogs";
    case "EventSchemas":
      return "eventbridge";
  }
  return resourceType;
}

function samTranslator(cfnType) {
  if (cfnType[1] !== "Serverless") {
    return;
  }
  switch (cfnType[2]) {
    case "Function":
      return "Lambda";
    case "SimpleTable":
      return "DynamoDB";
    case "StateMachine":
      return "StepFunctions";
    case "Api":
    case "HttpApi":
      return "ApiGateway";
  }
}

let map = {};
for (const resource of [
  ...Object.keys(cfnSchema.ResourceTypes),
  ...[
    "AWS::Serverless::Function",
    "AWS::Serverless::SimpleTable",
    "AWS::Serverless::StateMachine",
    "AWS::Serverless::Api",
    "AWS::Serverless::HttpApi",
  ],
]) {
  const gen = generate(resource);
  map[resource.toLowerCase()] = {
    icon: gen.icon,
  };
}

fs.writeFileSync("../mapping.json", JSON.stringify(map, null, 2));
fs.writeFileSync("../template.json", JSON.stringify(template, null, 2));

console.log(stringSimilarity.findBestMatch("abc", ["abd"]));
