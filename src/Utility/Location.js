const GOOGLE_API_KEY = "AIzaSyDVP7Rl20QiKYs5vVuDkfRACJ3EtjJtb5g";

export async function getAddressFromCoords(coords) {
	const response = await fetch(
		`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=${GOOGLE_API_KEY}`
	);
	if (!response.ok) {
		throw new Error("Fail to fetch address. Please try again!");
	}
	const data = await response.json();
	if (data.error_message) {
		throw new Error(data.error_message);
	}
	const address = data.results[0].formatted_address;
	return address;
}

export async function getCoordsFromAddress(address) {
	const urlAddress = encodeURI(address);
	const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${urlAddress}&key=${GOOGLE_API_KEY}`;
	console.log(url);
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error("Fail to fetch coordinates. Please try again!");
	}
	const data = await response.json();
	if (data.error_message) {
		throw new Error(data.error_message);
	}
	const coordinates = data.results[0].geometry.location;
	return coordinates;
}
