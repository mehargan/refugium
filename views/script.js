function initMap(){
	const Poland = { lat: 53, lng: 18 };
	const Moldova = { lat: 47, lng: 28 };
	const Belarus = { lat: 52 , lng: 23 };
	const Slovakia = { lat: 48, lng: 21};

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 50.45, lng: 30.52},
        zoom: 18,
      });
	  const contentString1 =
	  '<div id="content">' +
	  '<div id="siteNotice">' +
	  "</div>" +
	  '<h1 id="firstHeading" class="firstHeading">Refugee Housing Info</h1>' +
	  '<div id="bodyContent">'+
	  '<p>Address: Hetmana Stanisława Żółkiewskiego 11, 85-042 Bydgoszcz, Poland </p>' +
	  '<p>Capacity: </p>' +
	  '<p>Contact Info: </p>' +
	  '<p>Refugee Info: </p>' +
	  '<p>Notes: </p>' +
	  "</div>" +
	  "</div>";
	  const contentString2 =
	  '<div id="content">' +
	  '<div id="siteNotice">' +
	  "</div>" +
	  '<h1 id="firstHeading" class="firstHeading">Refugee Housing Info</h1>' +
	  '<div id="bodyContent">'+
	  '<p>Address: Strada Nicolae Testemițanu 29, Chișinău 2025, Moldova </p>' +
	  '<p>Capacity: </p>' +
	  '<p>Contact Info: </p>' +
	  '<p>Refugee Info: </p>' +
	  '<p>Notes: </p>' +
	  "</div>" +
	  "</div>";
	  const contentString3 =
	  '<div id="content">' +
	  '<div id="siteNotice">' +
	  "</div>" +
	  '<h1 id="firstHeading" class="firstHeading">Refugee Housing Info</h1>' +
	  '<div id="bodyContent">'+
	  '<p>Address: Солигорск Октябрьская улица 38, 223709, Belarus </p>' +
	  '<p>Capacity: </p>' +
	  '<p>Contact Info: </p>' +
	  '<p>Refugee Info: </p>' +
	  '<p>Notes: </p>' +
	  "</div>" +
	  "</div>";
	  const contentString4 =
	  '<div id="content">' +
	  '<div id="siteNotice">' +
	  "</div>" +
	  '<h1 id="firstHeading" class="firstHeading">Refugee Housing Info</h1>' +
	  '<div id="bodyContent">'+
	  '<p>Address: Kapitulská 23, 974 01 Banská Bystrica, Slovakia </p>' +
	  '<p>Capacity: </p>' +
	  '<p>Contact Info: </p>' +
	  '<p>Refugee Info: </p>' +
	  '<p>Notes: </p>' +
	  "</div>" +
	  "</div>";
	const infowindow1 = new google.maps.InfoWindow({
	  content: contentString1,
	});
	const infowindow2 = new google.maps.InfoWindow({
		content: contentString2,
	});
	const infowindow3 = new google.maps.InfoWindow({
		content: contentString3,
	});
	const infowindow4 = new google.maps.InfoWindow({
		content: contentString4,
	});
	const marker1 = new google.maps.Marker({
		position: Poland,
		map: map,
	});
	const marker2 = new google.maps.Marker({
		position: Moldova,
		map: map,
	});
	const marker3 = new google.maps.Marker({
		position: Belarus,
		map: map,
	});
	const marker4 = new google.maps.Marker({
		position: Slovakia,
		map: map,
	});
	marker1.addListener("click", () => {
		infowindow1.open({
			anchor: marker1,
			map,
			shouldFocus: false,
		});
	});
	marker2.addListener("click", () => {
		infowindow2.open({
			anchor: marker2,
			map,
			shouldFocus: false,
		});
	});
	marker3.addListener("click", () => {
		infowindow3.open({
			anchor: marker3,
			map,
			shouldFocus: false,
		});
	});
	marker4.addListener("click", () => {
		infowindow4.open({
			anchor: marker4,
			map,
			shouldFocus: false,
		});
	});
}

    

    