import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Image, Dimensions } from 'react-native';
import { getCurrentTimeInSeconds } from "expo-auth-session/build/TokenRequest";

const TrackItem = ({ track, startPlayback, accessToken }) => {
    const [spinValue] = useState(new Animated.Value(0));
    const [lyrics, setLyrics] = useState(null);
    const [backgroundColor, setBackgroundColor] = useState('transparent');
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [start, setStart] = useState(getCurrentTimeInSeconds());

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
            } catch (error) {
                console.error('Error fetching track data:', error);
            }
        };

        const intervalId = setInterval(() => {
            setCurrentTime(getCurrentTimeInSeconds() - start);
        }, 1000);

        fetchTrackData();

        return () => {
            clearInterval(intervalId); // Clear interval on component unmount
        };
    }, [spinValue, track.id, accessToken, start]);

    useEffect(() => {
        updateHighlights();
    }, [lyrics, currentTime]);

    const updateHighlights = () => {
        if (lyrics && currentTime > 0) {
            const highlightedLine = lyrics.lines.find(line => {
                if (line.timeTag) {
                    const startTime = parseFloat(line.timeTag.split(':')[0]) * 60 + parseFloat(line.timeTag.split(':')[1]);
                    return currentTime >= startTime && currentTime <= startTime + 4; // Highlight for 4 seconds
                }
                return false; // Handle the case where line.timeTag is undefined
            });


            if (highlightedLine) {
                setBackgroundColor('yellow');
            } else {
                setBackgroundColor('red');
            }
        }
    };

    const fetchLyrics = async (trackId) => {
        try {
            const response = await fetch(`https://spotify-lyric-api-984e7b4face0.herokuapp.com/?trackid=${trackId}`);
            const data = await response.json();
            setLyrics(data);
        } catch (error) {
            console.error('Error fetching lyrics:', error);
        }
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
                    <Text key={index} style={{ backgroundColor: backgroundColor }}>
                        {getLyrics(line.words, line.startTimeMs)}
                    </Text>
                ))}
            </View>
        );
    };

    const getLyrics = (words, startTimeMs) => {
        if (currentTime > 0) {
            const startTime = parseFloat(startTimeMs) / 1000;
            const endTime = startTime + 4;
            if (currentTime >= startTime && currentTime <= endTime) {
                return words;
            }
        }
    };

    const formatTimeTag = (timeTagMs) => {
        const totalSeconds = parseInt(timeTagMs) / 1000;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);
        return `${minutes}:${seconds}`;
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

    return (
        <View
            style={[styles.trackContainer, { backgroundColor }]}
            onStartShouldSetResponder={() => {
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
