import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import Pin from './Pin';

export default class Map extends Component {
  static defaultProps = {
    center: { 
      lat: 39.0000, 
      lng: -96.6852
    },
    zoom: 4
  };

  constructor(props) {
    super(props);
    this.state = {
      key: undefined,
      locations: undefined
    };
  }

  async componentDidMount() {
    try {
      const key = await (await fetch('/key')).json();
      const locations = await (await fetch('/api/locations')).json();
      this.setState(Object.assign({}, this.state, {
        key: key,
        locations: locations
      }));
    } catch (ex) {
      console.error(ex);
    }
  }

  get locations() {
    return this.state.locations === undefined
      ? null
      : this.state.locations.Points.map((location, i) => {
        return (<Pin key={i} lat={location.Latitude} lng={location.Longitude} text={location.Name} />);
      });
  }

  render() {
    return this.state.key === undefined ? null : (
      <GoogleMapReact
        apiKey={this.state.key}
        defaultCenter={this.props.center}
        defaultZoom={this.props.zoom}
      >
        {this.locations}
      </GoogleMapReact>
    );
  }
}