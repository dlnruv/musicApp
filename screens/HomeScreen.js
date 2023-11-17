import React, {memo, useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet, ScrollView, Linking, Dimensions} from 'react-native';
import axios from 'axios';
import { Alert } from 'react-native';
import TrackItem from "./TrackItem";

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

    const MemoizedTrackItem = memo(TrackItem);

    return (
        <View style={styles.container}>
            {/*{userData && (*/}
            {/*    <View style={styles.userInfoContainer}>*/}
            {/*        <Image style={styles.profileImage} source={{ uri: userData.images[0]?.url }} />*/}
            {/*        <Text style={styles.userName}>{userData.display_name}</Text>*/}
            {/*    </View>*/}
            {/*)}*/}

            {/*<Text style={styles.sectionTitle}>Top Tracks</Text>*/}

            <ScrollView
                showsVerticalScrollIndicator={false}
                pagingEnabled
                decelerationRate="fast"
                snapToAlignment="center"
            >
                {topTracks.map((track) => (
                    <MemoizedTrackItem key={track.id} track={track} startPlayback={startPlayback} accessToken={accessToken} />
                ))}
            </ScrollView>

        </View>
    );
};
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: windowHeight * .02,
        marginTop: windowHeight * .05,
        height: windowHeight * .05,
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
        marginBottom: windowHeight * .02,
        height: windowHeight * .05,
    },
});
export default HomeScreen;
