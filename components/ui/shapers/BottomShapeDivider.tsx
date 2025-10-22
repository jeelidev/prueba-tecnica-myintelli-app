import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export const BottomShapeDivider = () => {
    return (
        <View style={{ position: 'absolute', bottom: 0, left: 0, width: '120%', overflow: 'hidden' }}>
            <Svg
                height={100}
                width="100%"
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
            >
                <Path
                    d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
                    fill="#7166E4"
                />
            </Svg>
        </View>
    );
};