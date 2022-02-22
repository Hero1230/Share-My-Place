import { Modal } from "./UI/Modal";
import { Map } from "./UI/Map";
import { getCoordsFromAddress, getAddressFromCoords } from "./Utility/Location";

class PlaceFinder {
	constructor() {
		const addressform = document.querySelector("form");
		const locateUserBtn = document.getElementById("locate-btn");
		this.shareBtn = document.getElementById("share-btn");

		locateUserBtn.addEventListener("click", this.locateUserHandler.bind(this));
		this.shareBtn.addEventListener("click", this.sharePlaceHandler);
		addressform.addEventListener("submit", this.findAddressHandler.bind(this));
	}

	sharePlaceHandler() {
		const sharedLinkInputElement = document.getElementById("share-link");
		if (!navigator.clipboard) {
			sharedLinkInputElement.select();
			return;
		}

		navigator.clipboard
			.writeText(sharedLinkInputElement.value)
			.then(() => console.log("Coppied"))
			.catch((err) => {
				console.log(err);
				sharedLinkInputElement.select();
			});
	}

	selectPlace(coordinates, address) {
		if (this.map) {
			this.map.render(coordinates);
		} else {
			this.map = new Map(coordinates);
		}
		this.shareBtn.disabled = false;
		const sharedLinkInputElement = document.getElementById("share-link");
		sharedLinkInputElement.value = `${
			location.origin
		}/my-place?address=${encodeURI(address)}&lat=${coordinates.lat}&lng=${
			coordinates.lng
		}`;
	}

	locateUserHandler() {
		const modal = new Modal(
			"loading-modal-content",
			"Loading location - please wait!"
		);
		modal.show();
		navigator.geolocation.getCurrentPosition(
			async (successResult) => {
				const coordinates = {
					lat: successResult.coords.latitude,
					lng: successResult.coords.longitude,
				};
				const address = await getAddressFromCoords(coordinates);
				modal.hide();
				this.selectPlace(coordinates, address);
			},
			(error) => {
				modal.hide();
				alert(
					"Couldn't locate you unfortunately. Please enter an address manualy!"
				);
			}
		);
	}

	async findAddressHandler(event) {
		event.preventDefault();
		const address = event.target.querySelector("input").value;
		if (!address || address.trim().lenght === 0) {
			alert("Invalid address entered - please try again!");
			return;
		}
		const modal = new Modal(
			"loading-modal-content",
			"Loading location - please wait!"
		);
		modal.show();
		try {
			const coordinates = await getCoordsFromAddress(address);
			this.selectPlace(coordinates, address);
		} catch (err) {
			alert("Cannot find this place! Did you write address corectly?");
		}
		modal.hide();
	}
}

new PlaceFinder();
