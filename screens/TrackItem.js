import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Image, Dimensions } from 'react-native';
import { getCurrentTimeInSeconds } from "expo-auth-session/build/TokenRequest";

const TrackItem = ({ track, startPlayback, accessToken }) => {
    const [spinValue] = useState(new Animated.Value(0));
    const [lyrics, setLyrics] = useState(null);
    const [backgroundColor, setBackgroundColor] = useState('transparent');
    const [currentTime, setCurrentTime] = useState(getCurrentTimeInSeconds());
    const [duration, setDuration] = useState(0);
    const [startTime, setStart] = useState(0);
    let starttimex = 1;
    console.log("Start Time1: ", startTime);
    console.log("Start Time1xxxxxxxxx: ", starttimex);
    useEffect(() => {
        const fetchTrackData = async () => {
            try {
                fetchLyrics(track.id);

                Animated.loop(
                    Animated.timing(spinValue, {
                        toValue: 1,
                        duration: 3000,
                        useNativeDriver: true,
                    })
                ).start();

                const spotifyApiUrl = `https://api.spotify.com/v1/tracks/${track.id}`;
                const response = await fetch(spotifyApiUrl, {
                    headers: {
                        Authorization: 'Bearer ' + accessToken,
                    },
                });
                const data = await response.json();
                setDuration(data.duration_ms);
                console.log('Track data:', data.duration_ms);
            } catch (error) {
                console.error('Error fetching track data:', error);
            }
        };

        fetchTrackData();
    }, [spinValue, track.id, accessToken, startTime]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (startTime > 0) {
                setCurrentTime(getCurrentTimeInSeconds());
            } else {
                setCurrentTime(0);
            }
            console.log("Start Time: ", startTime);
        }, 1000);
        return () => clearInterval(intervalId);
    }, [startTime]);

    const fetchLyrics = async (trackId) => {
        try {
            const response = await fetch(`https://spotify-lyric-api-984e7b4face0.herokuapp.com/?trackid=${trackId}`);
            const data = await response.json();
            setLyrics(data);
        } catch (error) {
            console.error('Error fetching lyrics:', error);
        }
    };

    const getLyrics = (words, startTimeMs) => {
        let lineBackgroundColor = 'transparent';
        if (startTime > 0) {
            const lineStartTime = startTimeMs / 1000; // convert to seconds
            const lineEndTime = lineStartTime + 5; // assuming lines last for 5 seconds

            if (lineStartTime <= currentTime && currentTime <= lineEndTime) {
                lineBackgroundColor = 'yellow';
            }
        }

        return { words, backgroundColor: lineBackgroundColor };
    };

    const renderLyrics = () => {
        if (!lyrics) {
            return <Text>Loading lyrics...</Text>;
        }

        if (lyrics.error) {
            return <Text style={{ color: 'red' }}>{lyrics.message}</Text>;
        }

        return (
            <View>
                <Text>Lyrics:</Text>
                {lyrics.lines.map((line, index) => (
                    <Text key={index} style={{ backgroundColor: getLyrics(line.words,line.startTimeMs).backgroundColor, fontSize: 6}}>
                        {getLyrics(line.words, line.startTimeMs).words}
                    </Text>
                ))}
            </View>
        );
    };

    const styles = StyleSheet.create({
        trackContainer: {
            marginBottom: 20,
            alignItems: 'center',
            height: windowHeight * 1, // Adjusted to a fraction of the window height
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
    const formatTimeTag = (timeTagMs) => {
        const totalSeconds = parseInt(timeTagMs) / 1000;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);
        return `${minutes}:${seconds}`;
    };

    return (
        <View
            style={[styles.trackContainer, { backgroundColor }]}
            onStartShouldSetResponder={() => {
                setStart(2);
                starttimex = 2;
                console.log("Start Time2: ", startTime);
                startPlayback(track.uri);
            }}
        >
            {/*<Animated.Image*/}
            {/*    style={[styles.trackImage, { transform: [{ rotate: spinValue }] }]}*/}
            {/*    source={{ uri: track.album.images[0]?.url }}*/}
            {/*    resizeMode="cover"*/}
            {/*/>*/}
            <Text style={styles.trackName}>{track.name}</Text>
            <Text style={styles.artistName}>{track.artists[0].name}</Text>
            {renderLyrics()}
        </View>
    );

};

const windowHeight = Dimensions.get('window').height;

export default TrackItem;
