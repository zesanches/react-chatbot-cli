import * as https from 'https';

export interface RemoteFile {
  path: string;
  content: string;
}

/**
 * Fetches files from a GitHub repository
 * @param owner - GitHub username or organization
 * @param repo - Repository name
 * @param branch - Branch name
 * @param dirPath - Path to directory in the repo
 * @returns Array of files with their contents
 */
export async function fetchFromGitHub(
  owner: string,
  repo: string,
  branch: string,
  dirPath: string
): Promise<RemoteFile[]> {
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${dirPath}?ref=${branch}`;

  console.log(apiUrl)

  const files: RemoteFile[] = [];
  const contents = await fetchJson(apiUrl);

  if (contents.type === 'file') {
    const contentFile = await fetchFileContent(contents.download_url);

    files.push({
      path: contents.name,
      content: contentFile,
    });
  }

  return files;
}

export async function fetchFromRawGitHub(
  owner: string,
  repo: string,
  branch: string,
  filePath: string
): Promise<string> {
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
  return fetchFileContent(url);
}

function httpsGet(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'react-chatbot-cli',
      },
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        if (res.headers.location) {
          httpsGet(res.headers.location).then(resolve).catch(reject);
          return;
        }
      }

      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
        return;
      }

      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(data);
      });
    });

    req.on('error', reject);
  });
}

async function fetchJson(url: string): Promise<any> {
  const data = await httpsGet(url);

  return JSON.parse(data);
}

async function fetchFileContent(url: string): Promise<string> {
  return httpsGet(url);
}

export function convertTsToJs(content: string): string {
  return content
    .replace(/interface\s+\w+\s*{[^}]*}/g, '')
    .replace(/(\w+):\s*[\w<>[\]|&\s]+(?=[,)])/g, '$1')
    .replace(/\):\s*[\w<>[\]|&\s]+(?=\s*{)/g, ')')
    .replace(/<[\w\s,<>[\]|&]+>/g, '')
    .replace(/\s+as\s+[\w<>[\]|&\s]+/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function convertFileExtension(fileName: string, toTypeScript: boolean): string {
  if (toTypeScript) {
    return fileName;
  }

  return fileName
    .replace(/\.tsx$/, '.jsx')
    .replace(/\.ts$/, '.js');
}
