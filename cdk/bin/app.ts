import { App } from "aws-cdk-lib";
import { PhoneNumbersWebStack } from "../lib/stack";
import { EnvConfig } from "../lib/config";
import devConfig from "../config/dev.json";
import productionConfig from "../config/production.json";

const app = new App();

function deploy(id: string, cfg: EnvConfig) {
  new PhoneNumbersWebStack(app, id, cfg, {
    env: {
      account: cfg.account,
      region: cfg.region,
    },
  });
}

deploy("phone-numbers-web-dev", devConfig as EnvConfig);
deploy("phone-numbers-web-production", productionConfig as EnvConfig);
