
const fs = require('fs');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

let client;
function getClient() {
  if (client) return client;
  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (credPath) {
    if (!fs.existsSync(credPath)) {
      throw new Error(`GOOGLE_APPLICATION_CREDENTIALS is set to '${credPath}' but the file does not exist`);
    }
  }
  client = new SecretManagerServiceClient();
  return client;
}

function buildSecretName(projectId, secretIdOrFull) {
  if (!secretIdOrFull) throw new Error('secretIdOrFull required');
  if (secretIdOrFull.startsWith('projects/')) return secretIdOrFull;
  return `projects/${projectId}/secrets/${secretIdOrFull}/versions/latest`;
}

async function accessSecret(secretIdOrFull) {
  let projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT;
  const c = getClient();
  if (!projectId && !secretIdOrFull.startsWith('projects/')) {
    try {
      projectId = await c.getProjectId();
    } catch (e) {
      throw new Error('Could not determine GCP project ID from environment or ADC; set GOOGLE_CLOUD_PROJECT or provide full secret resource names');
    }
  }

  const name = buildSecretName(projectId, secretIdOrFull);
  const [version] = await c.accessSecretVersion({ name });
  return version.payload.data.toString('utf8');
}

async function init() {
  const useGcp = process.env.USE_GCP_SECRETS === 'true' || !!process.env.GOOGLE_CLOUD_PROJECT || !!process.env.GCLOUD_PROJECT;
  if (!useGcp) {
    console.log('GCP Secret Manager not configured; continuing with existing env variables');
    return;
  }

  try {
    // Allow overriding which secret resource to use via env vars.
    // Examples:
    // EMAIL_USER_SECRET=projects/123/secrets/my-user/versions/1
    // EMAIL_PASS_SECRET=arschwasser-mail
    const emailUserSecret = process.env.EMAIL_USER_SECRET || 'EMAIL_USER';
    const emailPassSecret = process.env.EMAIL_PASS_SECRET || 'EMAIL_PASS';

    const [emailUser, emailPass] = await Promise.all([
      accessSecret(emailUserSecret),
      accessSecret(emailPassSecret)
    ]);

    process.env.EMAIL_USER = emailUser;
    process.env.EMAIL_PASS = emailPass;
    console.log('Loaded EMAIL_* secrets from GCP Secret Manager');
  } catch (err) {
    console.error('Failed to load secrets from GCP Secret Manager:', err.message || err);
    throw err;
  }
}

module.exports = { init, accessSecret };

