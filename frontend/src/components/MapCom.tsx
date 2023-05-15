import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon, LatLngTuple } from "leaflet";

const MapCom = (prop:number[]) => {
  const icon = new Icon({
    iconUrl: require("../assets/images/placeholder.png"),
    iconSize: [38, 38],
  });
  return (
    <MapContainer
      center={[prop[1],prop[0]]}
      zoom={12}
      scrollWheelZoom={true}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        attribution=""
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={([prop[1],prop[0]] as LatLngTuple)} icon={icon}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapCom;
