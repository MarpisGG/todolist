import { Stack } from "expo-router";

export default function Layout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false, // This disables the header for all screens
            }}
        />
    );
}
