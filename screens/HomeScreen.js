import React, { useEffect, useState } from 'react';
import {View, Text, Image, StyleSheet, ScrollView, Linking} from 'react-native';
import axios from 'axios';
import { Alert } from 'react-native';

const HomeScreen = ({ accessToken }) => {
    const [userData, setUserData] = useState(null);
    const [topTracks, setTopTracks] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Fetch user data
                const userResponse = await axios.get('https://api.spotify.com/v1/me', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                setUserData(userResponse.data);

                // Fetch user's top tracks
                const topTracksResponse = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                setTopTracks(topTracksResponse.data.items);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [accessToken]);

    const startPlayback = async (trackUri) => {
        try {
            // Get the user's devices
            const devicesResponse = await axios.get('https://api.spotify.com/v1/me/player/devices', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const devices = devicesResponse.data.devices;

            if (devices.length > 0) {
                // Use the first available device to start playback
                const deviceId = devices[0].id;

                // Start playback on the specified device
                await axios.put(`https://api.spotify.com/v1/me/player/play`, {
                    uris: [trackUri],
                    device_id: deviceId,
                }, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
            } else {
                // No active devices found, show an alert
                Alert.alert(
                    'No Active Devices',
                    'Open Spotify and play something to start playback.',
                    [
                        { text: 'OK', onPress: () => openSpotify() },
                    ],
                    { cancelable: false }
                );
            }
        } catch (error) {
            // dont do anything
        }
        const openSpotify = () => {
            // Open the Spotify app or web player
            Linking.openURL('https://open.spotify.com/');
        };
    };


    return (
        <View style={styles.container}>
            {userData && (
                <View style={styles.userInfoContainer}>
                    <Image style={styles.profileImage} source={{ uri: userData.images[0]?.url }} />
                    <Text style={styles.userName}>{userData.display_name}</Text>
                </View>
            )}

            <Text style={styles.sectionTitle}>Top Tracks</Text>

            <ScrollView
                showsVerticalScrollIndicator={false}
                pagingEnabled
                decelerationRate="fast"
                snapToAlignment="center"
            >
                {topTracks.map((track) => (
                    <View
                        key={track.id}
                        style={styles.trackContainer}
                        onStartShouldSetResponder={() => {
                            startPlayback(track.uri);
                        }}
                    >
                        <Image style={styles.trackImage} source={{ uri: track.album.images[0]?.url }} />
                        <Text style={styles.trackName}>{track.name}</Text>
                        <Text style={styles.artistName}>{track.artists[0].name}</Text>
                    </View>
                ))}
            </ScrollView>


        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
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
    },
    playButton: {
        color: 'green',
        fontWeight: 'bold',
        marginTop: 8,
    },
});
export default HomeScreen;
