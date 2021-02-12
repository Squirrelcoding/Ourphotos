function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function refresh() {
	await window.location.reload();
	console.log("Page has refreshed.")
}
async function Download() {
  await refresh();
	document.getElementById('downloadImage').src = 'images/image.png';
};
