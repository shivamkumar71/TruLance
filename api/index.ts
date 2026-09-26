import serverless from "serverless-http";
import { app } from "../server";

// Vercel serverless functions need an HTTP-compatible handler,
// not a raw Express app.  serverless-http does this conversion.
export default serverless(app);
