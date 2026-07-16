const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const REQUIRED_FIELDS = ['name', 'tag', 'invoke', 'version'];
const VALID_TAGS = new Set([
  'review', 'delivery', 'design', 'strategy', 'teaching',
  'communication', 'research', 'debugging', 'analysis'
]);

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    return null;
  }
}

function extractFrontmatter(content) {
  if (!content.startsWith('---')) {
    return { frontmatter: null, body: content };
  }

  const end = content.indexOf('---', 3);
  if (end === -1) {
    return { frontmatter: null, body: content };
  }

  const yamlBlock = content.slice(3, end).trim();
  const body = content.slice(end + 3);

  let frontmatter;
  try {
    frontmatter = yaml.load(yamlBlock);
  } catch (err) {
    frontmatter = null;
  }

  return { frontmatter, body };
}

function validateSemver(version) {
  if (typeof version === 'number') {
    if (Number.isInteger(version)) {
      version = `${version}.0.0`;
    } else {
      version = String(version);
    }
  }
  if (typeof version !== 'string') return false;
  const match = version.match(/^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?$/);
  return match !== null;
}

function checkObfuscation(content) {
  const issues = [];

  if (/[A-Za-z0-9+/]{40,}={0,2}/.test(content)) {
    issues.push('Possible base64 blob detected');
  }

  if (/[\u200B-\u200D\uFEFF]/.test(content)) {
    issues.push('Zero-width characters detected');
  }

  return issues;
}

function validateSpirit(content, filePath) {
  const errors = [];
  const warnings = [];

  if (!content) {
    errors.push(`Cannot read file: ${filePath}`);
    return { valid: false, errors, warnings };
  }

  const { frontmatter, body } = extractFrontmatter(content);

  if (!frontmatter) {
    errors.push('Missing or invalid YAML frontmatter');
    return { valid: false, errors, warnings };
  }

  for (const field of REQUIRED_FIELDS) {
    if (!frontmatter[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  if (frontmatter.name && typeof frontmatter.name !== 'string') {
    errors.push('Field "name" must be a string');
  }

  if (frontmatter.tag && typeof frontmatter.tag === 'string' && !VALID_TAGS.has(frontmatter.tag)) {
    warnings.push(`Tag "${frontmatter.tag}" is not a known category`);
  }

  if (frontmatter.version && !validateSemver(frontmatter.version)) {
    errors.push(`Invalid semver: ${frontmatter.version}`);
  }

  if (!body.includes('## Boundaries')) {
    errors.push('Missing required section: ## Boundaries');
  }

  const logMatch = body.match(/^## LOG\s*$/m);
  if (!logMatch) {
    errors.push('Missing required section: ## LOG');
  } else {
    const afterLog = body.slice(logMatch.index + logMatch[0].length).trim();
    const lines = afterLog.split('\n').filter(l => {
      const trimmed = l.trim();
      return trimmed.length > 0 && !trimmed.startsWith('<!--') && !trimmed.startsWith('-->');
    });
    for (const line of lines) {
      if (!line.trim().startsWith('-') && !line.trim().startsWith('*')) {
        warnings.push('LOG entries should start with "-" or "*"');
        break;
      }
    }
  }

  const obfuscation = checkObfuscation(content);
  warnings.push(...obfuscation);

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    file: path.basename(filePath)
  };
}

function validatePath(targetPath) {
  const results = [];
  const files = [];

  const expanded = [];
  if (targetPath.includes('*')) {
    const dir = path.dirname(targetPath) || '.';
    const pattern = path.basename(targetPath).replace(/\*/g, '');
    const entries = fs.readdirSync(dir);
    for (const entry of entries) {
      if (pattern ? entry.includes(pattern.replace('.spirit.md', '')) : true) {
        expanded.push(path.join(dir, entry));
      }
    }
  } else {
    expanded.push(targetPath);
  }

  for (const p of expanded) {
    if (fs.statSync(p).isDirectory()) {
      const entries = fs.readdirSync(p);
      for (const entry of entries) {
        if (entry.endsWith('.spirit.md')) {
          files.push(path.join(p, entry));
        }
      }
      files.sort();
    } else if (p.endsWith('.spirit.md')) {
      files.push(p);
    }
  }

  if (files.length === 0) {
    console.error(`Error: no .spirit.md files found at ${targetPath}`);
    process.exit(1);
  }

  for (const file of files) {
    const content = readFile(file);
    const result = validateSpirit(content, file);
    results.push(result);
  }

  return results;
}

function printResults(results) {
  let hasErrors = false;

  for (const result of results) {
    if (result.errors.length === 0 && result.warnings.length === 0) {
      console.log(`✓ ${result.file}`);
      continue;
    }

    if (result.errors.length > 0) {
      hasErrors = true;
      console.log(`✗ ${result.file}`);
      for (const err of result.errors) {
        console.log(`  error: ${err}`);
      }
    }

    if (result.warnings.length > 0) {
      console.log(`! ${result.file}`);
      for (const warn of result.warnings) {
        console.log(`  warning: ${warn}`);
      }
    }
  }

  if (hasErrors) {
    console.log('\nValidation failed.');
    process.exit(1);
  } else {
    console.log('\nValidation passed.');
  }
}

const target = process.argv[2] || path.join(__dirname, '..', 'spirits');
const results = validatePath(target);
printResults(results);
