function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function refresh() {
	window.location.reload();
}
async function Download() {
  window.location.reload();
	document.getElementById('downloadImage').src = 'images/image.png';
};
