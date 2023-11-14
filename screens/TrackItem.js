// TrackItem.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import FastImage from 'react-native-fast-image';

const TrackItem = ({ track, startPlayback }) => {
    const [spinValue] = useState(new Animated.Value(0));
    const [backgroundColor, setBackgroundColor] = useState('transparent');

    useEffect(() => {
        const fetchImageColor = async () => {
            try {
                const color = await FastImage.getColor(track.album.images[0]?.url);
                setBackgroundColor(color);
            } catch (error) {
                console.error('Error fetching image color:', error);
            }
        };

        fetchImageColor();

        // Start the rotation animation when the component mounts
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 3000,
                useNativeDriver: true,
            })
        ).start();
    }, [spinValue, track.album.images]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View
            style={[styles.trackContainer, { backgroundColor }]}
            onStartShouldSetResponder={() => {
                startPlayback(track.uri);
            }}
        >
            <Animated.Image
                style={[styles.trackImage, { transform: [{ rotate: spin }] }]}
                source={{ uri: track.album.images[0]?.url }}
                resizeMode={FastImage.resizeMode.cover}
            />
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
        width: 200,
        height: 200,
        borderRadius: 100,
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
    },
});

export default TrackItem;
