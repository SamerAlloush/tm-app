

// // export default TabBarButton;
// import React, { useEffect } from 'react';
// import { Pressable, Text, StyleSheet } from 'react-native';
// import { icons } from '../assets/icons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

// const TabBarButton = ({ isFocused, label, routeName, color, onPress }) => {
//   const scale = useSharedValue(isFocused ? 1 : 0);

//   useEffect(() => {
//     scale.value = withSpring(isFocused ? 1 : 0, {
//       damping: 10,
//       stiffness: 100
//     });
//   }, [isFocused]);

//   const animatedIconStyle = useAnimatedStyle(() => {
//     return {
//       transform: [{ scale: interpolate(scale.value, [0, 1], [1, 1.4]) }],
//       top: interpolate(scale.value, [0, 1], [0, 8]),
//     };
//   });

//   const animatedTextStyle = useAnimatedStyle(() => {
//     return {
//       opacity: interpolate(scale.value, [0, 1], [1, 0]),
//     };
//   });

//   return (
//     <Pressable onPress={onPress} style={styles.container}>
//       <Animated.View style={animatedIconStyle}>
//         {icons[routeName] ? icons[routeName](color) : <FontAwesome name="user" size={26} color={color} />}
//       </Animated.View>
//       <Animated.Text style={[styles.label, animatedTextStyle, { color }]}>
//         {label}
//       </Animated.Text>
//     </Pressable>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 4,
//   },
//   label: {
//     fontSize: 11,
//     fontWeight: '500',
//   },
// });

// export default TabBarButton;
// components/TabBarButtons.jsx
import React, { useEffect } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const TabBarButton = ({ isFocused, label, routeName, color, onPress, iconName }) => {
  const scale = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0, {
      damping: 10,
      stiffness: 100
    });
  }, [isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: interpolate(scale.value, [0, 1], [1, 1.4]) }],
      top: interpolate(scale.value, [0, 1], [0, 8]),
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scale.value, [0, 1], [1, 0]),
    };
  });

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Animated.View style={animatedIconStyle}>
        <Ionicons
          name={isFocused ? iconName : `${iconName}-outline`}
          size={24}
          color={color}
        />
      </Animated.View>
      <Animated.Text style={[styles.label, animatedTextStyle, { color }]}>
        {label}
      </Animated.Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
  },
});

export default TabBarButton;