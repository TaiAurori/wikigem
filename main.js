const fs = require('fs');
const gemini = require('gemini-server');
const w = require('wtf_wikipedia');

const gemify = (text) => {
	return text
}

const options = {
	cert: fs.readFileSync('cert.pem'),
	key: fs.readFileSync('key.pem')
};

//Create gemini instance with cert and key
const app = gemini(options);

var footerText = "=> / Go to main page\n=> /page Go to article"

function gemifyWikiJson(dat) {
	let result = "";
	for (isec in dat.sections) {
		let sec = dat.sections[isec]
		if (sec.title) result += `\n#${"#".repeat(Math.min(2, sec.depth))} ${sec.title}\n`;
		for (ipara in sec.paragraphs) {
			let para = sec.paragraphs[ipara]
			result += para.sentences.map((v) => {return v.text}).join(" ") + "\n\n"
		}
		for (ilist in sec.lists) {
			let list = sec.lists[ilist]
			result += list.map((v) => {return "* " + v.text}).join("\n")
		}
	}
	return result
}

function assembleArticle(dat) {
	return `# -> ${dat.title()}\nFrom Wikipedia, the free encyclopedia.${dat.isDisambiguation() ? "\nThis is a disambiguation page." : ""}\n\n\n${gemifyWikiJson(dat.json())}\n\n${footerText}`
}

//On a request to / serve a gemini file
//This automatically detects the mime type and sends that as a header
app.on('/', (req, res) => {
	res.data("# Wikipedia Gemini Proxy\n=> /page Go to article", mimeType='text/gemini')
});

//Request input from the user
app.on('/page', async (req, res) => {
	if (req.query) {
		req.query = decodeURI(req.query)
		console.log("Page request: "+req.query)
		let dat = await w.fetch(req.query)
		if (dat != null) {
			res.data(assembleArticle(dat), mimeType='text/gemini')
		} else {
			res.data("# Not Found\nThis article does not exist.\n" + footerText, mimeType='text/gemini')
		}
	} else {
		res.input('Input article name');
	}
});

//start listening. Optionally specify port and callback
app.listen(() => {
	console.log("Listening...");
});
