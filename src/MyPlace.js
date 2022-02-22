import { Map } from "./UI/Map";

class LoadedPlace {
	constructor(coordinates, address) {
		new Map(coordinates);
		const headerTitle = document.querySelector("header h1");
		headerTitle.textContent = address;
	}
}

const url = new URL(location.href);
const queryParms = url.searchParams;
const coords = {
	lat: +queryParms.get("lat"),
	lng: +queryParms.get("lng"),
};
const address = queryParms.get("address");
new LoadedPlace(coords, address);
