import * as React from 'react';
import { autorun } from 'mobx';
import { observer } from 'mobx-react';

import * as atlas from 'azure-maps-control';

// Visualizes geo coordinates with Azure Maps control
export const MapControl = observer(class MapControl extends React.Component<{ entityKey: string, dataSource: atlas.source.DataSource, bounds: atlas.data.BoundingBox, azureMapSubscriptionKey: string }> {

    componentDidMount() {

        var map = new atlas.Map(this.props.entityKey, {

            style: "road_shaded_relief",
            language: 'en-US',

            authOptions: {
                authType: atlas.AuthenticationType.subscriptionKey,
                subscriptionKey: this.props.azureMapSubscriptionKey
            }
        });

        map.events.add('ready', () => {

            // Adding the zoom control
            map.controls.add( [new atlas.control.ZoomControl() ], { position: atlas.ControlPosition.BottomRight } );

            // Showing the dataSource with route line
            map.sources.add(this.props.dataSource);

            const layer = new atlas.layer.LineLayer(this.props.dataSource, undefined, {
                strokeColor: 'DarkOrchid',
                strokeWidth: 3
            });
            map.layers.add(layer);
        });

        // This will zoom the map to the bounding box of all points
        autorun(() => {
            map.setCamera({ bounds: this.props.bounds, padding: 40 });
        });
    }

    render(): JSX.Element {
        return (<div id={this.props.entityKey} className="map-div"/>);
    }
})