import { useRef, useCallback, useEffect, useState } from 'react';
import { Match, Push_SongFinished, RealtimeScore, Response_ResponseType, TAClient, Tournament } from "moons-ta-client";

type Listener<T> = (event: T) => void;

export const useTAClient = () => {
    const taConnectedListeners = useRef<Listener<{}>[]>([]);
    const realtimeScoreListeners = useRef<Listener<RealtimeScore>[]>([]);
    const songFinishedListeners = useRef<Listener<Push_SongFinished>[]>([]);
    const failedToCreateMatchListeners = useRef<Listener<{}>[]>([]);
    const matchCreatedListeners = useRef<Listener<[Match, Tournament]>[]>([]);
    const matchUpdatedListeners = useRef<Listener<[Match, Tournament]>[]>([]);
    const matchDeletedListeners = useRef<Listener<[Match, Tournament]>[]>([]);
    const taClient = useRef<TAClient>();
    const [taClientConnected, setTAClientConnected] = useState(false);

    const subscribeToTAConnected = useCallback((listener: Listener<{}>) => {
        taConnectedListeners.current.push(listener);
        return () => {
            taConnectedListeners.current = taConnectedListeners.current.filter((l) => l !== listener);
        };
    }, []);

    const emitTAConnected = useCallback(() => {
        taConnectedListeners.current.forEach((listener) => listener({}));
    }, []);

    const subscribeToRealtimeScores = useCallback((listener: Listener<RealtimeScore>) => {
        realtimeScoreListeners.current.push(listener);
        return () => {
            realtimeScoreListeners.current = realtimeScoreListeners.current.filter((l) => l !== listener);
        };
    }, []);

    const emitRealtimeScore = useCallback((event: RealtimeScore) => {
        realtimeScoreListeners.current.forEach((listener) => listener(event));
    }, []);

    const subscribeToSongFinished = useCallback((listener: Listener<Push_SongFinished>) => {
        songFinishedListeners.current.push(listener);
        return () => {
            songFinishedListeners.current = songFinishedListeners.current.filter((l) => l !== listener);
        };
    }, []);

    const emitSongFinished = useCallback((event: Push_SongFinished) => {
        songFinishedListeners.current.forEach((listener) => listener(event));
    }, []);

    const subscribeToFailedToCreateMatch = useCallback((listener: Listener<{}>) => {
        failedToCreateMatchListeners.current.push(listener);
        return () => {
            failedToCreateMatchListeners.current = failedToCreateMatchListeners.current.filter((l) => l !== listener);
        };
    }, []);

    const emitFailedToCreateMatch = useCallback(() => {
        failedToCreateMatchListeners.current.forEach((listener) => listener({}));
    }, []);

    const subscribeToMatchCreated = useCallback((listener: Listener<[Match, Tournament]>) => {
        matchCreatedListeners.current.push(listener);
        return () => {
            matchCreatedListeners.current = matchCreatedListeners.current.filter((l) => l !== listener);
        };
    }, []);

    const emitMatchCreated = useCallback((event: [Match, Tournament]) => {
        matchCreatedListeners.current.forEach((listener) => listener(event));
    }, []);

    const subscribeToMatchUpdated = useCallback((listener: Listener<[Match, Tournament]>) => {
        matchUpdatedListeners.current.push(listener);
        return () => {
            matchUpdatedListeners.current = matchUpdatedListeners.current.filter((l) => l !== listener);
        };
    }, []);

    const emitMatchUpdated = useCallback((event: [Match, Tournament]) => {
        matchUpdatedListeners.current.forEach((listener) => listener(event));
    }, []);

    const subscribeToMatchDeleted = useCallback((listener: Listener<[Match, Tournament]>) => {
        matchDeletedListeners.current.push(listener);
        return () => {
            matchDeletedListeners.current = matchDeletedListeners.current.filter((l) => l !== listener);
        };
    }, []);

    const emitMatchDeleted = useCallback((event: [Match, Tournament]) => {
        matchDeletedListeners.current.forEach((listener) => listener(event));
    }, []);

    useEffect(() => {
        const client = new TAClient();
        // client.setAuthToken('eyJhbGciOiJSUzI1NiIsImtpZCI6IjlDMTEwNEJDQTlGRjJCQjMzN0I4MjJBMDI1MkU4QjY0RjQ1MUVEQkMiLCJ4NXQiOiJuQkVFdktuX0s3TTN1Q0tnSlM2TFpQUlI3YnciLCJ0eXAiOiJKV1QifQ.eyJpYXQiOiIxNzQ0MjEzMTQyIiwiZXhwIjoiMjA1OTc0NTk0MiIsInRhOmRpc2NvcmRfaWQiOiIxM2RiNTExOS0xMDY2LTQwMTgtYjU5Ni1hNjBmOTY0MTEwYmEiLCJ0YTpkaXNjb3JkX25hbWUiOiJCU0VfQk9UMSIsInRhOmRpc2NvcmRfYXZhdGFyIjoiIiwiaXNzIjoidGFfc2VydmVyIiwiYXVkIjoidGFfdXNlcnMifQ.rmdm-1knhC6owtGXCg1M9fIhAvBJgLhCmsgEnv_1qv_XrnhwoQqFXQOKX7VtYlijvJFqECPk8tOnCBO_-yVKMxdPbEX-77i16xr8l_kPxI5scHtIAydxsF_9fOMmp0l72o17LA9Z2Zj-4iIC6R-huWpM7_olgXgz2AcAipbSBZy2ExG9ZjSEs8G0wV1E9ETvy2kQver43z-hiqegXI5NqITB-M5SJ9n24Ed4qumirFm7JzIq7O65xumesZDg7rg2M0gRoRU8E8DJgG2BMS0LYLNCapYJ4qUST2c9_ofcVCzreR6liG220_RRXRggitVH4X7znAceN2cR72AYc5mM5Q');
        let isMounted = true;

        const setupTAClient = async () => {
            try {
                const connectResponse = await client.connect('server.tournamentassistant.net', '8676');
                if (!isMounted) return;

                if (connectResponse.type !== Response_ResponseType.Success && connectResponse.details.oneofKind === "connect") {
                    console.error(connectResponse.details.connect.reason);
                }

                const tourneys = client.stateManager.getTournaments();
                const targetTourney = tourneys.find(x => x.settings?.tournamentName == "Beat Saber Elites");

                if (!targetTourney) {
                    console.error(`Could not find tournament with name ${"Beat Saber Elites"}`);
                    return;
                }

                const joinResponse = await client.joinTournament(targetTourney.guid);
                if (!isMounted) return; // If component unmounted, exit early

                if (joinResponse.type !== Response_ResponseType.Success && joinResponse.details.oneofKind === "join") {
                    console.error(joinResponse.details.join.reason);
                }

                taClient.current = client;

                setTAClientConnected(true);

                emitTAConnected();
            } catch (error) {
                console.error("Error setting up TAClient:", error);
            }
        };

        setupTAClient();

        return () => {
            isMounted = false; // Set flag to false on cleanup
            client.disconnect();

            setTAClientConnected(false);
        };
    }, [emitTAConnected]);

    useEffect(() => {
        if (taClientConnected && taClient.current) {
            const handleRealtimeScore = (score: RealtimeScore) => {
                emitRealtimeScore(score);
            };
            taClient.current.on('realtimeScore', handleRealtimeScore);

            const handleSongFinished = (songFinished: Push_SongFinished) => {
                emitSongFinished(songFinished);
            };
            taClient.current.on('songFinished', handleSongFinished);

            const handleFailedToCreateMatch = () => {
                emitFailedToCreateMatch();
            };
            taClient.current.on('failedToCreateMatch', handleFailedToCreateMatch);

            const handleMatchCreated = (matchInfo: [Match, Tournament]) => {
                emitMatchCreated(matchInfo);
            };
            taClient.current.stateManager.on('matchCreated', handleMatchCreated);

            const handleMatchUpdated = (matchInfo: [Match, Tournament]) => {
                emitMatchUpdated(matchInfo);
            };
            taClient.current.stateManager.on('matchUpdated', handleMatchUpdated);

            const handleMatchDeleted = (matchInfo: [Match, Tournament]) => {
                emitMatchDeleted(matchInfo);
            };
            taClient.current.stateManager.on('matchDeleted', handleMatchDeleted);

            return () => {
                taClient.current?.removeListener('realtimeScore', handleRealtimeScore);
                taClient.current?.removeListener('songFinished', handleSongFinished);
                taClient.current?.removeListener('failedToCreateMatch', handleFailedToCreateMatch);
                taClient.current?.stateManager.removeListener('matchCreated', handleMatchCreated);
                taClient.current?.stateManager.removeListener('matchUpdated', handleMatchUpdated);
                taClient.current?.stateManager.removeListener('matchDeleted', handleMatchDeleted);
            };
        }
    }, [taClientConnected, emitRealtimeScore, emitSongFinished, emitFailedToCreateMatch, emitMatchCreated, emitMatchUpdated, emitMatchUpdated]);

    return { taClient, subscribeToTAConnected, subscribeToRealtimeScores, subscribeToSongFinished, subscribeToFailedToCreateMatch, subscribeToMatchCreated, subscribeToMatchUpdated, subscribeToMatchDeleted };
};
