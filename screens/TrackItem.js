// TrackItem.js
import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

const TrackItem = ({ track, startPlayback }) => {
    return (
        <View
            style={styles.trackContainer}
            onStartShouldSetResponder={() => {
                startPlayback(track.uri);
            }}
        >
            <Image style={styles.trackImage} source={{ uri: track.album.images[0]?.url }} />
            <Text style={styles.trackName}>{track.name}</Text>
            <Text style={styles.artistName}>{track.artists[0].name}</Text>
        </View>
    );
};
const styles = StyleSheet.create({
    trackContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    trackImage: {
        width: '100%',
        height: 600,
        borderRadius: 10,
        marginBottom: 8,
    },
    trackName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 8,
    },
    artistName: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 8,
    }
});

export default TrackItem;
