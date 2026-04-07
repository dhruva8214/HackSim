// Virtual File System for HackSim
// Each mission provides its own FS tree snapshot

export class FileSystemNode {
  constructor(name, type = 'file', content = '', children = {}) {
    this.name = name;
    this.type = type; // 'file' | 'directory'
    this.content = content;
    this.children = children; // { name: FileSystemNode }
  }
}

export class VirtualFileSystem {
  constructor(rootStructure) {
    this.root = this._buildTree('/', rootStructure);
    this.currentPath = '/';
  }

  _buildTree(name, structure) {
    if (typeof structure === 'string') {
      return new FileSystemNode(name, 'file', structure);
    }
    const children = {};
    for (const [key, value] of Object.entries(structure)) {
      children[key] = this._buildTree(key, value);
    }
    return new FileSystemNode(name, 'directory', '', children);
  }

  _resolvePath(inputPath) {
    let path = inputPath;
    if (!path.startsWith('/')) {
      path = this.currentPath === '/'
        ? '/' + path
        : this.currentPath + '/' + path;
    }
    const parts = path.split('/').filter(Boolean);
    const resolved = [];
    for (const part of parts) {
      if (part === '.') continue;
      if (part === '..') {
        resolved.pop();
      } else {
        resolved.push(part);
      }
    }
    return '/' + resolved.join('/');
  }

  _getNode(path) {
    if (path === '/') return this.root;
    const parts = path.split('/').filter(Boolean);
    let current = this.root;
    for (const part of parts) {
      if (!current || current.type !== 'directory') return null;
      current = current.children[part];
    }
    return current || null;
  }

  list(dirPath = '.', showHidden = false) {
    const resolved = this._resolvePath(dirPath);
    const node = this._getNode(resolved);
    if (!node) return { success: false, output: `ls: cannot access '${dirPath}': No such file or directory` };
    if (node.type === 'file') return { success: true, output: node.name };

    let entries = Object.keys(node.children);
    if (!showHidden) {
      // Still show hidden entries — the game teaches players to find them
      // But we mark them differently
    }
    if (entries.length === 0) return { success: true, output: '(empty directory)' };

    const formatted = entries.map(e => {
      const child = node.children[e];
      return child.type === 'directory' ? e + '/' : e;
    });
    return { success: true, output: formatted.join('  ') };
  }

  listAll(dirPath = '.') {
    const resolved = this._resolvePath(dirPath);
    const node = this._getNode(resolved);
    if (!node) return { success: false, output: `ls: cannot access '${dirPath}': No such file or directory` };
    if (node.type === 'file') return { success: true, output: node.name };

    const entries = Object.keys(node.children);
    if (entries.length === 0) return { success: true, output: 'total 0' };

    const lines = ['total ' + entries.length];
    for (const e of entries) {
      const child = node.children[e];
      const typeChar = child.type === 'directory' ? 'd' : '-';
      lines.push(`${typeChar}rw-r--r--  1 agent  agency  ${child.type === 'file' ? child.content.length : 4096}  ${e}`);
    }
    return { success: true, output: lines.join('\n') };
  }

  changeDir(dirPath) {
    if (!dirPath || dirPath === '~' || dirPath === '') {
      this.currentPath = '/';
      return { success: true, output: '' };
    }
    const resolved = this._resolvePath(dirPath);
    const node = this._getNode(resolved);
    if (!node) return { success: false, output: `cd: ${dirPath}: No such file or directory` };
    if (node.type !== 'directory') return { success: false, output: `cd: ${dirPath}: Not a directory` };
    this.currentPath = resolved;
    return { success: true, output: '' };
  }

  readFile(filePath) {
    const resolved = this._resolvePath(filePath);
    const node = this._getNode(resolved);
    if (!node) return { success: false, output: `cat: ${filePath}: No such file or directory` };
    if (node.type === 'directory') return { success: false, output: `cat: ${filePath}: Is a directory` };
    return { success: true, output: node.content };
  }

  grep(term, filePath) {
    const resolved = this._resolvePath(filePath);
    const node = this._getNode(resolved);
    if (!node) return { success: false, output: `grep: ${filePath}: No such file or directory` };
    if (node.type === 'directory') return { success: false, output: `grep: ${filePath}: Is a directory` };

    const lines = node.content.split('\n');
    const matches = lines.filter(line => line.toLowerCase().includes(term.toLowerCase()));
    if (matches.length === 0) return { success: true, output: '(no matches)' };
    return { success: true, output: matches.join('\n') };
  }

  getPrompt() {
    const dir = this.currentPath === '/' ? '~' : this.currentPath.split('/').pop();
    return `agent@mainframe:${dir}$ `;
  }

  getCurrentPath() {
    return this.currentPath;
  }

  // Check if a file exists at path
  fileExists(filePath) {
    const resolved = this._resolvePath(filePath);
    const node = this._getNode(resolved);
    return node !== null && node.type === 'file';
  }

  // Dynamically add a file (for missions that create files on success)
  addFile(filePath, content) {
    const resolved = this._resolvePath(filePath);
    const parts = resolved.split('/').filter(Boolean);
    const fileName = parts.pop();
    let current = this.root;
    for (const part of parts) {
      if (!current.children[part]) {
        current.children[part] = new FileSystemNode(part, 'directory', '', {});
      }
      current = current.children[part];
    }
    current.children[fileName] = new FileSystemNode(fileName, 'file', content);
  }
}
