import {loadDataFromFile} from './loadDataFromFile';
import {SearchTree} from './SearchTree';

// extract data rows from a given file
const rows = loadDataFromFile('data-big-input.txt', '|');

// initialize a tree with the data headers
const tree = new SearchTree(rows.shift());

//load the data rows into the tree
for (const row of rows) {
  tree.addNode(row);
}

// sort the data with the required metric OR an array of metrics (metric per property)
tree.sort(['net_sales_units']);
// tree.sort(['net_sales','net_sales','net_sales_units'])

tree.printToFile('data-big-output.txt');
