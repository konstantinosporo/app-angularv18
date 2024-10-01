// firebaseAdmin.ts
import * as admin from "firebase-admin";

const firebaseConfig = {
  type: process.env["FIREBASE_TYPE"],
  projectId: process.env["FIREBASE_PROJECT_ID"],
  privateKeyId: process.env["FIREBASE_PRIVATE_KEY_ID"],
  privateKey: process.env["FIREBASE_PRIVATE_KEY"]
    ? process.env["FIREBASE_PRIVATE_KEY"].replace(/\\n/g, '\n') // Replace \n with newline
    : '',
  clientEmail: process.env["FIREBASE_CLIENT_EMAIL"],
  clientId: process.env["FIREBASE_CLIENT_ID"],
  authUri: process.env["FIREBASE_AUTH_URI"],
  tokenUri: process.env["FIREBASE_TOKEN_URI"],
  authProviderX509CertUrl: process.env["FIREBASE_AUTH_PROVIDER_X509_CERT_URL"],
  clientX509CertUrl: process.env["FIREBASE_CLIENT_X509_CERT_URL"],
};

if (!firebaseConfig.projectId || !firebaseConfig.privateKey || !firebaseConfig.clientEmail) {
  throw new Error("Missing Firebase configuration in environment variables.");
}

admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig as admin.ServiceAccount),
});

export default admin;
