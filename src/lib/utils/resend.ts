import { Resend } from "resend";

import env from "../env/index.mjs";

const resend = new Resend(env.RESEND_API_KEY);

export default resend;
