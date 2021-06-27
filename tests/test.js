const AWSIcon = require("../index");
test("Serverless icon resolves", () => {
  const icon = AWSIcon.getSVG("AWS::Serverless::Function");
  expect(icon.indexOf("Icon-Architecture/64/Arch_AWS-Lambda_64")).toBeGreaterThan(-1)
});
