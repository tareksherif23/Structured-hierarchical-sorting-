import fs from 'fs';

export class SearchTree {
  constructor(
    private headers: string[],
    private root: TreeNode = new TreeNode('*'),
    private longestPath: number = 1,
    private sorted: string = ''
  ) {}

  addNode(node: TreeNode) {
    let parent = this.root;
    const path = node.path;
    let value = path.shift();
    let pathLength = 1;
    while (value !== undefined && value !== '$total') {
      let foundNode = false;
      for (const child of parent.children) {
        if (value === child.value) {
          parent = child;
          foundNode = true;
        }
      }
      if (!foundNode) {
        parent.children.push(new TreeNode(value));
        parent = parent.children[parent.children.length - 1];
      }
      value = path.shift();
      pathLength++;
    }
    parent.metrics = node.metrics;
    this.longestPath = Math.max(this.longestPath, pathLength);
  }

  sort(
    metrics: string[],
    parent = this.root,
    defaultMetric = metrics[metrics.length - 1]
  ) {
    const metric = metrics.shift() || defaultMetric;
    parent.children.sort(
      (a, b) => parseInt(b.metrics[metric]) - parseInt(a.metrics[metric])
    );
    for (const child of parent.children) {
      this.sort(metrics, child, defaultMetric);
    }
  }

  printToFile(fileName: string) {
    this.printDFS();
    fs.writeFileSync(fileName, this.headers.join('|') + '\r\n' + this.sorted);
  }

  printDFS(node = this.root, path = this.root.path) {
    path.push(node.value + '|');
    let str = path.join('');
    str += '$total|'.repeat(this.longestPath - path.length);
    for (const key of Object.keys(node.metrics)) str += node.metrics[key] + '|';
    this.sorted += str.slice(2, -1) + '\r\n';
    for (const child of node.children) {
      this.printDFS(child, path);
      path.pop();
    }
  }
}

export class TreeNode {
  constructor(
    public value: string,
    public path: string[] = [],
    public children: TreeNode[] = [],
    public metrics: Record<string, string> = {}
  ) {}
}
