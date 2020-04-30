const fs = require('fs');
const myobj = {}
let myarr = [];
function buildTree(startPath) {
  fs.readdir(startPath, (err, entries) => {
    let genelistpath = `${startPath}/allgenes`;
    const genelist  = fs.readFileSync(genelistpath, 'utf8');
    genelist.split(/\r?\n/).forEach((gene) => {
	myarr = [];
	entries.forEach((file)=>{
	    const path = `${startPath}/${file}`;
	    if (file.match(/\.txt$/)) {
	    	processFile(path, file,gene);
	    }
	})
	myobj[gene] = myarr;
	});
    fs.writeFileSync('./data.json', JSON.stringify(myobj,null,2), 'utf-8'); 
  });
}

function processFile(path,file,gene) {
  const text = fs.readFileSync(path, 'utf8');
  tftargets = text.split(/\r?\n/);
  if (tftargets.includes(gene)) {
	myarr.push(file.split("_")[1]);
  }
}

buildTree(process.argv[2]);
