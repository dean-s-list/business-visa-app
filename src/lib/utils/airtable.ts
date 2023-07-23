import Airtable from "airtable";

import env from "../env/index.mjs";

const airtable = new Airtable({ apiKey: env.AIRTABLE_TOKEN });

export default airtable;
